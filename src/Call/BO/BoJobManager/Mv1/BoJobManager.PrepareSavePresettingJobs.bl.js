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
 * @function prepareSavePresettingJobs
 * @this BoJobManager
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @returns promise
 */
function prepareSavePresettingJobs(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
// determine base information for SavePresetting
var promise = me.loadAndSetPrerequisites("SavePresettingPreparation").then(
  function () {
    // FOR SURVEYS
    // BUILD JobDef Dictionary Tree
    var loJobDefs = me.getLoJobDefinitions().getItemsByParamArray([
      { "savePresetting" : "1", "op" : "EQ" },
      { "presetting" : "No", "op" : "NE" },
      { "jobMetaId" : "Survey" }
    ]);
    
    //the following compare functions will ensure the same ordering as expected by the while loop later in the code (sorting LO via FW uses locale based sorting which would result in a different order):
    loJobDefs.sort(function(a,b){
      if (a.getPOS() < b.getPOS()) return -1;
      if (a.getPOS() > b.getPOS()) return 1;
      if (a.getJobDefinitionPKey() < b.getJobDefinitionPKey()) return -1;
      if (a.getJobDefinitionPKey() > b.getJobDefinitionPKey()) return 1;
      return 0;
    });
      
    function comparePresettingProducts(a, b){
      if (a.getPrdMainPKey() < b.getPrdMainPKey()) return -1;
      if (a.getPrdMainPKey() > b.getPrdMainPKey()) return 1;
      return 0;
    }
    function compareExistingSurveys(a, b){
      if (a.getPrdMainPKey() < b.getPrdMainPKey()) return -1;
      if (a.getPrdMainPKey() > b.getPrdMainPKey()) return 1;
      if (a.getJobDefinitionPKey() < b.getJobDefinitionPKey()) return -1;
      if (a.getJobDefinitionPKey() > b.getJobDefinitionPKey()) return 1;
      return 0;
    }
    
    var dicOfJobDefsByPOS = Utils.createDictionary();
    var aJobDefsOfCurrentPOS;
    var slastPOSFlag;
    var sCurrentPOSFlag;
    var relevantPOS;
    var liJobDef;
    var posId;
    var idxJobDef;
    var idxPOS;

    for (idxJobDef = 0; idxJobDef < loJobDefs.length; idxJobDef++) {
      liJobDef = loJobDefs[idxJobDef];

      // filter out targetValue JobDefs without targetValueColumn
      if (liJobDef.getPresetting() === "TargetValue" && liJobDef.getTargetValueColumn() === 0) {
        continue;
      }

      sCurrentPOSFlag = liJobDef.getPOS();
      if (sCurrentPOSFlag !== slastPOSFlag) {
        relevantPOS = me.getLoPOS().getItemsByParam({
          "isPOS" : sCurrentPOSFlag
        });
        slastPOSFlag = sCurrentPOSFlag;
      }
      if (Utils.isDefined(relevantPOS)) {
        for (idxPOS = 0; idxPOS < relevantPOS.length; idxPOS++) {
          posId = relevantPOS[idxPOS].getPosId();
          if (!dicOfJobDefsByPOS.containsKey(posId)) {
            aJobDefsOfCurrentPOS = [];
            dicOfJobDefsByPOS.add(posId, aJobDefsOfCurrentPOS);
          }
          else {
            aJobDefsOfCurrentPOS = dicOfJobDefsByPOS.get(posId);
          }
          aJobDefsOfCurrentPOS.push(liJobDef);
        }
      }
    }
    // BUILD JobDef Dictionary Tree END

    var savePresettingSurveyJobDefsExist = dicOfJobDefsByPOS.keys().length > 0;
    var savePresettingQuestionJobDefsExist = false;

    if (savePresettingSurveyJobDefsExist || savePresettingQuestionJobDefsExist) {
      var loadType = "SavePresetting";
      if (savePresettingSurveyJobDefsExist && !savePresettingQuestionJobDefsExist) {
        loadType = "SavePresettingSurveys";
      }
      else if (!savePresettingSurveyJobDefsExist && savePresettingQuestionJobDefsExist) {
        loadType = "SavePresettingQuestions";
      }

      return me.loadAndSetPrerequisites(loadType).then(
        function () {
          if (savePresettingSurveyJobDefsExist) {
            // SURVEYS
            // expand JobProducts for affected POS ID
            return me.expandJobProducts(dicOfJobDefsByPOS.keys().join()).then(
              function () {
                var idxProduct;
                var loSurveys;
                var presettingProducts;
                var existingSurveys;
                var existingSurveysCount;
                var curSvyIdx = 0;
                var currentLiProductJDLPKeys;
                var currentPrdMainPKey;
                var currentPOSId;
                var currentJobDefPKey;
                var currentLiProduct;
                var currentLiJobDefinition;
                var currentLiPOS;
                var idxJDLJobDef;
                var iJobDefCount = 0;
                var newLiSurvey;
                var newLiSurveyData;
                var currentTargetValue;
                var listed;
                var planned;
                var newSurveys;
                var aPOS = dicOfJobDefsByPOS.keys();
                var dicPosInfo = Utils.createDictionary();
                
                for (idxPOS = 0; idxPOS < me.getLoPOS().getAllItems().length; idxPOS++) {
                  var currentPOS = me.getLoPOS().getAllItems()[idxPOS];
                  dicPosInfo.add(currentPOS.getPosId(), currentPOS);
                }

                for (idxPOS = 0; idxPOS < aPOS.length; idxPOS++) {
                  currentPOSId = aPOS[idxPOS];

                  //using === "" because " " should still go through and utils.isEmptystring considers both as empty
                  if (!Utils.isDefined(currentPOSId) || currentPOSId === "" ) {
                    continue;
                  }

                  aJobDefsOfCurrentPOS = dicOfJobDefsByPOS.get(currentPOSId);
                  if (Utils.isDefined(aJobDefsOfCurrentPOS)) {
                    iJobDefCount = aJobDefsOfCurrentPOS.length;

                    if (iJobDefCount <= 0) {
                      aJobDefsOfCurrentPOS = null;
                    }
                  }

                  if (!Utils.isDefined(aJobDefsOfCurrentPOS)) {
                    continue;
                  }

                  currentLiPOS = dicPosInfo.get(currentPOSId);
                    presettingProducts = currentLiPOS.getSurveyProducts().getAllItems();
                    //use dedicated sort (not FW Lo.sort) to ensure same order that is required for the comparison in the while loop below
                    presettingProducts.sort(comparePresettingProducts);
                    loSurveys = currentLiPOS.getSurveys();
                    existingSurveys = loSurveys.getAllItems();
                    //use dedicated sort (not FW Lo.sort) to ensure same order that is required for the comparison in the while loop below
                    existingSurveys.sort(compareExistingSurveys);
                    existingSurveysCount = existingSurveys.length;

                    newSurveys = [];

                    for (idxProduct = 0; idxProduct < presettingProducts.length; idxProduct++) {
                      currentLiProduct = presettingProducts[idxProduct];
                      currentLiProductJDLPKeys = currentLiProduct.getJDLPKeys();

                      if (Utils.isEmptyString(currentLiProductJDLPKeys)) {
                        continue;
                      }

                      listed = (currentLiProduct.getListedPlanned().indexOf("L")) === -1 ? "0" : "1";
                      planned = (currentLiProduct.getListedPlanned().indexOf("P")) === -1 ? "0" : "1";
                      currentPrdMainPKey = currentLiProduct.getPrdMainPKey();

                      for (idxJDLJobDef = 0; idxJDLJobDef < iJobDefCount; idxJDLJobDef++) {
                        currentLiJobDefinition = aJobDefsOfCurrentPOS[idxJDLJobDef];
                        currentJobDefPKey = currentLiJobDefinition.getJobDefinitionPKey();

                        if (currentLiProductJDLPKeys.indexOf(currentLiJobDefinition.getJobDefListPKey()) < 0) {
                          continue;
                        }

                        // move existingSurveys pointer to correct position
                        while (curSvyIdx < existingSurveysCount &&
                               (existingSurveys[curSvyIdx].getPosId() < currentPOSId ||
                                (existingSurveys[curSvyIdx].getPosId() === currentPOSId && existingSurveys[curSvyIdx].getPrdMainPKey() < currentPrdMainPKey) ||
                                (existingSurveys[curSvyIdx].getPosId() === currentPOSId && existingSurveys[curSvyIdx].getPrdMainPKey() === currentPrdMainPKey &&
                                 existingSurveys[curSvyIdx].getJobDefinitionPKey() < currentJobDefPKey))) {
                          if (curSvyIdx + 1 >= existingSurveysCount) {
                            break;
                          }
                          curSvyIdx += 1;
                        }

                        if (curSvyIdx < existingSurveysCount && existingSurveys[curSvyIdx].getPosId() === currentPOSId &&
                            existingSurveys[curSvyIdx].getPrdMainPKey() === currentPrdMainPKey &&
                            existingSurveys[curSvyIdx].getJobDefinitionPKey() === currentJobDefPKey) {
                          if (!Utils.isEmptyString(existingSurveys[curSvyIdx].getValue())) {
                            // assimilate lastValueSurvey
                            if (existingSurveys[curSvyIdx].getClbMainPKey() !== me.getClbMainPKey()) {
                              me.assimilateSurvey(existingSurveys[curSvyIdx], listed, planned, dicPosInfo.get(currentPOSId).getPosContentPKey());
                            }
                            existingSurveys[curSvyIdx].setDone("1");
                          }
                        }
                        else {
                          if ((currentLiJobDefinition.getPresetting() === "TargetValue") && (currentLiJobDefinition.getTargetValueColumn() != 0)) {
                            // create new survey
                            currentTargetValue = currentLiProduct["getPresetting" + currentLiJobDefinition.getTargetValueColumn()]();
                            if (!Utils.isEmptyString(currentTargetValue)) {
                              newLiSurveyData = {
                                "pKey" : PKey.next(),
                                "bpaMainPKey" : me.getBpaMainPKey(),
                                "clbMainPKey" : me.getClbMainPKey(),
                                "done" : "1",
                                "jobActionSuccess" : currentLiJobDefinition.getJobActionSuccess(),
                                "jobDefinitionMetaPKey" : currentLiJobDefinition.getJobDefinitionMetaPKey(),
                                "jobDefinitionPKey" : currentJobDefPKey,
                                "jobListPKey" : currentLiJobDefinition.getJobListPKey(),
                                "jobMetaPKey" : currentLiJobDefinition.getJobMetaPKey(),
                                "mandatory" : currentLiJobDefinition.getMandatory(),
                                "manual" : "0",
                                "history" : "0",
                                "prdMainPKey" : currentPrdMainPKey,
                                "sort" : currentLiJobDefinition.getSort(),
                                "value" : currentTargetValue,
                                "visitDate" : me.getReferenceDate(),
                                "visitTime" : me.getTimeFrom(),
                                "clbPOSCheckPKey" : currentPOSId,
                                "pOS" : currentPOSId === " " ? "0" : "1",
                                "listed" : listed,
                                "planned" : planned,
                                "prdPOSContentPKey" : currentLiPOS.getPosContentPKey(),
                                "targetValue" : currentTargetValue,
                                "surveyText" : currentLiJobDefinition.getJobDefinitionMetaText(),
                                "thresholdViolation" : "No",
                                "posId" : currentPOSId,
                                "objectStatus" : STATE.NEW | STATE.DIRTY
                              };
                              newSurveys.push(newLiSurveyData);
                            }
                          }
                        }
                      }
                    }
                    if (newSurveys.length > 0){
                      loSurveys.addItems(newSurveys);
                    }
                }
              });
          }
        });
    }
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}