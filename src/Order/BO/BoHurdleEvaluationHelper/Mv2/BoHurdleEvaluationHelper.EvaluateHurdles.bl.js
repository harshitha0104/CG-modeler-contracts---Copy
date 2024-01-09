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
 * @function evaluateHurdles
 * @this BoHurdleEvaluationHelper
 * @kind businessobject
 * @async
 * @namespace CORE
 * @maxRuntime 80
 * @param {Object} boOrder
 * @param {Object} boCall
 * @param {Object} promotionPKey
 * @param {Object} reward
 * @returns promise
 */
function evaluateHurdles(boOrder, boCall, promotionPKey, reward){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
//Shouldn't be enhanced beyond the scope of hurdle evaluation

var hurdleEvaluationPromises = [];
var hurdleResults = { };
var hurdles;

if(!Utils.isDefined(reward)){
  if (Utils.isEmptyString(promotionPKey)) {
    hurdles = me.getLoHurdles().getItemsByParamArray([{"hurdleType": "RewardSpecific", "op":"NE"}]);
  }
  else {
    hurdles = me.getLoHurdles().getItemsByParamArray([{"promotionPKey": promotionPKey,"op":"EQ"},{"hurdleType": "RewardSpecific", "op":"NE"}]);
  }
}
else {
  hurdles = me.getLoHurdles().getItemsByParamArray([{"pKey": reward.getHurdlePKey(), "op":"EQ"}]);
}

for (var i = 0; i < hurdles.length; i++) {
  var currentHurdle = hurdles[i];
  var targetValue = me.getHurdleValue(currentHurdle,reward);
  var params = [{"type": "static", "value": currentHurdle},
                {"type": "static", "value": boOrder},
                {"type": "static", "value": boCall},
                {"type": "static", "value": me.getSimplePricingCalculator()},
                {"type": "static", "value": targetValue}];
  var expressionResult = Facade.callBusinessLogicAsync("ProcessContext::BoHelperHurdleExpressionFunctions", currentHurdle.getExpressionFunction(), params);
  hurdleEvaluationPromises.push(when(expressionResult)
                                .then(function (hurdle, hurdleExpressionResult) {
    if(Utils.isDefined(reward)){
      reward.setPerFactor(hurdleExpressionResult.results.differenceInfo.perFactor);
      reward.setIsReadyToBeApplicable(hurdleExpressionResult.results.evaluationResult ? '1' : '0');
      reward.setCalculatedValue(hurdleExpressionResult.results.differenceInfo.calculatedValue);
    }
    else {
      hurdle.setIsFulfilled(hurdleExpressionResult.results.evaluationResult ? '1' : '0');
      hurdle.setValueToFulfillHurdle(hurdleExpressionResult.results.differenceInfo.detailText);
      hurdle.setCalculatedValue(hurdleExpressionResult.results.differenceInfo.calculatedValue);
    }
  }.bind(null, currentHurdle)));
}                               

var promise = when.all(hurdleEvaluationPromises);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}