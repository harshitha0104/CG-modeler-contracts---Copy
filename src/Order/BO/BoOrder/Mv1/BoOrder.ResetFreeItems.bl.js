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
 * @function resetFreeItems
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {LiOrderItem} orderItem
 * @returns promise
 */
function resetFreeItems(orderItem){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

/** 
 * Resets free items related to the given order item (parentType: Item) 
 * OR related to the complete order (parentType: Order)
 * Should be used if ppp relevant order item attribute changed
 */

var promise = when.resolve();
var deferreds = [];
var parentPKey = orderItem.getPKey();
var items = me.getLoItems().getAllItems();
var length = items.length;
var origQty;

for (var index = 0; index < length; index++) {
  var item = items[index];

  // Remove free items linked to givedn order item (parent item)
  // OR of parent type "Order" (linked to the complete Order)
  if (item.getSdoParentItemPKey() === parentPKey || item.getParentType() === "Order") {
    origQty = item.getQuantity();

    // First set the item deleted so that quantity changed allowed check is NOT executed in onOrderItemChanged handler
    deferreds.push(item.setDeletedFreeItem("1"));
    deferreds.push(item.setQuantity(0));
    // remove item from basket
    deferreds.push(item.setShowInBasket("0"));
    // update basket counter
    me.updateItemFilterBasketCount(item, origQty, 0);
    //Update counter for "All" Filter
    me.updateItemFilterCountAfterAdd();
    // update item in ppp engine
    deferreds.push(CP.PricingHandler.getInstance().updateProduct(item.getData(), "Quantity"));
  }
}
promise = when.all(deferreds);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}