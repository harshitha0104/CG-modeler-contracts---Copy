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
 * @function cpCreateSdoConditionRecords
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} PrintRelevantOnly
 * @returns promise
 */
function cpCreateSdoConditionRecords(PrintRelevantOnly){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
// Obsolete / unused : This function has been deprecated, we are creating Sdo Conditions in BoOrder.preparePrint method now.
var promise = when.resolve();

if (Utils.isDefined(me.getLoSdoConditions())){
  if(Utils.isSfBackend()){
    me.getLoSdoConditions().removeAllItems();
  }
  else{
    var items = me.getLoSdoConditions().getAllItems();
    for (var index = 0; index < items.length; index++){
      items[index].setObjectStatus(STATE.DIRTY | STATE.DELETED);
    }
  }
  // we do not generate pricing conditions if the generatePricingInformation on OrderMeta flag is set to no or undefined
  if (me.getCalculationStatus() == "1" && me.getDocTaType() !== "NonValuatedDeliveryNote" &&
      me.getBoOrderMeta().getGeneratePricingInformation() === "Yes"){
    var calculationPromise;
    if (Utils.isEmptyString(me.getSdoConditionsJson())){
      calculationPromise = me.cpCalculate();
    }

    promise = when(calculationPromise).then(
      function (){
        var tmpJSON = [];
        if (Utils.isDefined(me.getSdoConditionsJson()) && !Utils.isEmptyString(me.getSdoConditionsJson())){
          tmpJSON = JSON.parse(me.getSdoConditionsJson());
        }

        var newItems = [];
        if (Utils.isDefined(tmpJSON)){
          for (var i = 0; i < tmpJSON.length; i++){
            if (!PrintRelevantOnly || tmpJSON[i].PrintRelevant){
              var itemForAdd = {};
              itemForAdd.pKey = PKey.next();
              itemForAdd.sdoMainPKey = me.getPKey();
              itemForAdd.sdoItemPKey = tmpJSON[i].SdoItemPKey;
              itemForAdd.text1 = tmpJSON[i].Text1;
              itemForAdd.prdMainPKey = tmpJSON[i].PrdMainPKey;
              itemForAdd.currency = tmpJSON[i].Currency;
              itemForAdd.currencyConversionRate = tmpJSON[i].CurrencyConversionRate;

              if (!Utils.isEmptyString(tmpJSON[i].SdoItemPKey)){
                //set ErpID temporary to pkey
                //needed because printout correlates via ErpID
                //ErpIDs of SdoConditions are updated later in function setItemErpIDs
                var lstItem = me.getLoItems().getItemByPKey(tmpJSON[i].SdoItemPKey);
                if (Utils.isDefined(lstItem)){
                  if(Utils.isEmptyString(lstItem.getErpId())){
                    lstItem.setErpId(lstItem.getPKey());
                  }
                  itemForAdd.sdoItemErpId = lstItem.getErpId();
                }
              }

              itemForAdd.cndCpCalculationPosition = tmpJSON[i].CndCpCalculationPosition;
              itemForAdd.cndCpSearchStrategyKTRelPos = tmpJSON[i].CndCpSearchStrategyKTRelPos;
              itemForAdd.conditionBaseValue = tmpJSON[i].ConditionBaseValue;

              if (Utils.isEmptyString(tmpJSON[i].ConditionValue)){
                tmpJSON[i].ConditionValue = tmpJSON[i].ConvertedConditionValue;
              }

              itemForAdd.conditionValue = tmpJSON[i].ConditionValue;
              itemForAdd.conditionUnit = tmpJSON[i].ConditionUnit;
              itemForAdd.unitFactor = tmpJSON[i].UnitFactor;
              itemForAdd.convertedConditionValue = tmpJSON[i].ConvertedConditionValue;
              itemForAdd.conditionResult = tmpJSON[i].ConditionResult;
              itemForAdd.cndCpMetaPKey = tmpJSON[i].CndCpMetaPkey;

              if (tmpJSON[i].PrintRelevant){
                itemForAdd.cpIsPrintRelevant = "1";
              }
              else{
                itemForAdd.cpIsPrintRelevant = "0";
              }
              newItems.push(itemForAdd);
            }
          }

          if (newItems.length > 0){
            me.getLoSdoConditions().addItems(newItems);
            var items = me.getLoSdoConditions().getItemObjects();
            var stateDeleted = STATE.DIRTY | STATE.DELETED;
            var stateNewDirty = STATE.NEW | STATE.DIRTY;
            for (var j = 0; j < items.length; j++){
              if (items[j].getObjectStatus() !== stateDeleted){
                items[j].setObjectStatus(stateNewDirty);
              }
            }
            me.getLoSdoConditions().setObjectStatus(stateNewDirty);
          }
        }
      });
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}