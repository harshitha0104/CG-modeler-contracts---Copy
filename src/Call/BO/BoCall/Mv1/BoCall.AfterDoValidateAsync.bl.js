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
 * @function afterDoValidateAsync
 * @this BoCall
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} result
 * @param {Object} context
 * @returns promise
 */
function afterDoValidateAsync(result, context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise;
var deferreds = [];


if(me.getAllDay() == '1'){
  //update duration for all day calls and multiple all day calls. Time part must be ignored
  if(me.getDateFrom() === me.getDateThru())me.setDuration(24*60);
  else me.setDuration(me.getCallDuration(me.getDateFrom(), "00:00", me.getDateThru(), "00:00") + (24*60));
}else{
  me.setDuration(me.getCallDuration(me.getDateFrom(), me.getTimeFrom(), me.getDateThru(), me.getTimeThru()));
}

if (me.getClbStatus() === "Completed" && me.getOriginalClbStatus() !== "Completed") {
  //On Error reset ClbStatus & Magnetization
  if (context.messageCollector.getMessages().length > 0) {
    me.setClbStatus(me.getOriginalClbStatus());

    // reset demagnetization flags that might have been set during validation
    me.getBoJobManager().getLoMagnetizedJobList().resetMagnetizationFlag();

  } else {
    // call has just been completed and is valid ==> excute actions

    // update the customer's last call date
    var jsonQuery2 = {
      "customerPKey" : me.getBpaMainPKey(),
      "clbMetaPKey" : me.getClbMetaPKey()
    };
    deferreds.push(BoFactory.loadListAsync("LoBpaCallSetting", jsonQuery2).then(function (list) {
      list.updateLastCallDate(me.getBpaMainPKey(), me.getClbMetaPKey(), me.getDateThru());
    }));

    // retrieve location
    if (me.getLuCallMeta().getLocCaptureDuringComplete() == "1") {
      deferreds.push(me.getPosition());
    }

    //update call times
    me.captureProceedingTime("true");
    me.setCompletedDate(Utils.createAnsiDateToday());

    //Get Effective Duration
    if (me.getLuCallMeta().getCaptureProceedingTime() == "1") {
      var startDate = me.getStartTimeEffective();
      var dStartDate = Utils.convertAnsiDate2Date(startDate);
      var startTime = Utils.convertTime2Ansi(dStartDate);

      var stopDate = me.getStopTimeEffective();
      var dStopDate = Utils.convertAnsiDate2Date(stopDate);
      var stopTime = Utils.convertTime2Ansi(dStopDate);

      me.setDurationEffective(me.getCallDuration(startDate, startTime, stopDate, stopTime));

      //Update TimeFrom, TimeThru, Duration
      if (me.getLuCallMeta().getUpdatePlannedTimes() == "1") {
        me.setTimeFrom(startTime);
        me.setTimeThru(stopTime);
        me.setDuration(me.getDurationEffective());
        var ansiStartDate = Utils.convertAnsiDateTime2AnsiDate(startDate);
        var ansiStopDate = Utils.convertAnsiDateTime2AnsiDate(stopDate);
        me.setDateFrom(ansiStartDate);
        me.setDateThru(ansiStopDate);
      }
    }
  }
}

promise = when.all(deferreds).then(function () {
  //Update JobListMagnetization if no error occured
  if (context.messageCollector.getMessages().length === 0) {
    return me.updateJobListMagnetization();
  }
});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}