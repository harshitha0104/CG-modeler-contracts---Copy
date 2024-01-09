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
 * @this BoIssue
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
var newParams;
var pKey = PKey.next();
me.setPKey(pKey);

if (Utils.isDefined(context.jsonQuery)) {
  newParams = context.jsonQuery;
  if (Utils.isOldParamsFormat(newParams)) {
    newParams = Utils.convertDsParamsOldToNew(newParams);
  }
}

me.updateProperties(context.jsonQuery);
me.setInitiationDate(Utils.createAnsiDateTimeToday());

var user = ApplicationContext.get("user");
me.setInitiatorPKey(user.getPKey());
me.setDueDate(context.jsonQuery.dueDate);
me.setSalesOrg(user.getBoUserSales().getSalesOrg());

// Set responsible to substituted user if the selected customer is a substituted customer
if (Utils.isSfBackend()) {
  if (
    Utils.isDefined(newParams) &&
    !Utils.isEmptyString(newParams.substitutedUsrPKey)
  ) {
    me.setResponsiblePKey(newParams.substitutedUsrPKey);
  } else {
    me.setResponsiblePKey(user.getPKey());
  }
} else {
  if (
    Utils.isDefined(newParams) &&
    Utils.isDefined(newParams.isManagedCustomer) &&
    !Utils.isEmptyString(newParams.substitutedUsrPKey) &&
    newParams.isManagedCustomer.getId() == "0"
  ) {
    me.setResponsiblePKey(newParams.substitutedUsrPKey);
  } else {
    me.setResponsiblePKey(user.getPKey());
  }
}

// Check whether ClbMainPKey is defined, if not set to blank
// else copy to FromClbMainPKey to be consistent with Web Edition

if (Utils.isEmptyString(me.getClbMainPKey())) {
  me.setClbMainPKey(" ");
  me.setFromClbMainPKey(" ");
} else {
  me.setFromClbMainPKey(me.getClbMainPKey());
}

jParams = [];
jQuery = {};

jParams.push({
  field: "svcIssuePKey",
  value: me.getPKey(),
});
jQuery.params = jParams;

var promise = BoFactory.createObjectAsync("BoIssueNote", jQuery)
  .then(function (object) {
    if (Utils.isSfBackend()) {
      object.setPKey(me.getPKey());
    }
    //Set Issue Note
    me.setBoIssueNote(object);
    me.getBoIssueNote().setObjectStatus(STATE.NEW | STATE.DIRTY);

    return BoFactory.loadObjectByParamsAsync(
      "BoSvcRequestMeta",
      me.getQueryBy("pKey", me.getSvcRequestMetaPKey())
    );
  })
  .then(function (object) {
    // Assign loaded meta business object to BoIssue
    me.setBoSvcRequestMeta(object);
    me.setMetaType(me.getBoSvcRequestMeta().getMetaType());

    if (me.getBoSvcRequestMeta().getIsPrivate() == "0") {
      //To populate the OwnerPkey as per Usecase we are making use of LuIssueOwnerForCreate lookup
      var jsonParams = [];
      jsonParams.push({
        field: "managementType",
        value: me.getBoSvcRequestMeta().getManagementType(),
      });
      jsonParams.push({
        field: "customerPKey",
        value: me.getOwnerBpaMainPKey(),
      });

      var jsonQuery = {};
      jsonQuery.params = jsonParams;

      return BoFactory.loadObjectByParamsAsync(
        "LuIssueOwnerForCreate",
        jsonQuery
      );
    } else {
      return undefined;
    }
  })
  .then(function (lookupIssueOwner) {
    if (
      Utils.isDefined(lookupIssueOwner) &&
      !Utils.isEmptyString(lookupIssueOwner.getUsrMainPKey())
    ) {
      me.setOwnerPKey(lookupIssueOwner.getUsrMainPKey());
    } else {
      me.setOwnerPKey(me.getResponsiblePKey());
    }
    var jsonParams = me.prepareLookupsLoadParams(me);
    return Facade.loadLookupsAsync(jsonParams);
  })
  .then(function (lookups) {
    me.assignLookups(lookups);

    if (
      !Utils.isEmptyString(me.getOwnerBpaMainPKey()) &&
      me.getBoSvcRequestMeta().getIsPrivate() === "0"
    ) {
      //check management / substitution info for EA-Rights
      var cmiParams = [];
      var cmiQuery = {};

      cmiParams.push({
        field: "customerPKey",
        value: me.getOwnerBpaMainPKey(),
      });
      cmiParams.push({
        field: "referenceDate",
        value: Utils.createAnsiDateTimeToday(),
      });
      cmiParams.push({
        field: "referenceUserPKey",
        value: ApplicationContext.get("user").getPKey(),
      });

      cmiQuery.params = cmiParams;

      return BoFactory.loadObjectByParamsAsync(
        "LuCustomerManagementInfo",
        cmiQuery
      );
    } else {
      return undefined;
    }
  })
  .then(function (customerManagementInfoLookup) {
    if (Utils.isDefined(customerManagementInfoLookup)) {
      me.setLuCustomerManagementInfo(customerManagementInfoLookup);
    }
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
    me.setIssueId(sysnumber);

    // Prepopulate values of simple properties in BoTodo that come from the template (meta)
    me.setWfeWorkflowPKey(me.getBoSvcRequestMeta().getWfeWorkflowPKey());

    return BoFactory.loadObjectByParamsAsync(
      "BoWorkflow",
      me.getQueryBy("pKey", me.getWfeWorkflowPKey())
    );
  })
  .then(function (boWorkflow) {
    me.setBoWorkflow(boWorkflow);

    return BoFactory.loadObjectByParamsAsync(
      "LuInitialAndNextState",
      me.getQueryBy("wfeWorkflowPKey", me.getWfeWorkflowPKey())
    );
  })
  .then(function (luInitialAndNextState) {
    me.setActualStatePKey(luInitialAndNextState.getInitialStatePKey());
    me.setIssuePhase(luInitialAndNextState.getInitialStateType());
    me.setNextStatePKey(luInitialAndNextState.getInitialStatePKey());

    return BoFactory.createObjectAsync("LoIssueRecentState", {});
  })
  .then(function (loIssueRecentState) {
    me.setLoRecentState(loIssueRecentState);
    return BoFactory.createObjectAsync("LoIssueAttachments", {});
  })
  .then(function (loIssueAttachments) {
    me.setLoIssueAttachments(loIssueAttachments);
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