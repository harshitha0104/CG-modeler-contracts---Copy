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
 * @function setInventoryBalanceOfCashPayment
 * @this BoCash
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {DomPKey} paymentPKey
 * @returns promise
 */
function setInventoryBalanceOfCashPayment(paymentPKey){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise;

if(Utils.isDefined(paymentPKey))
{
  var liPayments = me.getLoPayments().getItemByPKey(paymentPKey);
  var objectStatus = liPayments.getObjectStatus();
  if(Utils.isEmptyString(liPayments.getIvcInformationObject()))
  {
    var ivcMetas = me.getBoCashMeta().getIvcMetasByPaymentMeta(liPayments.getSdoPaymentMetaPKey());
    var ivcMetaPKeys = [];
    var usrMainPKeys = [];
    var bpaMainPKeys = [];
    var tmgTourPKeys = [];
    var etpVehiclePKeys = [];
    for (var i = 0; i < ivcMetas.length; i++) {
      ivcMetaPKeys.push(ivcMetas[i].getIvcMetaPKey());
      usrMainPKeys.push(ivcMetas[i].getUsrMainPKey());
      bpaMainPKeys.push(ivcMetas[i].getBpaMainPKey());
      tmgTourPKeys.push(ivcMetas[i].getTmgTourPKey());
      etpVehiclePKeys.push(ivcMetas[i].getEtpVehiclePKey());
    }
    var jsonParamsForFinding = [];
    var jsonQueryForFinding = {};

    jsonParamsForFinding.push({
      "field" : "ivcMetaPKeys",
      "value" : "'" + ivcMetaPKeys.join("','") + "'"
    });
    jsonParamsForFinding.push({
      "field" : "usrMainPKeys",
      "value" : "'" + usrMainPKeys.join("','") + "'"
    });
    jsonParamsForFinding.push({
      "field" : "bpaMainPKeys",
      "value" : "'" + bpaMainPKeys.join("','") + "'"
    });
    jsonParamsForFinding.push({
      "field" : "prdMainPKeys",
      "value" : "' '"
    });
    jsonParamsForFinding.push({
      "field" : "tmgTourPKeys",
      "value" : "'" + tmgTourPKeys.join("','") + "'"
    });
    jsonParamsForFinding.push({
      "field" : "etpVehiclePKeys",
      "value" : "'" + etpVehiclePKeys.join("','") + "'"
    });
    jsonParamsForFinding.push({
      "field" : "addCond_Currency",
      "value" : " AND IvcMain.Currency = '" + liPayments.getCurrency() + "' "
    });

    jsonQueryForFinding.params = jsonParamsForFinding;

    promise = BoFactory.loadObjectByParamsAsync("LoInventoryFinding", jsonQueryForFinding).then(
      function (loInventoryFinding) {

        // Build inventory information object and store at payment
        var liInventory;
        var ivcInformation = {};
        var ivcInformationObject = [];
        var params = {};

        for (var i = 0; i < ivcMetas.length; i++) {
          params = {};
          params.ivcMetaPKey = ivcMetas[i].getIvcMetaPKey();
          params.usrMainPKey = ivcMetas[i].getUsrMainPKey();
          params.bpaMainPKey = ivcMetas[i].getBpaMainPKey();
          params.tmgTourPKey = ivcMetas[i].getTmgTourPKey();
          params.etpVehiclePKey = ivcMetas[i].getEtpVehiclePKey();

          // + Currency?

          ivcInformation = {};
          ivcInformation.ivcMainPKey = " ";
          ivcInformation.balance = 0;

          liInventory = loInventoryFinding.getItemsByParam(params);

          // If inventory found, add IvcMainPKey to IvcInformationObject
          if (liInventory.length > 0) {
            ivcInformation.ivcMainPKey = liInventory[0].getIvcMainPKey();
            ivcInformation.balance = liInventory[0].getBalance();
          }

          ivcInformation.ivcMetaByPaymentMeta = ivcMetas[i];

          ivcInformationObject.push(ivcInformation);
        }

        liPayments.setIvcInformationObject(ivcInformationObject);
        liPayments.setObjectStatus(objectStatus);
      }
    );
  }
  else
  {
    promise = when.resolve();
  }
}
else 
{
  promise = when.resolve();
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}