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
 * @function postLoadItemUpdates
 * @this LoOrderItems
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {Object} orderItems
 * @param {Object} jsonParams
 */
function postLoadItemUpdates(orderItems, jsonParams){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
//Unwrap JsonParams
var sdoMainPKey;
var mainItemTemplate;   
var callOutOfStockProducts;
var considerOutOfStock;
var useMergeEngine = jsonParams.useMergeEngine;

var index = 0;
for (index in jsonParams.params) {
  switch (jsonParams.params[index].field) {
    case "sdoMainPKey":
      sdoMainPKey = jsonParams.params[index].value;
      break;
    case "mainItemTemplate":
      mainItemTemplate = jsonParams.params[index].value;
      break;
    case "callOutOfStockProducts":
      callOutOfStockProducts = jsonParams.params[index].value;
      break;
    case "considerOutOfStock":
      considerOutOfStock = jsonParams.params[index].value;
      break;                  
  }
}

var orderItem;
var isNewItem;
var lastItem;

for(var i=0; i < orderItems.length; i++) {
  orderItem = orderItems[i];

  // OBSOLETE!! - logic in body of 'if (useMergeEngine) { }' no longer called by core if useMergeEngine is set to false 
  if (useMergeEngine) {
    // workaround: fix properties not provided by the merge engine for multiple items for the same product
    if (Utils.isDefined(lastItem) && lastItem.getPrdMainPKey() == orderItem.getPrdMainPKey()) {
      orderItem.setListed(lastItem.getListed());
      orderItem.setItemState(lastItem.getItemState());
      orderItem.setCustomerProductNumber(lastItem.getCustomerProductNumber());
      orderItem.setFocusProductImage(lastItem.getFocusProductImage());
      orderItem.setHistory(lastItem.getHistory());
      orderItem.setFocusProductType(lastItem.getFocusProductType());
      orderItem.setOutOfStock(lastItem.getOutOfStock());
      if (lastItem.getPromotionPKey() == orderItem.getPromotionPKey()) {
        orderItem.setPromoted(lastItem.getPromoted());
      }
    }
    lastItem = orderItem;
  }
  if (!Utils.isEmptyString(orderItem.getPromotionPKey())) {
    // OBSOLETE!! - logic in body of 'if (useMergeEngine) { }' no longer called by core if useMergeEngine is set to false 
    if (useMergeEngine) {
      orderItem.setPromoted("1");
    }
    var itemGroupName = orderItem.getGroupName();
    if (Utils.isEmptyString(itemGroupName)) {
      orderItem.setGroupName(Localization.resolve('Promotion_Misc'));
      //Misc Group after the regular groups in the list
      orderItem.setGroupIdSort("1000$");
    }
    else {
      // Add starting "0" for proper sorting of groups (which can't handle integer sorting)
      var groupIdSort = orderItem.getGroupIdSort();
      if (!Number.isInteger(groupIdSort)){
        groupIdSort=0;
      }
      var groupIdSortString = "";
      if (groupIdSort<0){
        groupIdSortString = "-" + Math.abs(groupIdSort).toString().padStart(3,"0"); 
      }
      else {
        groupIdSortString = groupIdSort.toString().padStart(4,"0");
      }
      //Append "$" to ensure value is not interpreted as unchanged integer value by the setter.
      orderItem.setGroupIdSort(groupIdSortString + "$");

    }
    if (!Utils.isEmptyString(orderItem.getParentType())) {
      orderItem.setGroupName(Localization.resolve('Order_Free'));
      //Free Group at the End of the List
      orderItem.setGroupIdSort("1001$");      
      orderItem.setGroupSort(orderItem.getText1());
    }
    if (orderItem.getQuantity() <= 0) {
      orderItem.setMergeEngine_invalidated("0");
    }
  }



  //Set default values for derived attributes
  orderItem.setIvcInformationObject(" ");

  if (Utils.isSfBackend()) {
    //Determine whether the item is a new item (origines from proposal list, Merge Engine)
    if (!Utils.isDefined(orderItem.getSdoMainPKey()) || Utils.isEmptyString(orderItem.getSdoMainPKey())) {
      isNewItem = true;
    }
    else {
      isNewItem = false;
    }

    // OBSOLETE!! - logic in body of 'if (useMergeEngine) { }' no longer called by core if useMergeEngine is set to false 
    if (useMergeEngine) {
      //Set promoted/listed flag for displaying the icon within item list
      this.setPromotedListed(orderItem);
    }

    //Mark products that have been marked as OutOfStock during survey (if consider out of stock is configured)

    if ((considerOutOfStock != "No") && (Utils.isDefined(callOutOfStockProducts))) {
      if (callOutOfStockProducts.indexOf(orderItem.getPrdMainPKey()) >= 0) {
        orderItem.setOutOfStock("1");
      }
    }

    // OBSOLETE!! - logic in body of 'if (useMergeEngine) { }' no longer called by core if useMergeEngine is set to false 
    if (useMergeEngine) {
      //Set default template information if the order item was not already stored
      if (isNewItem) {
        this.setDefaultTemplate(orderItem, mainItemTemplate);
      }
      //Set default unit if the order item was not already stored
      if (isNewItem) {
        this.setDefaultUnit(orderItem);
      }
    }
  }
  //Handle free items
  if (!Utils.isEmptyString(orderItem.getSdoParentItemPKey())) {
    orderItem.setEditedQty(orderItem.getQuantity());
  }

  // OBSOLETE!! - logic in body of 'if (useMergeEngine) { }' no longer called by core if useMergeEngine is set to false 
  if (Utils.isSfBackend() && useMergeEngine) {
    orderItem.setRefPKey(orderItem.getPrdMainPKey() + orderItem.getSdoItemMetaPKey() + orderItem.getPromotionPKey() + orderItem.getRewardPKey());
  }
  //Set reference to order
  //IMPORTANT! This must be the last step since the object status is set here
  if (Utils.isSfBackend() && (!Utils.isDefined(orderItem.getSdoMainPKey()) || Utils.isEmptyString(orderItem.getSdoMainPKey()))) {
    orderItem.setSdoMainPKey(sdoMainPKey);

    //Set object status
    orderItem.setObjectStatus(STATE.NEW);
  }
  else {
    orderItem.setObjectStatus(STATE.PERSISTED);
  }

  //Set reference to order
  //IMPORTANT! This must be the last step since the object status is set here
  if (!Utils.isDefined(orderItem.getPKey()) || Utils.isEmptyString(orderItem.getPKey())) {

    orderItem.setPKey(PKey.next());

    //Set object status
    orderItem.setObjectStatus(STATE.NEW);
  }
  else {
    orderItem.setObjectStatus(STATE.PERSISTED);
  }  
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}