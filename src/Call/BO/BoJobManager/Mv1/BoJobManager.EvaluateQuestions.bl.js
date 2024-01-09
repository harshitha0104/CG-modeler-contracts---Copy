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
 * @function evaluateQuestions
 * @this BoJobManager
 * @kind businessobject
 * @namespace CORE
 * @param {Object} listToBeEvaluated
 * @param {String} restrictToActivity
 */
function evaluateQuestions(listToBeEvaluated, restrictToActivity){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
/* This method is responsible for deciding visibility for each question based upon their evaluation result. It receives two inputs:
1. a list of questions that need to be evaluated and
2. activity reference (activity reference of question that has been changed manually) */


//create dictionary if not created already
if(!Utils.isDefined(me.getQuestionDic())){
  me.setQuestionDic(Utils.createDictionary());
}

var questionDic = me.getQuestionDic();

//store question data in dictionary to fetch it later when needed, parent questions will always be stored before dependent questions
for(var item = 0; item < listToBeEvaluated.length; item++){
  var question = listToBeEvaluated[item];
  if(!questionDic.containsKey(question.getJobDefinitionPKey() + question.getPosId())){
    questionDic.add(question.getJobDefinitionPKey() + question.getPosId(), question);
  } else{
    questionDic.data[question.getJobDefinitionPKey() + question.getPosId()] = question;
  }
}


//evaluates based upon target answers maintained for current question and parent question's data i.e. selected answer (value), visibility, done flag
var evaluationBasedOnCondition = function(currentQuestion){
  var parent = questionDic.get(currentQuestion.getCondition() + currentQuestion.getPosId());
  var targetAnswers = currentQuestion.getConditionAnswers().slice(0, currentQuestion.getConditionAnswers().length - 1).split(";");
  var operator = currentQuestion.getConditionOperator();
  var answerFound = false;

  if(Utils.isDefined(parent)) {
    for(var selectedAnswer = 0; selectedAnswer < targetAnswers.length; selectedAnswer++){
      if(parent.getValue() == targetAnswers[selectedAnswer] || (Utils.isEmptyString(parent.getValue()) && Utils.isEmptyString(targetAnswers[selectedAnswer]))){
        answerFound = true;
        break;
      }
    }

    /* if parent is done, visible and
 operator is either In and selected answer for parent is one of the target answers or
 operator is Not In and selected answer for parent is outside of target answers

 then mark current question as visible
 else mark it as not visible */

    if(parent.getDone() == "1" && parent.getVisible() == "1" && ((operator == "In" && answerFound) || (operator == "Not In" && !answerFound))){
      currentQuestion.setVisible("1");
    } else{
      currentQuestion.setVisible("0");
    }
  }
  else {
    // If parent question is not active any more make the current question invisible.
    currentQuestion.setVisible("0");
  }
};


var checkQuestion = function(currentQuestion){
  //in case question does not have any condition assigned then it will always be visible
  if(Utils.isEmptyString(currentQuestion.getCondition())){
    currentQuestion.setVisible("1");
  }
  else{
    //in case question does not have any condition answers assigned then it will always be not visible
    if(Utils.isEmptyString(currentQuestion.conditionAnswers)){
      currentQuestion.setVisible("0");
    }
    else{
      //in case question has condition and condition answers assigned then evaluate based upon parent question
      evaluationBasedOnCondition(currentQuestion);
    }
  }
};


var evaluationList;
if(!Utils.isDefined(restrictToActivity)){
  //in case activity reference is undefined then evaluate the list completely
  evaluationList = listToBeEvaluated;
}
else{
  //in case activity reference is available then only evaluate questions which belongs to same activity
  evaluationList = listToBeEvaluated.filter(function(item){return item.getJobDefListPKey() === restrictToActivity;});
}


//suspend LoQuestions events
me.getLoQuestions().suspendListRefresh();

evaluationList.forEach(function(item){checkQuestion(item);});

//discard LoQuestions events
me.getLoQuestions().resumeListRefresh(true);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}