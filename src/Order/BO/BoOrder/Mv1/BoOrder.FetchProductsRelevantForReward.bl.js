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
 * @function fetchProductsRelevantForReward
 * @this BoOrder
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {Object} loRewards
 * @returns promise
 */
function fetchProductsRelevantForReward(loRewards){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var criterionAttribute;
var addCondForeignProducts = "";
var rewardIdsWithoutClassification = loRewards.getRewardIds();
var loRewardProducts;
var promise = when.resolve();

if(me.getBoOrderMeta().getAllowForeignProducts() == "0"){
  addCondForeignProducts = " AND productInfo.Competitive_Product__c = 0 ";
}
if (me.getBoOrderMeta().getItemListOption() == "Hierarchy") {
  criterionAttribute = me.getBoOrderMeta().getCriterionAttributeForLevel(me.getBoOrderMeta().getNumberOfHierarchyLevels());
} else {
  criterionAttribute = me.getBoOrderMeta().getCriterionAttributeForFlatList();
}
promise = BoFactory.loadObjectByParamsAsync("LoRewardProducts", { rewardIds : rewardIdsWithoutClassification, addCondForeignProducts : addCondForeignProducts, criterionAttribute : criterionAttribute } );

// get the tactic products for rewards that do have a classification defined and convert them into LiRewardProducts
promise.then(function(rewardProducts) {
  var classificationProducts = [];
  var duplicateProducts = [];
  var rewardsWithClassification = loRewards.getItems().filter(function(item) {return !Utils.isEmptyString(item.classification) && item.mergeEngine_invalidated !== "1" && item.prdType !== "AssetType";});
  var orderItems = [];
  for (var i = 0; i < rewardsWithClassification.length; i++) {
    var currentReward = rewardsWithClassification[i];

    //filter those items which belongs to same promotion as that of reward promotion and includes reward classification and are order units
    orderItems = me.getLoItems().filter(function(item) {
      var itemClassifications = item.productClassifications.split(";");
      return item.promotionPKey === currentReward.getPromotionPKey() &&
        itemClassifications.indexOf(currentReward.getClassification()) >= 0 &&
        item.isOrderUnit == "1";
    });
    for (var k = 0; k < orderItems.length; k++) {
      var classificationProduct = {
        // concatenate pKey from tactic product id + reward id to achieve an unique id
        "pKey" : orderItems[k].getTacticProductPKey() + currentReward.getPKey(),
        "prdId" : orderItems[k].getPrdMainPKey(),
        "promotionReward" : currentReward.getPKey(),
        "defaultValue" : orderItems[k].getDefaultValue(),
        "maxQuantityValue" : orderItems[k].getMaxValue(),
        "rewardType" : currentReward.getRewardType(),
        "logisticUnit" : orderItems[k].getQuantityLogisticUnit(),
        "productName" : orderItems[k].getText1(),
        "quantity" : orderItems[k].getDefaultValue(),
        "isValidFreeItem" : "1",
        "shortId" : orderItems[k].getShortId(),
        "eAN" : orderItems[k].getEAN(),
        "piecesPerSmallestUnitForBasePrice" : orderItems[k].getPiecesPerSmallestUnitForBasePrice(),
        "prdType" : orderItems[k].getPrdType(),
        "taxClassification" : orderItems[k].getTaxClassification(),
        "productCode" : orderItems[k].getPrdId(),
        "deliveryState" : orderItems[k].getDeliveryState(),
        "fieldState" : orderItems[k].getFieldState(),
        "newState" : orderItems[k].getNewState(),
        "groupText" : orderItems[k].getGroupText(),
        "groupId" : orderItems[k].getGroupId(),
        "isOrderUnit" : "1"
      };
      // prevent to have duplicate reward products (this can happen when there are two products with different order item template)
      if (duplicateProducts.filter(function(item) {return classificationProduct.prdId === item.prdId && classificationProduct.promotionReward === item.promotionReward;}).length === 0) {
        duplicateProducts.push(classificationProduct);
        classificationProducts.push(classificationProduct);
      }
    }
  }
  if (classificationProducts.length > 0) {
    rewardProducts.addItems(classificationProducts);
  }
});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}