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
 * @function onOrderItemChanged
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} bufferedEvents
 * @returns promise
 */
function onOrderItemChanged(bufferedEvents){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise;
var mainItem;
var currentEvent;
var sdoItemMeta;
var orderUnitItem;

var isUpdateRequired = false;
if (!Array.isArray(bufferedEvents)) {
  bufferedEvents = [bufferedEvents];
}
//variables for checking what processes need to be done
var calculationProcessTriggers = [];
var groupingProcessTriggers = [];
var reasonCodeProcessTriggers = [];
var quantityProcessTriggers = [];
var modReasonTriggerObj;
var pricingTriggerObject;
var groupingTriggerObj;
var quantityChangedTriggerObj;

for (var j = 0; j < bufferedEvents.length; j++) {
  currentEvent = bufferedEvents[j];

  //setting up the environment
  mainItem = currentEvent.listItem;
  //IMPORTANT: Perf fix, commenting this here and executing it separately in every case statement below! Do not "optimize"!
  //orderUnitItem = me.getLoItems().getFirstOrderUnitItemForMainItem(mainItem);

  //processing all the changed attributes of the event
  for (var i = 0; i < currentEvent.modified.length; i++) {
    //reacting on the different attributes
    switch (currentEvent.modified[i]) {
        /******************************************************* Quantity ***********************************************************/
      case "quantity": {

        //Check if changed item is a free item which comes from pricing engine
        var isPEFreeItem = false;
        var parentType = mainItem.getParentType();
        if (Utils.isDefined(parentType) && (parentType === "Order" || parentType === "Item")) {
          isPEFreeItem = true;
        }

        //perf fix
        orderUnitItem = me.getLoItems().getFirstOrderUnitItemForMainItem(mainItem);
        modReasonTriggerObj = {
          mainItem: mainItem,
          orderUnitItem: orderUnitItem
        };
        reasonCodeProcessTriggers.push(modReasonTriggerObj);

        quantityChangedTriggerObj = {
          mainItem: mainItem,
          orderUnitItem: orderUnitItem,
          oldValue: currentEvent.oldValues.quantity,
          newValue: currentEvent.newValues.quantity
        };
        quantityProcessTriggers.push(quantityChangedTriggerObj);

        groupingTriggerObj = {
          mainItem: mainItem
        };
        groupingProcessTriggers.push(groupingTriggerObj);


        //only create calculationTrigger if qty change comes not from a Pricing Engine FreeItem
        if (!isPEFreeItem) {
          pricingTriggerObject = {
            mainItem: mainItem,
            orderUnitItem: orderUnitItem,
            modifiedAttribute: currentEvent.modified[i]
          };
          calculationProcessTriggers.push(pricingTriggerObject);
        }


        if (mainItem.getIsSuggestedClicked() === "0") {
          me.getLoItems().suspendListRefresh();
          mainItem.setEdited("1");
          me.getLoItems().resumeListRefresh(true);
        }
        else {
          me.getLoItems().suspendListRefresh();
          mainItem.setIsSuggestedClicked("0");
          me.getLoItems().resumeListRefresh(true);
        }
        isUpdateRequired = true;
        break;
      }

        /******************************************************* ModReason ***********************************************************/
      case "modReason": {
        //perf fix
        orderUnitItem = me.getLoItems().getFirstOrderUnitItemForMainItem(mainItem);
        modReasonTriggerObj = {
          mainItem: mainItem,
          orderUnitItem: orderUnitItem
        };
        reasonCodeProcessTriggers.push(modReasonTriggerObj);
        isUpdateRequired = true;

        break;
      }

        /******************************************************* Discount ***********************************************************/
      case "discount": {
        //perf fix
        orderUnitItem = me.getLoItems().getFirstOrderUnitItemForMainItem(mainItem);
        pricingTriggerObject = {
          mainItem: mainItem,
          orderUnitItem: orderUnitItem,
          modifiedAttribute: currentEvent.modified[i]
        };
        calculationProcessTriggers.push(pricingTriggerObject);

        groupingTriggerObj = {
          mainItem: mainItem
        };
        groupingProcessTriggers.push(groupingTriggerObj);
        isUpdateRequired = true;

        break;
      }

        /******************************************************* Special Price ***********************************************************/
      case "specialPriceReceipt": {
        //perf fix
        orderUnitItem = me.getLoItems().getFirstOrderUnitItemForMainItem(mainItem);
        pricingTriggerObject = {
          mainItem: mainItem,
          orderUnitItem: orderUnitItem,
          modifiedAttribute: currentEvent.modified[i]
        };
        calculationProcessTriggers.push(pricingTriggerObject);

        groupingTriggerObj = {
          mainItem: mainItem
        };
        groupingProcessTriggers.push(groupingTriggerObj);
        isUpdateRequired = true;

        break;
      }

        /******************************************************* PricingInfo ***********************************************************/
      case "pricingInfo1":
      case "pricingInfo2":
      case "pricingInfo3":
      case "pricingInfo4":
      case "pricingInfo5":
      case "pricingInfo6":
      case "pricingInfo7":
      case "pricingInfo8":
      case "pricingInfo9":
      case "pricingInfo10":
        //perf fix
        if (mainItem.getQuantity() > 0) {
          orderUnitItem = me.getLoItems().getFirstOrderUnitItemForMainItem(mainItem);
          pricingTriggerObject = {
            mainItem: mainItem,
            orderUnitItem: orderUnitItem,
            modifiedAttribute: currentEvent.modified[i]
          };
          calculationProcessTriggers.push(pricingTriggerObject);
          isUpdateRequired = true;
        }
        break;
    }
  }
}

/***************************************************************************************************************/
/*                       Handling the different processes that are needed                                      */
/***************************************************************************************************************/
//Skipped for other events like display information changes.
if (isUpdateRequired) {

  //defining the handler functions
  var qtyChangedHandler = function(x) {
    var mainItem = x.mainItem;
    orderUnitItem = x.orderUnitItem;
    var oldValue = x.oldValue;
    var newValue = x.newValue;
    var messagePromise = when.resolve();
    //check quantity modification allowed
    var buttonValues = {};
    buttonValues[Localization.resolve("OK")] = "ok";
    var sdoItemMeta = me.getBoOrderMeta().getLoOrderItemMetas().getItemByPKey(mainItem.getSdoItemMetaPKey());
    
    // Free item are not defined anymore with getSdoParentItemPKey , right way to check thru parentType
    //var isFreeItem = (mainItem.sdoItemMetaPKey === me.boOrderMeta.luOrderMetaForFreeItems.sdoItemMetaPKey && !Utils.isEmptyString(mainItem.getSdoParentItemPKey()));
    
    var isFreeItem = false;
    var parentType = mainItem.getParentType();
    if (Utils.isDefined(parentType) && (parentType === "Order" || parentType === "Item")) {
      isFreeItem = true;
    }

    if ((me.getBoOrderMeta().getConsiderQuantitySuggestion() === "PQty" || isFreeItem || mainItem.getSpecialPromoted() =="1") &&
        (mainItem.getMergeEngine_invalidated() === "0") && mainItem.getEdited() !== "0") {
      var modifyPresetQuantityOption = " ";
      if (!Utils.isEmptyString(me.getLuDeliveryRecipient().getPKey()) && !Utils.isEmptyString(me.getLuDeliveryRecipient().getSdoModifyPresetQuantity())) {
        modifyPresetQuantityOption= me.getLuDeliveryRecipient().getSdoModifyPresetQuantity();
      }
      else if (Utils.isDefined(sdoItemMeta)) {
        modifyPresetQuantityOption= sdoItemMeta.getModifyPresetQuantity();
      }
      var setPresetQuantity = function(item, modifyPresetQtyOption, presetValue){
        if (modifyPresetQtyOption === "No") {
          me.getLoItems().suspendListRefresh();
          item.setQuantity(presetValue);
          me.getLoItems().resumeListRefresh(true);
        }
        else {
          item.setQuantity(item.getSuggestedQuantity());
        }
        item.setEdited("0");
        return when.resolve();
      };

      if (mainItem.getDeletedFreeItem() === "0" && (
        (modifyPresetQuantityOption === "ODec" && newValue > mainItem.getSuggestedQuantity()) ||
        (modifyPresetQuantityOption === "OInc" && newValue < mainItem.getSuggestedQuantity()) ||
        (modifyPresetQuantityOption === "No" && newValue != oldValue))) {
        return MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Warning"), Localization.resolve("QtyEditNotAllowed"), buttonValues).then(function(){
          return when(setPresetQuantity(mainItem,modifyPresetQuantityOption,oldValue));
        }).then(function(){
          me.getLoItems().suspendListRefresh();
          return me.roundOrderItemQuantity(mainItem);
        }).then(function(){
          me.getLoItems().resumeListRefresh(true);
          return when(mainItem.setEditedQty(mainItem.getQuantity()));
        }).then(function(){
          me.getLoItems().createDisplayInformationForItem(orderUnitItem, me.getBoOrderMeta());
        });
      }
      else {
        return when(mainItem.setEditedQty(mainItem.getQuantity())).then(function(){
          me.getLoItems().createDisplayInformationForItem(orderUnitItem, me.getBoOrderMeta());
        });
      }
    }
    else {
      //Quantity rounding logic
      me.getLoItems().suspendListRefresh();
      return me.roundOrderItemQuantity(mainItem).then(function(){
        mainItem.setEditedQty(mainItem.getQuantity());
        me.getLoItems().resumeListRefresh(true);
        me.getLoItems().createDisplayInformationForItem(orderUnitItem, me.getBoOrderMeta());
      });
    }
  };

  var groupingHandler = function(x) {
    me.determineItemSplittingGroups(x.mainItem);
  };

  var pricingUpdateHandler = function(x) {
    var pricingPromise;
    var mainItem = x.mainItem;
    var isFreeItem = mainItem.sdoItemMetaPKey === me.boOrderMeta.luOrderMetaForFreeItems.sdoItemMetaPKey ;

    if (Utils.isDefined(CP) && (me.getBoOrderMeta().getComputePrice() === "4" || me.getBoOrderMeta().getComputePrice() === "5")) {
      var isNewItem = !(CP.PricingHandler.getInstance().hasOrderItem(mainItem.getPKey()));
      pricingPromise = CP.PricingHandler.getInstance().updateProduct(mainItem.getData(), x.modifiedAttribute).then(function () {
        if (isNewItem) {
          CP.PricingHandler.getInstance().setVariantItemAttributes(mainItem.getPKey(), me.cpGetVariantItemVariables(mainItem.getPKey()));
        }
      });
    }
    else {
      pricingPromise = me.calculateItemValue(mainItem);
    }
    return pricingPromise.then(function(){
      if (!isFreeItem) {
        return me.resetFreeItems(mainItem);
      }
    });
  };

  var resetCalculationHandler = function() {
    var resetCalculationPromise = when.resolve();

    if(me.getCalculationStatus() !== BLConstants.Order.CALCULATION_REQUIRED){
      me.setCalculationStatus(BLConstants.Order.CALCULATION_REQUIRED);
      resetCalculationPromise = me.resetCalculationResult();
    }
    return resetCalculationPromise;
  };

  var pricingCalculateHandler = function() {
    var pricingPromise = when.resolve();

    if (Utils.isDefined(CP) && (me.getBoOrderMeta().getComputePrice() === "4" || me.getBoOrderMeta().getComputePrice() === "5")) {
      if (me.getBoOrderMeta().getComputePrice() === "5" && me.getDocTaType() !== "NonValuatedDeliveryNote") {
        pricingPromise = me.cpCalculate();
      }
    }
    else {
      pricingPromise = me.calculateOrderValue().then(function(){
        me.setCalculationStatus("1");
        me.esDetermineSplittingGroups();
      });
    }
    return pricingPromise;
  };

  var modReasonHandler = function(x) {
    var sdoItemMeta = me.getBoOrderMeta().getLoOrderItemMetas().getItemByPKey(mainItem.getSdoItemMetaPKey());
    return me.reasonCodeItemValidation(x.mainItem, sdoItemMeta, "1");
  };

  /****************** Quantity Changed Handling ********************/
  var qtyChangedDeferreds = quantityProcessTriggers.map(qtyChangedHandler);

  promise = when.all(qtyChangedDeferreds).then(function() {
    /****************** Hurdles Evaluation ********************/
    if (me.getBoOrderMeta().getConsiderSelectablePromotion() == "1" && quantityProcessTriggers.length > 0 && 
        !Utils.isEmptyString(quantityProcessTriggers[0].mainItem.getPromotionPKey()) && me.getIsNotReadyForHurdleEvaluation() !== "1") {
      return me.getHurdleEvaluationHelper().evaluateHurdles(me, me.getBoItemTabManager().getBoCallCache(), quantityProcessTriggers[0].mainItem.getPromotionPKey()).then(function () {
        var promotionPkey = quantityProcessTriggers[0].mainItem.getPromotionPKey();
        return me.getHurdleEvaluationHelper().determineSatisfiedRewardGroups(promotionPkey, me.getLoSelectablePromotion()).then(function() {
          me.updateRewardGroupSatisfactionCounter(promotionPkey);
        });
      });
    }
  }).then(function () {
    /****************** Grouping Handling ********************/
    groupingProcessTriggers.forEach(groupingHandler);


    /****************** Pricing Handling ********************/
    if (calculationProcessTriggers.length !== 0) {
      return resetCalculationHandler();
    }
  }).then(function () {    
    var pricingUpdateDeferreds = calculationProcessTriggers.map(pricingUpdateHandler);

    return when.all(pricingUpdateDeferreds);
  }).then(function() {
    if (calculationProcessTriggers.length !== 0) {
      return pricingCalculateHandler();
    }
  }).then(function() {
    /****************** ModReason Handling ********************/
    var reasonCodeDeferreds = reasonCodeProcessTriggers.map(modReasonHandler);

    return when.all(reasonCodeDeferreds);
  }).then(function() {
    if (Utils.isDefined(me.getBoItemTabManager())) {
      var filterId = me.getBoItemTabManager().getCurrentItemFilterId();
      var categoryId = me.getBoItemTabManager().getCurrentFilterId();
      me.getLoItems().setItemFilter(filterId, categoryId, me.getSelectedPromotionPKey());
      me.setItemFilterCounts();
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