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
 * @this LoToDoOverviewContextMenu
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
    
//Build context menu list
var contextMenuItemList = [];
var newParams = context.jsonQuery;
if (Utils.isOldParamsFormat(context.jsonQuery)) {
  newParams = Utils.convertDsParamsOldToNew(context.jsonQuery);
  context.jsonQuery = newParams;
}
var promise = BoFactory.loadObjectByParamsAsync("BoWorkflow", me.getQueryBy("pKey", context.jsonQuery.wfeWorkflowPKey)).then(
  function (object) {
    var cancelMenuEntry = {
      "id": "0000001",
      "actionImg": "CancelDarkGrey24",
      "actionId": "Cancel",
      "processEvent": "Cancel",
      "actionVisible": "1",
      "actionEnabled": "0"
    };
    var deleteMenuEntry = {
      "id": "0000002",
      "actionImg": "TrashcanDarkGrey24",
      "actionId": "Delete",
      "processEvent": "Delete",
      "actionVisible": "1",
      "actionEnabled": "0"
    };
    var copyMenuEntry = {
      "id": "0000003",
      "actionImg": "CopyDarkGrey24",
      "actionId": "Copy",
      "processEvent": "Copy",
      "actionVisible": "1",
      "actionEnabled": "0"
    };
    var nextStates = object.getNextStatesByStateType(context.jsonQuery.actualStatePKey, "Cancelled");
    if(Utils.isSfBackend()) {
      if (context.jsonQuery.issuePhase.getText().toLowerCase() === "initial" || context.jsonQuery.issuePhase.getText().toLowerCase() === "released") {
        cancelMenuEntry.actionEnabled = "1";
      }
    }  
    else {
      if ((context.jsonQuery.issuePhase.getText().toLowerCase() === "initial" || context.jsonQuery.issuePhase.getText().toLowerCase() === "released") && (Utils.isDefined(nextStates) && nextStates.length > 0)) {
        cancelMenuEntry.actionEnabled = "1";
      }
    }
    var user = ApplicationContext.get('user');
    var userPkey = user.getPKey();
    var userIsSupervisor = (user.getIsSupervisor() == "1");
    var taskIsPrivate = (context.jsonQuery.isPrivate.getId() == "1");
    var taskIsActive = (context.jsonQuery.isActive.getId() == "1");
    if(context.jsonQuery.initiatorPKey === userPkey) {
      deleteMenuEntry.actionEnabled = "1";
    }
    if (!Utils.isSfBackend() && (context.jsonQuery.responsiblePKey === userPkey && taskIsPrivate)) {
      deleteMenuEntry.actionEnabled = "1";
    }
    if (userIsSupervisor && !taskIsPrivate && taskIsActive) {
      copyMenuEntry.actionEnabled = "1";
    }
    if (!Utils.isSfBackend() && (taskIsPrivate && taskIsActive)) {
      copyMenuEntry.actionEnabled = "1";
    }
    var menuEntries = [cancelMenuEntry, deleteMenuEntry, copyMenuEntry];
    menuEntries.forEach(
      function (item) {
        contextMenuItemList.push(item);
      }
    );
    me.addItems(contextMenuItemList);
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}