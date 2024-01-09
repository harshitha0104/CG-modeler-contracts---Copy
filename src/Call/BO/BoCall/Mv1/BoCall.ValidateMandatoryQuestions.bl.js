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
 * @function validateMandatoryQuestions
 * @this BoCall
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @returns promise
 */
function validateMandatoryQuestions(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var messageCollector = new MessageCollector();
var newError;
var promise;
var storeQuestions = []; 
var posQuestions = [];

if (me.getClbStatus()==="Completed" && me.getOriginalClbStatus()!=="Completed") {
  promise = me.getBoJobManager().loadAndSetPrerequisites("Questions")
    .then(function() {
    var liJobDef;
    var questionsCount;
    var previousQuestionsCount;
    var expectedQuestionCount;
    var lastDemagnetizedJobListPKey = "";
    var iStoreQuestionIndex = 0;
    var iPOSQuestionIndex = 0;
    var boJobManager = me.getBoJobManager();
    var jobDefsItems = boJobManager.getLoJobDefinitions().getAllItems();
    var questionItems = boJobManager.getLoQuestions().getAllItems();
    var existingJobListJobsItems = boJobManager.getLoExistingJobListJobs().getAllItems();
    var posItems = boJobManager.getLoPOS().getAllItems();
    var loMagnetizedJobList = boJobManager.getLoMagnetizedJobList();

    jobDefsItems.sort(function(a,b){return (a.getJobDefListPKey() === b.getJobDefListPKey()) ? 0 : ((a.getJobDefListPKey() < b.getJobDefListPKey()) ? -1 : 1);});

    // Initialise and evaluate all the questions
    // Store all the available pos in dictionary 
    var posDict = Utils.createDictionary();
    var posCount = 0;

    posItems.forEach(function(pos) {
      posDict.add(pos.getPosId(), pos);
      if(pos.getQuestionsInitialized() == "0") {
        boJobManager.getQuestions(pos.getPosId(), true);
      }    
      if(pos.getIsPOS() == "1") {
        posCount ++; 
      } 
    });
    boJobManager.evaluateQuestions(questionItems);

    // Store visible mandatory questions which aren't answered in dictionary
    // Store answered question count in dictionary
    var visibleMandatoryQuesDict = Utils.createDictionary();
    var questionCountDict = Utils.createDictionary();

    questionItems.forEach(function(question) {
      if(question.getMandatory() == "1" && question.getVisible() == "1" && question.getDone() == "0") {
        visibleMandatoryQuesDict.add(question.getJobDefinitionPKey().trim() + question.getPosId().trim(), question);
      }      
      if(question.getDone() == "1") {
        if(!questionCountDict.containsKey(question.getJobDefinitionPKey())) {
          questionCountDict.add(question.getJobDefinitionPKey(), 1);
        }
        else {
          questionCountDict.data[question.getJobDefinitionPKey()] = questionCountDict.get(question.getJobDefinitionPKey()) + 1;
        }
      }
    });

    // Store existing job list jobs count in dictionary
    var prevQuestionCountDict = Utils.createDictionary();

    existingJobListJobsItems.forEach(function(jobListJob) {
      if(!prevQuestionCountDict.containsKey(jobListJob.getJobDefinitionPKey())) {
        prevQuestionCountDict.add(jobListJob.getJobDefinitionPKey(), 1);
      }
      else {
        prevQuestionCountDict.data[jobListJob.getJobDefinitionPKey()] = prevQuestionCountDict.get(jobListJob.getJobDefinitionPKey()) + 1;
      }
    });

    for(var i = 0; i < jobDefsItems.length; i++) {
      expectedQuestionCount = 0;
      liJobDef = jobDefsItems[i];

      if (liJobDef.getJobActionSuccess() !== "None" && liJobDef.getJobMetaId() === "Question") {

        questionsCount = questionCountDict.containsKey(liJobDef.getJobDefinitionPKey()) ? questionCountDict.get(liJobDef.getJobDefinitionPKey()) : 0;
        previousQuestionsCount = prevQuestionCountDict.containsKey(liJobDef.getJobDefinitionPKey()) ? prevQuestionCountDict.get(liJobDef.getJobDefinitionPKey()) : 0;

        if(Utils.isEmptyString(liJobDef.getPosType()) && Utils.isEmptyString(liJobDef.getPosMetaPKey()) && liJobDef.getPOS() == "1") {
          // When question is present in all pos
          expectedQuestionCount = posCount;
        } else {
          // When question is present only in one pos or store        
          expectedQuestionCount = 1;
        }

        if (questionsCount + previousQuestionsCount < expectedQuestionCount) {
          if(liJobDef.getJobActionSuccess() === "Validation") {
            if(liJobDef.getPOS() == "0" && storeQuestions.indexOf(liJobDef.getJobDefinitionMetaText()) == -1 && visibleMandatoryQuesDict.containsKey(liJobDef.getJobDefinitionPKey())) {
              storeQuestions[iStoreQuestionIndex] = liJobDef.getJobDefinitionMetaText();
              iStoreQuestionIndex++;              
            }
            else {                                                        
              if (posQuestions.indexOf(liJobDef.getJobDefinitionMetaText()) == -1) {
                for (var key in posDict.data) {
                  if(!Utils.isEmptyString(key)) {
                    var currentPosId = posDict.get(key).getPosId();
                    if(visibleMandatoryQuesDict.containsKey(liJobDef.getJobDefinitionPKey() + currentPosId) && posQuestions.indexOf(liJobDef.getJobDefinitionMetaText()) == -1) {
                      posQuestions[iPOSQuestionIndex] =liJobDef.getJobDefinitionMetaText();
                      iPOSQuestionIndex++;	
                    }
                  }              
                }   
              }
            }
          }
          else if(liJobDef.getJobActionSuccess() === "Detach" && liJobDef.getStandardJobs() == "0") {
            //detach in magnetizejoblist
            if (lastDemagnetizedJobListPKey !== liJobDef.getJobListPKey()) {
              var loMagnetizedJobs = loMagnetizedJobList.getItemsByParam({"pKey": liJobDef.getJobListPKey()});
              if(loMagnetizedJobs.length > 0) {
                loMagnetizedJobs[0].setDemagnetizeOnSave("1");
                lastDemagnetizedJobListPKey = liJobDef.getJobListPKey();
              }
            }
          }
        }
      }
    }    
    if (storeQuestions.length > 0) {
      newError = {"level": "error", 
                  "objectClass": "BoCall", 
                  "simpleProperty": " ", 
                  "messageID": "CasClbNotAllMandatoryStoreQuestionsAnswered",
                  "messageParams":{"questions":"\n" + storeQuestions.join("\n") + "\n"}};
      messageCollector.add(newError);
    }
    if (posQuestions.length > 0) {
      newError = {"level": "error", 
                  "objectClass": "BoCall", 
                  "simpleProperty": " ", 
                  "messageID": "CasClbNotAllMandatoryPOSQuestionsAnswered",
                  "messageParams":{"questions":"\n" + posQuestions.join("\n") + "\n"}};
      messageCollector.add(newError);
    }
    return me.validateMandatorySurveys();
  }).then(function(surveyMessageCollector) {
    if (messageCollector.getMessages().length > 0 || surveyMessageCollector.getMessages().length > 0) {
      var buttonValues = {};
      buttonValues[Localization.resolve("OK")] = "ok";
      var messages = messageCollector.getMessages().join("<br>") + surveyMessageCollector.getMessages().join("<br>");
      return MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Validation"),messages, buttonValues);
    }
    else {
      return "valid";
    }
  }); 
}
else {
  promise = when.resolve("valid");
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}