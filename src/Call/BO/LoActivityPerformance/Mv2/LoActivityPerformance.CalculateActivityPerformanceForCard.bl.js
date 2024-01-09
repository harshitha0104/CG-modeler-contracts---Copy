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
 * @function calculateActivityPerformanceForCard
 * @this LoActivityPerformance
 * @kind listobject
 * @async
 * @namespace CORE
 * @param {Object} boJobManager
 * @param {Object} loQuestions
 * @returns promise
 */
function calculateActivityPerformanceForCard(boJobManager, loQuestions){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var jsonParams = [];

jsonParams.push({
  'field': 'clbMainPKey',
  'operator': 'EQ',
  'value': boJobManager.getClbMainPKey(),
},{
  'field': 'clbMetaPKey',
  'operator': 'EQ',
  'value': boJobManager.getClbMetaPKey(),
},{
  'field': 'bpaMainPKey',
  'operator': 'EQ',
  'value': boJobManager.getBpaMainPKey(),
},{
  'field': 'validFrom',
  'operator': 'EQ',
  'value': Utils.convertForDBParam(boJobManager.getReferenceDate(), 'DomDate'),
},{
  'field': 'validThru',
  'operator': 'EQ',
  'value': Utils.convertForDBParam(boJobManager.getReferenceDate(), 'DomDate'),
},{
  'field': 'ownerPKey',
  'operator': 'EQ',
  'value': boJobManager.getOwnerPKey(),
});

var jsonQuery = {};
jsonQuery.params = jsonParams;
var relevantActivity = [];

var promise = BoFactory.loadObjectByParamsAsync('LoActivityPerformance',jsonQuery)
.then(function(loActivityPerformance) {
  var performanceRelevantActivities = loActivityPerformance.getAllItems();
  var activityScoreDict = Utils.createDictionary();
  var initialBadgeActivityIconDict = Utils.createDictionary();
  var fulfilledBadgeActivityIconDict = Utils.createDictionary();
  var relevantActivityDict = Utils.createDictionary();

  performanceRelevantActivities.forEach(function(activity) {
    activityScoreDict.add(activity.getPKey(), 0);
    if(activity.getUsage() == 'InitialBadge' && (!initialBadgeActivityIconDict.containsKey(activity.getPKey()))) {
      initialBadgeActivityIconDict.add(activity.getPKey(), activity);
    }
    else if(activity.getUsage() == 'FulfilledBadge' && (!fulfilledBadgeActivityIconDict.containsKey(activity.getPKey()))){
      fulfilledBadgeActivityIconDict.add(activity.getPKey(), activity);
    }
  });

  //Calculate sum of answered activity score questions
  var questions = loQuestions.getAllItems();
  questions.forEach(function(question) {
    var questionDoneAndVisible = (question.getVisible() == '1' && question.getDone() == '1');
    var scoreRelevantToggleQuestion = (question.getConsiderScore() == 'Yes' && !Utils.isEmptyString(question.getScoreAnswers()) && question.getDataType() == 'Toggle');

    if (activityScoreDict.containsKey(question.getJobDefListPKey()) && questionDoneAndVisible && scoreRelevantToggleQuestion) {
      // Split score answers string to check if answer value (including empty answer) is a valid score answer
      var scoreAnswers = question.getScoreAnswers().slice(0, question.getScoreAnswers().length - 1).split(';');
      for (var selectedAnswer = 0; selectedAnswer < scoreAnswers.length; selectedAnswer++) {
        var answerAndValueEmptyString = (Utils.isEmptyString(question.getValue()) && Utils.isEmptyString(scoreAnswers[selectedAnswer]));
        if (answerAndValueEmptyString || question.getValue() == scoreAnswers[selectedAnswer]) {
          activityScoreDict.data[question.getJobDefListPKey()] = activityScoreDict.get(question.getJobDefListPKey())  + question.getScore();
          break;
        }
      }
    }
  });

  // Calculate threshold for each performance related activity
  performanceRelevantActivities.forEach(function(activity) {
    if(activityScoreDict.containsKey(activity.getPKey()) && (!relevantActivityDict.containsKey(activity.getPKey()))) {
      var threshold = Utils.round(((activityScoreDict.get(activity.getPKey()) / activity.getActivityScore()) * 100), 0, 1);
      var thresholdText = threshold + ' %';
      var mediaPath = ' ';
      var fileType = ' ' ;
      var usage = ' ' ;
      activity.setThresholdText(thresholdText);

      if(threshold >= activity.getThresholdFulfilled()) {
        activity.setThresholdIcon('IndicatorGreen');
        if(fulfilledBadgeActivityIconDict.containsKey(activity.getPKey())) {
          mediaPath = fulfilledBadgeActivityIconDict.get(activity.getPKey()).getMediaPath();
          fileType = fulfilledBadgeActivityIconDict.get(activity.getPKey()).getFileType();
          usage = fulfilledBadgeActivityIconDict.get(activity.getPKey()).getUsage();
        }
      }
      else if (threshold >= activity.getThresholdPartiallyFulfilled() && threshold < activity.getThresholdFulfilled()) {
        activity.setThresholdIcon('IndicatorYellow');
        if(initialBadgeActivityIconDict.containsKey(activity.getPKey())) {
          mediaPath = initialBadgeActivityIconDict.get(activity.getPKey()).getMediaPath();
          fileType = initialBadgeActivityIconDict.get(activity.getPKey()).getFileType();
          usage = initialBadgeActivityIconDict.get(activity.getPKey()).getUsage();
        }
      }
      else if (threshold < activity.getThresholdPartiallyFulfilled()) {
        activity.setThresholdIcon('IndicatorRed');
        if(initialBadgeActivityIconDict.containsKey(activity.getPKey())) {
          mediaPath = initialBadgeActivityIconDict.get(activity.getPKey()).getMediaPath();
          fileType = initialBadgeActivityIconDict.get(activity.getPKey()).getFileType();
          usage = initialBadgeActivityIconDict.get(activity.getPKey()).getUsage();
        }
      }

      if(Utils.isDefined(activity.getPromotionId()) && !Utils.isEmptyString(activity.getPromotionId()) && Utils.isDefined(activity.getPromotionDescription()) && !Utils.isEmptyString(activity.getPromotionDescription())) {
        var promotionDateFrom = Localization.localize(activity.getPromotionDateFrom(), 'date');
        var promotionDateThru = Localization.localize(activity.getPromotionDateThru(), 'date');
        var displayText = promotionDateFrom + ' - ' + promotionDateThru ;
        activity.setPromotionDateText(displayText);
      }
      activity.setMediaPath(mediaPath);
      activity.setFileType(fileType);
      activity.setUsage(usage);
      relevantActivityDict.add(activity.getPKey(), activity);
      relevantActivity.push(activity);
    }
  });

  me.cardItemCount = relevantActivity.length;
  me.removeAllItems();
  me.addItems(relevantActivity);
});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}