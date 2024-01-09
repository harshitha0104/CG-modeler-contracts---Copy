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
 * @this BoIssue
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
    
var jsonQuery = context.jsonQuery;

if (!jsonQuery) {
  jsonQuery = {
    params: [],
  };
}

var context = {
  jsonQuery: jsonQuery,
};

var promise = Facade.getObjectAsync(BO_ISSUE, jsonQuery)
  .then(function (selfJson) {
    context.selfJson = selfJson;
    if (me.beforeInitialize) {
      me.beforeInitialize.apply(me, [context]);
    }
    me.setProperties(selfJson);
    if (me.afterInitialize) {
      me.afterInitialize.apply(me, [context]);
    }
    if (Utils.isDefined(selfJson)) {
      var jsonParams = me.prepareLookupsLoadParams(selfJson);
      return Facade.loadLookupsAsync(jsonParams);
    } else {
      return when.resolve(null);
    }
  })
  .then(function (lookups) {
    if (Utils.isDefined(lookups)) {
      me.assignLookups(lookups);
    }

    return BoFactory.loadObjectByParamsAsync(
      BO_ISSUENOTE,
      me.getQueryBy("svcIssuePKey", me.getPKey())
    );
  })
  .then(function (boIssueNote) {
    if (Utils.isDefined(boIssueNote)) {
      me.setBoIssueNote(boIssueNote);
    } else {
      me.setBoIssueNote(null);
    }

    return BoFactory.loadObjectByParamsAsync(
      BO_SVCREQUESTMETA,
      me.getQueryBy("pKey", me.getSvcRequestMetaPKey())
    );
  })
  .then(function (boSvcRequestMeta) {
    if (Utils.isDefined(boSvcRequestMeta)) {
      me.setBoSvcRequestMeta(boSvcRequestMeta);
    } else {
      me.setBoSvcRequestMeta(null);
    }

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

      if (me.getIssuePhase() !== "initial") {
        var managementType = me.getBoSvcRequestMeta().getManagementType();

        cmiQuery.addCond_managementType =
          "AND SubBpaRel.ManagementType = #managementType# ";
        cmiParams.push({
          field: "managementType",
          value: managementType,
        });
      }
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

    return BoFactory.loadObjectByParamsAsync(
      BO_WORKFLOW,
      me.getQueryBy("pKey", me.getWfeWorkflowPKey())
    );
  })
  .then(function (boWorkflow) {
    if (Utils.isDefined(boWorkflow)) {
      me.setBoWorkflow(boWorkflow);
    } else {
      me.setBoWorkflow(null);
    }
    return BoFactory.loadListAsync(
      LO_ISSUERECENTSTATE,
      me.getQueryBy("svcIssuePKey", me.getPKey())
    );
  })
  .then(function (loIssueRecentStateJson) {
    if (Utils.isDefined(loIssueRecentStateJson)) {
      me.setLoRecentState(loIssueRecentStateJson);
    } else {
      me.setLoRecentState(null);
    }
    if (me.setObjectStatus) {
      me.setObjectStatus(STATE.PERSISTED);
    }
  });


    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}