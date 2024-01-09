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
 * @function createTransactionForTruckLoadItem
 * @this LoInventoryTransaction
 * @kind listobject
 * @async
 * @namespace CORE
 * @param {Object} itemObj
 * @returns promise
 */
function createTransactionForTruckLoadItem(itemObj){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var item = itemObj.item;
var ivcMetasByItemMeta = itemObj.ivcMetasByItemMeta;
var checkUserInventoryOver = itemObj.itemMeta.checkUserInventoryOver;
var checkQuotaOver =  itemObj.itemMeta.checkQuotaOver;
var prdMainPKey = item.getPrdMainPKey();
var validationError;
var loUnitFactorForProduct;

var promise = BoFactory.loadObjectByParamsAsync("LoUnitFactorForProduct", {"productPKey" : prdMainPKey})
.then(function (loUnitFactorForProduct) {

  return BoFactory.loadObjectByParamsAsync("LuLogisticUnit", {"ProductPKey": prdMainPKey, "UnitType" : item.getQuantityLogisticUnit()})

.then(function(luLogUnit){

  var validationError;

  for(var i=0;i<itemObj.ivcInformation.length && !Utils.isDefined(validationError);i++){
    var ivcMeta = itemObj.ivcInformation[i];
    var jsonIvcTaData = {};

    jsonIvcTaData.pKey = PKey.next();
    jsonIvcTaData.ivcMainPKey = ivcMeta.ivcMainPKey;
    jsonIvcTaData.ivcTaMetaPKey = ivcMeta.ivcTaMetaPKey;
    jsonIvcTaData.sdoMainPKey = item.getSdoMainPKey();
    jsonIvcTaData.sdoItemPKey = item.getPKey();
    jsonIvcTaData.accounted = "0";
    jsonIvcTaData.initiationDate = Utils.createDateToday();
    jsonIvcTaData.salesOrg = ApplicationContext.get('user').getBoUserSales().getSalesOrg();
    jsonIvcTaData.initiatorUsrMainPKey = ApplicationContext.get('user').getPKey();
    jsonIvcTaData.chargeDate = Utils.createDateNow();


    //Convert inventory balance to unit of item 
    var convertedTransactionValue; 

    //Determine amount and algebraic sign 
    switch(ivcMeta.tAControl){

      case "Add":
      case "Neutral":
        convertedTransactionValue = loUnitFactorForProduct.convertLogisticUnitToIvcMeasure(ivcMeta.ivcMeasure, item.getQuantity(), item.getQuantityLogisticUnit(), luLogUnit.getPiecesPerSmallestUnit());
        jsonIvcTaData.amount = convertedTransactionValue;
        break;

      case "Withdraw":
        convertedTransactionValue = loUnitFactorForProduct.convertLogisticUnitToIvcMeasure(ivcMeta.ivcMeasure, item.getQuantity(), item.getQuantityLogisticUnit(), luLogUnit.getPiecesPerSmallestUnit());
        jsonIvcTaData.amount = convertedTransactionValue * (-1);
        break;

      case "Audit":
        convertedTransactionValue = loUnitFactorForProduct.convertLogisticUnitToIvcMeasure(ivcMeta.ivcMeasure, item.getQuantity() - item.getTargetQuantity(), item.getQuantityLogisticUnit(), luLogUnit.getPiecesPerSmallestUnit());
        jsonIvcTaData.amount = convertedTransactionValue;
        break;
    }



    //Validate inventory overdrawn
    var balanceAfterTransaction = ivcMeta.balance + jsonIvcTaData.amount;

    if (balanceAfterTransaction < 0 && itemObj.documentType == "TruckIvcTransferOutward") {
      var valueForMessage = loUnitFactorForProduct.convertIvcMeasureToLogisticUnit(ivcMeta.ivcMeasure, Math.abs(balanceAfterTransaction),
                                                                                   item.getQuantityLogisticUnit(), luLogUnit.getPiecesPerSmallestUnit());

      //Validate user inventory over
      if ((ivcMeta.metaId == "UserInventory") && (checkUserInventoryOver != "0")) {
        if (checkUserInventoryOver == "1") {     
          validationError = {
            "level": "error",
            "objectClass": "BoTruckLoad",
            "messageID": "CasSdoMainQuantityExceedsUserInventorySummary",
            "messageParams": { "summary": item.getText1() + " (" + valueForMessage + " " + item.getQuantityLogisticUnit() + ")" }
          };
        } else {     
          validationError = {
            "level": "warning",
            "objectClass": "BoTruckLoad",
            "messageID": "CasSdoMainQuantityExceedsUserInventoryWarningSummary",
            "messageParams": { "summary": item.getText1() + " (" + valueForMessage + " " + item.getQuantityLogisticUnit() + ")" }
          };
        }
      }

      //Validate quota over
      if ((ivcMeta.metaId == "Quota") && (checkQuotaOver != "0")) {
        if (checkQuotaOver == "1") {
          validationError = {
            "level": "error",
            "objectClass": "BoTruckLoad",
            "messageID": "CasSdoMainQuantityExceedsQuotaSummary",
            "messageParams": { "summary": item.getText1() + " (" + valueForMessage + " " + item.getQuantityLogisticUnit() + ")" }
          };
        } else {
          validationError = {
            "level": "warning",
            "objectClass": "BoTruckLoad",
            "messageID": "CasSdoMainQuantityExceedsQuotaWarningSummary",
            "messageParams": { "summary": item.getText1() + " (" + valueForMessage + " " + item.getQuantityLogisticUnit() + ")" }
          };
        }
      }
    }

    me.addItems([jsonIvcTaData]);
    me.getItemsByParam({ "pKey": jsonIvcTaData.pKey })[0].setObjectStatus(this.self.STATE_NEW_DIRTY);
  }

  return validationError;
  });
});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}