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
 * @function setOnlyOpenFilterAfterComplete
 * @this LoToDoOverview
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {BoTodo} todoDetail
 */
function setOnlyOpenFilterAfterComplete(todoDetail){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
// Get the current ListItem
var liSvcRequestTodo = me.getCurrent();

if (liSvcRequestTodo && Utils.isDefined(liSvcRequestTodo)) {
  // Preset attributes
  liSvcRequestTodo.setPKey(todoDetail.getPKey());
  liSvcRequestTodo.setIssuePhase(todoDetail.getIssuePhase());
  liSvcRequestTodo.setInitiationDate(todoDetail.getInitiationDate());
  liSvcRequestTodo.setBusinessModified(Utils.createAnsiDateTimeNow());
  liSvcRequestTodo.setDueDate(todoDetail.getDueDate());
  liSvcRequestTodo.setPriority(todoDetail.getPriority());
  liSvcRequestTodo.setResponsiblePKey(todoDetail.getResponsiblePKey());
  liSvcRequestTodo.setResponsibleName(todoDetail.getLuResponsible().getName());
  liSvcRequestTodo.setText(todoDetail.getText());
  liSvcRequestTodo.setOwnerPKey(todoDetail.getOwnerPKey());
  liSvcRequestTodo.setOwnerName(todoDetail.getLuOwner().getName());
  liSvcRequestTodo.setInitiatorPKey(todoDetail.getInitiatorPKey());
  liSvcRequestTodo.setSvcMetaPKey(todoDetail.getSvcRequestMetaPKey());
  liSvcRequestTodo.setIsPrivate(
    todoDetail.getBoSvcRequestMeta().getIsPrivate()
  );
  liSvcRequestTodo.setIsActive(todoDetail.getBoSvcRequestMeta().getActive());
  liSvcRequestTodo.setWfeWorkflowPKey(todoDetail.getWfeWorkflowPKey());
  liSvcRequestTodo.setActualStatePKey(todoDetail.getActualStatePKey());

  //Update filter condition
  if (
    todoDetail.getIssuePhase().toLowerCase() === "initial" ||
    todoDetail.getIssuePhase().toLowerCase() === "released"
  ) {
    liSvcRequestTodo.setFilterOpen("1");
  } else {
    liSvcRequestTodo.setFilterOpen("0");
  }
}

var userPKey = ApplicationContext.get("user").getPKey();
var filterArray = [];
var FilterMap = me.getFilterMap();

if (
  Utils.isDefined(FilterMap.filterOpen) &&
  Utils.isDefined(FilterMap.responsiblePKey)
) {
  me.resetFilterArray(["filterOpen", "responsiblePKey"]);
  filterArray.push({ filterOpen: "1", op: "EQ" });
  filterArray.push({ responsiblePKey: userPKey, op: "EQ" });
  me.setFilterArray(filterArray);
}
var items = me.getItemObjects();

if (items.length > 0) {
  me.setCurrentByPKey(items[0].getPKey());
} else {
  me.setCurrentByPKey(undefined);
}


    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}