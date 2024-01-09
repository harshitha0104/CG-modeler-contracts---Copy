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
 * @function afterCreateAsync
 * @this BoHurdleEvaluationHelper
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} result
 * @param {Object} context
 * @returns promise
 */
function afterCreateAsync(result, context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var selectablePromotionIds = context.jsonQuery.selectablePromotions.getPromotionIdsForHurdles();

var simplePriceCalculatorPromise;

// Order create and load already initialize the SimplePricingCalculator HelperBO if simple pricing is enabled in the order template.
// In this case no need for re-initialization
if(!Utils.isDefined(me.getSimplePricingCalculator()))
{
  simplePriceCalculatorPromise = BoFactory.createObjectAsync("BoHelperSimplePricingCalculator", {})
    .then(function (calculator){
      me.setSimplePricingCalculator(calculator);
    });
}
else{
  simplePriceCalculatorPromise = when.resolve();
}

var promise = simplePriceCalculatorPromise
.then(function () { 
  return BoFactory.loadObjectByParamsAsync("LoRewardGroups", { promotionPKeyList : selectablePromotionIds } );
}).then(function(loRewardGroups) {
  me.setLoRewardGroups(loRewardGroups);
  return BoFactory.loadObjectByParamsAsync("LoRewards", { promotionPKeyList : selectablePromotionIds } );
}).then(function(rewards) {
  me.setLoRewards(rewards);
  rewards.addItemChangedEventListener(me.onRewardChanged, me);
  return context.jsonQuery.orderCache.fetchProductsRelevantForReward(rewards);
}).then(function(loRewardProducts) {
  me.setLoRewardProducts(loRewardProducts); 
  loRewardProducts.addItemChangedEventListener(me.onRewardProductChanged, me);
  return BoFactory.loadObjectByParamsAsync("LoHurdles", { promotionPKeyList : selectablePromotionIds } );
}).then(function(hurdles) {
  me.setLoHurdles(hurdles);
  me.setOrderCache(context.jsonQuery.orderCache);
  return result;
});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}