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
 * @function ebHandleItemListEvents
 * @this BoOrder
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {Object} bufferedEvents
 * @returns promise
 */
function ebHandleItemListEvents(bufferedEvents){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //*************************************************************************************************************
// New Event Handling with Buffering
// Events are buffered in ebBufferItemListEvents(), a timer is started
// When the timer is finished ebFireItemListEvents() is called, here the handling of the buffered events starts
// The handling itself is done in ebHandleItemListEvents()
// ebForceItemListEvents() can be called (should be called from a process) to force the clearance of the buffer
//*************************************************************************************************************
// ebHandleItemListEvents()
// This method handles the buffered events
// Before doing a change to this method, please read through it and understand its structure (this is important!)
// Changes should only be done in the relevant part (e.g. quantity related changes should be done in the quantity part)
// The method consists of two parts. First we collect all the things we need to to by looping over the events
// Then for each handling section (e.g. Quantity) we process the event handling
//*************************************************************************************************************

var currentEvent;
var sdoItemMeta;

if (!Array.isArray(bufferedEvents)) {
  bufferedEvents = [bufferedEvents];
}

//variables for checking what processes need to be done
var calculationProcessTriggers = [];
var groupingProcessTriggers = [];
var reasonCodeProcessTriggers = [];
var quantityProcessTriggers = [];
var mainItem;
var modReasonTriggerObj;
var quantityChangedTriggerObj;
var groupingTriggerObj;
var pricingTriggerObject;

//processing all the events
for (var index = 0; index < bufferedEvents.length; index++) {
  currentEvent = bufferedEvents[index];

  //setting up the environment
  mainItem = currentEvent.listItem;
  var orderUnitItem = me.getLoItems().getFirstOrderUnitItemForMainItem(mainItem);

  //processing all the changed attributes of the event
  for (var i = 0; i < currentEvent.modified.length; i++) {
    //reacting on the different attributes
    switch (currentEvent.modified[i]) {
        /******************************************************* Quantity ***********************************************************/
      case "quantity": {
        modReasonTriggerObj = {
          mainItem: mainItem,
          orderUnitItem: orderUnitItem,
        };
        reasonCodeProcessTriggers.push(modReasonTriggerObj);

        quantityChangedTriggerObj = {
          mainItem: mainItem,
          orderUnitItem: orderUnitItem,
          oldValue: currentEvent.oldValues.quantity,
          newValue: currentEvent.newValues.quantity,
        };
        quantityProcessTriggers.push(quantityChangedTriggerObj);

        groupingTriggerObj = {
          mainItem: mainItem,
        };
        groupingProcessTriggers.push(groupingTriggerObj);

        pricingTriggerObject = {
          mainItem: mainItem,
          orderUnitItem: orderUnitItem,
          modifiedAttribute: currentEvent.modified[i],
        };
        calculationProcessTriggers.push(pricingTriggerObject);

        break;
      }

        /******************************************************* ModReason ***********************************************************/
      case "modReason": {
        modReasonTriggerObj = {
          mainItem: mainItem,
          orderUnitItem: orderUnitItem,
        };
        reasonCodeProcessTriggers.push(modReasonTriggerObj);

        break;
      }

        /******************************************************* Discount ***********************************************************/
      case "discount": {
        pricingTriggerObject = {
          mainItem: mainItem,
          orderUnitItem: orderUnitItem,
          modifiedAttribute: currentEvent.modified[i],
        };
        calculationProcessTriggers.push(pricingTriggerObject);

        groupingTriggerObj = {
          mainItem: mainItem,
        };
        groupingProcessTriggers.push(groupingTriggerObj);

        break;
      }

        /******************************************************* Special Price ***********************************************************/
      case "specialPriceReceipt": {
        pricingTriggerObject = {
          mainItem: mainItem,
          orderUnitItem: orderUnitItem,
          modifiedAttribute: currentEvent.modified[i],
        };
        calculationProcessTriggers.push(pricingTriggerObject);

        groupingTriggerObj = {
          mainItem: mainItem,
        };
        groupingProcessTriggers.push(groupingTriggerObj);

        break;
      }
    }
  }
}

/***************************************************************************************************************/
/*                       Handling the different processes that are needed                                      */
/***************************************************************************************************************/

//defining the handler functions
var qtyChangedHandler = function (x) {
  var qtyPromise;

  mainItem = x.mainItem;
  var orderUnitItem = x.orderUnitItem;
  var oldValue = x.oldValue;
  var newValue = x.newValue;

  //check quantity modification allowed
  var buttonValues = {};
  buttonValues[Localization.resolve("OK")] = "ok";
  var sdoItemMeta = me.getBoOrderMeta().getLoOrderItemMetas().getItemByPKey(mainItem.getSdoItemMetaPKey());

  if (
    (me.getBoOrderMeta().getConsiderQuantitySuggestion() === "PQty" ||
     me.getBoOrderMeta().getComputePrice() === BLConstants.Order.BUTTON_MODE ||
     me.getBoOrderMeta().getComputePrice() === BLConstants.Order.EDIT_MODE) &&
    mainItem.getSuggestedQuantity() !== 0 &&
    mainItem.getMergeEngine_invalidated() === "0"
  ) {
    var modifyPresetQuantityOption = " ";
    if (
      !Utils.isEmptyString(me.getLuDeliveryRecipient().getPKey()) &&
      !Utils.isEmptyString(
        me.getLuDeliveryRecipient().getSdoModifyPresetQuantity()
      )
    ) {
      modifyPresetQuantityOption = me.getLuDeliveryRecipient().getSdoModifyPresetQuantity();
    } else if (Utils.isDefined(sdoItemMeta)) {
      modifyPresetQuantityOption = sdoItemMeta.getModifyPresetQuantity();
    }

    if (
      (modifyPresetQuantityOption === "ODec" &&
       newValue > mainItem.getSuggestedQuantity()) ||
      (modifyPresetQuantityOption === "OInc" &&
       newValue < mainItem.getSuggestedQuantity()) ||
      (modifyPresetQuantityOption === "No" &&
       newValue != mainItem.getSuggestedQuantity())
    ) {
      qtyPromise = MessageBox.displayMessage(
        Localization.resolve("MessageBox_Title_Warning"),
        Localization.resolve("QtyEditNotAllowed"),
        buttonValues
      )
        .then(function () {
        newValue = mainItem.getSuggestedQuantity();
        return me.roundOrderItemQuantity(mainItem);
      })
        .then(function () {
        return me.getLoItems().createDisplayInformationForItem(
          orderUnitItem,
          me.getBoOrderMeta()
        );
      });
    } else {
      qtyPromise = when.resolve();
    }
  } else {
    //Quantity rounding logic
    qtyPromise = me.roundOrderItemQuantity(mainItem).then(function () {
      return me.getLoItems().createDisplayInformationForItem(orderUnitItem, me.getBoOrderMeta());
    });
  }
  return qtyPromise;
};

var groupingHandler = function (x) {
  me.determineItemSplittingGroups(x.mainItem);
};

var pricingUpdateHandler = function (x) {
  var pricingPromise = when.resolve();
  var promise = when.resolve();
  mainItem = x.mainItem;
  var isFreeItem =
      mainItem.sdoItemMetaPKey ===
      me.boOrderMeta.luOrderMetaForFreeItems.sdoItemMetaPKey;

  if (!isFreeItem) {
    promise = me.resetFreeItems(mainItem);
  }
  promise = promise.then(function () {
    if (
      Utils.isDefined(CP) &&
      (me.getBoOrderMeta().getComputePrice() === BLConstants.Order.BUTTON_MODE ||
       me.getBoOrderMeta().getComputePrice() === BLConstants.Order.EDIT_MODE)
    ) {
      var isNewItem = !CP.PricingHandler.getInstance().hasOrderItem(
        mainItem.getPKey()
      );
      var pricingInfo = me.createPricingInformationForItem(mainItem);

      pricingPromise = CP.PricingHandler.getInstance()
        .updateProduct(pricingInfo, x.modifiedAttribute)
        .then(function () {
        if (isNewItem) {
          CP.PricingHandler.getInstance().setVariantItemAttributes(
            mainItem.getPKey(),
            me.cpGetVariantItemVariables(mainItem.getPKey())
          );
        }
      });
    } else {
      pricingPromise = me.calculateItemValue(mainItem);
    }
    return pricingPromise;
  });
  return promise;
};

var resetCalculationHandler = function () {
  var resetCalculationPromise = when.resolve();

  if (me.getCalculationStatus() !== BLConstants.Order.CALCULATION_REQUIRED) {
    me.setCalculationStatus(BLConstants.Order.CALCULATION_REQUIRED);
    resetCalculationPromise =  me.resetCalculationResult();
  }
  return resetCalculationPromise;
};

var pricingCalculateHandler = function () {
  var pricingPromise = when.resolve();

  if (
    Utils.isDefined(CP) &&
    (me.getBoOrderMeta().getComputePrice() === BLConstants.Order.BUTTON_MODE ||
     me.getBoOrderMeta().getComputePrice() === BLConstants.Order.EDIT_MODE)
  ) {
    if (
      me.getBoOrderMeta().getComputePrice() === BLConstants.Order.EDIT_MODE &&
      me.getDocTaType() !== "NonValuatedDeliveryNote"
    ) {
      pricingPromise = me.cpCalculate();
    }
  } else {
    pricingPromise = me.calculateOrderValue().then(function(){
      me.setCalculationStatus("1");
    });
  }
  return pricingPromise;
};

var modReasonHandler = function (x) {
  var sdoItemMeta = me.getBoOrderMeta().getLoOrderItemMetas().getItemByPKey(mainItem.getSdoItemMetaPKey());
  return me.reasonCodeItemValidation(x.mainItem, sdoItemMeta, "1");
};

/****************** Quantity Changed Handling ********************/
var qtyChangedDeferreds = quantityProcessTriggers.map(qtyChangedHandler);

var promise = when
.all(qtyChangedDeferreds)
.then(function () {
  /****************** Grouping Handling ********************/
  groupingProcessTriggers.forEach(groupingHandler);

  /****************** Pricing Handling ********************/
  if (calculationProcessTriggers.length !== 0) {
    return resetCalculationHandler();
  }
}).then(function () {
  var pricingUpdateDeferreds = calculationProcessTriggers.map(
    pricingUpdateHandler
  );

  return when.all(pricingUpdateDeferreds);
})
.then(function () {
  if (calculationProcessTriggers.length !== 0) {
    return pricingCalculateHandler();
  }
})
.then(function () {
  /****************** ModReason Handling ********************/
  var reasonCodeDeferreds = reasonCodeProcessTriggers.map(modReasonHandler);

  return when.all(reasonCodeDeferreds);
})
.then(function () {

  me.getLoItems().resumeListRefresh(true);

  var filterId = me.getBoItemTabManager().getCurrentItemFilterId();
  var categoryId = me.getBoItemTabManager().getCurrentFilterId();
  me.getLoItems().setItemFilter(
    filterId,
    categoryId,
    me.getSelectedPromotionPKey()
  );
  me.setItemFilterCounts();
});
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}