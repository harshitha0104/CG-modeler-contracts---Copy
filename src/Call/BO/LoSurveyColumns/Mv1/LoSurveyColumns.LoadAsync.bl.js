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
 * @function loadAsync
 * @this LoSurveyColumns
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @returns promise
 */
function loadAsync(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var surveyColumnList = [];

/* STORE surveys */

var surveyColumn1 = {
  "displayColumnIndex" : "1",
  "displayColumnName" : "svyFacings",
  "displayColumnNameCapitalized" : "SvyFacings",
  "jobMetaId" : "53001"
};

var surveyColumn2 = {
  "displayColumnIndex" : "2",
  "displayColumnName" : "svyPrice",
  "displayColumnNameCapitalized" : "SvyPrice",
  "jobMetaId" : "53002"
};

var surveyColumn3 = {
  "displayColumnIndex" : "3",
  "displayColumnName" : "svyDistributed",
  "displayColumnNameCapitalized" : "SvyDistributed",
  "jobMetaId" : "53003"
};

/* POS surveys */

var surveyColumn4 = {
  "displayColumnIndex" : "4",
  "displayColumnName" : "svyPosFacings",
  "displayColumnNameCapitalized" : "SvyPosFacings",
  "jobMetaId" : "540041",
  "measureType" : "POS"
};

var surveyColumn6 = {
  "displayColumnIndex" : "6",
  "displayColumnName" : "svyPosDistributed",
  "displayColumnNameCapitalized" : "SvyPosDistributed",
  "jobMetaId" : "54003",
  "measureType" : "POS"
};

var surveyColumn5 = {
  "displayColumnIndex" : "5",
  "displayColumnName" : "svyPosPrice",
  "displayColumnNameCapitalized" : "SvyPosPrice",
  "jobMetaId" : "54002",
  "measureType" : "POS"
};

surveyColumnList.push(surveyColumn1);
surveyColumnList.push(surveyColumn2);
surveyColumnList.push(surveyColumn3);
surveyColumnList.push(surveyColumn4);
surveyColumnList.push(surveyColumn5);
surveyColumnList.push(surveyColumn6);

var surveyColumnListIdx;
var sJobDefMetaIds = "";
for (surveyColumnListIdx = 0; surveyColumnListIdx < surveyColumnList.length; surveyColumnListIdx++) {
  if (surveyColumnListIdx > 0){
    sJobDefMetaIds += ",";
  }
  sJobDefMetaIds += "'" + surveyColumnList[surveyColumnListIdx].jobMetaId + "'";
}

me.addItems(surveyColumnList);

var jsonParams = {};
jsonParams.jobDefinitionMetaIds = sJobDefMetaIds;

var promise = Facade.selectSQL("DsLoJobDefinitionMetas", "JobDefinitionMetaInfoById", jsonParams)
.then(function(list){
  var rowList = list.getResultData();
  var rowData;
  var rowDataFound;
  var orderedSurveyColumns = me.getItemsByParamArray([], [{"jobMetaId" : "ASC"}]);
  var rowDataDic = Utils.createDictionary();

  rowList.forEach(function(rowListElement){
    rowData = rowListElement.data.rowData;
    rowDataDic.add(rowData.jobMetaId, rowData);
  });

  orderedSurveyColumns.forEach(function(column){
    rowDataFound = rowDataDic.get(column.getJobMetaId());
    if(Utils.isDefined(rowDataFound)){
      column.updateProperties(rowDataFound);
    }
  });

  return me;
});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}