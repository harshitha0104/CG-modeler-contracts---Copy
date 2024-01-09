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
 * @function getQuestions
 * @this BoJobManager
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {String} posId
 * @param {DomBool} ignoreCallState
 */
function getQuestions(posId, ignoreCallState){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
//for the specified POS collect all the answered questions and create the questions which have not been answered
//all the relevant data for questions and survey has already been loaded cnetrally on call level
var liCurrentPOS = me.getLoPOS().getItemsByParam({"posId": posId})[0];

faultyJobDefs = me.getLoJobDefinitions().getItemsByParam({
                "dataType": "Toggle",
                "toggleId": " ",
              });
for (idxFaultyJobDefs = 0; idxFaultyJobDefs < faultyJobDefs.length; idxFaultyJobDefs++) {
  AppLog.error("A question/survey was defined as Toggle, but the Name of the used Data Type doesn't start with 'Dom'. This will lead to an exception when this question has to be shown in UI. Id of corresponding Job Definition Template: '" + faultyJobDefs[idxFaultyJobDefs].jobDefinitionMetaPKey + "'");
}

if (Utils.isDefined(liCurrentPOS) && liCurrentPOS.getQuestionsInitialized()!=="1" && (me.getClbStatus() == "Planned" || ignoreCallState)) {
  var jobDefs = me.getLoJobDefinitions().getItemsByParam({"jobMetaId":"Question", "pOS": liCurrentPOS.getIsPOS()});
  var dicExistingJobs = {};
  var existingJobsOfThisCall = me.getLoQuestions().getAllItems();
  var dicKey;
  //creating dictionary to store all answered Questions which have either been answered in this call or historical question from previous calls
  //in order to store them for easier and faster access later
  //#########starting to build dict
  if (jobDefs.length > 0 && Utils.isDefined(existingJobsOfThisCall)) {
    var sPosBpaMainPKey = liCurrentPOS.getPosId() === " " ? " " : liCurrentPOS.getBpaMainPKey();
    var currentJob;
    var idxJobMains;

    // questions answered in this call
    for (idxJobMains=0; idxJobMains < existingJobsOfThisCall.length; idxJobMains++) {
      currentJob = existingJobsOfThisCall[idxJobMains];
      if (currentJob.posId == liCurrentPOS.getPosId() && currentJob.prdMainPKey == " ") {
        dicKey = currentJob.getJobDefinitionPKey() + currentJob.getJobListPKey();
        dicExistingJobs[dicKey] = true;
      }
    }

    // questions answered in previous calls
    var existingJobListJobs = me.getLoExistingJobListJobs().getAllItems();
    for (idxJobMains=0; idxJobMains < existingJobListJobs.length; idxJobMains++) {
      currentJob = existingJobListJobs[idxJobMains];
      if(currentJob.posBpaMainPKey == sPosBpaMainPKey && currentJob.prdMainPKey == " " && (currentJob.jobDefListPKey != " ")) {
        dicKey = currentJob.getJobDefinitionPKey() + currentJob.getJobListPKey();
        var ex = !(dicKey in dicExistingJobs);
        dicExistingJobs[dicKey] = true;
      }
    }
  }
  //######### dict built

  var questionlist = [];
  var liPOSCount = 0;

  for (var idxQuestions = 0; idxQuestions < jobDefs.length; idxQuestions++) {
    var questionJobDef = jobDefs[idxQuestions];

    //Build JobDefinitionListText for questions to group those together on UI
    if (questionJobDef.getJdlDescriptionInitialized() === "0" && Utils.isDefined(questionJobDef.getPromotionId()) && (!Utils.isEmptyString(questionJobDef.getPromotionId()))) {
      if (Utils.isDefined(questionJobDef.getPromotionSlogan()) &&  questionJobDef.getPromotionSlogan() !== null) {
        var promotionDateFrom = Localization.localize(questionJobDef.promotionDateFrom, "date");
        var promotionDateThru = Localization.localize(questionJobDef.promotionDateThru, "date");
        var displayText = questionJobDef.getJobDefinitionListText() + ' | ' + questionJobDef.getPromotionSlogan() + ' | ' + promotionDateFrom + ' - ' + promotionDateThru ;
        questionJobDef.setJobDefinitionListText(displayText);
        questionJobDef.setJdlDescriptionInitialized("1");
      }
    }

    // Check whether the question has already been answered in this call or a in a previous call
    dicKey = questionJobDef.getJobDefinitionPKey() + questionJobDef.getJobListPKey();
    var createQuestion = !(dicKey in dicExistingJobs);
    var isStorePOS = (Utils.isEmptyString(questionJobDef.getPosMetaPKey()) && Utils.isEmptyString(questionJobDef.getPosType()));
    var matchingPOS = ((questionJobDef.getPosMetaPKey() === liCurrentPOS.getPosMetaPKey()) || (questionJobDef.getPosType() === liCurrentPOS.getMetaType()));
    if ( (isStorePOS || matchingPOS) || (liCurrentPOS.getIsPOS() === "0" && Utils.isDefined(existingJobsOfThisCall) ) ) {
      if (createQuestion) {
        var questionitem = {
          "pKey" : PKey.next(),
          "jobDefinitionListText" : questionJobDef.getJobDefinitionListText(),
          "questionText" : questionJobDef.getJobDefinitionMetaText(),
          "dataType" : questionJobDef.getDataType(),
          "dataLength" : questionJobDef.getDataLength(),
          "toggleId" : questionJobDef.getToggleId(),
          "useStepper" : questionJobDef.getUseStepper(),
          "stepSize" : questionJobDef.getStepSize(),
          "considerMinValue" : questionJobDef.getConsiderMinValue(),
          "minValue" : questionJobDef.getMinValue(),
          "minDatePolicy" : questionJobDef.getMinDatePolicy(),
          "considerMaxValue" : questionJobDef.getConsiderMaxValue(),
          "maxValue" : questionJobDef.getMaxValue(),
          "decimalPlaces" : questionJobDef.getDecimalPlaces(),
          "maxDatePolicy" : questionJobDef.getMaxDatePolicy(),
          "jobDefinitionMetaPKey" : questionJobDef.getJobDefinitionMetaPKey(),
          "jobDefinitionPKey" : questionJobDef.getJobDefinitionPKey(),
          "jobListPKey" : questionJobDef.getJobListPKey(),
          "jobMetaPKey": questionJobDef.getJobMetaPKey(),
          "clbPOSCheckPKey" : liCurrentPOS.getPosId(),
          "pOS" : questionJobDef.getPOS(),
          "posId" : liCurrentPOS.getPosId(),
          "bpaMainPKey" : me.getBpaMainPKey(),
          "clbMainPKey" : me.getClbMainPKey(),
          "jobActionSuccess" : questionJobDef.getJobActionSuccess(),
          "mandatory" : questionJobDef.getMandatory(),
          "mandatoryImageId" : (questionJobDef.getMandatory() == "1") ? "Mandatory": "EmptyImage",
          "cameraIcon" : (questionJobDef.getPictureTaking() == "1") ? "CapturePictureIcon" : "EmptyImage",
          "listed" : "0",
          "planned" : "0",
          "prdPOSContentPKey" : liCurrentPOS.getPosContentPKey(),
          "manual" : "0",
          "prdMainPKey" : " ",
          "done" : "0",
          "sort" : questionJobDef.getSort(),
          "visitDate" : me.getReferenceDate(),
          "visitTime" : me.getTimeFrom(),
          "value" : (Utils.isEmptyString(questionJobDef.getDefaultValue())) ? " ": questionJobDef.getDefaultValue(),
          "defaultValue" : (Utils.isEmptyString(questionJobDef.getDefaultValue())) ? " ": questionJobDef.getDefaultValue(),
          "conditionOperator" : questionJobDef.getConditionOperator(),
          "conditionAnswers" : questionJobDef.getConditionAnswers(),
          "condition" : questionJobDef.getCondition(),
          "considerScore" : questionJobDef.getConsiderScore(),
          "score" : questionJobDef.getScore(),
          "scoreAnswers" : questionJobDef.getScoreAnswers(),
          "jobDefListPKey" : questionJobDef.getJobDefListPKey(),
          "visible" : "0",
          "lastValue" : " ",
          "history" : " ",
          "targetValue" : " ",
          "thresholdViolation" : "No",
          "objectStatus" : STATE.NEW
        };
        questionlist.push(questionitem);
      }
      else {
        //Update questions which are either answered in current call or previous call
        for (var question = 0; question < existingJobsOfThisCall.length; question++) {
          var answeredQuestion = existingJobsOfThisCall[question];
          var answeredQuestionJobDefinitionPKey = answeredQuestion.getJobDefinitionPKey();
          var jobDefinitionPKey = questionJobDef.getJobDefinitionPKey();
          var answeredQuestionJobListPKey = answeredQuestion.getJobListPKey();
          var jobListPKey = questionJobDef.getJobListPKey();

          me.getLoQuestions().suspendListRefresh();
          if (answeredQuestionJobDefinitionPKey === jobDefinitionPKey && answeredQuestionJobListPKey === jobListPKey) {
            answeredQuestion.setJobDefinitionListText(questionJobDef.getJobDefinitionListText());
          }
          if (answeredQuestion.getDataType() === 'Date' && Utils.isEmptyString(answeredQuestion.getValue)) {
            answeredQuestion.setValue(Utils.getMinDate());
          }
          me.getLoQuestions().resumeListRefresh(true);
        }
      }
    }
    liPOSCount++;
  }
  liCurrentPOS.setQuestionCount(liPOSCount);
  liCurrentPOS.setQuestionsInitialized("1");
  var loQuestions= me.getLoQuestions();
  loQuestions.addListItems(questionlist);
  
  /**
  *   There was an Fix in Nov 2022 Drop to set first item.
  *   It was not working in all scenarios hence implemented it differently
  *   questionList is not sorted in the same way as loQuestions
  *   see filterQuestions for current implementation
  *
  *   Nov 2022 fix not taken: if(questionlist.length > 0) loQuestions.setCurrentByPKey(questionlist[0].pKey);
  */
  
  me.setQuestionsInitialized("1");
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}