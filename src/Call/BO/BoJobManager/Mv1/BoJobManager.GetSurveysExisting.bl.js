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
 * @function getSurveysExisting
 * @this BoJobManager
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {String} posId
 * @param {String} prdMainPKey
 * @param {String} jobProductPKey
 */
function getSurveysExisting(posId, prdMainPKey, jobProductPKey){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
if (Utils.isDefined(prdMainPKey)) {
  var loCurrentPOS = me.getLoPOS().getItemsByParam({"posId" : posId});

  if (loCurrentPOS.length > 0) {
    var liCurrentPOS = loCurrentPOS[0];
    var loCurrentProduct = liCurrentPOS.getSurveyProducts().getItemsByParam({"pKey" : jobProductPKey});

    if (loCurrentProduct.length > 0 && loCurrentProduct[0].getSurveysInitialized() !== "1") {
      var liSurveyProduct = loCurrentProduct[0];
      var loSurveys = liCurrentPOS.getSurveys();

      var existingJobMainSurveys = loSurveys.getItemsByParamArray([{"prdMainPKey" : liSurveyProduct.getPrdMainPKey()}],
                                                                  [{"jobDefinitionMetaPKey" : "ASC"}]);

      var currentPOSColumnSurveys = me.getLoSurveyColumns().getItemsByParamArray([{"measureType" : ((posId === " ") ? "Store" : "POS")}],
                                                                                 [{"jobDefinitionMetaPKey" : "ASC"}]);

      var continueWhile = true;
      var idxMatrixColumn = 0;
      var idxJobMain = 0;
      var currentJobMainJobDefMetaPKey;
      var currentMatrixSurveyJobDefMetaPKey;
      var dicMatrixJobDefs = Utils.createDictionary();
      var idxJobSurvey;

      //Show all the existing suverys
      for (idxJobSurvey = 0; idxJobSurvey < existingJobMainSurveys.length; idxJobSurvey++) {
        existingJobMainSurveys[idxJobSurvey].setHide("0");
      }


      if (idxJobMain < existingJobMainSurveys.length && idxMatrixColumn < currentPOSColumnSurveys.length) {
        currentJobMainJobDefMetaPKey = existingJobMainSurveys[idxJobMain].getJobDefinitionMetaPKey();
        currentMatrixSurveyJobDefMetaPKey = currentPOSColumnSurveys[idxMatrixColumn].getJobDefinitionMetaPKey();
        while (continueWhile) {
          if (currentJobMainJobDefMetaPKey > currentMatrixSurveyJobDefMetaPKey) {
            idxMatrixColumn += 1;
            if (idxMatrixColumn >= currentPOSColumnSurveys.length) {
              continueWhile = false;
            } else {
              currentMatrixSurveyJobDefMetaPKey = currentPOSColumnSurveys[idxMatrixColumn].getJobDefinitionMetaPKey();
            }
          } else {

            if (currentJobMainJobDefMetaPKey === currentMatrixSurveyJobDefMetaPKey) {
              dicMatrixJobDefs.add(currentMatrixSurveyJobDefMetaPKey);
              existingJobMainSurveys[idxJobMain].setHide("1");
            }

            idxJobMain += 1;
            if (idxJobMain >= existingJobMainSurveys.length) {
              continueWhile = false;
            } else {
              currentJobMainJobDefMetaPKey = existingJobMainSurveys[idxJobMain].getJobDefinitionMetaPKey();
            }
          }
        }
      }

      var surveylist = [];
      var bpaMainPKey = me.getBpaMainPKey();
      var clbMainPKey = me.getClbMainPKey();

      //Add Matrix Surveys
      var currentPOSColumnSurvey;
      var idxColumn;

      var sProductPrefix = Localization.resolve('surveyDetailProductPrefix');
      if (Utils.isEmptyString(sProductPrefix)) {
        sProductPrefix = "";
      }

      for (idxColumn = 0; idxColumn < currentPOSColumnSurveys.length; idxColumn++) {
        currentPOSColumnSurvey = currentPOSColumnSurveys[idxColumn];

        if (dicMatrixJobDefs.containsKey(currentPOSColumnSurvey.getJobDefinitionMetaPKey())) {
          var newLiColumnSurvey = {
            "pKey" : PKey.next(),
            "prdMainPKey" : prdMainPKey,
            "posId" : posId,
            "surveyText" : currentPOSColumnSurvey.getJobDefinitionMetaText(),
            "jobDefinitionListText" : sProductPrefix + liSurveyProduct.getShortText(),
            "dataType" : currentPOSColumnSurvey.getDataType(),
            "dataLength" : currentPOSColumnSurvey.getDataLength(),
            "toggleId" : currentPOSColumnSurvey.getToggleId(),
            "bpaMainPKey" : bpaMainPKey,
            "clbMainPKey" : clbMainPKey,
            "done" : "0",
            "jobActionSuccess" : " ",
            "jobDefinitionMetaPKey" : currentPOSColumnSurvey.getJobDefinitionMetaPKey(),
            "jobDefinitionPKey" : " ",
            "jobMetaPKey" : currentPOSColumnSurvey.getJobMetaPKey(),
            "jobListPKey" : " ",
            "mandatory" : currentPOSColumnSurvey.getMandatory(),
            "mandatoryImageId" : (currentPOSColumnSurvey.getMandatory() == "1") ? "Mandatory" : "EmptyImage",
            "manual" : "0",
            "sort" : "" + currentPOSColumnSurvey.getDisplayColumnIndex(),
            "clbPOSCheckPKey" : posId,
            "pOS" : ((currentPOSColumnSurvey.getMeasureType() === "Store") ? "0" : "1"),
            "defaultValue" : " ",
            "lastValue" : " ",
            "history" : " ",
            "targetValue" : " ",
            "thresholdViolation" : "No",
            "dataWareHouseKey" : currentPOSColumnSurvey.getDataWareHouseKey(),
            "groupSort" : " ",
            "hide" : "0",
            "value" : liSurveyProduct["get" + currentPOSColumnSurvey.getDisplayColumnNameCapitalized()](),
            "objectStatus": STATE.NEW
          };

          if(newLiColumnSurvey.toggleId == "DomPrdDistributed" && (Utils.isEmptyString(newLiColumnSurvey.value) || newLiColumnSurvey.value == "0")) {
            newLiColumnSurvey.value= 'Distributed';
          }
          surveylist.push(newLiColumnSurvey);
        }
      }

      if (surveylist.length > 0) {
        loSurveys.addItems(surveylist);
      }
      liSurveyProduct.setSurveysInitialized("1");
    }
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}