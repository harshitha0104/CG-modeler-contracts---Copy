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
 * @function executeTimeCallback
 * @this BoUsrReminderRuleExecution
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {String} timerId
 * @returns promise
 */
function executeTimeCallback(timerId){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise;

if (Utils.isDefined(timerId) && !Utils.isEmptyString(timerId)) {
  promise = BoFactory.loadObjectByParamsAsync("LuUsrReminderRuleById", this.getQueryBy("ruleId", timerId)).then(
    function (result) {
      if (result && Utils.isDefined(result.getMessageContent())) {
        //if user exit is defined
        if (Utils.isDefined(result.getConditionUserExitId()) && !Utils.isEmptyString(result.getConditionUserExitId())) {

          return me.getReminderRuleConditionResult(result.getConditionUserExitId(), parseInt(result.getConditionThreshold(), 10)).then(
            function (conditionNotFullfilled) {
              if (conditionNotFullfilled) {
                var buttonValues = {};
                buttonValues[Localization.resolve("OK")] = "ok";
                return MessageBox.displayMessage(result.getMessageTitle(), result.getMessageContent(), buttonValues);
              }
            }
          );

        } else { //if no user exit is defined

          return BoFactory.loadObjectByParamsAsync("LoTimeEntryByActivityType", {
            "activityType" : result.getConditionActivityType(),
            "timeCardPKey" : ApplicationContext.get("openTimeCardPKey")
          }).then(
            function (timeEntries) {

              var conditionThreshold = parseInt(result.getConditionThreshold(), 10);

              //calculate duration also for running time entries
              var timeEntryList = timeEntries.getAllItems();
              var duration = 0;
              var now;
              var now_utc;
              var from_utc;
              var dateDiffInMins;
              for (var i = 0; i < timeEntryList.length; i++) {
                //check if TE is running
                if (timeEntryList[i].getDuration() === 0 && timeEntryList[i].getEffectiveUTCTimeThru() === Utils.getMinDate()) {
                  now = Utils.createDateNow();
                  now_utc = Utils.createSpecificDate(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
                  from_utc = Utils.convertAnsiDate2Date(timeEntryList[i].getEffectiveUTCTimeFrom());
                  dateDiffInMins = parseInt(((now_utc - from_utc) / (60 * 1000)), 10);
                  duration = duration + dateDiffInMins;
                } else {
                  duration = duration + timeEntryList[i].getDuration();
                }
              }

              if (duration < conditionThreshold) {
                var buttonValues = {};
                buttonValues[Localization.resolve("OK")] = "ok";
                return MessageBox.displayMessage(result.getMessageTitle(), result.getMessageContent(), buttonValues);
              }
            }
          );
        } //end if message content
      }
    }
  ); //end read LuUsrReminderRuleById
} else {
  promise = when.resolve();
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}