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
 * @function beforeLoadAsync
 * @this LoIssueOverview
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} context
 * @returns promise
 */
function beforeLoadAsync(context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
// Unwrap parameters
var newParams = context.jsonQuery;
var jsonParams = [];

if (Utils.isOldParamsFormat(context.jsonQuery)) {
  newParams = Utils.convertDsParamsOldToNew(context.jsonQuery);
  context.jsonQuery = newParams;
}

context.jsonQuery.params = jsonParams;

// If no customerPKey is passed, standalone overview with all customers related issues to current user should be displayed
if (Utils.isDefined(newParams.customerPKey) && !Utils.isEmptyString(newParams.customerPKey)) {
  context.jsonQuery.loadLoCustomerOverview = "'" + newParams.customerPKey + "'";
} else {
  // Put customer list into jsonQuery for LoIssueOverview
  var loadLoCustomerOverviewObj = Facade.myProxy.getLoadStatement("LoCustomerOverview", {});
  var customerSqlQuery = "SELECT pKey FROM ( " + loadLoCustomerOverviewObj.sql + " ) ";
  jsonParams.push({"field" : "loadLoCustomerOverviewParams", "value" : loadLoCustomerOverviewObj.params});
  context.jsonQuery.loadLoCustomerOverview = customerSqlQuery;
}


// Set appropriate advanced serach profile
if (Utils.isDefined(context.jsonQuery.asoName)) {

  if (Utils.isDefined(newParams.customerPKey) && !Utils.isEmptyString(newParams.customerPKey)) {
    // Take provile for visit navigation, but consider supervisor

    if (ApplicationContext.get('user').getIsSupervisor() == "1") {
      context.jsonQuery.asoName = "AsoIssueCallSupervisor";
    } else {
      context.jsonQuery.asoName = "AsoIssueCall";
    }
  } else {
    // Stand alone mode
    if (ApplicationContext.get('user').getIsSupervisor() == "1") {
      context.jsonQuery.asoName = "AsoIssueSupervisor";
    } else {
      context.jsonQuery.asoName = "AsoIssue";
    }
  }
}

var promise = me.addAsoInformation(context.jsonQuery).then(
  function () {
    return Facade.getListAsync("LoIssueOverview", context.jsonQuery);
  }).then(
  function(issue) {
    for(var i = 0; i < issue.length; i++) {
      if(issue[i].text.length > 25) {
        issue[i].text= issue[i].text.substr(0, 25);
        issue[i].text+= "...";
      }
    }
    me.addItems(issue, context.jsonQuery.params);
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}