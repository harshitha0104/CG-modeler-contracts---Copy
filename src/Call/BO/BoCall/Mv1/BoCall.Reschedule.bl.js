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
 * @function reschedule
 * @this BoCall
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {String} newDateFrom
 * @param {String} newTimeFrom
 * @param {String} newDateThru
 * @param {String} newTimeThru
 * @param {Boolean} newAllDayFlag
 * @returns promise
 */
function reschedule(newDateFrom, newTimeFrom, newDateThru, newTimeThru, newAllDayFlag){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise;
var buttonValues = {};
//reset timecard to avoid unnecessary time entries
me.setBoUserDailyReport(null);

if (me.isReadOnly()) {
  buttonValues[Localization.resolve("OK")] = "ok";
  promise = MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Validation"), Localization.resolve("BoCall_CasClbNotEditable"), buttonValues);
}
else {
  var dateFrom;
  var dateThru;
  var currentDateFrom = Utils.convertAnsiDate2Date(me.getDateFrom());
  var currentDateThru = Utils.convertAnsiDate2Date(me.getDateThru());
  var dayDifference = parseInt(((currentDateThru.getTime() - currentDateFrom.getTime()) / (24 * 3600 * 1000)), 10);
  var isDateChanged = false;
  var isDateFromChanged = false;
  var isDateThruChanged = false;
  var isTimeChanged = false;
  var isTimeFromChanged = false;
  var isTimeThruChanged = false;

  if (Utils.isDefined(newAllDayFlag) && newAllDayFlag != "0") {
    me.setAllDay("1");
    isTimeChanged = true;
  }
  else {
    me.setAllDay("0");
    isTimeChanged = true;
  }
  if (Utils.isDefined(newDateFrom)) {
    dateFrom = Utils.convertAnsiDate2Date(newDateFrom);
    isDateFromChanged = dateFrom.getTime() !== currentDateFrom.getTime();
    isDateChanged = isDateFromChanged;
  }
  if (Utils.isDefined(newDateThru)) {
    dateThru = Utils.convertAnsiDate2Date(newDateThru);
    isDateThruChanged = (dateThru.getTime() !== currentDateThru.getTime());
    isDateChanged = isDateChanged || currentDateThru;
  }
  if (me.allDay != "1"){
    if (!Utils.isEmptyString(newTimeFrom)) {
      isTimeFromChanged = (newTimeFrom !== me.getTimeFrom());
      isTimeChanged = isTimeFromChanged;
    }
    if (!Utils.isEmptyString(newTimeThru)) {
      isTimeThruChanged = (newTimeThru !== me.getTimeThru());
      isTimeChanged = isTimeChanged || isTimeThruChanged;
    }
  }

  if (newTimeFrom && newTimeThru && newTimeFrom > newTimeThru) {
    buttonValues[Localization.resolve("OK")] = "ok";
    promise = MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Validation"), Localization.resolve("BoCall_CasClbTimeFromGreaterTimeThru"), buttonValues);
  }
  else {
    if (isDateChanged || isTimeChanged) {
      if (isDateChanged) {
        if (isDateFromChanged) {
          me.setDateFrom(dateFrom);
          currentDateFrom = Utils.convertAnsiDate2Date(me.getDateFrom());
        }
        if (isDateThruChanged && dateThru >= currentDateFrom) {
          // update currentDateFrom
          me.setDateThru(dateThru);
        } else {
          // move DateThru according to DateFrom if not target DateThru is given
          me.setDateThru(Utils.addDays2AnsiFullDate(Utils.convertDate2Ansi(currentDateFrom),dayDifference));
        }
        // update currentDateThru
        currentDateThru = Utils.convertAnsiDate2Date(me.getDateThru());
      }

      if (isTimeChanged) {
        var timeDifference = me.getCallDuration(me.getDateFrom(), me.getTimeFrom(), me.getDateThru(), me.getTimeThru());
        if (isTimeFromChanged) {
          me.setTimeFrom(newTimeFrom);
        }
        if (isTimeThruChanged && (currentDateFrom !== currentDateThru || newTimeThru > me.getTimeFrom())) {
          me.setTimeThru(newTimeThru);
        }
        else {
          if(!Utils.isDefined(newTimeThru)){
            // move TimeThru according to TimeFrom if not target TimeThru is given
            newTimeThru = Utils.convertAnsiTime2Time(me.getTimeFrom());
            newTimeThru.setMinutes(newTimeThru.getMinutes() + timeDifference);
            me.setTimeThru(Utils.convertTime2Ansi(newTimeThru));
          }
        }
        if(me.getAllDay() == '1'){
          //update duration for all day calls and multiple all day calls. Time part must be ignored
          if(me.getDateFrom() === me.getDateThru())me.setDuration(24*60);
          else me.setDuration(me.getCallDuration(me.getDateFrom(), "00:00", me.getDateThru(), "00:00") + (24*60));
        }else{
          me.setDuration(me.getCallDuration(me.getDateFrom(), me.getTimeFrom(), me.getDateThru(), me.getTimeThru()));
        }
      }
    }
    promise = when.resolve(newDateFrom);
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}