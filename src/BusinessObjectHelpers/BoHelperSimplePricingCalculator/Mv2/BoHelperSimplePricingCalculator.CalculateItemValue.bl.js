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
 * @function calculateItemValue
 * @this BoHelperSimplePricingCalculator
 * @kind businessobject
 * @namespace CORE
 * @param {Object} mainItem
 * @param {Object} boOrderMeta
 * @returns prices
 */
function calculateItemValue(mainItem, boOrderMeta){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var prices = {
  grossValue: 0,
  grossValueReceipt:  0,
  value: 0,
  valueReceipt: 0,
  price: 0,
  basePrice: 0,
  basePriceReceipt: 0
};

var basePrice = parseFloat((mainItem.getSimplePricingBasePrice()).toString().replace(",","."));
var discount = mainItem.getDiscount();
var quantity = mainItem.getQuantity();
var price;
var basePricePerCurrentUnit = 0;

if (mainItem.getMergeEngine_invalidated() == "0") {
  basePricePerCurrentUnit = basePrice * mainItem.getPiecesPerSmallestUnit() / mainItem.getPiecesPerSmallestUnitForBasePrice();
}
var itemMeta = boOrderMeta.getLoOrderItemMetas().getItemsByParam({ "pKey" : mainItem.getSdoItemMetaPKey() });
if (Utils.isDefined(itemMeta[0]) && (itemMeta[0].getUseSpecialPrice() == "1") && (mainItem.getSpecialPriceReceipt() > 0)) {
  price = mainItem.getSpecialPriceReceipt();
}
else if (discount > 0) {
  price = basePricePerCurrentUnit - (discount * basePricePerCurrentUnit / 100);
}
else {
  price = basePricePerCurrentUnit;
}
//list of modified attributes has to be reset -> performance optimization (list refresh is missing)
// otherwise event is triggerd twice for qty -> wrong basket values
prices.price = price;
prices.basePrice = basePrice;
prices.basePriceReceipt = quantity > 0 ? price : 0;

if (Utils.isDefined(quantity)) {
  prices.grossValue = quantity * basePricePerCurrentUnit;
  prices.grossValueReceipt = quantity * basePricePerCurrentUnit;
  prices.value = quantity * price;
  prices.valueReceipt = quantity * price;
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return prices;
}