"use strict";

///////////////////////////////////////////////////////////////////////////////////////////////
//                 IMPORTANT - DO NOT MODIFY AUTO-GENERATED CODE OR COMMENTS                 //
//Parts of this file are auto-generated and modifications to those sections will be          //
//overwritten. You are allowed to modify:                                                    //
// - the tags in the jsDoc as described in the corresponding section                         //
// - the function name and its parameters                                                    //
// - the function body between the insertion ranges                                          //
//         "Add your customizing javaScript code below / above"                              //
//                                                                                           //
// NOTE:                                                                                     //
// - If you have created PRE and POST functions, they will be executed in the same order     //
//   as before.                                                                              //
// - If you have created a REPLACE to override core function, only the REPLACE function will //
//   be executed. PRE and POST functions will be executed in the same order as before.       //
//                                                                                           //
// - For new customizations, you can directly modify this file. There is no need to use the  //
//   PRE, POST, and REPLACE functions.                                                       //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Use the following jsDoc tags to describe the BL function. Setting these tags will
 * change the runtime behavior in the mobile app. The values specified in the tags determine
 * the name of the contract file. The filename format is “@this . @function .bl.js”.
 * For example, LoVisit.BeforeLoadAsync.bl.js
 * -> function: Name of the businessLogic function.
 * -> this: The LO, BO, or LU object that this function belongs to (and it is part of the filename).
 * -> kind: Type of object this function belongs to. Most common value is "businessobject".
 * -> async: If declared as async then the function should return a promise.
 * -> param: List of parameters the function accepts. Make sure the parameters match the function signature.
 * -> module: Use CORE or CUSTOM. If you are a Salesforce client or an implementation partner, always use CUSTOM to enable a seamless release upgrade.
 * -> extends: Base class of the LO, BO, and LU objects that this function belongs to.
 * -> maxRuntime: Maximum time this function is allowed to run, takes integer value in ms. If the max time is exceeded, error is logged.
 * -> returns: Type and variable name in which the return value is stored.
 * @function createPricingInfoJson
 * @this BoOrder
 * @kind businessobject
 * @async
 * @namespace CORE
 * @returns promise
 */
