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
 * @function beforeCreateAsync
 * @this BoTodo
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} context
 * @returns promise
 */
function beforeCreateAsync(context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    var jParams;
var jQuery;
var pKey = PKey.next();
var user = ApplicationContext.get("user");
me.setPKey(pKey);
me.updateProperties(context.jsonQuery);
me.setInitiationDate(Utils.createAnsiDateToday());
me.setInitiatorPKey(user.getPKey());
me.setResponsiblePKey(user.getPKey());
me.setSalesOrg(user.getBoUserSales().getSalesOrg());
me.setPriority("B");
me.setClassification("Inquiry");
me.setIssuePhase("initial");

var recordTypeHelper = function () {
  if (Utils.isSfBackend()) {
    var jsonParams = {
      recordType: "User_Task",
    };
    return Facade.selectSQL("DsLuRecordType", "UserTask", jsonParams);
  }
  return when.resolve();
};

var promise = recordTypeHelper()
.then(function (recordType) {
  jParams = [];
  jQuery = {};
  if (Utils.isDefined(recordType) && recordType.length > 0) {
    me.setSvcRequestMetaPKey(recordType[0].pKey);
  }
  jParams.push({
    field: "svcTodoPKey",
    value: me.getPKey(),
  });
  jQuery.params = jParams;
  return BoFactory.createObjectAsync("BoTodoNote", jQuery);
})
.then(function (object) {
  // Assign loaded meta business object to BoTodo
  me.setBoTodoNote(object);
  me.getBoTodoNote().setObjectStatus(STATE.NEW | STATE.DIRTY);
  return BoFactory.loadObjectByParamsAsync(
    "BoSvcRequestMeta",
    Utils.getParamsForDeprecatedDS("pKey", me.getSvcRequestMetaPKey())
  );
})
.then(function (object) {
  // Assign loaded meta business object to BoTodo
  me.setBoSvcRequestMeta(object);
  me.setMetaType(me.getBoSvcRequestMeta().getMetaType());
  if (me.getBoSvcRequestMeta().getIsPrivate() != "0") {
    me.setOwnerPKey(user.getPKey());
  }
  var jsonParams = me.prepareLookupsLoadParams(me);
  return me.loadLookupsAsync(jsonParams);
})
.then(function (lookups) {
  me.assignLookups(lookups);
  if (Utils.isSfBackend()) {
    return when.resolve();
  } else {
    return SysNumber.getSysNumberAsync(
      me.getBoSvcRequestMeta().getSysNumberPKey()
    );
  }
})
.then(function (sysnumber) {
  //Set id (generated by number generator)
  var sysnumberPkey = me.getBoSvcRequestMeta().getSysNumberPKey();
  //In case, SysNumberPKey of Meta is empty - ID is set by PKey
  if (Utils.isEmptyString(sysnumberPkey)) {
    me.setTodoId(me.getPKey());
  } else {
    me.setTodoId(sysnumber);
  }
  // Prepopulate values of simple properties in BoTodo that come from the template (meta)
  me.setWfeWorkflowPKey(me.getBoSvcRequestMeta().getWfeWorkflowPKey());
  return BoFactory.loadObjectByParamsAsync(
    "BoWorkflow",
    Utils.getParamsForDeprecatedDS("pKey", me.getWfeWorkflowPKey())
  );
})
.then(function (boWorkflow) {
  me.setBoWorkflow(boWorkflow);
  return BoFactory.loadObjectByParamsAsync(
    "LuInitialAndNextState",
    Utils.getParamsForDeprecatedDS("wfeWorkflowPKey", me.getWfeWorkflowPKey())
  );
})
.then(function (luInitialAndNextState) {
  if (!Utils.isSfBackend()) {
    me.setActualStatePKey(luInitialAndNextState.getInitialStatePKey());
    me.setIssuePhase(luInitialAndNextState.getInitialStateType());
    me.setNextStatePKey(luInitialAndNextState.getInitialStatePKey());
  }
  return BoFactory.createObjectAsync("LoTodoRecentState", {});
})
.then(function (loTodoRecentState) {
  me.setLoRecentState(loTodoRecentState);
  return BoFactory.createObjectAsync("LoTodoAttachments", {});
})
.then(function (loTodoAttachments) {
  me.setLoTodoAttachments(loTodoAttachments);
  return BoFactory.createObjectAsync("LoAtmAttachment", {});
})
.then(function (loAtmAttachment) {
  me.setLoAtmAttachment(loAtmAttachment);
  //Set State
  me.setObjectStatus(STATE.NEW | STATE.DIRTY);
  //Set edit and access rights
  me.setEARights();
});
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}