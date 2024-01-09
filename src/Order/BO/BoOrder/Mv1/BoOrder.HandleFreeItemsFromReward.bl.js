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
 * @function handleFreeItemsFromReward
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {DomPKey} rewardPKey
 * @param {DomBool} isPerFactorChanged
 * @returns promise
 */
function handleFreeItemsFromReward(rewardPKey, isPerFactorChanged){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
me.getLoItems().suspendListRefresh();
var deferreds = [];
var rewardToConsider = me.getHurdleEvaluationHelper().getLoRewards().getItemByPKey(rewardPKey);
var oldValue = 0;
var categoryId;
var freeItemsChange = false;

var updateCountersAndUpdatePricingEngine = function(oldValue, itemReference){
  me.getLoItems().createDisplayInformationForItem(itemReference, me.getBoOrderMeta());
  me.setItemFilterCounts();
  //update proudct in the pricing engine
  if (Utils.isDefined(window['CP']) && (me.getBoOrderMeta().getComputePrice() === "4" || me.getBoOrderMeta().getComputePrice() === "5")) {
    return CP.PricingHandler.getInstance().updateProduct(itemReference.getData(), "quantity");
  }
};

if (Utils.isDefined(rewardToConsider) && rewardToConsider.getIsApplicable() == "1" && rewardToConsider.getSelected() == "1") {
  var itemTemplates = me.getBoOrderMeta().getLoOrderItemMetas().getItemsByParamArray([{"calculationGroup": "FreeItem"}, {"active": "1"}, {"validFrom": Utils.createAnsiDateToday(), "op": "LE"}, {"validThru": Utils.createAnsiDateToday(), "op": "GE"}]);
  var rewardProducts = me.getHurdleEvaluationHelper().getLoRewardProducts().getItemsByParamArray([{ "promotionReward" : rewardPKey }, { "isValidFreeItem" : "1" }]);
  var itemsForAdd = [];
  var itemsInOrder;
  var itemInOrder;
  var itemTemplate;

  if(itemTemplates.length > 0) {
    itemTemplate = itemTemplates[0];
    rewardProducts.forEach(function(item) {
      oldValue = 0;
      itemsInOrder = me.getLoItems().getAllItems().filter(function(x) {
        return x.rewardPKey == rewardPKey && x.parentType == "Reward" && x.sdoItemMetaPKey == itemTemplate.getPKey() && x.quantityLogisticUnit == item.getLogisticUnit() && x.prdMainPKey == item.getPrdId();
      });
      if((isPerFactorChanged && rewardToConsider.getPerFactor() >= 1) ||
         // Free Items from autogranted reward that donot exist in LoItems must be added and its quantity must be calculated based on New Per factor.
         (rewardToConsider.getPerFactor() >= 1 && rewardToConsider.getAutomaticallyGranted() == "1" && itemsInOrder.length === 0 && item.getDefaultValue() > 0) ){
        me.getHurdleEvaluationHelper().getLoRewardProducts().suspendListRefresh();
        item.setQuantity(item.getDefaultValue()*rewardToConsider.getPerFactor());
        me.getHurdleEvaluationHelper().getLoRewardProducts().resumeListRefresh(true);
      }
      if(itemsInOrder.length > 0 ) {
        itemInOrder = itemsInOrder[0];
        // Means the free item exists in LoItems and needs to be updated
        if(itemInOrder.getQuantity() !== item.getQuantity()) {
          freeItemsChange = true;
          oldValue = itemInOrder.getQuantity();
          if((item.getDeliveryState() === "Available" && itemTemplate.getConsiderDeliveryState() == "1")  || itemTemplate.getConsiderDeliveryState() == "0") {
            itemInOrder.setQuantity(item.getQuantity());
          }
          if(item.getQuantity() === 0) {
            itemInOrder.setDeletedFreeItem("1");
          }
          else {
            var aclItemInOrder;
            itemInOrder.setDeletedFreeItem("0");
            itemInOrder.setShowInBasket("1");
            aclItemInOrder = itemInOrder.getACL();
            aclItemInOrder.removeRight(AclObjectType.PROPERTY, "modReason", AclPermission.VISIBLE);
            aclItemInOrder.removeRight(AclObjectType.OBJECT, "LiOrderItem", AclPermission.EDIT);
          }
          deferreds.push(updateCountersAndUpdatePricingEngine(oldValue,itemInOrder));
        }
      }
      else {
        // The item doesn´t exist in LoItems
        if(item.getQuantity() > 0) {
          freeItemsChange = true;
          var itemForAdd = {
            "pKey" : PKey.next(),
            "basePrice" : 0,
            "basePriceReceipt" : 0,
            "calculationGroup" : itemTemplate.getCalculationGroup(),
            "category" : item.getCategory(),
            "customerAssortment" : "0",
            "deletedFreeItem" : "0",
            "deliveryState" : item.getDeliveryState(),
            "eAN" : item.getEAN(),
            "editedQty" : item.getQuantity(),
            "fieldState" : item.getFieldState(),
            "freeItemUnit" : item.getLogisticUnit(),
            "freeItemMetaPKey" : itemTemplate.getPKey(),
            "freeItemCreationStep" : " ",
            "grossValue" : 0,
            "grossValueReceipt" : 0,
            "groupId" : item.getGroupId(),
            "groupName" : Localization.resolve("Order_Free"),
            "groupText" : item.getGroupText(),
            "groupSort" : item.getProductName(),
            "groupIdSort" : "1001$",
            "history" : "0",
            "isOrderUnit" : item.getIsOrderUnit(),
            "listed" : "0",
            "movementDirection" : itemTemplate.getMovementDirection(),
            "newState" : item.getNewState(),
            "objectStatus" : STATE.NEW | STATE.DIRTY,
            "outOfStock" : "0",
            "parentType" : "Reward",
            "piecesPerSmallestUnitForBasePrice" : item.getPiecesPerSmallestUnitForBasePrice(),
            "prdId" : item.getProductCode(),
            "prdMainPKey" : item.getPrdId(),
            "prdType" : item.getPrdType(),
            "price" : 0,
            "priceEffect" : itemTemplate.getPriceEffect(),
            "priceReceipt" : 0,
            "promoted" : "1",
            "promotionPKey" : rewardToConsider.getPromotionPKey(),
            "quantity" : item.getQuantity(),
            "quantityLogisticUnit" : item.getLogisticUnit(),
            "refPKey" : item.getPrdId() + itemTemplate.getPKey() + rewardToConsider.getPromotionPKey() + rewardPKey,
            "rewardPKey" : rewardPKey,
            "saveZeroQuantity" : itemTemplate.getSaveZeroQuantity(),
            "shortId" : item.getShortId(),
            "sdoMainPKey" : me.getPKey(),
            "sdoItemMetaPKey" : itemTemplate.getPKey(),
            "sdoParentItemPKey" : " ",
            "splittingGroup" : " ",
            "sort" : "1",
            "shortType" : itemTemplate.getShortText(),
            "suggestedQuantity" : item.getQuantity(),
            "targetQuantity" : item.getQuantity(),
            "taxClassification" : item.getTaxClassification(),
            "text1" : item.getProductName(),
            "type" : itemTemplate.getText(),
            "value" : 0,
            "valueReceipt" : 0,
            "showInBasket" : "1"
          };

          //Set pieces per smallest unit of the free item
          if (item.getLogisticUnit() == item.getOrderQuantityLogisticUnit()){
            itemForAdd.piecesPerSmallestUnit = item.getOrderPiecesPerSmallestUnit();
          }
          else if (item.getLogisticUnit() == item.getConsumerQuantityLogisticUnit()){
            itemForAdd.piecesPerSmallestUnit = item.getConsumerPiecesPerSmallestUnit();
          }
          if(item.getDeliveryState() === "NotAvailable" && itemTemplate.getConsiderDeliveryState() == "1") {
            itemForAdd.quantity = 0;
          }
          itemsForAdd.push(itemForAdd);
        }
      }
    });
    if(itemsForAdd.length > 0) {
      var aclRewardFreeItem;
      var itemFromRewardToSetReadOnly;
      me.getLoItems().addItems(itemsForAdd);
      for (var i = 0; i < itemsForAdd.length; i++) {
        itemFromRewardToSetReadOnly = itemsForAdd[i];
        aclRewardFreeItem = itemFromRewardToSetReadOnly.getACL();
        aclRewardFreeItem.removeRight(AclObjectType.PROPERTY, "modReason", AclPermission.VISIBLE);
        aclRewardFreeItem.removeRight(AclObjectType.OBJECT, "LiOrderItem", AclPermission.EDIT);
        deferreds.push(updateCountersAndUpdatePricingEngine(0, me.getLoItems().getItemByPKey(itemFromRewardToSetReadOnly.pKey)));
      }
    }
  }
}
else {
  var freeItemsToDelete = me.getLoItems().getItemsByParam({ "rewardPKey" : rewardPKey});
  oldValue = 0;
  freeItemsToDelete.forEach(function(item) {
    if(item.getQuantity() > 0 || item.getDeletedFreeItem() == "0"){
      freeItemsChange = true;
      oldValue = item.getQuantity();
      item.setQuantity(0);
      item.setDeletedFreeItem("1");
      item.setShowInBasket("1");
      deferreds.push(updateCountersAndUpdatePricingEngine(oldValue,item));
    }
  });
}

var promise = when.all(deferreds).then(function(){
  if (freeItemsChange) {
    //Update basket list
    if(me.getBoItemTabManager().getCurrentItemFilterId() === "Basket"){
      categoryId = me.getBoItemTabManager().getCurrentFilterId();
      me.getLoItems().setItemFilter("Basket", categoryId, me.getSelectedPromotionPKey());
    }
    else {
      categoryId = me.getBoItemTabManager().getCurrentFilterId();
      me.getLoItems().setItemFilter("All", categoryId, me.getSelectedPromotionPKey());
    }
  }
  me.getLoItems().resumeListRefresh(true);
});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}