function createPricingInfoJson(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
//Create JSON using complex pricing results and store it in Order/OrderItem (Pricing_Information__c)
var promise = when.resolve();
var isPricingRelevantOrder = me.getBoOrderMeta().getComputePrice() === "4" || me.getBoOrderMeta().getComputePrice() === "5";
var isInitialOrder = me.getPhase() === "Initial";
var isCalculatedOrder = me.getCalculationStatus() == "1";

if(isPricingRelevantOrder && isInitialOrder && isCalculatedOrder && me.getDocTaType() !== "NonValuatedDeliveryNote"){
  var generatePricingInfo = me.getBoOrderMeta().getGeneratePricingInformation() === "Yes";
  var generateOptimisedPricingInfo = me.getBoOrderMeta().getGeneratePricingInformation() === "YesOV";

  //generate pricing information: version 1 or version 2 (optimised)
  if(generatePricingInfo || generateOptimisedPricingInfo){
    var orderItemInfo = [];
    var pricingInfoJson;
    var currentSdoCondition;
    var i;
    //suspend list events
    me.getLoItems().suspendListRefresh();

    var orderInfo = [];
    var orderItemPricingInfoDict = Utils.createDictionary();
    var sdoConditionsJson = [];
    if (Utils.isDefined(me.getSdoConditionsJson()) && !Utils.isEmptyString(me.getSdoConditionsJson())){
      sdoConditionsJson = JSON.parse(me.getSdoConditionsJson());
    }

    if(generatePricingInfo){
      var orderItemIdDict = Utils.createDictionary();
      me.getLoItems().getAllItems().forEach(function(orderItem) {
        orderItemIdDict.add(orderItem.getPKey(), orderItem);
      });

      for(i = 0; i < sdoConditionsJson.length; i++){
        pricingInfoJson = {};
        currentSdoCondition = sdoConditionsJson[i];

        pricingInfoJson.pKey = PKey.next();
        pricingInfoJson.sdoMainPKey = me.getPKey();
        pricingInfoJson.sdoItemPKey = currentSdoCondition.SdoItemPKey;
        pricingInfoJson.text1 = currentSdoCondition.Text1;
        pricingInfoJson.prdMainPKey = currentSdoCondition.PrdMainPKey;
        pricingInfoJson.currency = currentSdoCondition.Currency;
        pricingInfoJson.currencyConversionRate = currentSdoCondition.CurrencyConversionRate;
        pricingInfoJson.cndCpCalculationPosition = currentSdoCondition.CndCpCalculationPosition;
        pricingInfoJson.cndCpSearchStrategyKTRelPos = currentSdoCondition.CndCpSearchStrategyKTRelPos;
        pricingInfoJson.conditionBaseValue = currentSdoCondition.ConditionBaseValue;
        pricingInfoJson.conditionUnit = currentSdoCondition.ConditionUnit;
        pricingInfoJson.unitFactor = currentSdoCondition.UnitFactor;
        pricingInfoJson.convertedConditionValue = currentSdoCondition.ConvertedConditionValue;
        pricingInfoJson.conditionResult = currentSdoCondition.ConditionResult;
        pricingInfoJson.cndCpMetaPKey = currentSdoCondition.CndCpMetaPkey;

        if(Utils.isEmptyString(currentSdoCondition.ConditionValue)){
          currentSdoCondition.ConditionValue = currentSdoCondition.ConvertedConditionValue;
        }
        pricingInfoJson.conditionValue = currentSdoCondition.ConditionValue;

        if(currentSdoCondition.PrintRelevant){
          pricingInfoJson.cpIsPrintRelevant = "1";
        }else{
          pricingInfoJson.cpIsPrintRelevant = "0";
        }

        if(Utils.isEmptyString(currentSdoCondition.SdoItemPKey)){
          orderInfo.push(pricingInfoJson);
        }
        else{
          //Set ErpID temporary to pkey, needed because printout correlates via ErpID
          //ErpIDs of SdoConditions are updated later in function setItemErpIDs
          var listItem = orderItemIdDict.get(currentSdoCondition.SdoItemPKey);
          if (Utils.isDefined(listItem)){
            if(Utils.isEmptyString(listItem.getErpId())){
              listItem.setErpId(listItem.getPKey());
            }
            pricingInfoJson.sdoItemErpId = listItem.getErpId();
          }

          //Prepare order item pricing info dictionary so that later the array can be stringified and set to the order item
          orderItemInfo = [];
          if(!orderItemPricingInfoDict.containsKey(currentSdoCondition.SdoItemPKey)){
            orderItemInfo.push(pricingInfoJson);
            orderItemPricingInfoDict.add(currentSdoCondition.SdoItemPKey, orderItemInfo);
          }
          else{
            orderItemInfo = orderItemPricingInfoDict.get(currentSdoCondition.SdoItemPKey);
            orderItemInfo.push(pricingInfoJson);
            orderItemPricingInfoDict.data[currentSdoCondition.SdoItemPKey] = orderItemInfo;
          }
        }
      }
    } else if(generateOptimisedPricingInfo){

      for(i = 0; i < sdoConditionsJson.length; i++){
        pricingInfoJson = {};
        currentSdoCondition = sdoConditionsJson[i];

        pricingInfoJson.v = "2";
        pricingInfoJson.clcPos = currentSdoCondition.CndCpCalculationPosition;
        pricingInfoJson.searchPos = currentSdoCondition.CndCpSearchStrategyKTRelPos;
        pricingInfoJson.nBase = currentSdoCondition.ConditionBaseValue;
        pricingInfoJson.unit = currentSdoCondition.ConditionUnit;
        pricingInfoJson.factor = currentSdoCondition.UnitFactor;
        pricingInfoJson.cnvValue = currentSdoCondition.ConvertedConditionValue;
        pricingInfoJson.result = currentSdoCondition.ConditionResult;
        pricingInfoJson.met = currentSdoCondition.CndCpMetaPkey;

        if(Utils.isEmptyString(currentSdoCondition.ConditionValue)){
          currentSdoCondition.ConditionValue = currentSdoCondition.ConvertedConditionValue;
        }
        pricingInfoJson.value = currentSdoCondition.ConditionValue;

        if(currentSdoCondition.PrintRelevant){
          pricingInfoJson.print = "1";
        }else{
          pricingInfoJson.print = "0";
        }

        if(Utils.isEmptyString(currentSdoCondition.SdoItemPKey)){
          orderInfo.push(pricingInfoJson);
        }
        else{
          //Prepare order item pricing info dictionary so that later the array can be stringified and set to the order item
          orderItemInfo = [];
          if(!orderItemPricingInfoDict.containsKey(currentSdoCondition.SdoItemPKey)){
            orderItemInfo.push(pricingInfoJson);
            orderItemPricingInfoDict.add(currentSdoCondition.SdoItemPKey, orderItemInfo);
          }
          else{
            orderItemInfo = orderItemPricingInfoDict.get(currentSdoCondition.SdoItemPKey);
            orderItemInfo.push(pricingInfoJson);
            orderItemPricingInfoDict.data[currentSdoCondition.SdoItemPKey] = orderItemInfo;
          }
        }
      }
    }

    //update order pricing information
    me.setPricingInformation(JSON.stringify(orderInfo));
    //update item pricing information
    me.getLoItems().getAllItems().forEach(function(orderItem){
      if(orderItemPricingInfoDict.containsKey(orderItem.getPKey())){
        orderItem.setPricingInformation(JSON.stringify(orderItemPricingInfoDict.get(orderItem.getPKey())));
      }else{
        //Write a valid JSON to order item if no conditions found
        orderItem.setPricingInformation("[]");
      }
    });
    //resume list events
    promise = me.getLoItems().resumeListRefreshAsync(false,true);
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}