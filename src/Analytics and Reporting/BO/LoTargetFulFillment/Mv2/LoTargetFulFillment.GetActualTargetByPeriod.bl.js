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
 * @function getActualTargetByPeriod
 * @this LoTargetFulFillment
 * @kind listobject
 * @async
 * @namespace CORE
 * @param {LiTargetFulFillment} target
 * @returns promise
 */
function getActualTargetByPeriod(target){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var deferreds = [];

// Get all the parameters for loading LoOrdersByTargetSetting
var jqueryParams = [];
var jqueryQuery = {};
jqueryParams.push({
  "field" : "FromDate",
  "value" : Utils.convertDate2Ansi(Utils.convertAnsiDate2Date(target.getValidFrom()))
});
jqueryParams.push({
  "field" : "ThruDate",
  "value" : Utils.convertDate2Ansi(Utils.convertAnsiDate2Date(target.getValidThru()))
});
jqueryQuery.params = jqueryParams;
var totalActual = 0;
// Load orders for current target period

var promise = BoFactory.loadObjectByParamsAsync("LoOrdersByTargetSetting", jqueryQuery)
  .then(function(loOrdersByTargetSetting){
  // Check if the orders are loaded properly
  if(Utils.isDefined(loOrdersByTargetSetting))
  {
    // loop through the targets
    var items = loOrdersByTargetSetting.getAllItems();
    for(var i = 0; i < items.length; i++)
    {
      // Check the value for targetSettingConsideration to add the gross value to the total
      switch(items[i].getTargetSettingConsideration())
      {
        case "PositiveSalesOnly":
          deferreds.push(loOrdersByTargetSetting.getOrderValueForPositiveSalesTarget(items[i].getSdoMainPKey()));
          break;
        case "CompleteOrder":
          totalActual += items[i].getGrossTotalValue();
          break;
      }
    }
    // When all the positiveOnly Sales are calculated, return
   return when.all(deferreds)
      .then(function(totals){
      for(var i = 0; i < totals.length; i++){
        totalActual += totals[i];
      }
      target.setActualTarget(totalActual);
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