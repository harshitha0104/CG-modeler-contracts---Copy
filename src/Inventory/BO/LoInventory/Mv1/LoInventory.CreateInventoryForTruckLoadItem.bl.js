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
 * @function createInventoryForTruckLoadItem
 * @this LoInventory
 * @kind listobject
 * @async
 * @namespace CORE
 * @param {Object} itemDetailObject
 * @returns promise
 */
function createInventoryForTruckLoadItem(itemDetailObject){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var jsonParamsForFinding = [];
var jsonQueryForFinding = {};
var ivcMetaPKeys = [];
var bpaMainPKeys = [];
var tmgTourPKeys = [];
var vehiclePKeys = [];

itemDetailObject.ivcInformation = [];

for (var i = 0; i < itemDetailObject.ivcMetasByItemMeta.length; i++) {
  ivcMetaPKeys.push(itemDetailObject.ivcMetasByItemMeta[i].getIvcMetaPKey());
  bpaMainPKeys.push(itemDetailObject.ivcMetasByItemMeta[i].getBpaMainPKey());

  if(itemDetailObject.ivcMetasByItemMeta[i].getTmgPolicy() === "One"){
    tmgTourPKeys.push(itemDetailObject.tmgMainPKey);
  }
  tmgTourPKeys.push(" ");

  if(itemDetailObject.ivcMetasByItemMeta[i].getVehiclePolicy() === "One"){
    vehiclePKeys.push(ApplicationContext.get('currentTour').getEtpVehicleTruckPKey());
  }
  vehiclePKeys.push(" ");
}

jsonParamsForFinding.push({ "field": "ivcMetaPKeys", "value": "'" + ivcMetaPKeys.join("','") + "'" });
jsonParamsForFinding.push({ "field": "usrMainPKeys", "value": "'" + itemDetailObject.usrMainPKey + "'" });
jsonParamsForFinding.push({ "field": "bpaMainPKeys", "value": "'" + bpaMainPKeys.join("','") + "'" });
jsonParamsForFinding.push({ "field": "prdMainPKeys", "value": "'" + itemDetailObject.prdMainPKey + "'" });
jsonParamsForFinding.push({ "field": "tmgTourPKeys", "value": "'" + tmgTourPKeys.join("','") + "'" });
jsonParamsForFinding.push({ "field": "etpVehiclePKeys", "value": "'" + vehiclePKeys.join("','") + "'" });

jsonQueryForFinding.params = jsonParamsForFinding;

var promise = BoFactory.loadObjectByParamsAsync("LoInventoryFinding", jsonQueryForFinding)
.then(function(result){

  for(var i=0; i<itemDetailObject.ivcMetasByItemMeta.length;i++){
    var ivcMainPKey= "";
    var ivcMetaByItemMeta = itemDetailObject.ivcMetasByItemMeta[i];
    //search existing inventories
    var params = {};
    params.ivcMetaPKey = ivcMetaByItemMeta.getIvcMetaPKey();

    if(ivcMetaByItemMeta.getUsrPolicy() === "One"){
      params.usrMainPKey = itemDetailObject.usrMainPKey;
    }else{
      params.usrMainPKey = " ";
    }
    params.bpaMainPKey = ivcMetaByItemMeta.getBpaMainPKey();

    if(ivcMetaByItemMeta.getTmgPolicy() === "One"){
      params.tmgTourPKey = itemDetailObject.tmgMainPKey;
    }
    else{
      params.tmgTourPKey = " ";
    }

    if(ivcMetaByItemMeta.getVehiclePolicy() === "One"){
      params.etpVehiclePKey = ApplicationContext.get('currentTour').getEtpVehicleTruckPKey();
    }
    else{
      params.etpVehiclePKey = " ";
    }

    params.prdMainPKey = itemDetailObject.prdMainPKey;

    var ivcInformation = {};
    ivcInformation.ivcMainPKey = " ";
    ivcInformation.balance = 0;

    var liInventory = result.getItemsByParam(params);
    //check if inventory was already created in the current run
    if (liInventory.length === 0){
      liInventory = me.getItemsByParam(params);
    }


    if (liInventory.length === 0) {
      //create new inventory
      var jsonIvcData = {};
      // Consider only UserInventories
      if(Utils.isDefined(ivcMetaByItemMeta)) {
        if (ivcMetaByItemMeta.getMetaId() == "UserInventory"  || ivcMetaByItemMeta.getMetaId() == "Unsalable") {

          //check if inventory is already available in list
          //e.g. if different item metas in same order (std, return) first item creates inventory second item has to reuse it
          var inventoryItems = me.getAllItems();
          var currentInventoryItem;
          for(var j=0; j < inventoryItems.length; j++){
            currentInventoryItem = inventoryItems[j];
            if(currentInventoryItem.getIvcMetaPKey() === ivcMetaByItemMeta.getIvcMetaPKey() &&
               currentInventoryItem.getUsrMainPKey() === ivcMetaByItemMeta.getUsrMainPKey() &&
               currentInventoryItem.getBpaMainPKey() === ivcMetaByItemMeta.getBpaMainPKey() &&
               currentInventoryItem.getPrdMainPKey() === itemDetailObject.prdMainPKey &&
               currentInventoryItem.getTmgTourPKey() === ivcMetaByItemMeta.getTmgTourPKey() &&
               currentInventoryItem.getEtpVehiclePKey() === ivcMetaByItemMeta.getEtpVehiclePKey()){
              ivcMainPKey = currentInventoryItem.getPKey();
              break;
            }
          }


          if(!Utils.isDefined(ivcMainPKey) || Utils.isEmptyString(ivcMainPKey)){
            ivcMainPKey = PKey.next();

            // Create inventory
            jsonIvcData = {};
            jsonIvcData.pKey = ivcMainPKey;
            jsonIvcData.ivcMetaPKey = ivcMetaByItemMeta.getIvcMetaPKey();
            jsonIvcData.bpaMainPKey = " ";
            jsonIvcData.prdMainPKey = itemDetailObject.prdMainPKey;
            jsonIvcData.phase = "Active";
            jsonIvcData.validFrom = Utils.createDateToday();
            jsonIvcData.validThru = Utils.getMaxDate();
            jsonIvcData.invalid = "0";
            jsonIvcData.salesOrg = ApplicationContext.get('user').getBoUserSales().getSalesOrg();

            if(ivcMetaByItemMeta.getUsrPolicy() === "One"){
              jsonIvcData.usrMainPKey = itemDetailObject.usrMainPKey;
            }
            else{
              jsonIvcData.usrMainPKey = " ";
            }

            if(ivcMetaByItemMeta.getTmgPolicy() === "One"){
              jsonIvcData.tmgTourPKey = itemDetailObject.tmgMainPKey;
            }
            else{
              jsonIvcData.tmgTourPKey = " ";
            }

            if(ivcMetaByItemMeta.getVehiclePolicy() === "One"){
              jsonIvcData.etpVehiclePKey = ApplicationContext.get('currentTour').getEtpVehicleTruckPKey();
            }
            else{
              jsonIvcData.etpVehiclePKey = " ";
            }

            me.addItems([jsonIvcData]);
            me.getItemByPKey(jsonIvcData.pKey).setObjectStatus(STATE.NEW | STATE.DIRTY);
          }
        }
      }


    }else{
      if(liInventory[0].getIvcMainPKey){
        ivcMainPKey = liInventory[0].getIvcMainPKey();
      }
      else if(liInventory[0].getPKey) {
        ivcMainPKey = liInventory[0].getPKey();
      }
      if(liInventory[0].getBalance) {
        ivcInformation.balance = liInventory[0].getBalance();
      }
    }

    itemDetailObject.ivcInformation.push({
      "ivcMainPKey" : ivcMainPKey,
      "ivcTaMetaPKey" : ivcMetaByItemMeta.getIvcTaMetaPKey(),
      "ivcMeasure" : ivcMetaByItemMeta.getIvcMeasure(),
      "tAControl" : ivcMetaByItemMeta.getTaControl(),
      "metaId" : ivcMetaByItemMeta.getMetaId(),
      "balance" : ivcInformation.balance
    });
  }
  return itemDetailObject;
});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}