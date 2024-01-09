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
 * @function setEARights
 * @this BoTruckLoad
 * @kind businessobject
 * @namespace CORE
 */
function setEARights(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var acl = me.getACL();
var lockedPhases = ['released', 'canceled', 'ready', 'feedback', 'voided'];
var lockedByPhase = false;
var userPKey = ApplicationContext.get('user').getPKey();

if (lockedPhases.indexOf(me.getPhase().toLowerCase()) > -1) {
  lockedByPhase = true;
}

//If the context tour has TmgTour.TmgStatus <> 'Running', the product check in document is not writeable.
//If the respective template has SdoMeta.MobilityRelevant = 'No', the user can not edit any product check in document data. Only display.
//If the product check in document has SdoMain.Phase in ('Released', 'Canceled', 'Ready', 'Feedback', 'Voided'), the document is not editable anymore.
//If the user is not responsible of the product check in document (SdoMain.ResponsiblePKey <> current user), the document is not editable.

if ((Utils.isDefined(ApplicationContext.get('currentTourStatus')) && ApplicationContext.get('currentTourStatus').toLowerCase() !== "running") ||
    me.getBoOrderMeta().getMobilityRelevant() === "0" || lockedByPhase || me.getResponsiblePKey() != ApplicationContext.get('user').getPKey()) {
  acl.removeRight(AclObjectType.OBJECT, "BoTruckLoad", AclPermission.EDIT);
  me.getLoItems().getACL().removeRight(AclObjectType.PROPERTY, "modReason", AclPermission.EDIT);
}

var loAcl = me.getLoItems().getACL();
var loItemMetaItems = me.getBoOrderMeta().getLoOrderItemMetas().getAllItems();
var qsAcl = me.getLoQuantitySums().getACL();
var orderItems = me.getLoItems();
var items = me.getLoItems().getAllItems();
var nloAcl = me.getLoUnitOfMeasure().getACL();
var loItemAcl;

// Hide the Type selection box
if (me.getDocumentType() === "ProductCheckOut") {
  for(var i = 0; i < items.length; i++) {
    loItemAcl = items[i].getACL();
    loItemAcl.removeRight(AclObjectType.PROPERTY, "sdoItemMetaPKey", AclPermission.VISIBLE);
  }
}

if (Utils.isDefined(me.getBoOrderMeta()) && me.getDocumentType() === "ProductCheckOut" && (me.getPhase() == "Canceled" || me.getPhase() == "Released")) {
  nloAcl.removeRight(AclObjectType.PROPERTY, "modReason", AclPermission.EDIT);
} 

if (me.getBoOrderMeta().getConsiderItemModReason() === "0") {
  nloAcl.removeRight(AclObjectType.PROPERTY, "modReason", AclPermission.VISIBLE);
}

if ((me.getDocumentType() == "TruckIvcTransferInward" && me.getRecipientPKey() == userPKey) || (me.getDocumentType() == "TruckIvcTransferInward" && me.getSenderPKey() == userPKey)) {
  nloAcl.removeRight(AclObjectType.PROPERTY, "modReason", AclPermission.VISIBLE);
} 

if (me.isEditable() && me.getActualPrdCheckOutType() !== "Express") {
  if (Utils.isDefined(me.getBoOrderMeta()) && me.getDocumentType() === "ProductCheckOut" && me.getBoOrderMeta().getItemPresettingPolicy() !== "Prepopulated") {
    loAcl.removeRight(AclObjectType.PROPERTY, "modReasonEntered", AclPermission.VISIBLE);
    qsAcl.removeRight(AclObjectType.PROPERTY, "targetQuantity", AclPermission.VISIBLE);
    qsAcl.removeRight(AclObjectType.PROPERTY, "qtyDifference", AclPermission.VISIBLE);
  }
  else {
    loAcl.addRight(AclObjectType.PROPERTY, "modReasonEntered", AclPermission.VISIBLE);
    qsAcl.addRight(AclObjectType.PROPERTY, "targetQuantity", AclPermission.VISIBLE);
    qsAcl.addRight(AclObjectType.PROPERTY, "qtyDifference", AclPermission.VISIBLE);
  }
}

acl.removeRight(AclObjectType.PROPERTY, "cancelReason", AclPermission.VISIBLE);
me.getLuSender().getACL().removeRight(AclObjectType.PROPERTY, "name", AclPermission.VISIBLE);
me.getLuRecipientDriver().getACL().removeRight(AclObjectType.PROPERTY, "name", AclPermission.VISIBLE);

if (me.getDocumentType() === "TruckIvcTransferOutward" || me.getDocumentType() === "TruckIvcTransferInward") {
  me.getLuSender().getACL().addRight(AclObjectType.PROPERTY, "name", AclPermission.VISIBLE);
  me.getLuRecipientDriver().getACL().addRight(AclObjectType.PROPERTY, "name", AclPermission.VISIBLE);
  loAcl.addRight(AclObjectType.PROPERTY, "ivcBalance", AclPermission.VISIBLE);
  loAcl.addRight(AclObjectType.PROPERTY, "ivcBalanceUnitType", AclPermission.VISIBLE);
  acl.removeRight(AclObjectType.PROPERTY, "bookInventoryValue", AclPermission.VISIBLE);
  acl.removeRight(AclObjectType.PROPERTY, "amountDifference", AclPermission.VISIBLE);
  acl.removeRight(AclObjectType.PROPERTY, "currency", AclPermission.VISIBLE);
}
else {
  loAcl.removeRight(AclObjectType.PROPERTY, "ivcBalance", AclPermission.VISIBLE);
  loAcl.removeRight(AclObjectType.PROPERTY, "ivcBalanceUnitType", AclPermission.VISIBLE);
}

if ((me.getDocumentType() === "TruckIvcTransferOutward") && (me.getPhase() == "Released" || me.getPhase() == "Canceled")) {
  me.getLuRecipientDriver().getACL().removeRight(AclObjectType.PROPERTY, "name", AclPermission.EDIT);
}

if ((me.getDocumentType() === "TruckIvcTransferInward") && (me.getPhase() == "Canceled")) {
  acl.addRight(AclObjectType.PROPERTY, "cancelReason", AclPermission.VISIBLE);
}

if (me.getDocumentType() == "TruckIvcTransferInward" && me.getPhase() == "Initial" && me.getSenderPKey() == userPKey && Utils.isEmptyString(me.getInwardTransferDocumentPKey())) {
  acl.addRight(AclObjectType.PROPERTY, "cancelReason", AclPermission.VISIBLE);
}

if (me.getDocumentType() === "TruckIvcTransferInward") { 
  acl.removeRight(AclObjectType.OBJECT, "BoTruckLoad", AclPermission.EDIT);
  me.getLuRecipientDriver().getACL().removeRight(AclObjectType.PROPERTY, "name", AclPermission.EDIT);
  acl.removeRight(AclObjectType.PROPERTY, "cancelReason", AclPermission.EDIT);
}

if (!(me.getBoOrderMeta().getComputePrice() === "4" || me.getBoOrderMeta().getComputePrice() === "5")) {
  acl.removeRight(AclObjectType.PROPERTY, "bookInventoryValue", AclPermission.VISIBLE);
  acl.removeRight(AclObjectType.PROPERTY, "amountDifference", AclPermission.VISIBLE);
  acl.removeRight(AclObjectType.PROPERTY, "currency", AclPermission.VISIBLE);
  acl.removeRight(AclObjectType.PROPERTY, "grossTotalValueReceipt", AclPermission.VISIBLE);
  acl.removeRight(AclObjectType.PROPERTY, "actualValueCurrency", AclPermission.VISIBLE);
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}