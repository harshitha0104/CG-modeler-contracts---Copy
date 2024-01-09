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
 * @function determineSatisfiedRewardGroups
 * @this BoHurdleEvaluationHelper
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {String} promotionPKey
 * @param {Object} loSelectablePromotion
 * @returns promise
 */
function determineSatisfiedRewardGroups(promotionPKey, loSelectablePromotion){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    var rewardGroup = Utils.createDictionary();
var rewardGroupId;
var hurdleIsFulfilled;
var groupHurdles;
var total = 0;
var count = 0;
var rewards;
var promotionPKeyFromRewards;
var selectablePromotion;
var promise = when.resolve();
var deferreds = [];
var x;

loSelectablePromotion.getAllItems().forEach(function(item) {
  item.setSatisfiedRewardGroupCount(0);
});

var loRewardGroups = me.getLoRewardGroups().getItems();
for(x = 0; x < loRewardGroups.length; x++) {
  rewardGroupId = loRewardGroups[x].getPKey();

  if (Utils.isEmptyString(promotionPKey)) {
    groupHurdles = me.getLoHurdles().getItemsByParamArray([{"hurdleType": "RewardSpecific", "op":"NE"}, {"rewardGroupId": rewardGroupId, "op":"EQ"}, {"operation": " ", "op":"NE"}]);
  }
  else {
    groupHurdles = me.getLoHurdles().getItemsByParamArray([{"promotionPKey": promotionPKey,"op":"EQ"}, {"hurdleType": "RewardSpecific", "op":"NE"}, {"rewardGroupId": rewardGroupId, "op":"EQ"}, {"operation": " ", "op":"NE"}]);
  }

  if(groupHurdles.length === 0) {
    //When no hurdle or only reward specific hurdle is assigned to a reward group then reward group should be satisfied
    if (!rewardGroup.containsKey(rewardGroupId)) {
      rewardGroup.add(rewardGroupId, true);
    }
  } else {
    for (var i = 0; i < groupHurdles.length; i++) {
      hurdleIsFulfilled = true;
      if (groupHurdles[i].getIsFulfilled() == '0') {
        hurdleIsFulfilled = false;
      }
      rewardGroupId = groupHurdles[i].getRewardGroupId();
      if (!rewardGroup.containsKey(rewardGroupId)) {
        rewardGroup.add(rewardGroupId, hurdleIsFulfilled);
      }
      else {
        var fulfilledHurdle;
        if(groupHurdles[i].getOperation() == "AND") {
          fulfilledHurdle = rewardGroup.get(rewardGroupId) && hurdleIsFulfilled ;
        }
        else if(groupHurdles[i].getOperation() == "OR") {
          fulfilledHurdle = rewardGroup.get(rewardGroupId) || hurdleIsFulfilled ;
        }
        rewardGroup.data[rewardGroupId] = fulfilledHurdle;
      }
    }
  }
}

for (var key in rewardGroup.data) {
  rewards = me.getLoRewards().getItemsByParam({'rewardGroupId': key});
  for(x = 0; x < rewards.length; x++ ) {
    if(rewardGroup.get(key)) {
      if(!Utils.isEmptyString(rewards[x].getHurdlePKey())) {
        deferreds.push(me.evaluateHurdles(me.orderCache, me.orderCache.getBoItemTabManager().getBoCallCache(),promotionPKey,rewards[x]));
      }
      else {
        deferreds.push(rewards[x].setIsReadyToBeApplicable('1'));
      }
      promotionPKeyFromRewards = rewards[x].getPromotionPKey();
    }
    else {
      deferreds.push(rewards[x].setIsReadyToBeApplicable('0'));
    }
  }
}
promise = when.all(deferreds).then(function(){
  var rewardSelectionDeferreds = [];
  for (var key in rewardGroup.data) {
    var currentRewardGroup = me.getLoRewardGroups().getItemByPKey(key);
    if(rewardGroup.get(key)) {
      var multiplicity = currentRewardGroup.getMultiplicity();
      rewardSelectionDeferreds.push(me.handleRewardSelection(key,multiplicity, ""));

      if (Utils.isEmptyString(promotionPKey)) {
        selectablePromotion = loSelectablePromotion.getItemByPKey(promotionPKeyFromRewards);
      }
      else {
        selectablePromotion = loSelectablePromotion.getItemByPKey(promotionPKey);
      }
      if(Utils.isDefined(selectablePromotion)){
        selectablePromotion.setSatisfiedRewardGroupCount(selectablePromotion.getSatisfiedRewardGroupCount() + 1);
      }
      currentRewardGroup.setRewardSectionText(Localization.resolve("ChooseYourReward"));
      currentRewardGroup.setHeaderBackgroundColor("Approve_Background");
    } else {
      currentRewardGroup.setRewardSectionText(Localization.resolve("RewardsId"));
      currentRewardGroup.setHeaderBackgroundColor("Reject_Background");
    }
  }
  return when.all(rewardSelectionDeferreds);
}).then(function(){
  var deferreds2 = [];
  var rewards = me.getLoRewards().getAllItems();

  for(x = 0; x < rewards.length; x++) {
    var currentReward = rewards[x];
    var rewardType = currentReward.getRewardType();

    if(currentReward.getIsReadyToBeApplicable() === "1" && currentReward.getIsApplicable() === "0"){
      currentReward.setIsApplicable("1");
      currentReward.setEditable(true);
      if(rewardType === "FreeItem"){
        currentReward.setShowButton(true);
        currentReward.setButtonText(Localization.resolve("SelectProducts"));
      }
      //update reward selection flag on ui when reward is selected and applicable
      if(currentReward.getSelected() === "1"){
        currentReward.setIsSelectedOnUI("1");
      }
    }

    if(currentReward.getIsReadyToBeApplicable() === "0" && currentReward.getIsApplicable() === "1"){
      currentReward.setIsApplicable("0");
      currentReward.setEditable(false);
      currentReward.setShowButton(false);
      currentReward.setButtonText("");
    }

    //remove free items from non-applicable free item rewards on re-opening order
    if(currentReward.getIsReadyToBeApplicable() === "0" && rewardType === "FreeItem"){
      deferreds2.push(me.getOrderCache().handleFreeItemsFromReward(currentReward.getPKey(), false));
    }
  }

  me.getLoRewards().generateProductsCounterStringForReward(me.getLoRewardProducts());
  if(Utils.isDefined(me.getLoRewards().getCurrent())){
    me.loadRelevantRewardProducts(me.getLoRewards().getCurrent().getPKey());
  }

  return when.all(deferreds2);
});
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}