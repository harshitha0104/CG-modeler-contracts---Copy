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
 * @function setCurrentItem
 * @this BoTruckLoad
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {String} itemPKey
 * @param {DomPKey} itemPKeys
 * @param {Object} startIndex
 * @returns promise
 */
function setCurrentItem(itemPKey, itemPKeys, startIndex){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise;
var logisticUnitParams = [];
var logisticUnitQuery = {};
var modReasonParams = [];
var modReasonQuery = {};
var allItems = me.getLoItems();
var orderItem = allItems.getItemByPKey(itemPKey);

if (Utils.isDefined(orderItem)) {
  logisticUnitParams.push(
    {
      "field": "ProductPKey",
      "value": orderItem.getPrdMainPKey()
    }
  );

  var itemMeta = me.getBoOrderMeta().getLoOrderItemMetas().getItemByPKey(orderItem.getSdoItemMetaPKey());

  if (Utils.isDefined(itemMeta)) {
    logisticUnitParams.push(
      {
        "field": "LogisticCategory",
        "value": itemMeta.getLogisticCategory()
      }
    );
    orderItem.set("sdoItemMetaText", itemMeta.getText());
  }

  var unitOfMeasuresList = me.getLoUnitOfMeasure();

  unitOfMeasuresList.removeAllItems();
  if (Utils.isDefined(itemPKeys) && Utils.isDefined(startIndex)) {
    unitOfMeasuresList.addWeakReferencedItems(allItems.getRange(startIndex, itemPKeys.length));
  }

  var orderUnitItems = unitOfMeasuresList.getOrderUnitItems();
  unitOfMeasuresList.setCurrent(orderUnitItems.length > 0 ? orderUnitItems[0] : unitOfMeasuresList.getFirstItem(), true);

  logisticUnitQuery.params = logisticUnitParams;

  promise = BoFactory.loadObjectByParamsAsync("LoLogisticUnit", logisticUnitQuery).then(
    function (loLogisticUnit) {
      var subItems;
      var items = loLogisticUnit.getAllItems();
      
      subItems = new Array(items.length);
      for (var i = 0; i < items.length; i++) {
        subItems[i] = items[i].getUnitType();
      }

      orderItem.setAvailableUOMs(Utils.getToggleListObject("PrdLogisticUnit", subItems));

      me.getLoItems().setCurrent(orderItem);

      var loModReasonPromise = [];
      if (!me.getLoModReasonCache().containsKey(orderItem.getSdoItemMetaPKey())) {
        loModReasonPromise = BoFactory.loadObjectByParamsAsync("LoModReason", me.getQueryBy("sdoItemMetaPKey", orderItem.getSdoItemMetaPKey()));
      }
      else {
        loModReasonPromise = when.resolve();
      }

      return loModReasonPromise.then(
        function (loModReason) {
          if (me.getLoModReasonCache().containsKey(orderItem.getSdoItemMetaPKey())) {
            loModReason = me.getLoModReasonCache().get(orderItem.getSdoItemMetaPKey());
          }
          else {
            loModReason = loModReason.getAllItems();
            me.getLoModReasonCache().add(orderItem.getSdoItemMetaPKey(), loModReason);
          }

          var subItems;
          var items = loModReason;

          subItems = new Array(items.length);
          if (items.length > 0) {
            for (var i = 0; i < items.length; i++) {
              subItems[i] = items[i].getModReason();
            }
          }

          subItems.push(" ");
          orderItem.setAvailableModReasons(Utils.getToggleListObject("SdoModReason", subItems));
          me.getLoItems().setCurrentByPKey(itemPKey);
        }
      );
    }
  );

  orderItem.setQtyDifference(orderItem.getQuantity() - orderItem.getTargetQuantity());

  if (!me.isEditable() && me.getBoOrderMeta().getSdoSubType() != "TruckIvcTransferInward") {
    orderItem.setObjectStatus(STATE.PERSISTED);
    me.setObjectStatus(STATE.PERSISTED);
  }
}
else {
  me.getLoItems().setCurrentByPKey(itemPKey);
  if (!me.isEditable() && me.getBoOrderMeta().getSdoSubType() != "TruckIvcTransferInward") {
    me.setObjectStatus(STATE.PERSISTED);
  }
  promise = when.resolve();
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}