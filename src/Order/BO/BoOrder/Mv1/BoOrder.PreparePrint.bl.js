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
 * @function preparePrint
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {LoCpConditionTemplateText} loCpConditionTemplateText
 * @returns promise
 */
function preparePrint(loCpConditionTemplateText){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var cndCpMetaPKeyForEmpties = "00100000007hnjlk"; //hard coded to Empties Total as discussed with PO

var buildSdoConditions = function(pricingInfoJson, orderItem) {
  var conditions = [];
  for (var i = 0; i < pricingInfoJson.length; i++) {
    var currentPricingInfo = pricingInfoJson[i];
    var isOptimisedPricingInfo = Utils.isDefined(currentPricingInfo.v) && currentPricingInfo.v === "2";
    var isPrintRelevant = isOptimisedPricingInfo ? currentPricingInfo.print : currentPricingInfo.cpIsPrintRelevant;

    if (isPrintRelevant == "1") {
      var sdoCondition = {};
      sdoCondition.pKey = PKey.next();
      sdoCondition.sdoMainPKey = me.getPKey();
      sdoCondition.sdoItemPKey = orderItem ? orderItem.getPKey() : " ";
      sdoCondition.prdMainPKey = orderItem ? orderItem.getPrdMainPKey() : " ";
      sdoCondition.currency = me.getCurrency();
      sdoCondition.currencyConversionRate = "1";

      if (sdoCondition.sdoItemPKey) {
        //Set ErpID to order item pkey as it is needed because printout correlates via ErpID
        if (Utils.isDefined(orderItem)) {
          if(Utils.isEmptyString(orderItem.getErpId())){
            orderItem.setErpId(orderItem.getPKey());
          }
          sdoCondition.sdoItemErpId = orderItem.getErpId();
        }
      }

      if(isOptimisedPricingInfo){

        //The pricing condition template texts are only used in printouts. Because of that the texts were removed from the optimised JSON structure.
        //Pricing condition template texts are handed over from the calling process (Advantage: No need to have loop over SdoConditions twice or doing DB requests in this loop).
        //The texts for all templates can be loaded in the process because we expect max 100 records. (committed by PMs). If this number is getting higher
        //in the future we should think about the concept again.
        sdoCondition.text1 = loCpConditionTemplateText.getItemByPKey(currentPricingInfo.met).getText();

        sdoCondition.cndCpCalculationPosition = currentPricingInfo.clcPos;
        sdoCondition.cndCpSearchStrategyKTRelPos = currentPricingInfo.searchPos;
        sdoCondition.conditionBaseValue = currentPricingInfo.nBase;
        sdoCondition.conditionValue = currentPricingInfo.value;
        sdoCondition.conditionUnit = currentPricingInfo.unit;
        sdoCondition.unitFactor = currentPricingInfo.factor;
        sdoCondition.convertedConditionValue = currentPricingInfo.cnvValue;
        sdoCondition.conditionResult = currentPricingInfo.result;
        sdoCondition.cndCpMetaPKey = currentPricingInfo.met;
        sdoCondition.cpIsPrintRelevant = currentPricingInfo.print;
      } else{
        sdoCondition.text1 = currentPricingInfo.text1;
        sdoCondition.cndCpCalculationPosition = currentPricingInfo.cndCpCalculationPosition;
        sdoCondition.cndCpSearchStrategyKTRelPos = currentPricingInfo.cndCpSearchStrategyKTRelPos;
        sdoCondition.conditionBaseValue = currentPricingInfo.conditionBaseValue;
        sdoCondition.conditionValue = currentPricingInfo.conditionValue;
        sdoCondition.conditionUnit = currentPricingInfo.conditionUnit;
        sdoCondition.unitFactor = currentPricingInfo.unitFactor;
        sdoCondition.convertedConditionValue = currentPricingInfo.convertedConditionValue;
        sdoCondition.conditionResult = currentPricingInfo.conditionResult;
        sdoCondition.cndCpMetaPKey = currentPricingInfo.cndCpMetaPKey;
        sdoCondition.cpIsPrintRelevant = currentPricingInfo.cpIsPrintRelevant;
      }

      conditions.push(sdoCondition);
    }
  }
  return conditions;
};

var promise = when.resolve();
if (me.getValidateForRelease() == "1") {
  me.setPhaseText(BLConstants.Order.PHASE_RELEASED);
} else {
  me.setPhaseText(me.getPhase());
}

if (Utils.isDefined(this.getLoSdoConditions())) {
  if(Utils.isSfBackend()) {
    this.getLoSdoConditions().removeAllItems();
  }
}

// Set balance after calculating total value in receipt and the value amount paid
if (me.getPaidAmountReceipt() === 0) {
  me.setPaymentMethodText(" ");
  me.setTotalPaidAmount(" ");
} else {
  me.setPaymentMethodText(Utils.getToggleText("DomPaymentMethod", me.getPaymentMethod()));
  me.setTotalPaidAmount(me.getPaidAmountReceipt());
}
me.setBalance(me.getGrossTotalValueReceipt() - me.getPaidAmountReceipt());

if ((me.getBoOrderMeta().getComputePrice() == BLConstants.Order.BUTTON_MODE) || (me.getBoOrderMeta().getComputePrice() == BLConstants.Order.EDIT_MODE)) {

  var conditionsQuery = {};
  conditionsQuery.sdoMainPKey = me.getPKey();
  conditionsQuery.addCond_PrintRelevant = " AND SdoCondition.CpIsPrintRelevant = '1' ";

  promise = BoFactory.loadObjectByParamsAsync("LoSdoConditions", conditionsQuery)
    .then(function (loSdoCondition) {

    // SF/CASDIF: General Dif
    // In CGCloud case no SdoCondition records are stored in DB
    // The info is directly stored in Order/OrderItem (Pricing_Information__c)
    //Load pricing information from Order/OrderItem and create SdoConditions out of it
    if (Utils.isSfBackend()) {
      if (!Utils.isEmptyString(me.getPricingInformation())) {
        var pricingInfoJson = [];
        pricingInfoJson = JSON.parse(me.getPricingInformation());

        var orderConditions = [];
        if (Utils.isDefined(pricingInfoJson)) {
          orderConditions = buildSdoConditions(pricingInfoJson);  
          loSdoCondition.addItems(orderConditions);
        }

        var orderItems = me.getLoItems().getAllItems();
        for(var j = 0; j < orderItems.length; j++) {
          var currentItem = orderItems[j];
          if (!Utils.isEmptyString(currentItem.getPricingInformation())) {
            pricingInfoJson = JSON.parse(currentItem.getPricingInformation());
            var orderItemConditions = [];
            orderItemConditions = buildSdoConditions(pricingInfoJson, currentItem);
            loSdoCondition.addItems(orderItemConditions);
          }
        }
      }

      // Create dummy condition if no conditions exist
      if (loSdoCondition.getAllItemsCount() === 0) {

        var liSdoCondition = {
          "cpIsPrintRelevant" : "1",
          "sdoItemPKey" : PKey.next()
        };
        loSdoCondition.addListItems([liSdoCondition]);
      }
      me.setLoSdoConditions(loSdoCondition);

      //set total amount of empties
      var loHeaderConditionAmountOfEmpties = loSdoCondition.getItemsByParamArray([{
        "cndCpMetaPKey" : cndCpMetaPKeyForEmpties,
        "op" : "EQ"
      }]);

      if (loHeaderConditionAmountOfEmpties.length > 0) {
        me.setEmptiesTotalText(loHeaderConditionAmountOfEmpties[0].getText1());
        me.setEmptiesTotalAmount(parseFloat(loHeaderConditionAmountOfEmpties[0].getConditionResult()).toFixed(2).toString());
        me.setEmptiesTotalCurrency(me.getData().currency.getShortText());
      } else {
        me.setEmptiesTotalText("");
        me.setEmptiesTotalAmount("");
        me.setEmptiesTotalCurrency("");
      }
    }
  });
} 
else {
  // Create dummy LoSdoCondition if complex pricing is not enabled to avoid "NULL" values in Printout
  var loSdoCondition = BoFactory.instantiate("LoSdoConditions");
  var liSdoCondition = {
    "cpIsPrintRelevant" : "1",
    "sdoItemPKey" : PKey.next()
  };
  loSdoCondition.addListItems([liSdoCondition]);
  me.setLoSdoConditions(loSdoCondition);
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}