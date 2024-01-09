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
 * @function createAsync
 * @this BoWizardCreateNewCall
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} jsonQuery
 * @returns promise
 */
function createAsync(jsonQuery){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise;
if (!jsonQuery) {
  jsonQuery = {
    'params' : []
  };
}
var pKey = PKey.next();
me.setPKey(pKey);
me.updateProperties(jsonQuery);
var newParams;
if (Utils.isDefined(jsonQuery)) {
  newParams = jsonQuery;
  if (Utils.isOldParamsFormat(newParams)) {
    newParams = Utils.convertDsParamsOldToNew(newParams);
  }
}
var dateFromIsDefined = Utils.isDefined(me.getDateFrom());
if (!Utils.isSfBackend() && dateFromIsDefined) {
  var dFrom = me.getDateFrom().substr(0,10) + " 00:00:00";
  me.setDateFrom(dFrom);
}

var dateFromIsMinDate = me.getDateFrom() == Utils.getMinDate();

if (!dateFromIsDefined || dateFromIsMinDate) {
  // set date to today
  me.setDateFrom(Utils.createAnsiDateToday());
}
else {
  //fix datefrom and cut of the time part since framework deliver datefrom with time 00:00:00
  //if the convertAnsiDateTime2AnsiDate function from Framework is usable it needs to be added here
  me.setDateFrom(me.getDateFrom().substring(0, 10));
}
//Double conversion is needed  here as no Utils Function is available to replace
//returns TimeStamp("00:00")
if (!Utils.isDefined(me.getTimeFrom()) || Utils.isEmptyString(me.getTimeFrom()) || (me.getTimeFrom() == Utils.convertTime2Ansi(Utils.createDateToday())) ) {
  // set time to now
  me.setTimeFrom(Utils.createAnsiTimeNow());
}

if (Utils.isEmptyString(me.getCallMetaPKey())) {
  me.setCallMetaPKey(ApplicationContext.get('user').getBoUserSales().getClbMetaPKey());
}
if (Utils.isEmptyString(me.getCustomerPKey())) {
  me.setCustomerPKey(ApplicationContext.get('user').getBoUserSales().getBpaCustomerPKey());
}

// Determine substitution Info
var managementInfoParams = [];
var managementInfoQuery = {};

managementInfoParams.push({
  "field" : "customerPKey",
  "value" : me.getCustomerPKey()
});
managementInfoParams.push({
  "field" : "referenceDate",
  "value" : me.getDateFrom()
});
managementInfoParams.push({
  "field" : "referenceUserPKey",
  "value" : Utils.isDefined(newParams) ? newParams.responsiblePKey : " ",
});

managementInfoQuery.params = managementInfoParams;

promise = BoFactory.loadObjectByParamsAsync("LuCustomerManagementInfo", managementInfoQuery)
  .then(function (customerManagementInfoLookup) {
  if (customerManagementInfoLookup) {
    if (customerManagementInfoLookup.getIsManaged() === "0" && customerManagementInfoLookup.getIsSubstituted() === "0") {
      me.setCustomerPKey(" ");
    } else {
      me.setHasSubstitute(customerManagementInfoLookup.getHasSubstitute());
      me.setSubstitutedUsrPKey(customerManagementInfoLookup.getSubstitutedUsrMainPKey());
      me.setIsManagedCustomer(customerManagementInfoLookup.getIsManaged());
      me.setIsSubstituted(customerManagementInfoLookup.getIsSubstituted());
      me.setSubValidFrom(customerManagementInfoLookup.getSubstitutedFrom());
      me.setSubValidThru(customerManagementInfoLookup.getSubstitutedThru());
      me.setManagementRelationValidFrom(customerManagementInfoLookup.getManagementRelationValidFrom());
      me.setManagementRelationValidThru(customerManagementInfoLookup.getManagementRelationValidThru());
    }
  }
  var jsonParams = me.prepareLookupsLoadParams(me);
  return Facade.loadLookupsAsync(jsonParams);
}).then(
  function (lookups) {
    me.assignLookups(lookups);
    me.setEARights();
    me.setObjectStatus(STATE.NEW);
    return me;
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}