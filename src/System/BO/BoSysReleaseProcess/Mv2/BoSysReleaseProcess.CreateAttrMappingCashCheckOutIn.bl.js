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
 * @function createAttrMappingCashCheckOutIn
 * @this BoSysReleaseProcess
 * @kind businessobject
 * @namespace CORE
 * @returns attributes
 */
function createAttrMappingCashCheckOutIn(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var attributes = Utils.createDictionary();
var ref = me.getReferenceObject();
var tour = ApplicationContext.get('currentTour');
var amount;
var currency;
var difference;
var time;

if(Utils.isDefined(tour)){
  var tourId = tour.getId();
  attributes.add("TourId", tourId);
}

if (ref.getLoEtpWarehouse) {
  ref.getLoEtpWarehouse().setFilter("pKey", ref.getEtpWarehousePKey());
  var filteredItems = ref.getLoEtpWarehouse().getItemObjects();
  if (filteredItems.length > 0) {
    var warehouseId = filteredItems[0].getText();
    attributes.add("Warehouse", warehouseId);
  }
}

if(Utils.isDefined(tour)){
  var driver = tour.getDriverName();
  attributes.add("Driver", driver);
}

if (ref.getReleaseTime) {
  time = Localization.localize(ref.getReleaseTime(), "dateTime");
}

if (!Utils.isEmptyString(time)) {
  attributes.add("Date", time);
}

if (ref.getCurrency) {
  currency = Utils.getToggleText("DomCurrency", ref.currency, false);
}

if (ref.getAbsolutePaidAmount) {
  amount = Localization.localize(ref.getAbsolutePaidAmount().toFixed(2), "number");	
}

if (ref.getDifferenceAmount) {
  difference = Localization.localize(ref.getDifferenceAmount().toFixed(2), "number");
}

if (!Utils.isEmptyString(amount) && !Utils.isEmptyString(currency)) {
  attributes.add("Amount", amount + " " + currency);
}

if (!Utils.isEmptyString(difference) && !Utils.isEmptyString(currency)) {
  attributes.add("Difference", difference + " " + currency);
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return attributes;
}