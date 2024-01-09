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
 * @function validateTimeEntry
 * @this BoCreateNewTimeEntry
 * @kind businessobject
 * @namespace CORE
 * @param {messageCollector} messageCollector
 */
function validateTimeEntry(messageCollector){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var newError;
var isOverlap = false;
var origTimeEntries;
var dateTimeHelper = ApplicationContext.get("dateTimeHelper");

me.setTimeEntryValid("1");

//check if necessary fields are empty
if ((Utils.isEmptyString(me.getTimeEntryMetaPKey)) || (Utils.isEmptyString(me.getDescription())) || (Utils.isEmptyString(me.getStartdate())) ||
    (Utils.isEmptyString(me.getEnddate())) || (Utils.isEmptyString(me.getEndtime())) || (Utils.isEmptyString(me.getStarttime())) ||
    !Utils.isDefined(me.getStartdate()) || !Utils.isDefined(me.getEnddate()) || !Utils.isDefined(me.getStarttime()) || !Utils.isDefined(me.getEndtime())) {
  newError = {
    "level" : "error",
    "objectClass" : "BoCreateNewTimeEntry",
    "messageID" : "CasTimeFillInAllValues",
  };
  me.setTimeEntryValid("0");
  messageCollector.add(newError);
  return;
}

//calculate UTC-Dates
var effectiveDateFrom = Utils.convertAnsiDate2Date(me.getStartdate());
effectiveDateFrom.setHours(me.getStarttime().split(":")[0]);
effectiveDateFrom.setMinutes(me.getStarttime().split(":")[1]);

var effectiveDateThru = Utils.convertAnsiDate2Date(me.getEnddate());
effectiveDateThru.setHours(me.getEndtime().split(":")[0]);
effectiveDateThru.setMinutes(me.getEndtime().split(":")[1]);

var effectiveUTCTimeFrom;
var effectiveUTCTimeFromAnsiString;
if (Utils.isDefined(me.getTimeFromGeoOffset()) && !Utils.isEmptyString(me.getTimeFromGeoOffset()) &&
    Utils.isDefined(me.getTimeFromDSTOffset()) && !Utils.isEmptyString(me.getTimeFromDSTOffset())) {

  effectiveUTCTimeFromAnsiString = dateTimeHelper.getUTCAnsiString(effectiveDateFrom, me.getTimeFromGeoOffset(), me.getTimeFromDSTOffset());
  effectiveUTCTimeFrom = dateTimeHelper.getUTCDate(effectiveUTCTimeFromAnsiString);
}

var effectiveUTCTimeThru;
var effectiveUTCTimeThruAnsiString;
if (Utils.isDefined(me.getTimeThruGeoOffset()) && !Utils.isEmptyString(me.getTimeThruGeoOffset()) &&
    Utils.isDefined(me.getTimeThruDSTOffset()) && !Utils.isEmptyString(me.getTimeThruDSTOffset())) {

  effectiveUTCTimeThruAnsiString = dateTimeHelper.getUTCAnsiString(effectiveDateThru, me.getTimeThruGeoOffset(), me.getTimeThruDSTOffset());
  effectiveUTCTimeThru = dateTimeHelper.getUTCDate(effectiveUTCTimeThruAnsiString);
}

//check if necessary fields are empty
if ((Utils.isEmptyString(me.getTimeEntryMetaPKey)) || (Utils.isEmptyString(me.getDescription())) || (Utils.isEmptyString(me.getStartdate())) || (Utils.isEmptyString(me.getEnddate())) || (Utils.isEmptyString(me.getEndtime())) || (Utils.isEmptyString(me.getStarttime()))) {
  newError = {
    "level" : "error",
    "objectClass" : "BoCreateNewTimeEntry",
    "messageID" : "CasTimeFillInAllValues",
  };
  me.setTimeEntryValid("0");
  messageCollector.add(newError);
}

//check if thru is bigger from
if (Utils.isDefined(effectiveUTCTimeFrom) && Utils.isDefined(effectiveUTCTimeThru) && effectiveUTCTimeFrom.getTime() >= effectiveUTCTimeThru.getTime()) {
  newError = {
    "level" : "error",
    "objectClass" : "BoCreateNewTimeEntry",
    "messageID" : "CasTimeInvalidData",
  };
  me.setTimeEntryValid("0");
  messageCollector.add(newError);
}

//overlap check for time entries
if (Utils.isDefined(me.timeEntries)) {

  var listOfWorkingTimeTEs = [];
  origTimeEntries = me.timeEntries.slice();
  //ignore working time time entry for overlap check AND already deleted entries
  var idxRemoveElement = [];
  for (var k = 0; k < me.timeEntries.length; k++) {
    if (me.timeEntries[k].getUsrTimeEntryMetaPKey() === me.getWorkUsrTimeEntryMetaPKey() || me.timeEntries[k].getObjectStatus() === STATE.DELETED) {
      if (me.timeEntries[k].getUsrTimeEntryMetaPKey() === me.getWorkUsrTimeEntryMetaPKey()) {
        listOfWorkingTimeTEs.push(me.timeEntries[k]);
      }
      idxRemoveElement.push(k);
    }
  }
  for (var idR = idxRemoveElement.length-1; idR >= 0; idR--) {
    me.timeEntries.splice(idxRemoveElement[idR],  1);
  }


  //sort time entries
  me.timeEntries = dateTimeHelper.sortTimeEntries(me.timeEntries);

  var entry1 = "";
  var entry2 = "";
  var entry1TimeFrame = "";
  var entry2TimeFrame = "";

  var compTimeFrom = dateTimeHelper.getUTCDateWithoutSeconds(effectiveUTCTimeFromAnsiString);
  var compTimeThru = dateTimeHelper.getUTCDateWithoutSeconds(effectiveUTCTimeThruAnsiString);

  if (me.timeEntries.length > 0) {
    for (var i = 0; i < me.timeEntries.length; i++) {

      var listItemTimeFrom = dateTimeHelper.getUTCDateWithoutSeconds(me.timeEntries[i].getEffectiveUTCTimeFrom());
      var listItemTimeThru = dateTimeHelper.getUTCDateWithoutSeconds(me.timeEntries[i].getEffectiveUTCTimeThru());

      //check for identical entry
      if (listItemTimeThru.getTime() == compTimeThru.getTime() || compTimeFrom.getTime() == listItemTimeFrom.getTime()) {
        entry1 = me.timeEntries[i].getDescription();
        entry2 = me.getDescription();
        entry1TimeFrame = me.timeEntries[i].getEffectiveTimeFrom() + " - " + me.timeEntries[i].getEffectiveTimeThru();
        entry2TimeFrame = me.getStarttime() + " - " + me.getEndtime();
        isOverlap = true;
        break;
      }
      if (listItemTimeFrom.getTime() < compTimeThru.getTime() && compTimeFrom.getTime() < listItemTimeThru.getTime()) {
        entry1 = me.timeEntries[i].getDescription();
        entry2 = me.getDescription();
        entry1TimeFrame = me.timeEntries[i].getEffectiveTimeFrom() + " - " + me.timeEntries[i].getEffectiveTimeThru();
        entry2TimeFrame = me.getStarttime() + " - " + me.getEndtime();
        isOverlap = true;
        break;
      }

    }
    me.timeEntries = origTimeEntries.slice();
  }

  //check if new time entry is in-between working time TE slot
  var newError2;
  if (listOfWorkingTimeTEs.length > 0) {
    var startWorkingTimeDate = dateTimeHelper.getUTCDateWithoutSeconds(listOfWorkingTimeTEs[0].getEffectiveUTCTimeFrom());
    var endWorkingTimeDate;

    if (listOfWorkingTimeTEs[listOfWorkingTimeTEs.length - 1].getEffectiveUTCTimeThru() != Utils.getMinDate()) {
      endWorkingTimeDate = dateTimeHelper.getUTCDateWithoutSeconds(listOfWorkingTimeTEs[listOfWorkingTimeTEs.length - 1].getEffectiveUTCTimeThru());
    }

    var timeRange =  me.getStarttime() + " - " + me.getEndtime();
    //check TE against start time of working time
    if (compTimeFrom.getTime() < startWorkingTimeDate.getTime()) {
      newError2 = {
        "level" : "error",
        "objectClass" : "BoUserDailyReport",
        "simpleProperty" : " ",
        "messageID" : "CasUsrTimeEntryOutOfBounds",
        "messageParams" : {
          "entry" : me.getDescription(),
          "time" : timeRange,
        }
      };
      me.timeEntries = origTimeEntries.slice();
    }

    //check TE against end time of working time
    if (Utils.isDefined(endWorkingTimeDate) && (compTimeThru.getTime() > endWorkingTimeDate.getTime())) {
      newError2 = {
        "level" : "error",
        "objectClass" : "BoUserDailyReport",
        "simpleProperty" : " ",
        "messageID" : "CasUsrTimeEntryOutOfBounds",
        "messageParams" : {
          "entry" : me.getDescription(),
          "time" : timeRange,
        }
      };
    }
    me.timeEntries = origTimeEntries.slice();
  }

  if (isOverlap) {
    newError = {
      "level" : "error",
      "objectClass" : "BoCreateNewTimeEntry",
      "messageID" : "CasTimeOverlapData",
      "messageParams" : {
        "entry1" : entry1,
        "entry2" : entry2,
        "time1" : entry1TimeFrame,
        "time2" : entry2TimeFrame,
      }
    };
    me.setTimeEntryValid("0");
    messageCollector.add(newError);
  }

  if (Utils.isDefined(newError2)) {
    me.setTimeEntryValid("0");
    messageCollector.add(newError2);
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}