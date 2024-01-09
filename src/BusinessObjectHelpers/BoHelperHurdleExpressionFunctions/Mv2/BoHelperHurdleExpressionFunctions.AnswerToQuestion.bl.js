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
 * @function answerToQuestion
 * @this BoHelperHurdleExpressionFunctions
 * @kind businessobjecthelper
 * @async
 * @namespace CORE
 * @param {Object} hurdle
 * @param {Object} order
 * @param {Object} call
 * @param {Object} pricingCalculator
 * @param {Object} targetValue
 * @returns promise
 */
function answerToQuestion(hurdle, order, call, pricingCalculator, targetValue){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var perFactor = 1;
var evaluationResult = {
  "evaluationResult": false,
  "differenceInfo": {
    "detailText": "",
    "calculatedValue": "",
    "perFactor": 0
  }
};

var promise = when.resolve(evaluationResult);

if (Utils.isDefined(call)) {
  var evaluateCurrentHurdle = function(){
    var hurdleOperator = hurdle.getOperator().toUpperCase();
    var jobManager = call.getBoJobManager();
    var questions = jobManager.getLoQuestions();

    if(hurdleOperator === "PER") {
      if(hurdle.getExpressionResultType() === "Numeric") {
        hurdleOperator = "GE";
      }
      else {
        hurdleOperator = "EQ";
      }
    }

    questions.resetAllFilters();
    var validAnswers = questions.getItemsByParamArray([
      {"jobDefinitionMetaPKey": hurdle.getJobDefinitionTemplate(), "op": "EQ"},
      {"done":"1","op":"EQ"},
      {"value": targetValue, "op": hurdleOperator}]);

    if(validAnswers.length > 0) {
      evaluationResult.evaluationResult = true;
      evaluationResult.differenceInfo.calculatedValue = validAnswers[0].value;

      if(hurdle.getOperator() === "PER" && hurdle.getExpressionResultType() === "Numeric") {
        if(targetValue > 0 && validAnswers[0].value > 0) {
          perFactor = Math.floor(validAnswers[0].value/targetValue);
        }
        else {
          perFactor = 0; 
        }
      }
    } else {
      var invalidAnswers = questions.getItemsByParamArray([
        {"jobDefinitionMetaPKey": hurdle.getJobDefinitionTemplate(), "op": "EQ"},
        {"done":"1","op":"EQ"}]);

      if(invalidAnswers.length > 0) {
        evaluationResult.differenceInfo.calculatedValue = "Not fulfilled";
      } else {
        evaluationResult.differenceInfo.calculatedValue = "None found";
      }
      perFactor = 0;
    }
  };

  if(!Utils.isDefined(call.getBoJobManager().getLoQuestions())){
    promise = call.getBoJobManager().loadAndSetPrerequisites("AnswerToQuestionHurdle")
      .then(function(){
      evaluateCurrentHurdle();
      return when.resolve(evaluationResult);
    });
  } else{
    evaluateCurrentHurdle();
  }
}
else {
  perFactor = 0;
}
evaluationResult.differenceInfo.perFactor = perFactor;

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}