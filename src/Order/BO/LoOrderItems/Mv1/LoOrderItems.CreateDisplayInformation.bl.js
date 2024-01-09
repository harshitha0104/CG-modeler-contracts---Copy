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
 * @function createDisplayInformation
 * @this LoOrderItems
 * @kind listobject
 * @namespace CORE
 * @param {Object} orderMeta
 * @param {Object} loSuggestedQuantity
 */
function createDisplayInformation(orderMeta, loSuggestedQuantity){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var liMainObject;
var allItems = me.getItems();
var mainItem;
var currentRefPKey = allItems.length > 0 ? allItems[0].getRefPKey() : null;
var orderUnitInformation = "";
var unitInformation = "";
var isSuggestedVisible;

// items are ordered by refPKey
for (var i = 0; i < allItems.length; i++) {
  var currentItem = allItems[i];

  isSuggestedVisible = (!Utils.isEmptyString(orderMeta.getConsiderQuantitySuggestion()) && orderMeta.getConsiderQuantitySuggestion() !== "No") || currentItem.getSpecialPromoted() == "1";
  if (currentRefPKey !== currentItem.getRefPKey() && Utils.isDefined(mainItem)) {
    mainItem.setOrderUnitInformation(orderUnitInformation);
    mainItem.setUnitInformation(unitInformation);
    //RefPKey changed which means that is a new main list item --> mainItem is not known yet
    mainItem = undefined;

    currentRefPKey = currentItem.getRefPKey();
    orderUnitInformation = "";
    unitInformation = "";
  
  }else if (currentRefPKey !== currentItem.getRefPKey()){
    //RefPKey changed without having a main item (e.g. if last record was a free item which was granted but not granted in order unit)
    currentRefPKey = currentItem.getRefPKey();
  }

  var info = me.createDisplayInformationForUoMItem(currentItem, orderMeta);

  if (isSuggestedVisible) {
    currentItem.setOQtyString(info.oQtyString);
    currentItem.setSpecialPromotionIcon(info.specialPromotionIcon);
  }
  else {
    currentItem.setOQtyString("");
    currentItem.setSpecialPromotionIcon("");
  }

  currentItem.setLogicUnitsforDisplay(info.logicUnitsforDisplay);

  //check for free item
  var isFreeItem = false;
  isFreeItem = (currentItem.sdoItemMetaPKey === orderMeta.luOrderMetaForFreeItems.sdoItemMetaPKey) || !Utils.isEmptyString(currentItem.getRewardPKey());

  if(Utils.isEmptyString(currentItem.promotionPKey) && !isFreeItem && isSuggestedVisible) {
    me.displayQuantitySuggestion(currentItem, loSuggestedQuantity, orderMeta);
  }

  if (currentItem.getIsOrderUnit() == "1") {
    //mainItem holds a reference to the item loOrderItems list
    mainItem = currentItem;
    orderUnitInformation += info.unitInformation;
  }
  else {
    unitInformation += Utils.isEmptyString(unitInformation) ? info.unitInformation : ", " + info.unitInformation;
  }

  // for free reward products set orderUnitInformation correctly
  if(currentItem.getParentType() === "Reward") {
    currentItem.setOrderUnitInformation(orderUnitInformation);
    currentItem.setUnitInformation(unitInformation);
  }
}


if (Utils.isDefined(mainItem)) {
  mainItem.setOrderUnitInformation(orderUnitInformation);
  mainItem.setUnitInformation(unitInformation);
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}