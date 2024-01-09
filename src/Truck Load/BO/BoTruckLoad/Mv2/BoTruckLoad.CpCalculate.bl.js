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
 * @function cpCalculate
 * @this BoTruckLoad
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {Object} initial
 * @returns promise
 */
function cpCalculate(initial){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
if (initial) {
  //for initial calculation:
  // update the items with target qty and calculate for initial calculation to set Book Inventory
  for (var i = 0; i < me.getLoItems().getAllItems().length; i++) {
    var orderItem = me.getLoItems().getAllItems()[i];

    if (Utils.isDefined(orderItem) && CP.PricingHandler.getInstance().hasOrderItem(orderItem.getPKey())) {
      CP.PricingHandler.getInstance().updateProduct(orderItem, "Quantity");
    }
  }
}

var promise = CP.PricingHandler.getInstance().calculateOrderValue().then(
  function (result) {
    if (result.CSTAT === true && Utils.isDefined(me.getLoItems())) {

      me.setCalculationStatus("1");
      me.setPricingJSON(result.Debug);
      me.getLoItems().suspendListRefresh();
      if (Utils.isDefined(result.SdoConditions)) {
        me.setSdoConditionsJson(JSON.stringify(result.SdoConditions));
      }

      if (initial) {
        if (!isNaN(result.GrossTotalValueReceipt)) {
          me.setBookInventoryValue(result.GrossTotalValueReceipt);
        }
      } else {
        if (!isNaN(result.GrossTotalValueReceipt)) {
          me.setGrossTotalValueReceipt(result.GrossTotalValueReceipt);
          me.setAmountDifference(result.GrossTotalValueReceipt - me.getBookInventoryValue());
        }
      }

      var length = result.Items.length;

      for (var i = 0; i < length; i++) {
        var resultPkey = result.Items[i].PKey;
        var orderItem = me.getLoItems().getItemByPKey(resultPkey);

        if (Utils.isDefined(orderItem)) {
          var mainItem = me.getLoItems().getFirstOrderUnitItemForMainItem(orderItem);

          orderItem.beginEdit();

          if (!isNaN(result.Items[i].Value)) {
            orderItem.setValue(result.Items[i].Value);
          }

          if (initial) {
            if (!isNaN(result.Items[i].Value)) {
              orderItem.setTargetValue(result.Items[i].Value);
            }

            if (orderItem.getQuantity() !== orderItem.getTargetQuantity() && CP.PricingHandler.getInstance().hasOrderItem(orderItem.getPKey())) {
              //set qty back to original        
              CP.PricingHandler.getInstance().updateProduct(mainItem, "Quantity");
            }
          }

          if (!isNaN(result.Items[i].Value)) {
            orderItem.setValueDifference(result.Items[i].Value - orderItem.getTargetValue());
          }

          orderItem.endEdit();
        }
      }

      if (initial) {
        return CP.PricingHandler.getInstance().calculateOrderValue().then(
          function (result) {
            if (result.CSTAT === true) {
              me.setPricingJSON(result.Debug);
              if (Utils.isDefined(result.SdoConditions)) {
                me.setSdoConditionsJson(JSON.stringify(result.SdoConditions));
              }
              if (!isNaN(result.GrossTotalValueReceipt)) {
                me.setGrossTotalValueReceipt(result.GrossTotalValueReceipt);
                me.setAmountDifference(result.GrossTotalValueReceipt - me.getBookInventoryValue());
              }

              var length = result.Items.length;
              var targetQtyItems = [];

              for (var i = 0; i < length; i++) {
                var resultPkey = result.Items[i].PKey;

                var orderItem = me.getLoItems().getItemByPKey(resultPkey);

                if (Utils.isDefined(orderItem)) {
                  orderItem.beginEdit();
                  if (!isNaN(result.Items[i].Value)) {
                    orderItem.setValue(result.Items[i].Value);
                    orderItem.setValueDifference(result.Items[i].Value - orderItem.getTargetValue());
                  }
                  orderItem.endEdit();
                }
              }
            }

            return me.cpCreateSdoConditionRecords(false).then(
              function () {
                if (Utils.isDefined(me.getLoItems())) {
                  me.getLoItems().resumeListRefresh(true);
                }
              }
            );
          }
        );
      } else {
        //In CGCloud we create pricing info JSON on cpCalculate and Sdo Conditions are built in preparePrint method now. Thus this method is not ready to use when truckload is enabled in CGCloud.
        //For a consistent JSON structure as in Order this method needs an update.
        return me.cpCreateSdoConditionRecords(false).then(
          function () {
            if (Utils.isDefined(me.getLoItems())) {
              me.getLoItems().resumeListRefresh(true);
            }
          }
        );
      }
    } else {
      if (Utils.isDefined(me.getLoItems())) {
        me.getLoItems().resumeListRefresh(true);
      }
    }
  }
);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}