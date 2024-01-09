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
 * @this LoIssueOverViewContextMenu
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
    
// unwrap parameters
var newParams = context.jsonQuery;

var menuEntry0 = {
  "id" : "0000001",
  "actionImg" : "CancelDarkGrey24",
  "actionId" : "Cancel",
  "processEvent" : "Cancel",
  "actionVisible" : "1",
  "actionEnabled" : "0"
};

var menuEntry1 = {
  "id" : "0000002",
  "actionImg" : "TrashcanDarkGrey24",
  "actionId" : "Delete",
  "processEvent" : "Delete",
  "actionVisible" : "1",
  "actionEnabled" : "0"
};

var menuEntry2 = {
  "id" : "0000003",
  "actionImg" : "CopyDarkGrey24",
  "actionId" : "Copy",
  "processEvent" : "Copy",
  "actionVisible" : "1",
  "actionEnabled" : "0"
};

if (Utils.isOldParamsFormat(context.jsonQuery)) {
  newParams = Utils.convertDsParamsOldToNew(context.jsonQuery);
  context.jsonQuery = newParams;
}

var promise = BoFactory.loadObjectByParamsAsync("BoWorkflow", me.getQueryBy("pKey", context.jsonQuery.wfeWorkflowPKey)).then(
  function (object) {
    var nextStates = object.getNextStatesByStateType(context.jsonQuery.actualStatePKey, "Cancelled");
    var user = ApplicationContext.get('user');
    if (Utils.isCasBackend()) {
      var activeBySubstitution = false;

      if (context.jsonQuery.substitutionStatus === "Active_Substitute" || context.jsonQuery.substitutionStatus === "Active_Substituted") {
        activeBySubstitution = true;
      }
    }

    var jsonQuery = context.jsonQuery;
    var phase = jsonQuery.issuePhase.getText().toLowerCase();
    var userPKey = user.getPKey();
    var inactiveSubstituted = jsonQuery.substitutionStatus !== "Inactive_Substituted"; 
    var activeSubstitute = jsonQuery.substitutionStatus === "Active_Substitute";
    var userIsResponsible = jsonQuery.responsiblePKey === userPKey;
    var userIsInitiatior = jsonQuery.initiatorPKey === userPKey;

    //Only For Responsible or Initiator (which is not currently substituted) or a substitute (that is currently active) and for Initial or Release state
    if ((userIsResponsible && inactiveSubstituted || userIsInitiatior && inactiveSubstituted || activeSubstitute) && (phase === "initial" || phase === "released") && Utils.isDefined(nextStates) && nextStates.length > 0) {
      menuEntry0.actionEnabled = "1";
    }

    //If Current user is responsible (and currently not substituted), Delete is available at any phase
    if (userIsResponsible && inactiveSubstituted) {
      menuEntry1.actionEnabled = "1";
    }
    //If not supervisor (and currently not substituted) then Initial and Release phase
    else if (userIsInitiatior && user.getIsSupervisor() === "0" && inactiveSubstituted && (phase === "initial" || phase === "released")) {
      menuEntry1.actionEnabled = "1";
    }
    //Supervisor (and currently not substituted) then any phase
    else if (jsonQuery.initiatorPKey === userPKey && inactiveSubstituted && user.getIsSupervisor() == "1") {
      menuEntry1.actionEnabled = "1";
    }
    //If current user is active substitute then Initial and Release phase
    else if (activeSubstitute && (phase === "initial" || phase === "released")) {

      menuEntry1.actionEnabled = "1";
    }

    var svcQuery = {};

    svcQuery.params = [{ "field" : "svcRequestMetaPKey", "value" : jsonQuery.svcMetaPKey }];

    return BoFactory.loadObjectByParamsAsync("LuSvcRequestMetaValidForUser", svcQuery);
  }).then(
  function (luSvcRequestMetaValidForUser) {

    // Copy Context Menu for Issue - EA Rights

    // Template must be active and valid for the current user (checked via the lookup)
    if (luSvcRequestMetaValidForUser.getValidForUser() == "1") {

      // Do not allow copy if the original issue is private and the customer is only substituted (via isManagedCustomer = 0)
      if ((context.jsonQuery.isPrivate.getId() == "1") && (Utils.isDefined(context.jsonQuery.isManagedCustomer)) && (context.jsonQuery.isManagedCustomer.getId() === "0")) {
        menuEntry2.actionEnabled = "0";
      } else {
        menuEntry2.actionEnabled = "1";            
      }
    }

    me.addItems([menuEntry0, menuEntry1, menuEntry2]);
  }
);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}