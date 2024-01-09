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
 * @function createDisplayInformationForList
 * @this BoTruckLoad
 * @kind businessobject
 * @namespace CORE
 * @param {Object} truckLoadItemsMain
 */
function createDisplayInformationForList(truckLoadItemsMain){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var addDisplayInformation = function(mainItem, orderUnitInformation, unitInformation){
  mainItem.setOrderUnitInformation(orderUnitInformation.ForTruckLoad);
  mainItem.setUnitInformation(unitInformation.ForTruckLoad);
  mainItem.setOrderUnitInformationForFreeItems(orderUnitInformation.ForFreeItem);
  mainItem.setUnitInformationForFreeItems(unitInformation.ForFreeItem);
  //Assign values for Stock display
  if(me.getDocumentType() == "TruckIvcTransferInward"){
    me.setInventoryBalanceOfItem(mainItem.getPKey());
  }
  else{
    mainItem.setIvcBalance(mainItem.getTargetQuantity());
  }
  mainItem.setIvcBalanceUnitType(Utils.getToggleText("DomPrdLogisticUnit", mainItem.getQuantityLogisticUnit()));
};


var mainItem;
var orderUnitInformation = [];
var unitInformation = [];
orderUnitInformation.ForTruckLoad = "";
unitInformation.ForTruckLoad = "";
orderUnitInformation.ForFreeItem = "";
unitInformation.ForFreeItem = "";

if(Utils.isDefined(truckLoadItemsMain)){
  var userPKey = ApplicationContext.get('user').getPKey();
  var currentRefPKey = truckLoadItemsMain.length > 0 ? truckLoadItemsMain[0].getRefPKey() : null;

  // items are ordered by refPKey
  for(var i = 0; i < truckLoadItemsMain.length; i++){
    var currentItem = truckLoadItemsMain[i];

    if (currentRefPKey !== currentItem.getRefPKey()){
      addDisplayInformation(mainItem, orderUnitInformation, unitInformation);
      currentRefPKey = currentItem.getRefPKey();
      orderUnitInformation.ForTruckLoad = "";
      unitInformation.ForTruckLoad = "";
      orderUnitInformation.ForFreeItem = "";
      unitInformation.ForFreeItem = "";
    }

    var info = me.createDisplayInformationForUoMItem(currentItem, userPKey);
    if (currentItem.getIsOrderUnit() == "1"){
      mainItem = currentItem;
      orderUnitInformation.ForTruckLoad += info.unitInformationForTruckInventory;
      orderUnitInformation.ForFreeItem += info.unitInformationForFreeItems;
    } else{
      unitInformation.ForTruckLoad += Utils.isEmptyString(unitInformation.ForTruckLoad) ? info.unitInformationForTruckInventory : ", " + info.unitInformationForTruckInventory;
      unitInformation.ForFreeItem += Utils.isEmptyString(unitInformation.ForFreeItem) ? info.unitInformationForFreeItems : ", " + info.unitInformationForFreeItems;
    }
  }

  if (Utils.isDefined(mainItem)){
    addDisplayInformation(mainItem, orderUnitInformation, unitInformation);
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}