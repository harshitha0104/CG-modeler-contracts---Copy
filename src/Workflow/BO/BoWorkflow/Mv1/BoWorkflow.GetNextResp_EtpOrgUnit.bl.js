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
 * @function getNextResp_EtpOrgUnit
 * @this BoWorkflow
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} liNextWfeState
 * @param {DomPkey} responsiblePKey
 * @returns promise
 */
function getNextResp_EtpOrgUnit(liNextWfeState, responsiblePKey){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var responsiblesMain = {};
var responsibles = {};

// Get all org units the current responsible belongs to (in the current sales area)
var promise = BoFactory.loadObjectByParamsAsync("LoOrgUnitsOfUser", me.getQueryBy("usrMainPKey", responsiblePKey)).then(
  function (loOrgUnitsOfUser) {
    var orgUnits = loOrgUnitsOfUser.getItemObjects();
    var functions = [];
    var seqenceArguments = [];
    var seqArg;

    // For each org unit found, search for next responsible
    for (var i = 0; i < orgUnits.length; i++) {
      seqArg = {};
      seqArg.orgUnitPKey = orgUnits[i].getEtpOrgMainPKey();
      seqArg.usrRolePKey = liNextWfeState.getUsrRolePKey();
      seqArg.managementType = orgUnits[i].getManagementType();

      functions.push(startRecursiveFunction);
      seqenceArguments.push(seqArg);
    }

    // Call recursive functions for each org unit by when_sequence
    return when_sequence(functions, seqenceArguments);
  }).then(
  function (results) {
    // Check whether the collection contains any responsible - If not, return undefined
    var collectionIsEmpty = true;
    for (var key in responsibles) {
      if (responsibles.hasOwnProperty(key)) {
        collectionIsEmpty = false;
        break;
      }
    }
    var nextResponsibleCollection;
    if (!collectionIsEmpty) {
      // Pack and return results
      nextResponsibleCollection = {};
      nextResponsibleCollection.responsibles = responsibles;
      nextResponsibleCollection.mainResponsibles = responsiblesMain;
    }

    return nextResponsibleCollection;
  });

// Declaration of recursive function for org unit hierarchy search
function startRecursiveFunction(args) {
  function recursiveFunction(orgUnitPKey, usrRolePKey, managementType) {

    var params = [];
    var query = {};
    params.push({ "field": "etpOrgMainPKey", "value": orgUnitPKey });
    params.push({ "field": "managementType", "value": managementType });
    params.push({ "field": "usrRolePKey", "value": usrRolePKey });
    query.params = params;

    // Get all users of given org unit with given user role
    return BoFactory.loadObjectByParamsAsync("LoUsersOfOrgUnitByRole", query).then(
      function (loUsersOfOrgUnitByRole) {
        var usersWithRole = loUsersOfOrgUnitByRole.getItemObjects();
        var usrPKey;

        if (usersWithRole.length > 0) {
          // Push found users to result
          for (var j = 0; j < usersWithRole.length; j++) {
            usrPKey = usersWithRole[j].getUsrMainPKey();

            if (usersWithRole[j].getMain() == "1") {
              // Check whether this responsible has been already found
              if (!Utils.isDefined(responsiblesMain[usrPKey])) {
                responsiblesMain[usrPKey] = usrPKey;
              }
            } else {
              // Check whether this responsible has been already found
              if (!Utils.isDefined(responsibles[usrPKey])) {
                responsibles[usrPKey] = usrPKey;
              }
            }
          }
        } else {
          // Determine parent org unit for hierarchy search
          var paramsHierarchy = [];
          var queryHierarchy = {};
          paramsHierarchy.push({ "field": "childPKey", "value": orgUnitPKey });
          paramsHierarchy.push({ "field": "structureType", "value": "Sales" });
          queryHierarchy.params = paramsHierarchy;

          return BoFactory.loadObjectByParamsAsync("LuParentOrgUnit", queryHierarchy);
        }
      }).then(
      function (luParentOrgUnit) {
        // Search on next hierarchy level
        if (Utils.isDefined(luParentOrgUnit) && !Utils.isEmptyString(luParentOrgUnit.getParentPKey())) {
          return recursiveFunction(luParentOrgUnit.getParentPKey(), usrRolePKey, managementType);
        }
      });
  }

  // Call recursive function with argument for this sequence part
  var arg = args[0];
  args.shift();
  return recursiveFunction(arg.orgUnitPKey, arg.usrRolePKey, arg.managementType);
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}