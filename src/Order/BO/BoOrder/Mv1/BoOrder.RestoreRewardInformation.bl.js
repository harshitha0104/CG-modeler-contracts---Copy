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
 * @function restoreRewardInformation
 * @this BoOrder
 * @kind businessobject
 * @async
 * @namespace CORE
 * @returns promise
 */
function restoreRewardInformation(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
/* Restoring applicable and selected rewards:
- reselecting the rewards that have been saved to the database
- or selecting the first reward of a group otherwise
*/

var storedRewardString = me.getSelectedRewards();
if(Utils.isEmptyString(storedRewardString)){
  storedRewardString = "{}";
}
var storedRewards = JSON.parse(storedRewardString);
var rewards = me.getHurdleEvaluationHelper().getLoRewards().getAllItems();
var rewardGroups = {};


me.getHurdleEvaluationHelper().getLoRewards().suspendListRefresh();
me.getHurdleEvaluationHelper().getLoRewardProducts().suspendListRefresh();

rewards.forEach(function(reward){
  var promotion = reward.getPromotionPKey();
  var rewardGroup = reward.getRewardGroupId();

  //if no info about this group yet, create some initial info
  if(!(rewardGroup in rewardGroups)){
    rewardGroups[rewardGroup] = {newRewardGroup: true, selectedRewards: [], prioReward: undefined, sort:99999};
  }

  //did we store information about this reward group in the json?
  if(promotion in storedRewards){
    var rewardGroupsFromJson = storedRewards[promotion].filter(function(x){return x.id === rewardGroup;});
    if(rewardGroupsFromJson.length > 0){
      var savedGroup = rewardGroupsFromJson[0];
      rewardGroups[rewardGroup].newRewardGroup = false;

      //was this reward selected?
      var rewardsFromJson = savedGroup.rewards.filter(function(x){return x.id === reward.getPKey();});
      if(rewardsFromJson.length > 0){
        var savedReward = rewardsFromJson[0];
        reward.setSelected('1');
        reward.setPerFactor(savedReward.perFactor);
        //also restore the free item information
        if(reward.getRewardType() === "FreeItem" && savedReward.hasOwnProperty("freeItems")){
          var rewardProducts = me.getHurdleEvaluationHelper().getLoRewardProducts().getItems().filter(function(x){return x.getPromotionReward() === reward.getPKey();});

          savedReward.freeItems.forEach(function(item){
            var rewardProduct = rewardProducts.filter(function(rP){return rP.getPKey() === item.id;});
            if(rewardProduct.length > 0){
              rewardProduct[0].setQuantity(item.qty);
            }
          });
        }
      }
    }
    //when no reward is selected for a reward group in json then select auto granted reward
    else if(reward.getAutomaticallyGranted() == "1") {
      reward.setSelected('1');
    }
  }
  //search for all auto granted rewards of the group to make it selected
  else if(reward.getAutomaticallyGranted() == "1") {
    reward.setSelected('1');
  }
});

me.getHurdleEvaluationHelper().getLoRewards().resumeListRefresh(true);
me.getHurdleEvaluationHelper().getLoRewardProducts().resumeListRefresh(true);
var invalidFreeItemRewardPKeys = [];
var deferreds = [];
// check if there are free item rewards from invalidated promotions and call handleFreeItemsFromReward to remove those free items
for (var key in storedRewards) {
  var promotion = me.getLoSelectablePromotion().getAllItems().filter(function(item) {return item.pKey === key;});
  if (promotion.length === 0) {
    storedRewards[key].forEach(function(rewardGroup) {
      rewardGroup.rewards.forEach(function(reward) {
        if (reward.hasOwnProperty("freeItems")) {
          invalidFreeItemRewardPKeys.push(reward.id);
        }
      });
    });
  }
}

for (var i = 0; i < invalidFreeItemRewardPKeys.length; i++) {
  deferreds.push(me.handleFreeItemsFromReward(invalidFreeItemRewardPKeys[i]), false);
}

var promise = when.all(deferreds);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}