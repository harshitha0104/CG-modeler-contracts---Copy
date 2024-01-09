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
 * @function setEARight
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {String} promotionPKey
 * @returns promise
 */
function setEARight(promotionPKey){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = when.resolve();
var acl = me.getACL();
var uomAcl = me.getBoItemTabManager().getLoUnitOfMeasure().getACL();
var phase = me.getPhase();
var orderItems = me.getLoItems();
var orderItemsACL = orderItems.getACL();

if(me.getDocumentType() === "Replenishment") {
  me.getLuDeliveryRecipient().getACL().removeRight(AclObjectType.PROPERTY, "name", AclPermission.EDIT);
}

/* ################################################################################################################
     ###  Remove EA Rights on Order Item LO Level                                                                 ###
     ###  Note:  If EA rights are edited on LO Level and on LI Level then the lower Level (LI) wins.              ###
     ###         Means if you hide a field on LO Level and do some other changes like setting the                 ###
     ###         record read only on LI Level the LI wins and the hidden field on LO level is visible again.      ###
     ###         --> This can be prevented by setting the fields "final"                                          ###
     ################################################################################################################ */
if(me.getBoOrderMeta().getDisplayIvcBalance() === "0") {
  orderItemsACL.removeRight(AclObjectType.PROPERTY, "ivcBalance", AclPermission.VISIBLE);
  orderItemsACL.setFinal(AclObjectType.PROPERTY, "ivcBalance", true);
  me.getBoItemTabManager().getACL().removeRight(AclObjectType.PROPERTY, "stockUnitText", AclPermission.VISIBLE);
}

if(me.getBoOrderMeta().getConsiderListing() == "0") {
  orderItemsACL.removeRight(AclObjectType.PROPERTY, "focusProductType", AclPermission.VISIBLE);
  orderItemsACL.setFinal(AclObjectType.PROPERTY, "focusProductType", true);
  orderItemsACL.removeRight(AclObjectType.PROPERTY, "customerProductNumber", AclPermission.VISIBLE);
  orderItemsACL.setFinal(AclObjectType.PROPERTY, "customerProductNumber", true);
}

me.getBoItemTabManager().getACL().addRight(AclObjectType.PROPERTY, "loUnitOfMeasure", AclPermission.EDIT);

/* ##################################################################################################
     ###  All UC: BO is readonly, if the order has phase closed, released or workcompleted.         ###
     ###  NGM Order - Execute an Order: If the respective order template is not Mobility Relevant,  ###
     ###                                the user can not edit any order data. Only display.         ###
     ################################################################################################## */

if ((phase === BLConstants.Order.PHASE_CLOSED) || (phase === BLConstants.Order.PHASE_CANCELED) || (phase === BLConstants.Order.PHASE_READY) || (phase === BLConstants.Order.PHASE_FEEDBACK) || (phase === BLConstants.Order.PHASE_VOIDED) ||
    (me.getBoOrderMeta().getMobilityRelevant() == "0") || (me.getResponsiblePKey() != ApplicationContext.get('user').getPKey()) ||
    (me.getBoOrderMeta().getSdoSubType() === "Delivery" && me.getCallInContext_clbMainPKey() != me.getClbMainPKey()) ||
    (Utils.isDefined(ApplicationContext.get('currentTourPKey')) && !Utils.isEmptyString(ApplicationContext.get('currentTourPKey')) && ApplicationContext.get('currentTourStatus') !== "Running")) {
  acl.removeRight(AclObjectType.OBJECT, "BoOrder", AclPermission.EDIT);
  acl.removeRight(AclObjectType.PROPERTY, "paymentReason", AclPermission.VISIBLE);
  acl.addRight(AclObjectType.PROPERTY, "cancelReason", AclPermission.VISIBLE);

  me.getLuBrokerCustomer().getACL().removeRight(AclObjectType.OBJECT, "luBrokerCustomer", AclPermission.EDIT);
  me.getLuDeliveryRecipient().getACL().removeRight(AclObjectType.OBJECT, "luDeliveryRecipient", AclPermission.EDIT);
  uomAcl.removeRight(AclObjectType.PROPERTY, "modReason", AclPermission.EDIT);
  uomAcl.removeRight(AclObjectType.PROPERTY, "quantity", AclPermission.EDIT);
  uomAcl.removeRight(AclObjectType.PROPERTY, "discount", AclPermission.EDIT);
  uomAcl.removeRight(AclObjectType.PROPERTY, "specialPriceReceipt", AclPermission.EDIT);
}
else {
  acl.removeRight(AclObjectType.PROPERTY, "cancelReason", AclPermission.VISIBLE);
  if(me.getDocumentType() === "OrderEntry" || me.getDocumentType() === "Invoice"){
    acl.removeRight(AclObjectType.PROPERTY, "paymentReason", AclPermission.VISIBLE);
  }
  else {
    acl.addRight(AclObjectType.PROPERTY, "paymentReason", AclPermission.VISIBLE);
  }
}

if(phase === BLConstants.Order.PHASE_RELEASED || me.getSyncStatus() === BLConstants.Order.NOT_SYNCABLE) {
  acl.removeRight(AclObjectType.OBJECT, "BoOrder", AclPermission.EDIT);
  acl.removeRight(AclObjectType.PROPERTY, "paymentReason", AclPermission.EDIT);
  me.getLuBrokerCustomer().getACL().removeRight(AclObjectType.OBJECT, "luBrokerCustomer", AclPermission.EDIT);
  me.getLuDeliveryRecipient().getACL().removeRight(AclObjectType.OBJECT, "luDeliveryRecipient", AclPermission.EDIT);
  uomAcl.removeRight(AclObjectType.PROPERTY, "modReason", AclPermission.EDIT);
  uomAcl.removeRight(AclObjectType.PROPERTY, "quantity", AclPermission.EDIT);
  uomAcl.removeRight(AclObjectType.PROPERTY, "discount", AclPermission.EDIT);
  uomAcl.removeRight(AclObjectType.PROPERTY, "specialPriceReceipt", AclPermission.EDIT);
}

if(Utils.isEmptyString(me.getAsn())) {
  acl.removeRight(AclObjectType.PROPERTY, "asn", AclPermission.VISIBLE);
}

me.getLoSplittingGroups().setVisible(me.isGroupingEnabled());

if (Utils.isDefined(me.getBoOrderMeta())) {
  if (me.getBoOrderMeta().getHideBroker() == 1) {
    acl.removeRight(AclObjectType.PROPERTY, "BrokerCustomerPKey", AclPermission.VISIBLE);
    me.getLuBrokerCustomer().getACL().removeRight(AclObjectType.OBJECT, "luBrokerCustomer", AclPermission.VISIBLE);
  }

  if(me.getBoOrderMeta().getSdoSubType() != "Delivery") {
    acl.removeRight(AclObjectType.PROPERTY, "asn", AclPermission.VISIBLE);
    acl.removeRight(AclObjectType.PROPERTY, "invoiceId", AclPermission.VISIBLE);
    acl.removeRight(AclObjectType.PROPERTY, "message", AclPermission.VISIBLE);
    acl.removeRight(AclObjectType.PROPERTY, "documentType", AclPermission.VISIBLE);
    acl.removeRight(AclObjectType.PROPERTY, "totalShippedQuantity", AclPermission.VISIBLE);
    acl.removeRight(AclObjectType.PROPERTY, "totalReturnedQuantity", AclPermission.VISIBLE);
    acl.removeRight(AclObjectType.PROPERTY, "docTaType", AclPermission.VISIBLE);
  }
  else {
    acl.removeRight(AclObjectType.PROPERTY, "deliveryDate", AclPermission.EDIT);
    acl.removeRight(AclObjectType.PROPERTY, "deliveryRecipientPKey", AclPermission.EDIT);
    acl.removeRight(AclObjectType.PROPERTY, "headerDiscount", AclPermission.EDIT);
    me.getLuDeliveryRecipient().getACL().removeRight(AclObjectType.OBJECT, "luDeliveryRecipient", AclPermission.EDIT);
  }

  if(me.getIsOrderPaymentRelevant() === '0') {
    acl.removeRight(AclObjectType.PROPERTY, "paidAmount", AclPermission.VISIBLE);
    acl.removeRight(AclObjectType.PROPERTY, "paidAmountReceipt", AclPermission.VISIBLE);
    acl.removeRight(AclObjectType.PROPERTY, "absolutePaidAmount", AclPermission.VISIBLE);
    acl.removeRight(AclObjectType.PROPERTY, "paymentMethod", AclPermission.VISIBLE);
    acl.removeRight(AclObjectType.PROPERTY, "paidAmountCurrency", AclPermission.VISIBLE);
    acl.removeRight(AclObjectType.PROPERTY, "isPaymentCollected", AclPermission.VISIBLE);
  }
  else {
    if(me.getDocTaType() === "CashOrder" || me.getDocTaType() === "InvoiceCashInvoice") {
      acl.removeRight(AclObjectType.PROPERTY, "paidAmount", AclPermission.EDIT);
      acl.removeRight(AclObjectType.PROPERTY, "paidAmountReceipt", AclPermission.EDIT);
      acl.removeRight(AclObjectType.PROPERTY, "absolutePaidAmount", AclPermission.EDIT);
      acl.removeRight(AclObjectType.PROPERTY, "paymentMethod", AclPermission.EDIT);
    }
    if(me.getPaidAmountReceipt() === 0){
      acl.removeRight(AclObjectType.PROPERTY, "isPaymentCollected", AclPermission.EDIT);
    } else{
      acl.addRight(AclObjectType.PROPERTY, "isPaymentCollected", AclPermission.EDIT);
    }
    if(me.getGrossTotalValueReceipt() <= 0){
      acl.removeRight(AclObjectType.PROPERTY, "paidAmountReceipt", AclPermission.EDIT);
      acl.removeRight(AclObjectType.PROPERTY, "paymentMethod", AclPermission.EDIT);
    } else{
      acl.addRight(AclObjectType.PROPERTY, "paidAmountReceipt", AclPermission.EDIT);
      acl.addRight(AclObjectType.PROPERTY, "paymentMethod", AclPermission.EDIT);
    }

    var isValidUser = me.getResponsiblePKey() ===  ApplicationContext.get('user').getPKey();
    var isValidPhase = phase === BLConstants.Order.PHASE_INITIAL;
    if (!isValidUser || !isValidPhase){
      acl.removeRight(AclObjectType.PROPERTY, "isPaymentCollected", AclPermission.VISIBLE);
      acl.removeRight(AclObjectType.PROPERTY, "paymentMethod", AclPermission.EDIT);
      acl.removeRight(AclObjectType.PROPERTY, "paidAmountReceipt", AclPermission.EDIT);
    }
  }
}

if(me.getBoOrderMeta().getConsiderListing() == "0") {
  orderItemsACL.removeRight(AclObjectType.PROPERTY, "focusProductType", AclPermission.VISIBLE);
  orderItemsACL.removeRight(AclObjectType.PROPERTY, "customerProductNumber", AclPermission.VISIBLE);
}

// Hide quantity suggestion info when order is released or canceled
var displayQtySuggestionInfo = (((((me.getBoOrderMeta().getConsiderQuantitySuggestion() === "LQty" &&  me.getBoOrderMeta().getLoOrderItemMetas().getMainItemTemplate().getQuantitySuggestionPolicy() === "OrderedQuantity") || me.getBoOrderMeta().getConsiderQuantitySuggestion() === "UserExit") &&
                                  (!Utils.isDefined(me.getSelectedPromotionPKey()) || Utils.isEmptyString(me.getSelectedPromotionPKey()))) || (!Utils.isEmptyString(me.getSelectedPromotionPKey()) && me.getLoSelectablePromotion().getCurrent().getSpecialPromoted() === '1')) && phase === BLConstants.Order.PHASE_INITIAL);

if(!displayQtySuggestionInfo || (phase === BLConstants.Order.PHASE_RELEASED || phase === BLConstants.Order.PHASE_READY || me.getSyncStatus() === BLConstants.Order.NOT_SYNCABLE)) {
  orderItems.getItems().forEach(function(orderItem) {
    orderItem.specialPromotionIcon = " ";
    orderItem.oQtyString = " ";
    orderItem.specialQuantity = " ";
  });
}

// Handle the editability of DeliveryDate in the header tab
if (Utils.isDefined(me.getBoOrderMeta())) {
  if (me.getBoOrderMeta().getEditDeliveryDate() === 0) {
    acl.removeRight(AclObjectType.PROPERTY, "deliveryDate", AclPermission.EDIT);
  }
}

/* ##################################################################################
     ###  UC  NGM Order - Add Item to Item List Automatically:                      ###
     ###      The system determines invalid and not editable items.                 ###
     ###      -> Blocked items are displayed, but not editable.                     ###
     ###        (LiOrderItemMeta.considerDeliveryState, LiOrderItem.deliveryState)  ###
     ################################################################################## */
orderItems.getEAReadOnly(me.getBoOrderMeta().getLoOrderItemMetas(), undefined, me.getBoOrderMeta());

// Remove edit permision from FreeItems which come from Reward.
var itemsFromRewardToSetReadOnly = orderItems.getItems();
var aclRewardFreeItem;
itemsFromRewardToSetReadOnly.forEach(function(itemFromRewardToSetReadOnly) {
  if(itemFromRewardToSetReadOnly.getCalculationGroup() === "FreeItem" && itemFromRewardToSetReadOnly.getParentType() === "Reward"){
    aclRewardFreeItem = itemFromRewardToSetReadOnly.getACL();
    aclRewardFreeItem.removeRight(AclObjectType.PROPERTY, "modReason", AclPermission.VISIBLE);
    aclRewardFreeItem.removeRight(AclObjectType.OBJECT, "LiOrderItem", AclPermission.EDIT);
  }
});

//Handle Visibility of Selectable Promotion Section on change of filter
if (Utils.isDefined(promotionPKey) && me.getBoOrderMeta().getConsiderSelectablePromotion() == '1' && !Utils.isEmptyString(promotionPKey)) {
  var currentlySelectedPromotion = me.getLoSelectablePromotion().getItemByPKey(promotionPKey);
  var aclItemManager;
  if (Utils.isDefined(currentlySelectedPromotion) && Utils.isDefined(currentlySelectedPromotion.pKey) && Utils.isEmptyString(me.getSelectedPromotionPKey())) {
    me.boItemTabManager.setSloganOfSelectablePromotion(currentlySelectedPromotion.promotionSlogan);
    aclItemManager = me.boItemTabManager.getACL();
    aclItemManager.addRight(AclObjectType.PROPERTY, "sloganOfSelectablePromotion", AclPermission.VISIBLE);
  }
  else {
    me.boItemTabManager.setSloganOfSelectablePromotion(" ");
    aclItemManager = me.boItemTabManager.getACL();
    aclItemManager.removeRight(AclObjectType.PROPERTY, "sloganOfSelectablePromotion", AclPermission.VISIBLE);
  }
}

//Disable quantity stepper for special orders based on Modify Quantity flag
if(Utils.isDefined(me.getLoSelectablePromotion()) && Utils.isDefined(me.getLoSelectablePromotion().getCurrent()) && me.getLoSelectablePromotion().getCurrent().getSpecialPromoted() == "1") {
  var itemMetaPkey = me.getBoOrderMeta().getLoOrderItemMetas().getMainItemTemplate().getPKey();
  var sdoItemMeta = me.getBoOrderMeta().getLoOrderItemMetas().getItemByPKey(itemMetaPkey);
  var modifyPresetQuantityOption = " ";

  if (!Utils.isEmptyString(me.getLuDeliveryRecipient().getPKey()) && !Utils.isEmptyString(me.getLuDeliveryRecipient().getSdoModifyPresetQuantity())) {
    modifyPresetQuantityOption= me.getLuDeliveryRecipient().getSdoModifyPresetQuantity();
  }
  else if (Utils.isDefined(sdoItemMeta)) {
    modifyPresetQuantityOption= sdoItemMeta.getModifyPresetQuantity();
  }
  if(modifyPresetQuantityOption === "OInc" || modifyPresetQuantityOption === "No") {
    var prmPKey = me.getLoSelectablePromotion().getCurrent().getPKey();
    var itemsWithQuantity = orderItems.getItemsByParamArray([{"promotionPKey": me.getLoSelectablePromotion().getCurrent().getPKey(), "op":"EQ"},{"quantity": "0", "op":"GT"}]);
    if (itemsWithQuantity.length === 0) {
      orderItems.forEach(function(orderItem) {
        if(orderItem.getPromotionPKey() === prmPKey){
          orderItem.getACL().removeRight(AclObjectType.PROPERTY, "quantity", AclPermission.EDIT);
        }
      });
    }
  }
}

if(Utils.isDefined(me.getCallInContext_clbMainPKey())) {
  promise = Facade.getObjectAsync("BoCall", me.getQueryBy("pKey", me.getCallInContext_clbMainPKey()))
    .then(function (boCall) {
    if (Utils.isDefined(boCall) && me.getBoOrderMeta().getSdoSubType() === "Delivery") {
      var bCallIsReadOnly = boCall.clbStatus === "Completed" || boCall.clbStatus === "Canceled";
      if(bCallIsReadOnly) {
        me.getACL().removeRight(AclObjectType.OBJECT, "BoOrder", AclPermission.EDIT);
        me.getLuBrokerCustomer().getACL().removeRight(AclObjectType.OBJECT, "luBrokerCustomer", AclPermission.EDIT);
        me.getLuDeliveryRecipient().getACL().removeRight(AclObjectType.OBJECT, "luDeliveryRecipient", AclPermission.EDIT);
        uomAcl.removeRight(AclObjectType.PROPERTY, "modReason", AclPermission.EDIT);
        uomAcl.removeRight(AclObjectType.PROPERTY, "quantity", AclPermission.EDIT);
        uomAcl.removeRight(AclObjectType.PROPERTY, "discount", AclPermission.EDIT);
        uomAcl.removeRight(AclObjectType.PROPERTY, "specialPriceReceipt", AclPermission.EDIT);
      }
    }
    BindingUtils.refreshEARights();
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