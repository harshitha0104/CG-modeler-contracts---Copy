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
 * @function addItemFromObject
 * @this LoOrderItems
 * @kind listobject
 * @async
 * @namespace CORE
 * @param {LoProductForAdd} productsForAdd
 * @param {DomPKey} productPKey
 * @param {DomPKey} sdoMainPKey
 * @param {DomPKey} customerPKey
 * @param {DomPkey} promotionPkey
 * @param {DomBool} considerSelectablePromotion
 * @param {DomDate} commitDate
 * @param {LiOrderItemMeta} itemTemplate
 * @param {DomPKey} clbMainPKey
 * @param {String} criterionAttribute
 * @param {DomSdoBarcodeScanBehavior} barcodeScanBehavior
 * @param {DomInteger} scanIncrementQuantity
 * @param {String} mode
 * @param {DomPrdLogisticUnit} uoM
 * @param {DomPrdPiecesPerUnit} piecesPerSmallestUnit
 * @param {Object} orderMeta
 * @param {Object} loSuggestedQuantity
 * @returns promise
 */
function addItemFromObject(productsForAdd, productPKey, sdoMainPKey, customerPKey, promotionPkey, considerSelectablePromotion, commitDate, itemTemplate, clbMainPKey, criterionAttribute, barcodeScanBehavior, scanIncrementQuantity, mode, uoM, piecesPerSmallestUnit, orderMeta, loSuggestedQuantity){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    var productInformationCP;
var productInfoJsonParams = [];
var productInfoJsonQuery = {};
var promise;
var result;

if(Utils.isSfBackend()) {
  commitDate = Utils.convertForDBParam(commitDate, "DomDate");
}
productInfoJsonParams.push({
  "field" : "prdMainPKey",
  "value" : productPKey
});
productInfoJsonParams.push({
  "field" : "commitDate",
  "value" : commitDate
});
productInfoJsonParams.push({
  "field" : "criterionAttribute",
  "value" : criterionAttribute
});

productInfoJsonQuery.params = productInfoJsonParams;
if(Utils.isSfBackend() && Utils.isDefined(orderMeta) && (orderMeta.getComputePrice() === "4" || orderMeta.getComputePrice() === "5")) {
  productInformationCP = "LuCpProductInformation";
}
else {
  productInformationCP ="LuProductInformation";
}

var productInformationLookup;
promise = Facade.getObjectAsync(productInformationCP, productInfoJsonQuery)
  .then(
  function (lookupData) {
    // Instantiate lookup from lookup data
    productInformationLookup = BoFactory.instantiate(productInformationCP, lookupData);

    if (!Utils.isDefined(uoM) || Utils.isEmptyString(uoM)) {
      // Set unit information depending on default unit
      if (itemTemplate.getQuantityLogisticUnit() == "OrderUnit") {
        uoM = productInformationLookup.getOrderQuantityLogisticUnit();
      }
      else if (itemTemplate.getQuantityLogisticUnit() == "ConsumerUnit") {
        uoM = productInformationLookup.getConsumerQuantityLogisticUnit();
      }
      else if (itemTemplate.getQuantityLogisticUnit() == "PriceUnit") {
        uoM = productInformationLookup.getPriceQuantityLogisticUnit();
      }
      else {
        uoM = productInformationLookup.getOrderQuantityLogisticUnit();
      }
    }

    var existingItems;

    if(considerSelectablePromotion == '1') {
      existingItems = me.getItemsByParam(
        {
          "prdMainPKey" : productPKey,
          "sdoItemMetaPKey" : itemTemplate.getPKey(),
          "quantityLogisticUnit" : uoM,
          "promotionPKey" : promotionPkey
        });
    }
    else {
      existingItems = me.getItemsByParam(
        {
          "prdMainPKey" : productPKey,
          "sdoItemMetaPKey" : itemTemplate.getPKey(),
          "quantityLogisticUnit" : uoM
        }); 
    }

    var filterCountIncrements = [];

    //Check if there exists an item with the same ProductPKey
    if (existingItems.length === 0) {

      var product = productsForAdd.getItemsByParam({"prdMainPKey" : productPKey})[0];

      // Initializing result
      result = {};
      // If the product is empty, then throw a error message otherwise get the data
      if (Utils.isDefined(product)) {
        var item = product.getData();

        // Prepare data to instantiate the LI from, give PKey and remove id property
        item.pKey = PKey.next();
        delete item.id;
        item.sdoMainPKey = sdoMainPKey;
        item.prdMainPKey = productPKey;
        item.isOrderUnit = "1";
        item.quantityLogisticUnit = productInformationLookup.getOrderQuantityLogisticUnit();
        item.piecesPerSmallestUnit = productInformationLookup.getOrderPiecesPerSmallestUnit();
        item.piecesPerSmallestUnitForBasePrice = Math.max(productInformationLookup.getPiecesPerSmallestUnitForBasePrice(), 1);
        item.priceEffect = itemTemplate.getPriceEffect();
        item.sdoItemMetaPKey = itemTemplate.getPKey();
        item.shortType = itemTemplate.getShortText();
        item.type = itemTemplate.getText();
        item.saveZeroQuantity = itemTemplate.getSaveZeroQuantity();
        item.calculationGroup = itemTemplate.getCalculationGroup();
        item.movementDirection = itemTemplate.getMovementDirection();
        item.refPKey = productPKey + itemTemplate.getPKey();
        item.deletedFreeItem = "0";
        item.sort = "0";
        item.discount = 0;
        item.specialPrice = 0;
        // pricing info variable assignment
        item.pricingInfo1 = 0;
        item.pricingInfo2 = 0;
        item.pricingInfo3 = 0;
        item.pricingInfo4 = 0;
        item.pricingInfo5 = 0;
        item.pricingInfo6 = 0;
        item.pricingInfo7 = 0;
        item.pricingInfo8 = 0;
        item.pricingInfo9 = 0;
        item.pricingInfo10 = 0;

        if(Utils.isSfBackend()) {
          if(item.listed == '1' && item.promoted == '1') {
            item.itemState = 'PL';
          } 
          else if(item.listed == '0' && item.promoted == '1') {
            item.itemState = 'P';                
          } 
          else if(item.listed == '1' && item.promoted == '0') {
            item.itemState = 'L';                
          }
        }

        /*this is a workaround:
        groupId is bound as sorting attribute to order item list UI,
        if groupId is null then framework will remove this item from list.
        groupId is null when criterion product code is not maintained in backend for product in context*/
        if(!Utils.isDefined(item.groupId)) {
          item.groupId = "";
        }

        // Set object status
        item.objectStatus = STATE.NEW;

        me.addListItems([item]);
        return me.addMissingUoMsToItem(item, itemTemplate).then(
          function()
          {
            if (Utils.isDefined(orderMeta)) {
              me.createDisplayInformationForItem(item, orderMeta, loSuggestedQuantity);
            }

            result.selectPKey = item.getPKey();

            var foundItem = me.getItemsByParam(
              {
                "refPKey": item.getRefPKey(),
                "quantityLogisticUnit" : uoM
              });

            var unitOfMeasureItem;

            if(foundItem.length > 0) {
              unitOfMeasureItem = foundItem[0];
            }
            else {
              unitOfMeasureItem = me.getFirstItem();
            }

            result.filterCountIncrements = filterCountIncrements;
            result.unitOfMeasureItem = unitOfMeasureItem;

            // Build return values
            if (item.getPromoted() == "1") {
              filterCountIncrements.push(
                {
                  "key" : "Promotion",
                  "value" : 1
                });
            }

            if (item.getNewState() == "Available") {
              filterCountIncrements.push({
                "key" : "New",
                "value" : 1
              });
            }

            if (item.getOutOfStock() == "1") {
              filterCountIncrements.push({
                "key" : "OutOfStock",
                "value" : 1
              });
            }

            filterCountIncrements.push(
              {
                "key" : "All",
                "value" : 1
              });
            return result;
          });     
      }
      else {
        result.filterCountIncrements = filterCountIncrements;
        var buttonValues = {};
        buttonValues[Localization.resolve("OK")] = "ok";
        return MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Validation"), Localization.resolve("Product_ScanProductProcess.ProductScannedNotInPromotionMsg"), buttonValues)
          .then(function (input) {
          return result;
        });
      }
    } 
    else {
      var existingItem = existingItems[0];  
      result = {};
      result.selectPKey = existingItem.getPKey();
      result.filterCountIncrements = filterCountIncrements;	
      result.unitOfMeasureItem = existingItem;
      return result;
    }
  }).then(function(result) {
  // Increase quantity by scan increment if product is selected via scanning
  if (mode === "addScannedProduct" && barcodeScanBehavior === "SelectIncrease") {
    return me.incrementQuantityByScan(result.unitOfMeasureItem, scanIncrementQuantity);
  }
}).then(function(){
  return result;  
});
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}