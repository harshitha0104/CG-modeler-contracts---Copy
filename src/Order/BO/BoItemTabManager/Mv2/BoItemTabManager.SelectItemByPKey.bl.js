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
 * @function selectItemByPKey
 * @this BoItemTabManager
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} pKey
 * @param {DomPKey} itemPKeys
 * @param {Object} startIndex
 * @param {DomPKey} refPKey
 * @param {DomString} considerQtySuggestion
 * @returns promise
 */
function selectItemByPKey(pKey, itemPKeys, startIndex, refPKey, considerQtySuggestion){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise;
var acl = me.getACL();
var curItem;
var allItems = me.getBoOrder().getLoItems();
var unitOfMeasuresList = me.getLoUnitOfMeasure();

unitOfMeasuresList.removeAllItems();
unitOfMeasuresList.addWeakReferencedItems(allItems.getRange(startIndex,itemPKeys.length));

var orderUnitItems = unitOfMeasuresList.getOrderUnitItems();
if (Utils.isDefined(allItems) && Utils.isDefined(allItems.getCurrent())) {
  curItem = allItems.getCurrent();
}
else {
  curItem = orderUnitItems.length > 0 ? orderUnitItems[0] : unitOfMeasuresList.getFirstItem();
}

// Set the current item
me.setCurrentSelectedOrderItem(curItem);

// Set the current nested item in the UoM List to the first one
unitOfMeasuresList.setCurrent(orderUnitItems.length > 0 ? orderUnitItems[0] : unitOfMeasuresList.getFirstItem(), true);

// Determine unit for stock information
if (orderUnitItems.length > 0) {
  me.setStockUnit(orderUnitItems[0].getQuantityLogisticUnit());    
  me.setStockUnitText(orderUnitItems[0].getQuantityLogisticUnit()); 
}
else {
  if (unitOfMeasuresList.length > 0) {
    me.setStockUnit(unitOfMeasuresList.getFirstItem().getQuantityLogisticUnit());
    me.setStockUnitText(unitOfMeasuresList.getFirstItem().getQuantityLogisticUnit());
  }
}

if(Utils.isDefined(curItem)) {
  //Set Inventory balance of item
  promise = me.getBoOrder().setInventoryBalanceOfItem(curItem.getPKey())
    .then( function () {
    // Load promotion information if necessary
    if (Utils.isDefined(me.getBoOrder()) && Utils.isDefined(allItems) && Utils.isDefined(curItem) && curItem.getPromoted() == "1" && me.getBoOrder().getBoOrderMeta().getConsiderPromotion() == "1") {
      var jsonQuery = {};
      var jsonParams = [];

      jsonParams.push(
        {
          "field" : "customerPKey",
          "value" : me.getBoOrder().getOrdererPKey()
        }
      );
      jsonParams.push(
        {
          "field" : "commitDate",
          "value" : me.getBoOrder().getCommitDate()
        }
      );
      jsonParams.push(
        {
          "field" : "productPKey",
          "value" : curItem.getPrdMainPKey()
        }
      );

      jsonQuery.params = jsonParams;
      return BoFactory.loadObjectByParamsAsync("LoPromotionsForProduct", jsonQuery);
    } 
    else {
      return undefined;
    }
  }).then( function (loPromotionsforProduct) {
    if (!Utils.isDefined(me.getLoPromotionsForCurrentProduct())) {
      return undefined;   
    } 

    // If promotion information has been loaded, assign and set visible. Otherwise set invisible
    if (Utils.isDefined(loPromotionsforProduct)) {

      me.setLoPromotionsForCurrentProduct(loPromotionsforProduct);

      me.getLoPromotionsForCurrentProduct().setVisible("true");
    } 
    else {
      me.getLoPromotionsForCurrentProduct().setVisible("false");
    }
    acl = me.getLoUnitOfMeasure().getACL();
    acl.removeRight(AclObjectType.PROPERTY, "modReason", AclPermission.VISIBLE);

    if (me.getBoOrder().getDocumentType() === "Delivery") {
      if (Utils.isDefined(considerQtySuggestion) && considerQtySuggestion.getId() == "No") {
        acl.removeRight(AclObjectType.PROPERTY, "targetQuantity", AclPermission.VISIBLE);
        BindingUtils.refreshEARights();
      }
    }

    if (Utils.isDefined(curItem)) {
      var sdoItemMeta = me.getBoOrder().getBoOrderMeta().getLoOrderItemMetas().getItemByPKey(curItem.getSdoItemMetaPKey());

      if (Utils.isDefined(sdoItemMeta)) {
        if (Utils.isCasBackend() && me.getBoOrder().getBoOrderMeta().getConsiderItemModReason() == "1" && sdoItemMeta.getModReasonRequired() !== "NotReq") {
          acl.addRight(AclObjectType.PROPERTY, "modReason", AclPermission.VISIBLE);
        }
      }
    }

  }).then(function() {
    if (me.getBoOrder().getBoOrderMeta().getConsiderSelectablePromotion() == '1' && !Utils.isEmptyString(curItem.getPromotionPKey())) {
      return Facade.getObjectAsync("LuSelectablePromotion", {pKey: curItem.getPromotionPKey()});
    }
  }).then(function(selectablePromotion) {
    if (Utils.isDefined(selectablePromotion) && Utils.isDefined(selectablePromotion.PKey) && Utils.isEmptyString(me.getBoOrder().getSelectedPromotionPKey())) {
      me.setSloganOfSelectablePromotion(selectablePromotion.slogan);
      acl = me.getACL();
      acl.addRight(AclObjectType.PROPERTY, "sloganOfSelectablePromotion", AclPermission.VISIBLE);
    }
    else {
      me.setSloganOfSelectablePromotion(" ");
      acl = me.getACL();
      acl.removeRight(AclObjectType.PROPERTY, "sloganOfSelectablePromotion", AclPermission.VISIBLE);
    }
    if (Utils.isDefined(me.getBoOrder().getCallInContext_clbMainPKey()) && !Utils.isEmptyString(me.getBoOrder().getCallInContext_clbMainPKey())) {
      if (Utils.isDefined(me.getBoCallCache())) {
        return me.getBoCallCache();
      } 
      else {
        return Facade.getObjectAsync("BoCall", me.getQueryBy("pKey", me.getBoOrder().getCallInContext_clbMainPKey()));
      }
    } 
    else {
      return undefined;
    }
  }).then( function (boCall) {
    if (Utils.isDefined(boCall)) {
      me.setBoCallCache(boCall);
    }

    if (Utils.isDefined(boCall) && me.getBoOrder().getBoOrderMeta().getSdoSubType() === "Delivery") {
      var bCallIsReadOnly = boCall.clbStatus === "Completed" || boCall.clbStatus === "Canceled";
      if (bCallIsReadOnly) {
        me.getBoOrder().getLoItems().getACL().removeRight(AclObjectType.PROPERTY, "modReason", AclPermission.EDIT);
      }
    }
    BindingUtils.refreshEARights();
    return me.getReasonCodesForItemMeta();
  }).then( function () {
    return me;
  });
} 
else {
  promise = when.resolve(me);
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}