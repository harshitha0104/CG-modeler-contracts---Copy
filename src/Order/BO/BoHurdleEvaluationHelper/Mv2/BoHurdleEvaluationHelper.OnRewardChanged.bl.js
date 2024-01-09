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
 * @function onRewardChanged
 * @this BoHurdleEvaluationHelper
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {Object} handlerParams
 * @returns promise
 */
function onRewardChanged(handlerParams){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = when.resolve();
var deferreds = [];
var listItem = handlerParams.listItem;
var modified = handlerParams.modified[0];

if (modified === "isApplicable") {
  if(listItem.getSelected() === "1") {
    if (listItem.getRewardType() === "Special") {
      promise = me.userExitForSpecialReward(listItem, false);
    }
    if (listItem.getRewardType() === "FreeItem") {
      var isPerFactorChanged = false;
      //Check the perfactor Value from stored Reward Info to know if any Ordered Item has become invalid on Reopen.
      if(!Utils.isEmptyString(me.getOrderCache().getSelectedRewards())) {
        var storedRewards = JSON.parse(me.getOrderCache().getSelectedRewards());
        var rewardPromotion = listItem.getPromotionPKey();
        var rewardGroupId = listItem.getRewardGroupId();
        if(rewardPromotion in storedRewards) {
          var rewardGroupFromJson = storedRewards[rewardPromotion].find(function(x){return x.id === rewardGroupId;});
          if(Utils.isDefined(rewardGroupFromJson)) {
            var rewardFromJson = rewardGroupFromJson.rewards.find(function(x){return x.id === listItem.getPKey();});
            if(Utils.isDefined(rewardFromJson)) {
              isPerFactorChanged = listItem.getPerFactor() >= 1 && listItem.getPerFactor() !== rewardFromJson.perFactor;
            }
          }
        }
      }
      if (handlerParams.newValues.isApplicable === "1") {
        isPerFactorChanged = true;
      }
      promise = me.getOrderCache().handleFreeItemsFromReward(listItem.getPKey(), isPerFactorChanged);
    }
    promise = promise.then(function(){
      if (me.getOrderCache().getBoOrderMeta().getComputePrice() === BLConstants.Order.BUTTON_MODE ||
          me.getOrderCache().getBoOrderMeta().getComputePrice() === BLConstants.Order.EDIT_MODE) {
        if (!["Special", "FreeItem"].includes(listItem.getRewardType())) {
          CP.PricingHandler.getInstance().updateRewardCache(listItem.getPricingConditionTemplate(), listItem.getPKey(), handlerParams.newValues.isApplicable);
        }
        if(me.getOrderCache().getCalculationStatus() !== BLConstants.Order.CALCULATION_REQUIRED &&
           me.getOrderCache().getBoOrderMeta().getComputePrice() === BLConstants.Order.BUTTON_MODE) {
          me.getOrderCache().setCalculationStatus(BLConstants.Order.CALCULATION_REQUIRED);
          return me.getOrderCache().resetCalculationResult();
        }
      }
    });
  }
}

if (modified === "selected") {
  var rewardGroup = me.getLoRewardGroups().getItemByPKey(listItem.getRewardGroupId());
  var multiplicity = rewardGroup.getMultiplicity();

  //update reward selection flag on ui
  me.getLoRewards().suspendListRefresh();
  listItem.setIsSelectedOnUI(listItem.getSelected());
  me.getLoRewards().resumeListRefresh(true);

  promise = me.handleRewardSelection(listItem.getRewardGroupId(),multiplicity, listItem.getPKey()).then(function(){
    if(me.getOrderCache().getBoOrderMeta().getComputePrice() === BLConstants.Order.EDIT_MODE &&
       me.getOrderCache().getCalculationStatus() === BLConstants.Order.CALCULATION_REQUIRED){
      return me.getOrderCache().cpCalculate();
    }
  });
}

if (modified === "perFactor") {
  if(listItem.getSelected() === "1" && listItem.getIsApplicable() === "1" && listItem.getPerFactor() >= 1) {
    if (listItem.getRewardType() === "FreeItem") {
      promise = me.getOrderCache().handleFreeItemsFromReward(listItem.getPKey(), true);
    }
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}