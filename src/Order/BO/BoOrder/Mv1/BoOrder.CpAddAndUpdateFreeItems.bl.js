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
 * @function cpAddAndUpdateFreeItems
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} result
 * @param {DomPKey} sdoItemMetaPKey
 * @param {String} splittingGroup
 * @returns promise
 */
function cpAddAndUpdateFreeItems(result, sdoItemMetaPKey, splittingGroup){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var deferreds = [];
var itemAddedOrUpdated = "0";
var data;
var freeItemsToBeGenerated = [];
var productInformationLookups = [];
var liItemTemplate = me.getBoOrderMeta().getLoOrderItemMetas().getItemTemplateByPKey(sdoItemMetaPKey);
var ProductInformationCP;

var promise = me.loadProductForAdd(sdoItemMetaPKey).then(
  function (){
    var itemsToBeAdded = [];
    var item;

    var addProductInformation = function (lookupData) {
      // Instantiate lookup from lookup data
      var productInformationLookup = BoFactory.instantiate(ProductInformationCP, lookupData);
      productInformationLookups.push(productInformationLookup);
    };

    var index;
    var currentItem;
    var key;

    // create dictionary for LoOrderItemMetas
    var orderItemMetasDict = Utils.createDictionary();
    var items = me.getBoOrderMeta().getLoOrderItemMetas().getAllItems();
    var itemsLength = items.length;

    for(index = 0; index < itemsLength; index++){
      currentItem = items[index];
      orderItemMetasDict.add(currentItem.getPKey(), currentItem);
    }

    // create dictionary for LoItems
    var orderItemsDict = Utils.createDictionary();
    items = me.getLoItems().getAllItems();
    itemsLength = items.length;

    if (Utils.isSfBackend()){
      for(index = 0; index < itemsLength; index++){
        currentItem = items[index];
        key = currentItem.getSdoParentItemPKey() + 
          currentItem.getParentType() +
          currentItem.getSdoItemMetaPKey() +
          currentItem.getQuantityLogisticUnit() +
          currentItem.getPrdMainPKey();

        orderItemsDict.add(key, currentItem);
      }
    }
    else{
      for(index = 0; index < itemsLength; index++){
        currentItem = items[index];
        key = currentItem.getSdoParentItemPKey() + 
          currentItem.getSdoItemMetaPKey() +
          currentItem.getQuantityLogisticUnit() +
          currentItem.getPrdMainPKey();

        orderItemsDict.add(key, currentItem);
      }
    }
    
    /**
    * Free item handling:
    * The penny perfect pricing engine supports free items generation.
    * Free products can be generated in multiple calculation steps from
    *  - different ordered products and
    *  - different free items from the same ordered products product
    *
    * The identical product cannot be generated multiple times from the same ordered product. 
    **/
    
    //create a dictionary to check if free items of same product link to same parent item (not supported use case)
    var freeItemDic = Utils.createDictionary();
    var freeItemDicKey;

    for(var i = 0; i < result.length; i++) {
      
      var freeItem = result[i];
      var productKey = freeItem.FreeItemPKey;
      var parentItemKey = freeItem.ParentItemPKey;

      
      //check if free item was already added
      freeItemDicKey = productKey + parentItemKey;
      if(freeItemDic.containsKey(freeItemDicKey)){
        AppLog.error("Identical free product (" + productKey +")  was added multiple times by the same ordered product for order " +  me.getOrderId() + ". Review the associated Calculation Step and Merged Key:" + freeItem.CreationStep + ".");
        continue;
      }else{
        freeItemDic.add(freeItemDicKey, '');
      }
      
      /**
	* CGCloud switch is needed here because CGCloud is not supporting polymorphic lookups.
	* In onPrem in the parentItemPKey Order AND Order Item relations can be stored.
	* That is not possible in SalesForce. Therfore we introduced a parentItem field which only holds relations to a parent item-
	* Additionally we introduced a new field parentType which describes if the free item is related to a order item or a order
	*
	* Example:
	*
	* CGCloud:
	* FreeItem related to a order item:		parentItemPKey: key of the related order item		parentType:	Item
	* FreeItem related to a order header:		parentItemPKey: Blank								parentType:	Order
	*
	* onPrem:
	* FreeItem related to a order item:		parentItemPKey: key of the related order item
	* FreeItem related to a order header:     parentItemPKey: key of the related order
	**/

      if (Utils.isSfBackend()) {
        // check if free items is related to order or order item
        var parentType = "Item";
        if (freeItem.ParentItemPKey === me.pKey) {
          parentType = "Order";
          parentItemKey = " ";
        }

        key = parentItemKey + parentType + liItemTemplate.getPKey() + freeItem.FreeUoM + freeItem.FreeItemPKey;
      }
      else {
        key = freeItem.ParentItemPKey + liItemTemplate.getPKey() + freeItem.FreeUoM + freeItem.FreeItemPKey;
      }

      // check for already existing item
      var listItem = orderItemsDict.get(key);
      if (Utils.isDefined(listItem) && 
          (Utils.isEmptyString(listItem.getFreeItemCreationStep()) || listItem.getFreeItemCreationStep() === freeItem.CreationStep)) {
        var old = listItem.getQuantity();
        if (listItem.getQuantity() != freeItem.FreeQty) {
          // If now the engine re-calcualtes a free item, which already was there (LiOrderItem.deletedFreeItem = “1”)
          // Check if the entered Qty from the used (new temporarily attribute) is smaller than the freeItem.FreeQty which was calculated by the engine -> IF yes,
          // take the User’s qty from the temp-field and set it as Quantity for the free Item -> IF NOT take the engine’s Qty and update the SuggestedQty of the LiOrderItem
          if (listItem.getQuantity() < freeItem.FreeQty && 
              (listItem.getSuggestedQuantity() < 1 || listItem.getSuggestedQuantity() == freeItem.FreeQty)) {
            if (listItem.getDeletedFreeItem() == "1") {
              deferreds.push(listItem.setQuantity(freeItem.FreeQty));
              deferreds.push(listItem.setTargetQuantity(freeItem.FreeQty));
              deferreds.push(listItem.setOQtyString("OQty: " + freeItem.FreeQty + ""));
            }
            else {
              deferreds.push(listItem.setQuantity(listItem.getEditedQty()));
              deferreds.push(listItem.setTargetQuantity(freeItem.FreeQty));
              deferreds.push(listItem.setOQtyString("OQty: " + listItem.getTargetQuantity() + ""));
            }
            deferreds.push(listItem.setSuggestedQuantity(freeItem.FreeQty));
          }
          else {
            deferreds.push(listItem.setSuggestedQuantity(freeItem.FreeQty));
            deferreds.push(listItem.setQuantity(freeItem.FreeQty));
            deferreds.push(listItem.setTargetQuantity(freeItem.FreeQty));
            deferreds.push(listItem.setOQtyString("OQty: " + freeItem.FreeQty + ""));
          }
        }
        deferreds.push(listItem.setEditedQty(listItem.getQuantity()));
        deferreds.push(listItem.setDeletedFreeItem("0"));
        deferreds.push(listItem.setShowInBasket("1"));
        deferreds.push(listItem.setSplittingGroup(splittingGroup));
        deferreds.push(listItem.setFreeItemCreationStep(freeItem.CreationStep));
        deferreds.push(listItem.setModReasonEntered('EmptyImage'));
        itemAddedOrUpdated = "1";
        me.getLoItems().createDisplayInformationForItem(listItem, me.getBoOrderMeta());
        // Update basket count on item filter
        me.updateItemFilterBasketCount(listItem, old, listItem.getQuantity());
        //Update other filter counts
        me.updateItemFilterCountAfterAdd();
        var itemMeta = orderItemMetasDict.get(listItem.getSdoItemMetaPKey());
        if (Utils.isDefined(itemMeta)) {
          if (itemMeta.getModReasonRequired() === "Mand" && 
              Utils.isEmptyString(listItem.getModReason()) && listItem.getEditedQty() != freeItem.FreeQty) {
            deferreds.push(listItem.setModReasonEntered('PrioHigh24'));
          }
        }
        deferreds.push(CP.PricingHandler.getInstance().updateProduct(listItem.getData(), "quantity"));
      }
      else {
        var product = me.getProductForAddDict().get(freeItem.FreeItemPKey);
        if (Utils.isDefined(product)) {
          var jsonParams_Lookup_productInformation = [];
          var jsonQuery_productInformation = {};
          jsonParams_Lookup_productInformation.push({"field" : "prdMainPKey", "value" : freeItem.FreeItemPKey});
          jsonParams_Lookup_productInformation.push({"field" : "commitDate", "value" : me.getCommitDate()});
          jsonParams_Lookup_productInformation.push({"field" : "criterionAttribute", 
                                                     "value" : me.getBoItemTabManager().getAddProduct_CriterionAttribute()});
          jsonQuery_productInformation.params = jsonParams_Lookup_productInformation;

          freeItemsToBeGenerated.push({FreeItem : freeItem, ProdData : product });
          if(Utils.isSfBackend() && (me.getBoOrderMeta().getComputePrice() === "4" || me.getBoOrderMeta().getComputePrice() === "5")) {
            ProductInformationCP = "LuCpProductInformation";
          }
          else {
            ProductInformationCP ="LuProductInformation";
          }
          deferreds.push(Facade.getObjectAsync(ProductInformationCP, jsonQuery_productInformation).then(addProductInformation));
        }
        else {
          AppLog.error("The free product (" + productKey +") is not an addable product. Review the associated Calculation Step and Merged Key:" + freeItem.CreationStep + ".");
        }
      }
    }

    return when.all(deferreds).then(
      function(){

        var productInformationLookupDic = Utils.createDictionary();
        productInformationLookups.forEach(function(productInformation){
          productInformationLookupDic.add(productInformation.getPKey(), productInformation);
        });

        freeItemsToBeGenerated.forEach(function(freeItemContainer){
          var freeItem = freeItemContainer.FreeItem;
          var prod = freeItemContainer.ProdData;
          var productInformationLookup = productInformationLookupDic.get(freeItem.FreeItemPKey);
          var data = prod.getData();

          item = {
            "pKey" : PKey.next(),
            "basePrice" : data.basePrice,
            "basePriceReceipt" : data.basePriceReceipt,
            "calculationGroup" : liItemTemplate.getCalculationGroup(),
            "category" : data.category,
            "customerAssortment" : data.customerAssortment,
            "deletedFreeItem" : "0",
            "deliveryState" : data.deliveryState,
            "eAN" : productInformationLookup.getEAN(),
            "editedQty" : freeItem.FreeQty,
            "fieldState" : data.fieldState,
            "freeItemUnit" : freeItem.FreeUoM,
            "freeItemMetaPKey" : liItemTemplate.getPKey(),
            "freeItemCreationStep" : freeItem.CreationStep,
            "grossValue" : data.grossValue,
            "grossValueReceipt" : data.grossValueReceipt,
            "groupId" : productInformationLookup.getGroupId(),
            "groupText" : productInformationLookup.getGroupText(),
            "history" : data.history,
            "isOrderUnit" : "1",
            "itemState" : data.itemState,
            "listed" : data.listed,
            "movementDirection" : liItemTemplate.getMovementDirection(),
            "newState" : data.newState,
            "objectStatus" : STATE.NEW | STATE.DIRTY,
            "outOfStock" : data.outOfStock,
            "piecesPerSmallestUnitForBasePrice" : data.piecesPerSmallestUnitForBasePrice,
            "prdId" : data.prdId,
            "prdMainPKey" : freeItem.FreeItemPKey,
            "prdType" : data.prdType,
            "price" : data.price,
            "priceEffect" : liItemTemplate.getPriceEffect(),
            "priceReceipt" : data.priceReceipt,
            "promoted" : data.promoted,
            "quantity" : freeItem.FreeQty,
            "quantityLogisticUnit" : freeItem.FreeUoM,
            "refPKey" : productInformationLookup.getPKey() + liItemTemplate.getPKey(),
            "saveZeroQuantity" : liItemTemplate.getSaveZeroQuantity(),
            "shortId" : data.shortId,
            "sdoMainPKey" : me.getPKey(),
            "sdoItemMetaPKey" : liItemTemplate.getPKey(),
            "sdoParentItemPKey" : freeItem.ParentItemPKey,
            "splittingGroup" : splittingGroup,
            "sort" : "1",
            "shortType" : liItemTemplate.getShortText(),
            "suggestedQuantity" : freeItem.FreeQty,
            "targetQuantity" : freeItem.FreeQty,
            "taxClassification" : data.taxClassification,
            "text1" : data.text1,
            "type" : liItemTemplate.getText(),
            "value" : data.value,
            "valueReceipt" : data.valueReceipt,
          };

          if(freeItem.FreeQty > 0 ) {
            item.showInBasket = "1";
          }

          //check if free items is related to order or order item
          if (Utils.isSfBackend()){
            if (item.sdoParentItemPKey === me.pKey){
              item.sdoParentItemPKey = " ";
              item.parentType = "Order";
            }else{
              item.parentType = "Item";
            }
          }

          //set pieces per smallest unit of the free item
          if (item.quantityLogisticUnit == productInformationLookup.getOrderQuantityLogisticUnit()){
            item.piecesPerSmallestUnit = productInformationLookup.getOrderPiecesPerSmallestUnit();
          }
          else if (item.quantityLogisticUnit == productInformationLookup.getConsumerQuantityLogisticUnit()){
            item.piecesPerSmallestUnit = productInformationLookup.getConsumerPiecesPerSmallestUnit();
          }

          itemAddedOrUpdated = "1";
          itemsToBeAdded.push(item);
        });

        var productsUpdated = [];
        me.getLoItems().addObjectItems(itemsToBeAdded);

        for(var i = 0; i < itemsToBeAdded.length; i++){
          item = itemsToBeAdded[i];
          me.getLoItems().createDisplayInformationForItem(item, me.getBoOrderMeta());

          // Update basket count on item filter
          me.updateItemFilterBasketCount(item, 0, item.getQuantity());

          //Update Count for "All" Filter
          me.updateItemFilterCountAfterAdd();

          //add item to the pricing engine
          if (Utils.isDefined(window['CP']) && (me.getBoOrderMeta().getComputePrice() === "4" || me.getBoOrderMeta().getComputePrice() === "5")) {
            productsUpdated.push(CP.PricingHandler.getInstance().updateProduct(item.getData(), "quantity"));
          }
        }

        var categoryId = me.getBoItemTabManager().getCurrentFilterId();
        if(me.getBoOrderMeta().getComputePrice() === "4"){
          //Update item filters in case of Offline (button) mode
          var filterId = me.getBoItemTabManager().getCurrentItemFilterId();
          me.getLoItems().setItemFilter(filterId, categoryId, me.getSelectedPromotionPKey());
        } else{
          //Update basket list
          if(me.getBoItemTabManager().getCurrentItemFilterId() === "Basket"){
            me.getLoItems().setItemFilter("Basket", categoryId, me.getSelectedPromotionPKey());
          }
        }

        return when.all(productsUpdated).then(
          function(){
            return itemAddedOrUpdated;
          });
      });
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}