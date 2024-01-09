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
 * @function processInvalidatedItems
 * @this LoOrderItems
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} jsonQueryAddProducts
 * @param {DomString} addProductCriterionAttribute
 * @param {Object} orderItemMetas
 * @param {Object} hurdleEvaluationHelper
 * @returns promise
 */
function processInvalidatedItems(jsonQueryAddProducts, addProductCriterionAttribute, orderItemMetas, hurdleEvaluationHelper){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    var promise;
//Check for items that are invalidated by the merge engine (property mergeEngine_invalidated = "1")
//and that have no product information (e.g. text...)
var dictItemMetas= Utils.createDictionary();
var allItems = me.getAllItems();
var invalidPromotionPKeys = [];
var selectablePromotionProducts;
var productTextsForMessage = "";
var promotionTextsForMessage = "";
var addCondSdoItemPKeys = "";
var promotions;
var jsonParams = [];
var considerSelectablePromotion = jsonQueryAddProducts.params.find(function (param) { return param.field == "considerSelectablePromotion"; }).value;
var customerPKey = jsonQueryAddProducts.params.find(function (param) { return param.field == "customerPKey"; }).value;
var itemMeta;
var itemPKey;
var invalidProductPKeys = "";
var relevantPromotionPKeys = "";
var relevantPromotionProductPKeys = "";
var itemMetaReward;
var itemPKeyReward;

for (var i = 0; i < allItems.length; i++) {
  itemPKey = allItems[i].getSdoItemMetaPKey();
  if(!dictItemMetas.containsKey(itemPKey)) {
    itemMeta = orderItemMetas.getItemByPKey(itemPKey);
    dictItemMetas.add(itemPKey, itemMeta);
  }
  else {
    itemMeta = dictItemMetas.get(itemPKey);
  }
  if(!Utils.isDefined(itemMeta) || itemMeta.getActive() != "1" || itemMeta.getValidFrom() > Utils.createAnsiDateToday() ||
     itemMeta.getValidThru() < Utils.createAnsiDateToday() || (allItems[i].getDeliveryState() != "Available" && itemMeta.getConsiderDeliveryState() == "1") ||
     (Utils.isEmptyString(allItems[i].getRewardPKey()) && considerSelectablePromotion == "1" &&
      !Utils.isEmptyString(allItems[i].getPromotionPKey()) && allItems[i].getQuantity() > 0) || allItems[i].getParentType() == "Reward") {
    allItems[i].setMergeEngine_invalidated("1");
    var sdoItemMeta = dictItemMetas.get(itemPKey);
    if(Utils.isDefined(sdoItemMeta) && sdoItemMeta.getActive() == "1" && (allItems[i].getDeliveryState() == "Available" || sdoItemMeta.getConsiderDeliveryState() == "0")) {
      if (!Utils.isEmptyString(invalidProductPKeys)) {
        invalidProductPKeys += ",";
      }
      invalidProductPKeys += "'" + allItems[i].getPrdMainPKey() + "'";
    }
    if(relevantPromotionPKeys.indexOf(allItems[i].getPromotionPKey()) == -1) {
      if (!Utils.isEmptyString(relevantPromotionPKeys)) {
        relevantPromotionPKeys += ",";
      }
      relevantPromotionPKeys += "'" + allItems[i].getPromotionPKey() + "'";
    }
    if(relevantPromotionProductPKeys.indexOf(allItems[i].getPrdMainPKey()) == -1) {
      if (!Utils.isEmptyString(relevantPromotionProductPKeys)) {
        relevantPromotionProductPKeys += ",";
      }
      relevantPromotionProductPKeys += "'" + allItems[i].getPrdMainPKey() + "'";
    }
  }
}

var items = me.getItemsByParam({mergeEngine_invalidated: "1"});

if (items.length > 0) {
  me.suspendListRefresh();

  
  if(Utils.isEmptyString(invalidProductPKeys)) {
    invalidProductPKeys += "' '";
  }

  jsonQueryAddProducts.params.push({
    "field" : "addCond_ProductPKeys",
    "value" : invalidProductPKeys
  });

  if(Utils.isEmptyString(relevantPromotionPKeys)) {
    relevantPromotionPKeys = undefined;
  }

  var promotionPromise = when.resolve();
  if (considerSelectablePromotion == "1") {
    promotionPromise = Facade.getListAsync("LoSelectablePromotionProducts", { currentDate: Utils.createDateToday(), customer: customerPKey, addCondition_Promotion: relevantPromotionPKeys, addCondition_PromotionProducts: relevantPromotionProductPKeys })
      .then(function (promotionProducts) {
      selectablePromotionProducts = promotionProducts;
    });
  }

  promise = promotionPromise.then(function () {
    return BoFactory.loadObjectByParamsAsync("LoProductForAdd", jsonQueryAddProducts);
  }).then(function (loProductsForAdd) {
    var dictValidItems = Utils.createDictionary();
    var validItems = loProductsForAdd.getItemObjects();

    for (var x = 0; x < validItems.length; x++) {
      dictValidItems.add(validItems[x].getPrdMainPKey(), validItems[x].getPrdMainPKey());
    }

    //Build SdoItemPKey condition
    //SF/CASDiff: General Difference
    var columnName = "";
    if(Utils.isSfBackend()){
      columnName = "Order_Item__c.Id";
    }
    else{
      columnName = "SdoItem.PKey";
    }

    for (var j = 0; j < items.length; j++) {
      var isValidRewardProduct = false;
      var isRewardProduct = false;
      if (items[j].getParentType() === "Reward") {
        itemPKeyReward = items[j].getSdoItemMetaPKey();
        itemMetaReward = orderItemMetas.getItemByPKey(itemPKeyReward);
        isRewardProduct = true;
        var rewardProduct = hurdleEvaluationHelper.getLoRewardProducts().getItems().filter(function(rewardProduct){
          return rewardProduct.prdId === items[j].getPrdMainPKey() && rewardProduct.promotionReward === items[j].getRewardPKey() && rewardProduct.logisticUnit === items[j].quantityLogisticUnit;
        });
        if (rewardProduct.length > 0 && ((rewardProduct[0].getDeliveryState() === "Available" && itemMetaReward.getConsiderDeliveryState() == "1") || (itemMetaReward.getConsiderDeliveryState() == "0"))) {
          // assign product name etc. to the reward product
          items[j].setText1(rewardProduct[0].getProductName());
          items[j].setShortId(rewardProduct[0].getShortId());
          items[j].setPrdId(rewardProduct[0].getPrdId());
          items[j].setGroupText(rewardProduct[0].getGroupText());
          items[j].setGroupId(rewardProduct[0].getGroupId());
          isValidRewardProduct = true;
        }
      }

      var isPromotionProduct = function(promotionProduct) {
        return promotionProduct.promotionPKey == items[j].getPromotionPKey() && promotionProduct.prdMainPKey == items[j].getPrdMainPKey();
      };

      // Check if a Product is invalid for the case that it is not anymore a Tactic Product of the Promotion; exception: the Product is a Reward Product
      if (!isRewardProduct && !Utils.isEmptyString(items[j].getPromotionPKey()) && Utils.isDefined(selectablePromotionProducts) && selectablePromotionProducts.findIndex(isPromotionProduct) <= -1) {
        invalidPromotionPKeys.push(items[j].getPromotionPKey());
        if (!Utils.isEmptyString(addCondSdoItemPKeys)) {
          addCondSdoItemPKeys += " OR ";
        }
        addCondSdoItemPKeys += columnName + " ='" + items[j].getPKey() + "' ";
      }
      // Check if a Product is either valid from a Manual Add perspective or if it is valid from a Reward Product perspective
      else if ((dictValidItems.containsKey(items[j].getPrdMainPKey()) && !isRewardProduct) || (isValidRewardProduct && isRewardProduct)) {
        itemMeta = dictItemMetas.get(items[j].getSdoItemMetaPKey());
        if (itemMeta.getActive() == "1" && itemMeta.getValidFrom() <= Utils.createAnsiDateToday() && itemMeta.getValidThru() >= Utils.createAnsiDateToday() ) {
          // When the Product is valid and its Order Item Template is valid, reset invalidated flag
          items[j].setMergeEngine_invalidated("0");
        }
      }
      else {
        if (!Utils.isEmptyString(addCondSdoItemPKeys)) {
          addCondSdoItemPKeys += " OR ";
        }
        addCondSdoItemPKeys += columnName + " ='" + items[j].getPKey() + "' ";
        if (isRewardProduct && !isValidRewardProduct) {
          invalidPromotionPKeys.push(items[j].getPromotionPKey());
        }
      }
    }
    var promotionsLoaded = [];
    for (var k = 0; k < invalidPromotionPKeys.length; k++) {
      promotionsLoaded.push(Facade.getObjectAsync("LuSelectablePromotion", {pKey: invalidPromotionPKeys[k]}));
    }

    return when.all(promotionsLoaded);
  }).then(function(invalidPromotions) {
    promotions = invalidPromotions;
    if (!Utils.isEmptyString(addCondSdoItemPKeys)) {
      jsonParams.push({
        "field" : "addCondSdoItemPKeys",
        "value" : addCondSdoItemPKeys
      });
      jsonParams.push({
        "field" : "criterionAttribute",
        "value" : addProductCriterionAttribute
      });
      var jsonQuery = {};
      jsonQuery.params = jsonParams;
      return BoFactory.loadObjectByParamsAsync("LoProductInformationForInvalidated", jsonQuery);
    }
    else {
      return undefined;
    }
  }).then(function (loProductInformation) {
    var item;
    var prdInfo;
    var itemText = "";
    var isFirst = true;

    //get only the Items who are still invalid to reset QTY and to appear in the message
    var invalidItems = items.filter(function(invalidItems){ return invalidItems.mergeEngine_invalidated == "1";});
    invalidItems.sort(function(a,b) {
      if (a.prdMainPKey < b.prdMainPKey) {
        return 1;
      }
      return 0;
    });
    me.resumeListRefresh(true);
    // Set product information
    for (var i = 0; i < invalidItems.length; i++) {
      item = invalidItems[i];
      itemText = "";

      if (Utils.isEmptyString(item.getText1())) {
        prdInfo = loProductInformation.getItemsByParam({prdMainPKey : item.getPrdMainPKey()});
        if (prdInfo.length > 0) {
          itemText = prdInfo[0].getText1();

          item.setText1(itemText);
          item.setGroupText(prdInfo[0].getGroupText());
          item.setGroupId(prdInfo[0].getGroupId());
        }
      }
      else {
        itemText = item.getText1();
      }

      if (!Utils.isEmptyString(itemText)) {
        if (isFirst) {
          if(productTextsForMessage.indexOf(itemText) == -1) {
            productTextsForMessage = itemText;
            isFirst = false;
          }
        }
        else {
          if(productTextsForMessage.indexOf(itemText) == -1) {
            productTextsForMessage += ", " + itemText;
            promotionTextsForMessage = "";
          }
        }
      }
      if (invalidPromotionPKeys.indexOf(item.getPromotionPKey()) > -1) {
        var referencedPromotion = promotions.find(function (promotion) { return promotion.PKey == item.getPromotionPKey();});
        if (promotionTextsForMessage.indexOf(referencedPromotion.slogan) == -1) {
          promotionTextsForMessage += referencedPromotion.slogan;
          productTextsForMessage += " (" + referencedPromotion.slogan + ")";
        }
      }
      // Set quantity of invalid items to zero
      item.setQuantity(0);
    }
    if (!Utils.isEmptyString(productTextsForMessage)) {
      // Display message about removed products
      var buttonValues = {};
      buttonValues[Localization.resolve("OK")] = "ok";
      return MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Notification"), 
                                       Localization.resolve("OrderInvalidatedProductsFound") + productTextsForMessage, buttonValues);
    }
  });
}
else {
  promise = when.resolve();
}
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}