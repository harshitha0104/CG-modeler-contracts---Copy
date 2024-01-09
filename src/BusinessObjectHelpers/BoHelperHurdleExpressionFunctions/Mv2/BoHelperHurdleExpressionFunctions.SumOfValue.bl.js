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
 * @function sumOfValue
 * @this BoHelperHurdleExpressionFunctions
 * @kind businessobjecthelper
 * @namespace CORE
 * @param {Object} hurdle
 * @param {Object} order
 * @param {Object} call
 * @param {Object} pricingCalculator
 * @param {Object} targetValue
 * @returns evaluationResult
 */
function sumOfValue(hurdle, order, call, pricingCalculator, targetValue){
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

// round is needed to round values in detailtext
function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

if(Utils.isDefined(targetValue) && !Utils.isEmptyString(targetValue)) {
  var operator = hurdle.getOperator();
  var itemsParams = [];
  var itemsValue = 0;
  var mainOrderItemMeta = order.getBoOrderMeta().getLoOrderItemMetas().getMainItemTemplate();
  itemsParams.push({"quantity":"0","op":"GT"});
  itemsParams.push({"sdoItemMetaPKey":mainOrderItemMeta.getPKey(),"op":"EQ"});
  itemsParams.push({"promotionPKey":hurdle.getPromotionPKey(),"op":"EQ"});
  var filteredItems = order.getLoItems().getItemsByParamArray(itemsParams);
  var itemsToConsider = me.filterItemsByClassification(filteredItems, hurdle);
  itemsToConsider.forEach(function(item){
    var calculatedItemValue = pricingCalculator.calculateItemValue(item, order.getBoOrderMeta());
    itemsValue += calculatedItemValue.grossValue;
  });
  evaluationResult.evaluationResult = me.evaluateOperation(itemsValue, operator, targetValue);
  evaluationResult.differenceInfo.calculatedValue = itemsValue;

  // to check the applicability of reward having linked hurdle and set the per factor according to evaluation result
  if(!evaluationResult.evaluationResult) {
    perFactor = 0;
  }
  if(operator === "PER") {
    if(targetValue > 0 && itemsValue > 0) {
      perFactor = Math.floor(itemsValue/targetValue);
    }
    else {
      perFactor = 0; 
    }       
  }
  evaluationResult.differenceInfo.perFactor = perFactor;

  if(!evaluationResult.evaluationResult) {
    switch (operator) {
      case "gt":
        evaluationResult.differenceInfo.detailText = "[b]" + round(targetValue + 0.01 - itemsValue, 2) + " " + order.getCurrency() + "[/b] " + Localization.resolve("Hurdle_more");
        break;
      case "ge":
        evaluationResult.differenceInfo.detailText = "[b]" + round(targetValue - itemsValue, 2) + " " + order.getCurrency() + "[/b] " + Localization.resolve("Hurdle_more");
        break;
      case "PER":
        evaluationResult.differenceInfo.detailText = "[b]" + round(targetValue - itemsValue, 2) + " " + order.getCurrency() + "[/b] " + Localization.resolve("Hurdle_more");
        break;
      case "eq":
        if (itemsValue < targetValue) {
          evaluationResult.differenceInfo.detailText = "[b]" + round(targetValue - itemsValue, 2) + " " + order.getCurrency() + "[/b] " + Localization.resolve("Hurdle_more");
        }
        else {
          evaluationResult.differenceInfo.detailText = "[b]" + round(itemsValue - targetValue, 2) + " " + order.getCurrency() + "[/b] " + Localization.resolve("Hurdle_less");
        }
        break; 
      case "ne":
        evaluationResult.differenceInfo.detailText = "[b]0.01 " + order.getCurrency() + "[/b] " + Localization.resolve("Hurdle_moreless");
        break;
      case "le":
        evaluationResult.differenceInfo.detailText = "[b]" + round(itemsValue - targetValue, 2) + " " + order.getCurrency() + "[/b] " + Localization.resolve("Hurdle_less");
        break;
      case "lt":
        evaluationResult.differenceInfo.detailText = "[b]" + round(itemsValue + 0.01 - targetValue, 2) + " " + order.getCurrency() + "[/b] " + Localization.resolve("Hurdle_less");
        break;
    }
  }
}
else {
  AppLog.warn("Invalid numeric value for following hurdle: '" + hurdle.getHurdleTitle() + "' (" + hurdle.getPKey() + ")");
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return evaluationResult;
}