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
 * @function addSurvey
 * @this BoJobManager
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {String} prdMainPKey
 * @param {String} posId
 * @param {String} jobDefMetaPKey
 * @param {LiSurveyColumn} surveyColumn
 * @param {String} value
 */
function addSurvey(prdMainPKey, posId, jobDefMetaPKey, surveyColumn, value){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var loCurrentPOS = me.getLoPOS().getItemsByParam({"posId" : posId});

if (loCurrentPOS.length > 0) {
  var liCurrentPOS = loCurrentPOS[0];

  var surveyItemData = {
    "pKey" : PKey.next(),
    "clbMainPKey" : me.getClbMainPKey(),
    "bpaMainPKey" : me.getBpaMainPKey(),
    "visitDate" : me.getReferenceDate(),
    "visitTime" : me.getTimeFrom(),
    "prdMainPKey" : prdMainPKey,
    "posId" : posId,
    "jobDefinitionMetaPKey" : jobDefMetaPKey,
    "surveyText" : surveyColumn.getJobDefinitionMetaText(),
    "jobDefinitionListText" : "Manual",
    "jobListPKey" : " ",
    "jobMetaPKey" : surveyColumn.getJobMetaPKey(),
    "jobDefinitionPKey" : " ",
    "defaultValue" : 0,
    "pOS" : liCurrentPOS.getIsPOS(),
    "manual" : "1",
    "clbPOSCheckPKey" : liCurrentPOS.getPosId(),
    "prdPOSContentPKey" : liCurrentPOS.getPosContentPKey(),
    "dataType" : surveyColumn.getDataType(),
    "dataLength" : surveyColumn.getDataLength(),
    "toggleId" : surveyColumn.getToggleId(),
    "listed" : "0",
    "planned" : "0",
    "history" : "0",
    "thresholdViolation" : "No",
    "value" : value,
    "done" : Utils.isEmptyString(value) ? "0" : "1",
    "dataWareHouseKey" : surveyColumn.getDataWareHouseKey(),
    "useStepper" : surveyColumn.getUseStepper(),
    "stepSize" : surveyColumn.getStepSize(),
    "considerMinValue" : surveyColumn.getConsiderMinValue(),
    "minValue" : surveyColumn.getMinValue(),
    "minDatePolicy" : surveyColumn.getMinDatePolicy(),
    "considerMaxValue" : surveyColumn.getConsiderMaxValue(),
    "maxValue" : surveyColumn.getMaxValue(),
    "decimalPlaces" : surveyColumn.getDecimalPlaces(),
    "maxDatePolicy" : surveyColumn.getMaxDatePolicy(),
    "hide" : "0",
    "mandatory" : "0",
    "jobActionSuccess" : "None",
    "objectStatus" : STATE.NEW | STATE.DIRTY
  };

  liCurrentPOS.getSurveys().addItem(surveyItemData);
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}