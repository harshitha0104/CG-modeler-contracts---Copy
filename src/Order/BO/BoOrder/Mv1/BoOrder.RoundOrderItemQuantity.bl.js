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
 * @function roundOrderItemQuantity
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} orderItemMain
 * @returns promise
 */
function roundOrderItemQuantity(orderItemMain){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = when.resolve();
var itemMeta = me.getBoOrderMeta().getLoOrderItemMetas().getItemByPKey(orderItemMain.getSdoItemMetaPKey());
var isRoundingON = me.getIsRoundingOn();
var isRoundingToggleChanged = me.getIsRoundingToggleChanged();
var quantityRounding = me.getBoOrderMeta().getQuantityRounding();

//function to calculate the rounded quantity
function RoundQuantityforProduct(prdLogisticRoundingItem, myOrderItem, currentRoundingRule) {

  var quantity = myOrderItem.getQuantity();
  var piecesPerSmallestUnitOrderItem = myOrderItem.getPiecesPerSmallestUnit();
  var piecesPerSmallestUnitTarget = prdLogisticRoundingItem.getPiecesPerSmallestUnit();

  //Math.floor is used to get rid of decimal values.
  var quotientUnits = Math.floor((quantity * piecesPerSmallestUnitOrderItem) / piecesPerSmallestUnitTarget);
  var remainderUnits = (quantity * piecesPerSmallestUnitOrderItem) % piecesPerSmallestUnitTarget;
  if (remainderUnits === 0) {
    return myOrderItem;
  }

  switch (currentRoundingRule) {
    case "Up":
      quotientUnits = quotientUnits + 1;
      quantity = Math.floor((quotientUnits * piecesPerSmallestUnitTarget) / piecesPerSmallestUnitOrderItem);
      break;
    case "Down":
      quantity = Math.floor((quotientUnits * piecesPerSmallestUnitTarget) / piecesPerSmallestUnitOrderItem);
      break;
    case "Nearest":
      var nextNearestQuotient = quotientUnits + 1;
      var nextOrderQty = Math.floor((nextNearestQuotient * piecesPerSmallestUnitTarget) / piecesPerSmallestUnitOrderItem);

      var prevNearestQuotient = quotientUnits;
      var prevOrderQty = Math.floor((prevNearestQuotient * piecesPerSmallestUnitTarget) / piecesPerSmallestUnitOrderItem);

      //quantity is near to the previous or next rounded value.
      if (quantity - prevOrderQty < nextOrderQty - quantity) {
        quantity = prevOrderQty; //quantity is near to the previous round value.
      }
      else {
        quantity = nextOrderQty; //quantity is near to the next round value.
      }
      break;
    case "UserExit":
      if (Utils.isDefined(me.roundOrderItemQuantityUserExit)) {
        me.roundOrderItemQuantityUserExit();
      }
      break;
    case "Never":
      //no rounding happens
      break;
  }
  myOrderItem.setQuantity(quantity);
}


// explanation for below if condition
// rounding is default off from begining
// rounding is set off by user
// rounding is permanently off
// orderitemmeta's excludeQuantityRounding is on

if ((isRoundingToggleChanged == "0" && quantityRounding == "RoundingDefaultOff") ||
    (isRoundingToggleChanged == "1" && isRoundingON == "0") ||
    (quantityRounding == "Off") ||
    (itemMeta.getExcludeQuantityRounding() == "1")) {

  promise = when.resolve();
}
else {

  //load the lo from prod logistic with quantity rounding info for the perticular product key.
  promise = BoFactory.loadObjectByParamsAsync("LoProductQuantityRounding", me.getQueryBy("ProductPKey", orderItemMain.getPrdMainPKey()))
    .then(function (loProductQuantityRounding) {
    var prdLogisticRoundingItems = loProductQuantityRounding.getItemObjects();
    var currentRoundingRule = "Never";
    var indexOfPrdLogisticRounding = -1;
    var prdLogisticRoundingItem;

    for (var index = 0; index < prdLogisticRoundingItems.length; index++) {
      if ((prdLogisticRoundingItems[index].getOrderAbility() == 1) &&
          (prdLogisticRoundingItems[index].getRoundingTarget() == 1) &&
          (prdLogisticRoundingItems[index].getPiecesPerSmallestUnit() > orderItemMain.getPiecesPerSmallestUnit())) {

        //only if matching prod logistic item is found , rounding logic is applied.
        RoundQuantityforProduct(prdLogisticRoundingItems[index], orderItemMain, currentRoundingRule);
        break;
      }

      if (prdLogisticRoundingItems[index].getUnitType() == orderItemMain.getQuantityLogisticUnit()) {
        currentRoundingRule = prdLogisticRoundingItems[index].getRoundingRule();
      }
    }
  });
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}