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
 * @function setInventoryBalanceOfItem
 * @this BoTruckLoad
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {String} itemPKey
 * @returns promise
 */
function setInventoryBalanceOfItem(itemPKey){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var ivcMetaPKeys = [];
var usrMainPKeys = [];
var bpaMainPKeys = [];
var prdMainPKeys = [];
var tmgTourPKeys = [];
var etpVehiclePKeys = [];

var mainItem = me.getLoItems().getItemByPKey(itemPKey);
var itemMeta = me.getBoOrderMeta().getLoOrderItemMetas().getItemTemplateByPKey(mainItem.getSdoItemMetaPKey());
var objectStatus = mainItem.getObjectStatus();
// Get inventory meta information with prepared search keys
var ivcMetasByItemMeta = this.getBoOrderMeta().getIvcMetasByItemMeta(mainItem.getSdoItemMetaPKey());

for (var i = 0; i < ivcMetasByItemMeta.length; i++) {
  ivcMetaPKeys.push(ivcMetasByItemMeta[i].getIvcMetaPKey());
  usrMainPKeys.push(ivcMetasByItemMeta[i].getUsrMainPKey());
  bpaMainPKeys.push(ivcMetasByItemMeta[i].getBpaMainPKey());
  tmgTourPKeys.push(ivcMetasByItemMeta[i].getTmgTourPKey());
  etpVehiclePKeys.push(ivcMetasByItemMeta[i].getEtpVehiclePKey());
}

prdMainPKeys.push(mainItem.getPrdMainPKey());

var jsonQueryForFinding = {};
jsonQueryForFinding.params = [
  { "field": "ivcMetaPKeys", "value": "'" + ivcMetaPKeys.join("','") + "'" },
  { "field": "usrMainPKeys", "value": "'" + usrMainPKeys.join("','") + "'" },
  { "field": "bpaMainPKeys", "value": "'" + bpaMainPKeys.join("','") + "'" },
  { "field": "prdMainPKeys", "value": "'" + prdMainPKeys.join("','") + "'" },
  { "field": "tmgTourPKeys", "value": "'" + tmgTourPKeys.join("','") + "'" },
  { "field": "etpVehiclePKeys", "value": "'" + etpVehiclePKeys.join("','") + "'" }
];

var jsonQueryForUnitConversion =
    {
      "params": [
        {
          "field": "productPKey",
          "value": mainItem.getPrdMainPKey()
        }
      ]
    };

var loUnitFactorForProduct;
var luLogUnit;

var promise = BoFactory.loadObjectByParamsAsync("LoUnitFactorForProduct", jsonQueryForUnitConversion).then(
  function (unitFactorForProductLo) {
    // Get conversion information for product
    loUnitFactorForProduct = unitFactorForProductLo;
    return BoFactory.loadObjectByParamsAsync("LuLogisticUnit", { "ProductPKey": mainItem.getPrdMainPKey(), "UnitType": mainItem.getQuantityLogisticUnit() });
  }
).then(
  function (luLogisticUnit) {
    luLogUnit = luLogisticUnit;
    return BoFactory.loadObjectByParamsAsync("LoInventoryFinding", jsonQueryForFinding);
  }
).then(
  function (loInventoryFinding) {
    // Build inventory information object and store at item
    var liInventory;
    var params = {};
    var existingInvBalance;

    for (var i = 0; i < ivcMetasByItemMeta.length; i++) {
      params = {};
      params.ivcMetaPKey = ivcMetasByItemMeta[i].getIvcMetaPKey();
      params.usrMainPKey = ivcMetasByItemMeta[i].getUsrMainPKey();
      params.bpaMainPKey = ivcMetasByItemMeta[i].getBpaMainPKey();
      params.prdMainPKey = mainItem.getPrdMainPKey();
      params.tmgTourPKey = ivcMetasByItemMeta[i].getTmgTourPKey();
      params.etpVehiclePKey = ivcMetasByItemMeta[i].getEtpVehiclePKey();

      liInventory = loInventoryFinding.getItemsByParam(params);

      // If inventory found
      if (liInventory.length > 0) {
        existingInvBalance = loUnitFactorForProduct.convertIvcMeasureToLogisticUnit(ivcMetasByItemMeta[i].getIvcMeasure(), liInventory[0].getBalance(), mainItem.getQuantityLogisticUnit(), luLogUnit.getPiecesPerSmallestUnit());
      }
    }
    mainItem.setIvcBalance(existingInvBalance);
    mainItem.setObjectStatus(objectStatus);
  }
);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}