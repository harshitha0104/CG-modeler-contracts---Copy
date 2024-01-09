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
 * @function getSurveyExceptions
 * @this BoStoreCockpitHelper
 * @kind businessobject
 * @namespace CORE
 * @param {LoSurveys} currentSurveys
 * @returns jsonData
 */
function getSurveyExceptions(currentSurveys){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var notDistributedLength = 0;
var outOfStockLength = 0;
var facingMismatchLength = 0;
var priceMismatchLength = 0;

currentSurveys.forEach(function(survey){
  if(survey.hide != "1"){

    if(survey.value == "NotDistributed"){
      notDistributedLength++;
    }

    if(survey.value == "OutOfStock"){
      outOfStockLength++;
    }

    if((survey.targetValue != " " && survey.surveyText == Localization.resolve("CardSurveyExceptions_Facings") && ((!Utils.isEmptyString(survey.targetValue) && survey.value!= survey.targetValue) || (!Utils.isEmptyString(survey.lastValue) && survey.value != survey.lastValue))) || (survey.targetValue == " " && survey.lastValue == " " && survey.value != "0" && survey.surveyText == Localization.resolve("CardSurveyExceptions_Facings"))){
      facingMismatchLength++;
    }

    if((survey.targetValue != " " && survey.surveyText == Localization.resolve("CardSurveyExceptions_Price") && ((!Utils.isEmptyString(survey.targetValue) && survey.value != survey.targetValue) || (!Utils.isEmptyString(survey.lastValue) && survey.value != survey.lastValue))) || (survey.targetValue == " " && survey.lastValue == " " && survey.value != "0" && survey.surveyText == Localization.resolve("CardSurveyExceptions_Price"))){
      priceMismatchLength++;
    }
  }
});

// reset currentSurveys state when exceptions are reset
if (notDistributedLength === 0 && outOfStockLength === 0 && facingMismatchLength === 0 && priceMismatchLength === 0) {
  me.setCurrentSurveys("0");
}
else {
  me.setCurrentSurveys("1");
}

// Small bars in case of no exceptions
if (notDistributedLength === 0) {notDistributedLength = 0.03;}
if (outOfStockLength === 0) {outOfStockLength = 0.03;}
if (facingMismatchLength === 0) {facingMismatchLength = 0.03;}
if (priceMismatchLength === 0) {priceMismatchLength = 0.03;}

// Determine maximum for axis
var valueArray = [];
valueArray.push(notDistributedLength);
valueArray.push(outOfStockLength);
valueArray.push(facingMismatchLength);
valueArray.push(priceMismatchLength);

var maxValue = valueArray.reduce(function (p, v) {
  return (p > v ? p : v);
});

var axisMax = Math.ceil(maxValue * 1.2);

// Generate grid lines
var gridLines = [];
var tick = maxValue / 5;

gridLines.push({"value": (tick)});
gridLines.push({"value": (tick * 2)});
gridLines.push({"value": (tick * 3)});
gridLines.push({"value": (tick * 4)});
gridLines.push({"value": (tick * 5)});

var jsonData = {
  "data" : {
    columns : [['surveyExceptions', notDistributedLength, outOfStockLength, facingMismatchLength, priceMismatchLength]]
  },
  "axisRange" : {
    "max" : {
      "y" : axisMax
    }
  },
  "gridLines" : gridLines
};

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return jsonData;
}