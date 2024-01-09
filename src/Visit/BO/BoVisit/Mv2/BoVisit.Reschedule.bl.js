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
 * @this BoVisit
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {String} newDateFrom
 * @param {String} newTimeFrom
 * @param {String} newDateThru
 * @param {String} newTimeThru
 */
function reschedule(newDateFrom, newTimeFrom, newDateThru, newTimeThru){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
// date and time input format is ansi. eg: "2021-07-01" "23:00"
// for reschedule via context menu if both end date and time are made null in FUTURE rescheduled end time will not be correct
var timeFrom;
var timeThru;
if (!validateDate(newDateFrom)) {
    logMsg("Input Planned Start Date is not Defined or Empty");
    return;
}
if(!validateTime(newTimeFrom)){
   logMsg("Input Planned Start Time is not Defined or Empty");
   return;
}
timeFrom = Utils.convertAnsiDate2Date(newDateFrom);
timeFrom.setHours(newTimeFrom.substring(0,2));
timeFrom.setMinutes(newTimeFrom.substring(3,5));

if (validateDate(newDateThru)) {
    if(!validateTime(newTimeThru)){
       logMsg("Input Planned End Date is not Present but End Time is specified");
       return;
	}
     timeThru = Utils.convertAnsiDate2Date(newDateThru);
     timeThru.setHours(newTimeThru.substring(0,2));
     timeThru.setMinutes(newTimeThru.substring(3,5));
    
}
else 
{
  if(me.getPlannedEndDate() === Utils.getMinDateAnsi())
  {
       rescheduleStartTime();
       return;
  }
  else
   {
      var timeDifference = me.getCallDuration(me.getPlannedStartDate(), me.getPlannedStartTime(), me.getPlannedEndDate(), me.getPlannedEndTime());
      timeThru = Utils.convertAnsiDate2Date(newDateFrom);
      timeThru.setHours(timeFrom.getHours());
      timeThru.setMinutes(timeFrom.getMinutes() + timeDifference);

   }
}
if(validateDateTimeOrder())
  {
    rescheduleStartTime();
    rescheduleEndTime();
  }
else
  {
    logMsg("Start Datetime should be lesser than End DateTime");
    return;
  }

function validateDateTimeOrder()
{
     if(timeThru.toJSON()>timeFrom.toJSON())
         return true;
     return false;
}

function rescheduleStartTime()
{
    me.setPlannedStartDate(timeFrom);
    me.setPlannedStartTime(Utils.convertTime2Ansi(timeFrom));
}
function rescheduleEndTime()
{
    me.setPlannedEndDate(timeThru);
    me.setPlannedEndTime(Utils.convertTime2Ansi(timeThru));
}

function validateDate(inputDate)
{
  if(Utils.isDefined(inputDate)&&inputDate)
    return true;
  return false;
}

function validateTime(inputTime)
{
  if(Utils.isDefined(inputTime)&&inputTime&&!Utils.isEmptyString(inputTime))
    return true;
  return false;
}

function logMsg(msg)
{
  AppLog.info("Error : Reschedule Failed - " + msg);
  return;
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}