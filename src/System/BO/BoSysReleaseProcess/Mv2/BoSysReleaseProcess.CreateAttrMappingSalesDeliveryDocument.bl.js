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
 * @function createAttrMappingSalesDeliveryDocument
 * @this BoSysReleaseProcess
 * @kind businessobject
 * @namespace CORE
 * @returns attributes
 */
function createAttrMappingSalesDeliveryDocument(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var attributes = Utils.createDictionary();
var ref = this.getReferenceObject();
var tour = ApplicationContext.get('currentTour');

var tourId;
var date;
var customerId;
var invoiceId;
var asn;
var amount;
var currency;
var driver;
var time;

if(Utils.isDefined(tour)){
  tourId = tour.getId();
}

if (Utils.isDefined(ref.getReleaseTime) && Utils.isDefined(ref.getReleaseTime()) && ref.getBoOrderMeta().getCaptureReleaseTime() == "1") {  
  date = Localization.localize(ref.getReleaseTime(), "dateTime");
}

if(Utils.isDefined(tour)){
  driver = tour.getDriverName();	
}

if (ref.getLuDeliveryRecipient) {  
  customerId = ref.getLuDeliveryRecipient().getCustomerNumber();
}

if (ref.getInvoiceId) {  
  invoiceId = ref.getInvoiceId();
}

if (ref.getAsn) {  
  asn = ref.getAsn();
}

if (ref.getGrossTotalValue) {  
  amount = Localization.localize(ref.getGrossTotalValue().toFixed(2), "number");
}  

if (ref.getCurrency) {  
  currency = Utils.getToggleText("DomCurrency", ref.getCurrency());
}

if (Utils.isDefined(tourId) && !Utils.isEmptyString(tourId)) {  
  attributes.add("TourId", tourId);
}

if (!Utils.isEmptyString(date)) {
  attributes.add("Date", date);
}

if (!Utils.isEmptyString(driver)) {
  attributes.add("Driver", driver);
}

// <!-- CW-REQUIRED: Framework is now Utils -->
if((!Utils.isSfBackend()) || (Utils.isSfBackend() && customerId != '0')) {
attributes.add("CustomerId", customerId);
}

if (!Utils.isEmptyString(invoiceId)) {
  attributes.add("InvoiceId", invoiceId);
}

if (!Utils.isEmptyString(asn)) {
  attributes.add("ASN", asn);
}

if (!Utils.isEmptyString(amount) && !Utils.isEmptyString(currency)) {
  attributes.add("Amount", amount + " " + currency);
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return attributes;
}