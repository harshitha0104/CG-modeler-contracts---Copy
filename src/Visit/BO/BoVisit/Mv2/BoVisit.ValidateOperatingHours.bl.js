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
 * @function validateOperatingHours
 * @this BoVisit
 * @kind businessobject
 * @namespace CORE
 * @param {String} dateFrom
 * @param {String} timeFrom
 * @param {Object} operatingHoursBo
 * @returns isVisitInOperatingHours
 */
function validateOperatingHours(dateFrom, timeFrom, operatingHoursBo){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var isVisitInOperatingHours = false;
if(Utils.isDefined(operatingHoursBo)&&operatingHoursBo)
  {
    var isTimeSlotPresent = false;
    dateFrom = Utils.convertAnsiDate2Date(dateFrom);
    timeFrom = Utils.convertAnsiTime2Time(timeFrom);
    dateFrom.setHours(timeFrom.getHours());
    dateFrom.setMinutes(timeFrom.getMinutes());
    if( ! (Utils.isDefined(dateFrom) && dateFrom))
      return;
    var newDateFrom  = Utils.createDateByString(dateFrom.toLocaleString("en-US", {timeZone: operatingHoursBo.getTimeZone()}));
    var day = newDateFrom.getDay();
    var dayString = dayOfWeekAsString(day);
	var timeSlots = operatingHoursBo.getTimeslots();
    var newTimeFrom = Utils.convertTime2Ansi(newDateFrom);
    timeSlots.forEach(function(timeSlot){
      if(timeSlot.dayOfWeek === dayString)
        {
          isTimeSlotPresent = true;
          var timeSlotStartTime = convertSalesforceTimeToAnsiTime(timeSlot.startTime);
          var timeSlotEndTime = convertSalesforceTimeToAnsiTime(timeSlot.endTime);
          if(newTimeFrom >= timeSlotStartTime && newTimeFrom <= timeSlotEndTime)
            {
              isVisitInOperatingHours = true;
            }
        }
    });
    if(!isTimeSlotPresent)
      {
        isVisitInOperatingHours = true;
      }
	}
else
  {
    isVisitInOperatingHours = true;
    return;
  }

function dayOfWeekAsString(dayIndex) {
    return ["Sunday", "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dayIndex] || '';   
 }

function convertSalesforceTimeToAnsiTime(salesforceTime)
{
  if(salesforceTime === null)
    return null;
  if(salesforceTime.length === 7)
    {
      salesforceTime = "0" + salesforceTime;
    }
  if(salesforceTime.charAt(0) == "1"&& salesforceTime.charAt(1) === "2")
    {
          salesforceTime = "00" + salesforceTime.substring(2);
    }
  if(salesforceTime.charAt(salesforceTime.length-2) === "p")
    {
       var hours = salesforceTime.substring(0,2);
       hours = parseInt(hours);
       hours += 12;
       hours = hours.toString();
       salesforceTime = hours.charAt(0)+hours.charAt(1)+salesforceTime.substring(2);
    }
  return salesforceTime.substring(0,5);
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return isVisitInOperatingHours;
}