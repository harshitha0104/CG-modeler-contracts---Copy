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
 * @this BoCustomer
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {String} mode
 */
function setEARights(mode){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
/* #########################################################
       NGM Customer Main - If the respective customer template is not Mobility Relevant, the user can not edit any customer data. Only display.
       ######################################################### */
var acl = me.getACL();
if (me.getBoBpaMeta().getMobilityRelevant() === "0") {
  acl.setAce({
    "objectType" : AclObjectType.OBJECT,
    "objectName" : "BoCustomer",
    "rights" : AclPermission.EDIT,
    "grant" : false
  });
}

// make email readonly if necessary
if(me.getEmailEditable() === '0') {
  acl.removeRight(AclObjectType.PROPERTY, "email1", AclPermission.EDIT);
}

if(me.getDeleted() == "1") {
  acl.removeRight(AclObjectType.OBJECT, "BoCustomer", AclPermission.EDIT);
}

switch (mode) {

    //####################################
    //### Set EARights for Roles Tab   ###
    //### Called after roles tab click ###
    //####################################
  case "roles":
    var roles = me.getLoBpaRole().getAllItems();
    var hasOrdererRole = false;
    var hasCustomerRole = false;
    var hasPayerRole = false;

    for (var i = 0; i < roles.length; i++) {
      switch (roles[i].getCategory()) {
        case "order":
          hasOrdererRole = true;
          break;
        case "customer":
          hasCustomerRole = true;
          break;
        case "payer":
          hasPayerRole = true;
          break;
      }
    }

    if (!hasOrdererRole) {
      var aclBoOrderRole = me.getBoOrderRole().getACL();
      aclBoOrderRole.removeRight(AclObjectType.PROPERTY, "ordererType", AclPermission.VISIBLE);
      aclBoOrderRole.removeRight(AclObjectType.PROPERTY, "sdoMetaBlocked", AclPermission.VISIBLE);
    }

    if (!hasCustomerRole) {
      var aclBoCustomerRole = me.getBoCustomerRole().getACL();
      aclBoCustomerRole.removeRight(AclObjectType.PROPERTY, "customerNumber", AclPermission.VISIBLE);
      aclBoCustomerRole.removeRight(AclObjectType.PROPERTY, "priceType", AclPermission.VISIBLE);
      aclBoCustomerRole.removeRight(AclObjectType.PROPERTY, "priceListType", AclPermission.VISIBLE);
    }

    if (!hasPayerRole) {
      var aclBoPayerRole = me.getBoPayerRole().getACL();
      aclBoPayerRole.removeRight(AclObjectType.PROPERTY, "overallCreditLimit", AclPermission.VISIBLE);
      aclBoPayerRole.removeRight(AclObjectType.PROPERTY, "creditRating", AclPermission.VISIBLE);
      aclBoPayerRole.removeRight(AclObjectType.PROPERTY, "creditBlock", AclPermission.VISIBLE);
    }

    //Refreshing EA rights after reload of customer roles date
    //--> triggers UI refresh
    BindingUtils.refreshEARights();
    break;
}

//SF houseNumber is not available and must be written in the same field as the street
if (Utils.isSfBackend() && Utils.isDefined(me.getLoCustomerAddress()) && Utils.isDefined(me.getLoCustomerAddress().getCurrent())) {
  var aclLoCustomerAddress = me.getLoCustomerAddress().getCurrent().getACL();
  aclLoCustomerAddress.removeRight(AclObjectType.PROPERTY, "houseNumber", AclPermission.VISIBLE);
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}