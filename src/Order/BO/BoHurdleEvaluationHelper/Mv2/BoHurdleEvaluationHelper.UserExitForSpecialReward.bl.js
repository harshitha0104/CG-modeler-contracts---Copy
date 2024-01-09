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
 * @function userExitForSpecialReward
 * @this BoHurdleEvaluationHelper
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {Object} reward
 * @param {DomBool} forceReset
 * @returns promise
 */
function userExitForSpecialReward(reward, forceReset){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = when.resolve();
var selectReward = reward.getIsApplicable() == "1" && reward.getSelected() == "1" && !forceReset;
var loItems = me.getOrderCache().getLoItems().getItemsByParamArray([{"promotionPKey" : reward.getPromotionPKey(),"op":"EQ"}, {"parentType" : "Reward","op":"NE"}]);
var items;

me.getOrderCache().getLoItems().suspendListRefresh();

if(reward.getUserExit() === "5PercentDiscount"){
  var loRewardProducts = me.getLoRewardProducts().getItemsByParam({"promotionReward" : reward.getPKey()});
  var loRewardProductIds = loRewardProducts.map(function(item){return item.getPrdId();});
  items = loItems.filter(function(item){return loRewardProductIds.length === 0 || loRewardProductIds.find(id => id === item.getPrdMainPKey());});

  if(selectReward){
    //Set Order_Item__c.Pricing_Info_1__c to -5 for special reward products (if available), else for tactic products of current promotion
    items.forEach(function(item){
      item.setPricingInfo1(-5);
    });

    reward.setUserExitResult("Pricing_Info_1 : -5 for manual Discount");
  } else{
    //Reset Order_Item__c.Pricing_Info_1__c to 0 for special reward products (if available), else for tactic products of current promotion
    items.forEach(function(item){
      item.setPricingInfo1(0);
    });

    reward.setUserExitResult(" ");
  }
}
if(!Utils.isEmptyString(reward.getClassification())){
  items = loItems.filter(function (item){return item.productClassifications.includes(reward.classification);});

  if(reward.getUserExit() === "PercentDiscountForClassification"){

    if(selectReward){
      //Add Reward.DefaultValue to Order_Item__c.Pricing_Info_2__c  for tactic products of current promotion/classification
      var totalPercentDiscount;
      items.forEach(function(item){
        totalPercentDiscount = item.getPercentDiscount() + reward.getDefaultValue();
        item.setPercentDiscount(totalPercentDiscount);

        if(totalPercentDiscount > -100){
          item.setPricingInfo2(totalPercentDiscount);
        }
        else{
          item.setPricingInfo2(-100);
        }
      });
    } else{
      //Reset Order_Item__c.Pricing_Info_2__c to previous pricing value for tactic products of current promotion/classification
      items.forEach(function(item){
        item.setPercentDiscount(item.getPercentDiscount() - reward.getDefaultValue());
        if(item.getPercentDiscount() > -100){
          item.setPricingInfo2(item.getPercentDiscount());
        }
      });
    }
  }
  if(reward.getUserExit() === "ClassificationBasedSpecialPriceDiscount"){
    if(selectReward){
      //Set Order_Item__c.Pricing_Info_3__c to Promoted Price for tactic products of current promotion/classification
      var promotedPrice = 0;
      items.forEach(function(item){
        if(item.getIsOrderUnit() == "1"){
          promotedPrice = item.getPromotedPrice();
        }
        else{
          promotedPrice = (item.getPromotedPrice() * (item.getPiecesPerSmallestUnit() / item.getDefaultPiecesPerSmallestUnit()));
        }
        item.setPricingInfo3(promotedPrice);
      });
    } else{
      //Reset Order_Item__c.Pricing_Info_3__c to 0 for tactic products of current promotion/classification
      items.forEach(function(item){
        item.setPricingInfo3(0);
      });
    }
  }
}

if(forceReset){
  me.getOrderCache().getLoItems().resumeListRefresh(true);
}
else {
  me.getOrderCache().getLoItems().resumeListRefresh(false, true);
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}