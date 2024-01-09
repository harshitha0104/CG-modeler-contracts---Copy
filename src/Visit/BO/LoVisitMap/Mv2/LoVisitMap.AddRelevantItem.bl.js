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
 * @function addRelevantItem
 * @this LoVisitMap
 * @kind listobject
 * @namespace CORE
 * @param {Object} loVisitList
 * @returns loaded
 */
function addRelevantItem(loVisitList){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var loaded = false;
var relevantItems = loVisitList.getAllItems().filter(function(visit){
  return   visit.getVisitStatus() == 'Planned' || visit.getVisitStatus() == 'InProgress';
});


me.removeAllItems();

if(Utils.isDefined(relevantItems)){

  if(relevantItems.length > 0){
    var mapItem = {
      pkey:                    relevantItems[0].pKey,
      retailStoreCity:         relevantItems[0].retailStoreCity,
      retailStorePostalCode:   relevantItems[0].retailStorePostalCode,
      retailStoreStreet:       relevantItems[0].retailStoreStreet,
      retailStoreLongitude:    relevantItems[0].retailStoreLongitude,
      retailStoreLatitude:     relevantItems[0].retailStoreLatitude,
      visitorCity:             relevantItems[0].visitorCity,
      visitorStreet:           relevantItems[0].visitorStreet,
      visitorPostalCode:       relevantItems[0].visitorPostalCode,
      latitude:                relevantItems[0].latitude,
      longitude:               relevantItems[0].longitude,
      mapPinId:                relevantItems[0].mapPinId,
      mapPinImage:             relevantItems[0].mapPinImage,
      toolTipText:             relevantItems[0].toolTipText
    };
    me.addItems([mapItem]);
    loaded = true;
  }
}

loaded = true;

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return loaded;
}