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
 * @function handleRewardSelection
 * @this BoHurdleEvaluationHelper
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {String} rewardGroupPkey
 * @param {String} multiplicity
 * @param {String} rewardPKey
 * @returns promise
 */
function handleRewardSelection(rewardGroupPkey, multiplicity, rewardPKey){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    var promise = when.resolve();
var deferreds = [];

//suspend and discard reward list events
me.getLoRewards().suspendListRefresh();

var updateRewardCacheAndPricingEngine = function(reward){
  var updatePromise = when.resolve();
  if(reward.getIsApplicable() === '1') {
    if (reward.getRewardType() === "Special") {
      updatePromise = me.userExitForSpecialReward(reward, false);
    }
    else if (reward.getRewardType() === "FreeItem") {
      updatePromise = me.getOrderCache().handleFreeItemsFromReward(reward.getPKey(), true);
    }
    else {
      var newValue = reward.getSelected() === '1' ? '1' : '0';
      if (me.getOrderCache().getBoOrderMeta().getComputePrice() === BLConstants.Order.BUTTON_MODE ||
          me.getOrderCache().getBoOrderMeta().getComputePrice() === BLConstants.Order.EDIT_MODE) {
        updatePromise = CP.PricingHandler.getInstance().updateRewardCache(reward.getPricingConditionTemplate(), reward.getPKey(), newValue);
      }
    }
  }
  return updatePromise;
};

if (!Utils.isEmptyString(rewardPKey)) { // manual selection of rewards
  var currentReward = me.getLoRewards().getItemByPKey(rewardPKey);
  deferreds.push(updateRewardCacheAndPricingEngine(currentReward)); // handling pricing engine for selected item
  if (currentReward.getSelected() === '1' && !(multiplicity === "n" && Utils.isEmptyString(currentReward.getSubGroup()))) {
    var rewards = me.getLoRewards().getItemsByParamArray([{rewardGroupId: rewardGroupPkey}, {pKey: rewardPKey, op: "NE"}]);
    for (var i = 0; i < rewards.length; i++) {
      var isMatchingSubGroup = currentReward.getSubGroup() === rewards[i].getSubGroup();
      if(rewards[i].getSelected() === '1' && (multiplicity == "1" || (multiplicity === "n" && isMatchingSubGroup))) {
        rewards[i].setSelected('0');
        rewards[i].setIsSelectedOnUI('0');
        deferreds.push(updateRewardCacheAndPricingEngine(rewards[i])); // handling pricing engine for deselected items
      }
    }
  }
}
else {
  if(multiplicity =="1") {
    var groupRewards = me.getLoRewards().getItemsByParam({'rewardGroupId': rewardGroupPkey, 'selected': 1, 'isReadyToBeApplicable': 1}).reverse('sort');
    if(groupRewards.length > 1){
      for(var y = 1; y < groupRewards.length; y++ ) {
        groupRewards[y].setSelected('0');
        groupRewards[y].setIsSelectedOnUI('0');
      }
    }
  }
  else {
    var subGroupRewards = me.getLoRewards().getItemsByParamArray([{'rewardGroupId': rewardGroupPkey},{'selected' : '1'},{ 'isReadyToBeApplicable': 1},{ 'subGroup' : ' ','op' : 'NE'}]).reverse('sort');
    if(subGroupRewards.length > 1){
      var subgroups = {};
      subGroupRewards.forEach(function(reward) {
        var subgroup = reward.getSubGroup();
        if(!(subgroup in subgroups)) {
          subgroups[subgroup] = [];
        }
        subgroups[subgroup].push(reward);
        if(subgroups[subgroup].length>1) {
          reward.setSelected('0');
          reward.setIsSelectedOnUI('0');
        }
      });
    }
  }
}

promise = when.all(deferreds).then(function(){
  me.getLoRewards().resumeListRefresh(true);
  if(me.getOrderCache().getCalculationStatus() !== BLConstants.Order.CALCULATION_REQUIRED && 
     (me.getOrderCache().getBoOrderMeta().getComputePrice() === BLConstants.Order.BUTTON_MODE ||
      me.getOrderCache().getBoOrderMeta().getComputePrice() === BLConstants.Order.EDIT_MODE)) {
    me.getOrderCache().setCalculationStatus(BLConstants.Order.CALCULATION_REQUIRED);
    return me.getOrderCache().resetCalculationResult();
  }
});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}