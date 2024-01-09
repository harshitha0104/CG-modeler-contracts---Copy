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
 * @function onTruckLoadItemChanged
 * @this BoTruckLoad
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {Object} handlerParams
 * @returns promise
 */
function onTruckLoadItemChanged(handlerParams){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var mainItem;
var currentEvent;
var sdoItemMeta;
var isUpdateRequired = false;
var promise;
//variables for checking what processes need to be done
var calculationProcessTriggers = [];
var groupingProcessTriggers = [];
var reasonCodeProcessTriggers = [];
var quantityProcessTriggers = [];
var modReasonTriggerObj;
var groupingTriggerObj;
var pricingTriggerObject;
var quantityChangedTriggerObj;

currentEvent = handlerParams;

//setting up the environment
mainItem = currentEvent.listItem;
var orderUnitItem = me.getLoItems().getFirstOrderUnitItemForMainItem(mainItem);

//processing all the changed attributes of the event
for (var i = 0; i < currentEvent.modified.length; i++) {
  //reacting on the different attributes
  switch (currentEvent.modified[i]) {
      /******************************************************* Quantity ***********************************************************/
    case "quantity":
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

      pricingTriggerObject = {
        mainItem: mainItem,
        orderUnitItem: orderUnitItem,
        modifiedAttribute: currentEvent.modified[i]
      };
      calculationProcessTriggers.push(pricingTriggerObject);
      isUpdateRequired = true;

      break;

      /******************************************************* ModReason ***********************************************************/
    case "modReason":
      modReasonTriggerObj = {
        mainItem: mainItem,
        orderUnitItem: orderUnitItem
      };
      reasonCodeProcessTriggers.push(modReasonTriggerObj);
      isUpdateRequired = true;

      break;

      /******************************************************* Discount ***********************************************************/
    case "discount":
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

      /******************************************************* Special Price ***********************************************************/
    case "specialPriceReceipt":
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
}

/***************************************************************************************************************/
/*                       Handling the different processes that are needed                                      */
/***************************************************************************************************************/
//Skipped for other events like display information changes.
if(isUpdateRequired === true) {
  //defining the handler functions
  var qtyChangedDeferreds = [];
  var qtyChangedHandler = function (x) {
    var mainItem = x.mainItem;
    var orderUnitItem = x.orderUnitItem;
    var oldValue = x.oldValue;
    var newValue = x.newValue;

    //check quantity modification allowed
    var buttonValues = {};
    buttonValues[Localization.resolve("OK")] = "ok";
    var sdoItemMeta = me.getBoOrderMeta().getLoOrderItemMetas().getItemByPKey(mainItem.getSdoItemMetaPKey());

    if (mainItem.getEdited() == "1" && Utils.isDefined(sdoItemMeta)) {
      var modifyPresetQuantityOption = sdoItemMeta.getModifyPresetQuantity();

      if ((modifyPresetQuantityOption === "ODec" && newValue > mainItem.getSuggestedQuantity()) || (modifyPresetQuantityOption === "OInc" && newValue < mainItem.getSuggestedQuantity()) || (modifyPresetQuantityOption === "No" && newValue != mainItem.getSuggestedQuantity())) {

        qtyChangedDeferreds.push(Framework.displayMessage(Localization.resolve("MessageBox_Title_Warning"), Localization.resolve("QtyEditNotAllowed"), buttonValues).then(
          function () {
            if(modifyPresetQuantityOption === "No") {
              newValue = oldValue;
              me.getLoItems().suspendListRefresh();
              mainItem.setQuantity(newValue);
              me.getLoItems().resumeListRefresh(true);
            }
            else {
              newValue = mainItem.getTargetQuantity();
              mainItem.setQuantity(newValue);
            }
            mainItem.setQtyDifference(mainItem.getQuantity() - mainItem.getTargetQuantity());
            mainItem.setEdited("1");
            me.createDisplayInformationForListItem(orderUnitItem, me.getBoOrderMeta());
            if (me.getBoOrderMeta().getConsiderQuantitySuggestion() !== "No" || me.getBoOrderMeta().getItemPresettingPolicy() === "Prepopulated" || me.getBoOrderMeta().getSdoSubType() === "TruckIvcTransferOutward") {
              mainItem.setDifferenceInfo(Localization.resolve("DifferenceId") + "  " + mainItem.getQtyDifference());
            }
          }
        ));
      }
    }

    mainItem.setQuantity(newValue);
    mainItem.setQtyDifference(mainItem.getQuantity() - mainItem.getTargetQuantity());
    mainItem.setEdited("1");

    me.createDisplayInformationForListItem(orderUnitItem, me.getBoOrderMeta());

    if (me.getBoOrderMeta().getConsiderQuantitySuggestion() !== "No" || me.getBoOrderMeta().getItemPresettingPolicy() === "Prepopulated" || me.getBoOrderMeta().getSdoSubType() === "TruckIvcTransferOutward") {
      mainItem.setDifferenceInfo(Localization.resolve("DifferenceId") + "  " + mainItem.getQtyDifference());
    }
  };

  var pricingUpdateDeferreds = [];

  var pricingUpdateHandler = function (x) {
    var mainItem = x.mainItem;

    if (Utils.isDefined(CP) && Utils.isDefined(me.getPricingReady()) && me.getPricingReady() == "1" && (me.getBoOrderMeta().getComputePrice() === "4" || me.getBoOrderMeta().getComputePrice() === "5") && !Utils.isEmptyString(me.getBoOrderMeta().getCndCpCalculationSchemaPKey())) // ToDo: fix ComplexPricing
    {
      pricingUpdateDeferreds.push(CP.PricingHandler.getInstance().updateProduct(mainItem, x.modifiedAttribute));
    }
  };

  var resetCalculationHandler = function () {
    if (me.getCalculationStatus() !== "3") {
      me.setCalculationStatus("3");
      me.resetCalculationResult();
    }
  };

  var pricingCalculateHandler = function () {
    promise = when.resolve();
    if (Utils.isDefined(CP) && Utils.isDefined(me.getPricingReady()) && me.getPricingReady() == "1" && (me.getBoOrderMeta().getComputePrice() === "4" || me.getBoOrderMeta().getComputePrice() === "5") && !Utils.isEmptyString(me.getBoOrderMeta().getCndCpCalculationSchemaPKey())) {
      promise = me.cpCalculate();
    }
    return promise;
  };

  var modReasonHandler = function (x) {
    var sdoItemMeta = me.getBoOrderMeta().getLoOrderItemMetas().getItemByPKey(mainItem.getSdoItemMetaPKey());
    me.reasonCodeItemValidation(x.mainItem, sdoItemMeta, "1");
  };

  /****************** Quantity Changed Handling ********************/
  quantityProcessTriggers.forEach(qtyChangedHandler);

  promise = when.all(qtyChangedDeferreds).then(
    function () {
      /****************** Pricing Handling ********************/
      if (calculationProcessTriggers.length !== 0) {
        resetCalculationHandler();
      }
      calculationProcessTriggers.forEach(pricingUpdateHandler);

      return when.all(pricingUpdateDeferreds).then(
        function () {
          if (calculationProcessTriggers.length !== 0) {
            return pricingCalculateHandler();
          }
        }).then(
        function () {
          /****************** ModReason Handling ********************/
          reasonCodeProcessTriggers.forEach(modReasonHandler);

          me.getLoItems().resumeListRefresh(true);

        }
      );
    }
  );
}
else {
  return when.resolve();
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}