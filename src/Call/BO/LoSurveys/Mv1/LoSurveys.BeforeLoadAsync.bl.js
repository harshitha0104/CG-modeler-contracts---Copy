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
 * @this LoSurveys
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
    
var promise = when.resolve(context);
var params = Utils.convertDsParamsOldToNew(context.jsonQuery);
var posIdParam = params.posId;
var boJobManager = params.boJobManager;
var skipPresettingJobs = params.skipPresettingJobs;

var loCurrentPOS = boJobManager.getLoPOS().getItemsByParam({
  "posId" : posIdParam
});

if (loCurrentPOS.length > 0) {
  var liCurrentPOS = loCurrentPOS[0];

  var jsonParams = context.jsonQuery.params;
  jsonParams.push({
    "field" : "clbMainPKey",
    "operator" : "EQ",
    "value" : boJobManager.getClbMainPKey()
  });
  jsonParams.push({
    "field" : "clbMetaPKey",
    "operator" : "EQ",
    "value" : boJobManager.getClbMetaPKey()
  });
  jsonParams.push({
    "field" : "bpaMainPKey",
    "operator" : "EQ",
    "value" : boJobManager.getBpaMainPKey()
  });
  jsonParams.push({
    "field" : "validFrom",
    "operator" : "EQ",
    "value" : boJobManager.getReferenceDate()
  });
  jsonParams.push({
    "field" : "timeFrom",
    "operator" : "EQ",
    "value" : boJobManager.getTimeFrom()
  });

  //LastValue finding
  if (boJobManager.getOriginalClbStatus() !== "Completed") {
    //Determine POSBpaMainPKeys
    var posList = boJobManager.getLoPOS().getAllItems();
    var posIdx = posList.length;
    var pos;
    var pOSBpaMainPKeys = " ";
    var jobDefPKeys = "";
    while (posIdx--) {
      pos = posList[posIdx];
      if (pos.getPosId() !== " ") {
        pOSBpaMainPKeys += "'" + pos.getBpaMainPKey() + "', ";
      }
    }
    //Remove last occurrence of ","
    pOSBpaMainPKeys = pOSBpaMainPKeys.replace(/,(?=[^,]*$)/, '');
    jsonParams.push({
      "field" : "pOSBpaMainPKeys",
      "operator" : "EQ",
      "value" : pOSBpaMainPKeys
    });

    if(!skipPresettingJobs){
      //Determine relevant jobDefPKeys with lastValue Setting
      var jdList = boJobManager.getLoJobDefinitions().getItemsByParamArray([
        {"presetting": "LastValue", "op": "EQ"},
        {"jobMetaId": "Survey", "op": "EQ"}
      ]);
      var jdIdx = jdList.length;
      var jd;
      while (jdIdx--) {
        jd = jdList[jdIdx];
        jobDefPKeys += "'" + jd.getJobDefinitionPKey() + "', ";
      }
      //Remove last occurrence of ","
      jobDefPKeys = jobDefPKeys.replace(/,(?=[^,]*$)/, '');
      jsonParams.push({
        "field" : "jobDefPKeys",
        "operator" : "EQ",
        "value" : jobDefPKeys
      });
    }
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}