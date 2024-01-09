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
 * @function afterCreateAsync
 * @this BoOrderPrintTextItems
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} result
 * @param {Object} context
 * @returns promise
 */
function afterCreateAsync(result, context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var params = Utils.convertDsParamsOldToNew(context.jsonQuery);
var documentTransactionType = params.documentTransactionType;

// Set end of print message
if(params.subType === "OrderEntry"){
  switch(documentTransactionType){
    case "CashOrder":
    case "CreditOrder":
    case "NoPaymentOrder":
      me.setEndOfPrint(Localization.resolve("Order_Print_EndOfPrint1") + " (" +
                       Localization.resolve("Order_Print_EndOfPrint2") + " " +
                       Localization.localize(Utils.createDateNow(), "date") + ")");
      break;
  }
}  else if  (params.subType === "Invoice"){
  switch(documentTransactionType){
    case "InvoiceCashInvoice":
    case "InvoiceCreditInvoice":
    case "NoPayment":
      me.setEndOfPrint(Localization.resolve("Order_Print_EndOfPrint3") + " (" +
                       Localization.resolve("Order_Print_EndOfPrint2") + " " +
                       Localization.localize(Utils.createDateNow(), "date") + ")");
      break;
    case "CreditMemo":
      me.setEndOfPrint(Localization.resolve("Order_Print_EndOfPrint4") + " (" +
                       Localization.resolve("Order_Print_EndOfPrint2") + " " +
                       Localization.localize(Utils.createDateNow(), "date") + ")");
      break;
  }
}  else if (params.subType === "Delivery" && params.reportPolicy === "Confirmation"){
  me.setEndOfPrint(Localization.resolve("Order_Print_EndOfPrint1") + " (" +
                   Localization.resolve("Order_Print_EndOfPrint2") + " " +
                   Localization.localize(Utils.createDateNow(), "date") + ")");
}

if(Utils.isEmptyString(me.getEndOfPrint())){
  switch(params.subType){
    case "OrderEntry":
    case "Delivery":
      me.setEndOfPrint(Localization.resolve("Order_Print_EndOfPrint1") + " (" +
                       Localization.resolve("Order_Print_EndOfPrint2") + " " +
                       Localization.localize(Utils.createDateNow(), "date") + ")");
      break;
    case "Invoice":
      me.setEndOfPrint(Localization.resolve("Order_Print_EndOfPrint3") + " (" +
                       Localization.resolve("Order_Print_EndOfPrint2") + " " +
                       Localization.localize(Utils.createDateNow(), "date") + ")");
      break;
    default:
      me.setEndOfPrint(Localization.resolve("Order_Print_EndOfPrint3") + " (" +
                       Localization.resolve("Order_Print_EndOfPrint2") + " " +
                       Localization.localize(Utils.createDateNow(), "date") + ")");
      break;
  }
}

if (params.phase === "Initial" && params.releaseInProgress !== "yes") {
  //In case of printing sdo document for initial/editable orders, the watermark will display 'Draft'.
  me.setDocumentStatus(Localization.resolve("DraftId"));
} else {
  //In case of printing sdo document for non-editable orders, the watermark will not be displayed.
  me.setDocumentStatus("");
}

if (params.releaseInProgress === "yes") {
  //during order release, generate and save pdf
  me.setPrintV2GenerateAndSave(true);
  me.setBlobPKey(PKey.next());
} else {
  me.setPrintV2GenerateAndSave(false);
}

if (Utils.isDefined(params.signatures)) {
  if (Utils.isDefined(params.signatures.getAllItems()[0])) {
    var firstSignature = params.signatures.getItemsByParamArray([
    ],[
      { "sysSort" : "ASC" },
      { "name" : "ASC" }
    ])[0];
    me.setSignature1MediaPath(firstSignature.mediaPath);
    me.setSignature1Name(firstSignature.name);
    me.setSignature1sysReleaseStepText(firstSignature.sysReleaseStepText);
  }
}

var promise = when.resolve(me);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}