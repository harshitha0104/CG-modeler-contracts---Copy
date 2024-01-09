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
 * @function getReminderRuleConditionResult
 * @this BoUsrReminderRuleExecution
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {DomId} conditionUserExitId
 * @param {DomInteger} currentConditionThreshold
 * @returns promise
 */
function getReminderRuleConditionResult(conditionUserExitId, currentConditionThreshold){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = when.resolve();

if (Utils.isDefined(conditionUserExitId) && !Utils.isEmptyString(conditionUserExitId) && conditionUserExitId === "38BTOT2015") {
  promise = BoFactory.loadObjectByParamsAsync("LoUsrTimeEntry", {
    "usrDailyReportPKey" : ApplicationContext.get("openTimeCardPKey")
  }).then(
    function (timeEntries) {
      if (timeEntries.getAllItems().length > 0) {
        var workingTimeDuration = 0;
        var nonProductiveTimeDuration = 0;
        var productiveTimeDuration = 0;
        var breakTimeDuration = 0;
        var now_utc;
        var from_utc;
        var dateDiffInMins;

        //calculate working time duration
        var workingTimeItems = timeEntries.getItemsByParamArray([{"activityType" : "WorkingTime", "op" : "EQ"}]);
        var now = Utils.createDateNow();
        now_utc = Utils.createSpecificDate(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());

        for (var idxWTE = 0; idxWTE < workingTimeItems.length; idxWTE++) {
          if (workingTimeItems[idxWTE].getDuration() === 0 && workingTimeItems[idxWTE].getEffectiveUTCTimeThru() === Utils.getMinDate()) {
            from_utc = Utils.convertAnsiDate2Date(workingTimeItems[idxWTE].getEffectiveUTCTimeFrom());

            //if time entry does not start in future
            if(now_utc - from_utc >= 0) {
              dateDiffInMins = parseInt(((now_utc - from_utc) / (60 * 1000)), 10);
              workingTimeDuration = workingTimeDuration + dateDiffInMins;
            }
          } 
          else {
            workingTimeDuration = workingTimeDuration + workingTimeItems[idxWTE].getDuration();
          }
        }

        //calculate non productive time duration
        var nonProductiveTimeItems = timeEntries.getItemsByParamArray([{"productiveTimeEffect" : "-1", "op" : "EQ"}]);
        for (var idxNPTE = 0; idxNPTE < nonProductiveTimeItems.length; idxNPTE++) {
          if (nonProductiveTimeItems[idxNPTE].getDuration() === 0 && nonProductiveTimeItems[idxNPTE].getEffectiveUTCTimeThru() === Utils.getMinDate()) {
            from_utc = Utils.convertAnsiDate2Date(nonProductiveTimeItems[idxNPTE].getEffectiveUTCTimeFrom());

            //if time entry does not start in future
            if(now_utc - from_utc >= 0) {
              dateDiffInMins = parseInt(((now_utc - from_utc) / (60 * 1000)), 10);
              nonProductiveTimeDuration = nonProductiveTimeDuration + dateDiffInMins;
            }
          }
          else {
            nonProductiveTimeDuration = nonProductiveTimeDuration + nonProductiveTimeItems[idxNPTE].getDuration();
          }
        }

        //calculate productive time
        productiveTimeDuration = workingTimeDuration - nonProductiveTimeDuration;
        if (productiveTimeDuration < 0) {
          productiveTimeDuration = 0;
        }

        //calculate break duration
        var breakTimeItems = timeEntries.getItemsByParamArray([{"activityType" : "Break", "op" : "EQ"}]);
        for (var idxBreakTE = 0; idxBreakTE < breakTimeItems.length; idxBreakTE++) {
          if (breakTimeItems[idxBreakTE].getDuration() === 0 && breakTimeItems[idxBreakTE].getEffectiveUTCTimeThru() === Utils.getMinDate()) {
            from_utc = Utils.convertAnsiDate2Date(breakTimeItems[idxBreakTE].getEffectiveUTCTimeFrom());

            //if time entry does not start in future
            if(now_utc - from_utc >= 0) {
              dateDiffInMins = parseInt(((now_utc - from_utc) / (60 * 1000)), 10);
              breakTimeDuration = breakTimeDuration + dateDiffInMins;
            }
          } 
          else {
            breakTimeDuration = breakTimeDuration + breakTimeItems[idxBreakTE].getDuration();
          }
        }
        return productiveTimeDuration > 300 && breakTimeDuration < 30; 
      }   
    }
  );
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}