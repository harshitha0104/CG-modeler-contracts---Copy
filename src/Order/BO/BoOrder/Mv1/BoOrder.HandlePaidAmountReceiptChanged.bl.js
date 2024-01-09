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
 * @function handlePaidAmountReceiptChanged
 * @this BoOrder
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {String} oldValue
 * @param {String} newValue
 * @returns promise
 */
function handlePaidAmountReceiptChanged(oldValue, newValue){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = when.resolve();

if(oldValue != newValue){
  var acl = me.getACL();

  if(newValue < 0){
    me.setPaidAmountReceipt(0);
    newValue = 0;
  }
  if(me.getGrossTotalValueReceipt() <= 0){
    acl.removeRight(AclObjectType.PROPERTY, "paidAmountReceipt", AclPermission.EDIT);
    acl.removeRight(AclObjectType.PROPERTY, "paymentMethod", AclPermission.EDIT);
  }
  else {
    if(!(me.getDocTaType() === "CashOrder" || me.getDocTaType() === "InvoiceCashInvoice")){
      acl.addRight(AclObjectType.PROPERTY, "paidAmountReceipt", AclPermission.EDIT);
      acl.addRight(AclObjectType.PROPERTY, "paymentMethod", AclPermission.EDIT);
    }
  }

  //update paid amount and absolute paid amount, should be same as paid amount receipt
  me.setPaidAmount(newValue);
  me.setAbsolutePaidAmount(Math.abs(me.getPaidAmount()));

  if(newValue === 0){
    acl.removeRight(AclObjectType.PROPERTY, "isPaymentCollected", AclPermission.EDIT);
  }
  else{
    acl.addRight(AclObjectType.PROPERTY, "isPaymentCollected", AclPermission.EDIT);
  }
  //reset payment collected flag whenever paid amount is changed
  me.setIsPaymentCollected("0");
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}