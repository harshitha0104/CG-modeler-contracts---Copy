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
 * @function cpHandleCalculateResult
 * @this BoOrder
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {String} triggeredByFreeItem
 * @param {Object} result
 * @returns promise
 */
function cpHandleCalculateResult(triggeredByFreeItem, result){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = when.resolve("0");
var li;

if (Utils.isDefined(result.Debug) && Utils.isDefined(result.Debug[0]) && Utils.isDefined(result.Debug[0].PricingDate)) {
  result.Debug[0].PricingDate = Utils.convertAnsiDateTime2AnsiDate(Utils.convertFullDate2Ansi(result.Debug[0].PricingDate));
}

if (result.CSTAT === true) {
  var length = result.Items.length;

  for (var i = 0; i < length; i++) {
    var resultPkey = result.Items[i].PKey;
    var orderItem = me.getLoItems().getItemByPKey(resultPkey);

    if (Utils.isDefined(orderItem)) {
      //important to suspend list refresh here
      //if that is not done pricinginfo1-10 which was calculated by the PE
      //makes the order dirty again and recalculation is needed
      //--> suspend list refresh so that item changes handler is not called
      me.getLoItems().suspendListRefresh();

      orderItem.setPrice(Utils.round(result.Items[i].Price,6,ROUNDING_TYPE.FINANCIAL));
      orderItem.setPriceReceipt(Utils.round(result.Items[i].PriceReceipt,6,ROUNDING_TYPE.FINANCIAL));
      orderItem.setValue(Utils.round(result.Items[i].Value,6,ROUNDING_TYPE.FINANCIAL));
      orderItem.setValueReceipt(Utils.round(result.Items[i].ValueReceipt,6,ROUNDING_TYPE.FINANCIAL));
      orderItem.setBasePrice(Utils.round(result.Items[i].BasePrice,6,ROUNDING_TYPE.FINANCIAL));
      orderItem.setBasePriceReceipt(Utils.round(result.Items[i].BasePriceReceipt,6,ROUNDING_TYPE.FINANCIAL));
      orderItem.setGrossValue(Utils.round(result.Items[i].GrossValue,6,ROUNDING_TYPE.FINANCIAL));
      orderItem.setGrossValueReceipt(Utils.round(result.Items[i].GrossValueReceipt,6,ROUNDING_TYPE.FINANCIAL));
      orderItem.setSpecialPrice(Utils.round(result.Items[i].SpecialPrice,6,ROUNDING_TYPE.FINANCIAL));
      orderItem.setPricingInfo1(result.Items[i].PricingInfo1);
      orderItem.setPricingInfo2(result.Items[i].PricingInfo2);
      orderItem.setPricingInfo3(result.Items[i].PricingInfo3);
      orderItem.setPricingInfo4(result.Items[i].PricingInfo4);
      orderItem.setPricingInfo5(result.Items[i].PricingInfo5);
      orderItem.setPricingInfo6(result.Items[i].PricingInfo6);
      orderItem.setPricingInfo7(result.Items[i].PricingInfo7);
      orderItem.setPricingInfo8(result.Items[i].PricingInfo8);
      orderItem.setPricingInfo9(result.Items[i].PricingInfo9);
      orderItem.setPricingInfo10(result.Items[i].PricingInfo10);

      me.getLoItems().resumeListRefresh(true);
    }
  }

  if (Utils.isDefined(result.SdoConditions)) {
    me.setSdoConditionsJson(JSON.stringify(result.SdoConditions));
  }
  if (Utils.isDefined(result.Debug)) {
    me.setPricingJSON(result.Debug);
  }

  if (result.splittingGroup !== " ") {
    li = {
      "splittingGroup": result.splittingGroup,
      "totalValue": result.TotalValue,
      "totalValueReceipt": result.TotalValueReceipt,
      "grossTotalValue": result.GrossTotalValue,
      "grossTotalValueReceipt": result.GrossTotalValueReceipt,
      "merchandiseValue": result.MerchandiseValue,
      "merchandiseValueReceipt": result.MerchandiseValueReceipt,
      "sdoConditions": result.SdoConditions,
      "pricingJson": result.Debug,
      "paidAmount": result.GrossTotalValue,
      "paidAmountReceipt": result.GrossTotalValueReceipt,
      "absolutePaidAmount": Math.abs(result.GrossTotalValue),
      "currency": me.getCurrency()
    };
    me.getLoSplittingGroups().addListItems([li]);
    me.setGrossTotalValueReceipt(Utils.round(me.getGrossTotalValueReceipt() + result.GrossTotalValueReceipt,6,ROUNDING_TYPE.FINANCIAL));
    me.setGrossTotalValue(Utils.round(me.getGrossTotalValue() + result.GrossTotalValue,6,ROUNDING_TYPE.FINANCIAL));
    me.setMerchandiseValueReceipt(Utils.round(me.getMerchandiseValueReceipt() + result.MerchandiseValueReceipt,6,ROUNDING_TYPE.FINANCIAL));
    me.setMerchandiseValue(Utils.round(me.getMerchandiseValue() + result.MerchandiseValue,6,ROUNDING_TYPE.FINANCIAL));
    me.setTotalValueReceipt(Utils.round(me.getTotalValueReceipt() + result.TotalValueReceipt,6,ROUNDING_TYPE.FINANCIAL));
    me.setTotalValue(Utils.round(me.getTotalValue() + result.TotalValue,6,ROUNDING_TYPE.FINANCIAL));
  }
  else {
    me.setGrossTotalValueReceipt(Utils.round(result.GrossTotalValueReceipt,6,ROUNDING_TYPE.FINANCIAL));
    me.setGrossTotalValue(Utils.round(result.GrossTotalValue,6,ROUNDING_TYPE.FINANCIAL));
    me.setMerchandiseValueReceipt(Utils.round(result.MerchandiseValueReceipt,6,ROUNDING_TYPE.FINANCIAL));
    me.setMerchandiseValue(Utils.round(result.MerchandiseValue,6,ROUNDING_TYPE.FINANCIAL));
    me.setTotalValueReceipt(Utils.round(result.TotalValueReceipt,6,ROUNDING_TYPE.FINANCIAL));
    me.setTotalValue(Utils.round(result.TotalValue,6,ROUNDING_TYPE.FINANCIAL));
    me.setPricingInfo1(result.PricingInfo1);
    me.setPricingInfo2(result.PricingInfo2);
    me.setPricingInfo3(result.PricingInfo3);
    me.setPricingInfo4(result.PricingInfo4);
    me.setPricingInfo5(result.PricingInfo5);
    me.setPricingInfo6(result.PricingInfo6);
    me.setPricingInfo7(result.PricingInfo7);
    me.setPricingInfo8(result.PricingInfo8);
    me.setPricingInfo9(result.PricingInfo9);
    me.setPricingInfo10(result.PricingInfo10);
  }
}
else if (result.CSTAT === false && triggeredByFreeItem !== "1") {
  if (result.splittingGroup !== " ") {
    li = {
      "splittingGroup": 0,
      "totalValue": 0,
      "totalValueReceipt": 0,
      "grossTotalValue": 0,
      "grossTotalValueReceipt": 0,
      "merchandiseValue": 0,
      "merchandiseValueReceipt": 0,
      "pricingJson": result.Debug,
      "currency": me.getCurrency()
    };
    me.getLoSplittingGroups().addListItems([li]);
  }

  if (Utils.isDefined(result.Debug)) {
    me.setPricingJSON(result.Debug);
  }

  if (result.IsMandCondFnd === false) {
    if (Utils.isDefined(result.PrdText && result.calcStepID)) {
      var messageCollector = new MessageCollector();
      var newError = {
        "level": "error",
        "objectClass" : "BoOrder",
        "messageID" : "CasSdoCpMandatoryConditionMissing",
        "messageParams" : {
          "step" : result.calcStepID,
          "product" : result.PrdText
        }
      };
      messageCollector.add(newError);

      var buttonValues = {};
      var messages = messageCollector.getMessages().join("<br>");
      buttonValues[Localization.resolve("OK")] = "ok";
      promise = MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Error"), messages, buttonValues).then(function () {
        return "0";
      });
    }
  }
}

var freeItemHelperFunction = function () {
  if (Utils.isDefined(me.getBoOrderMeta())) {
    var calculationSchemaParams = [];
    var calculationSchemaQuery = {};
    calculationSchemaParams.push({
      "field" : "sdoMetaPKey",
      "value" : me.getBoOrderMeta().getPKey()
    });
    calculationSchemaQuery.params = calculationSchemaParams;

    return BoFactory.loadObjectByParamsAsync("LuOrderMetaforFreeItems", calculationSchemaQuery).then(function (luOrderMetaforFreeItems) {
      if (Utils.isDefined(luOrderMetaforFreeItems) && !Utils.isEmptyString(luOrderMetaforFreeItems.getSdoItemMetaPKey())) {
        return me.cpAddAndUpdateFreeItems(result.FreeItems, luOrderMetaforFreeItems.getSdoItemMetaPKey(), result.splittingGroup);
      }
      else {
        return "0";
      }
    });
  }
  else {
    return when.resolve("0");
  }
};

if (Utils.isDefined(result.FreeItems) && triggeredByFreeItem !== "1" && result.FreeItems.length > 0) {
  promise = freeItemHelperFunction();
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}