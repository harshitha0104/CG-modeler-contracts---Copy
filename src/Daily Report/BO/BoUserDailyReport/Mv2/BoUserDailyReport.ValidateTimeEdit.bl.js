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
 * @function validateTimeEdit
 * @this BoUserDailyReport
 * @kind businessobject
 * @namespace CORE
 * @param {messageCollector} messageCollector
 */
function validateTimeEdit(messageCollector){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var newError;
var liTime;
var idxTime = 0;
var fullEFromDate;
var fullEThruDate;
var isOverlap = false;
var dateTimeHelper = ApplicationContext.get("dateTimeHelper");

var loTimeEntries = me.getLoUsrTimeEntry().getItemsByParamArray([{
  "description" : "Hidden",
  "op" : "EQ"
}, {
  "objectStatus" : "9",
  "op" : "NE"
}]);

if (loTimeEntries.length === 1) {
  var origLI = me.getLoUsrTimeEntry().getItemByPKey(loTimeEntries[0].getOrgPKey());
  var copiedLI = loTimeEntries[0];
  var loTimeEntriesFull = me.getLoUsrTimeEntry().getItemsByParamArray([{
    "pKey" : loTimeEntries[0].getOrgPKey(),
    "op" : "NE"
  }, {
    "description" : "Hidden",
    "op" : "NE"
  }, {
    "usrTimeEntryMetaPKey" : me.getBoUserDocMeta().getWorkUsrTimeEntryMetaPKey(),
    "op" : "NE"
  }, {
    "objectStatus" : STATE.DIRTY | STATE.DELETED,
    "op" : "NE"
  }]);

  //get working time entry list
  var listOfWorkingTimeTEs = me.getLoUsrTimeEntry().getItemsByParamArray([{
    "usrTimeEntryMetaPKey" : me.getBoUserDocMeta().getWorkUsrTimeEntryMetaPKey(),
    "op" : "EQ"
  }]);

  listOfWorkingTimeTEs = dateTimeHelper.sortTimeEntries(listOfWorkingTimeTEs);

  //check if necessary fields are empty
  if (Utils.isEmptyString(copiedLI.getEffectiveDateFrom()) || Utils.isEmptyString(copiedLI.getEffectiveDateThru()) || Utils.isEmptyString(copiedLI.getEffectiveTimeFrom())|| Utils.isEmptyString(copiedLI.getEffectiveTimeThru())) {
    newError = {
      "level" : "error",
      "objectClass" : "BoCreateNewTimeEntry",
      "messageID" : "CasTimeFillInAllValues"
    };
    messageCollector.add(newError);
    return;
  }

  //sort time entries
  loTimeEntriesFull = dateTimeHelper.sortTimeEntries(loTimeEntriesFull);

  var from = Utils.convertAnsiDate2Date(copiedLI.getEffectiveDateFrom());
  var fromTime = Utils.convertAnsiTime2Time(copiedLI.getEffectiveTimeFrom());
  var newFromTime = Utils.createSpecificDate(from.getFullYear(), from.getMonth(), from.getDate(), fromTime.getHours(), fromTime.getMinutes());

  var thru = Utils.convertAnsiDate2Date(copiedLI.getEffectiveDateThru());
  var thruTime = Utils.convertAnsiTime2Time(copiedLI.getEffectiveTimeThru());
  var newThruTime = Utils.createSpecificDate(thru.getFullYear(), thru.getMonth(), thru.getDate(), thruTime.getHours(), thruTime.getMinutes());

  if ((fromTime.getHours() * 60 + fromTime.getMinutes() !== newFromTime.getHours() * 60 + newFromTime.getMinutes()) ||
      (thruTime.getHours() * 60 + thruTime.getMinutes() !== newThruTime.getHours() * 60 + newThruTime.getMinutes())) {
    //Error due to DST
    newError = {
      "level" : "error",
      "objectClass" : "BoUserDailyReport",
      "messageID" : "CasUsrTimeEntryDSTInvalid",
      "messageParams" : {
        "item" : origLI.getDescription()
      }
    };
    messageCollector.add(newError);

  }

  //check if changed
  if (Utils.isDefined(origLI) && (origLI.getEffectiveTimeFrom() !== copiedLI.getEffectiveTimeFrom() || origLI.getEffectiveTimeThru() !== copiedLI.getEffectiveTimeThru() ||
                                  origLI.getEffectiveDateFrom() !== copiedLI.getEffectiveDateFrom() || origLI.getEffectiveDateThru() !== copiedLI.getEffectiveDateThru()) ||
      origLI.getEffectiveTimeFromGeoOffset() !== copiedLI.getEffectiveTimeFromGeoOffset() || origLI.getEffectiveTimeFromDSTOffset() !== copiedLI.getEffectiveTimeFromDSTOffset() ||
      origLI.getEffectiveTimeThruGeoOffset() !== copiedLI.getEffectiveTimeThruGeoOffset() || origLI.getEffectiveTimeThruDSTOffset() !== copiedLI.getEffectiveTimeThruDSTOffset() ||
      origLI.getReasonCode() !==copiedLI.getReasonCode()) {
    //if changed -> Check if reason code is maintained (if not manual)
    if (origLI.getManual() !== "1" && Utils.isEmptyString(copiedLI.getReasonCode())) {
      //Error
      newError = {
        "level" : "error",
        "objectClass" : "BoUserDailyReport",
        "messageID" : "CasUsrTimeEntryEmptyReason",
        "messageParams" : {
          "item" : origLI.getDescription()
        }
      };
      messageCollector.add(newError);

    }

    //create effectiveUTCTimeFrom
    var dateFrom = Utils.convertAnsiDate2Date(copiedLI.getEffectiveDateFrom());
    var timeFrom = Utils.convertAnsiTime2Time(copiedLI.getEffectiveTimeFrom());
    var currentDateFromDate = Utils.createSpecificDate(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate(), timeFrom.getHours(), timeFrom.getMinutes(), 0);
    var effectiveUTCimeFromAnsiString = dateTimeHelper.getUTCAnsiString(currentDateFromDate, copiedLI.getEffectiveTimeFromGeoOffset(), copiedLI.getEffectiveTimeFromDSTOffset());
    var effectiveUTCTimeFrom = dateTimeHelper.getUTCDate(effectiveUTCimeFromAnsiString);

    //create effectiveUTCTimeThru
    var dateThru = Utils.convertAnsiDate2Date(copiedLI.getEffectiveDateThru());
    var timeThru = Utils.convertAnsiTime2Time(copiedLI.getEffectiveTimeThru());
    var currentDateThruDate = Utils.createSpecificDate(dateThru.getFullYear(), dateThru.getMonth(), dateThru.getDate(), timeThru.getHours(), timeThru.getMinutes(), 0);
    var effectiveUTCTimeThruAnsiString = dateTimeHelper.getUTCAnsiString(currentDateThruDate, copiedLI.getEffectiveTimeThruGeoOffset(), copiedLI.getEffectiveTimeThruDSTOffset());
    var effectiveUTCTimeThru = dateTimeHelper.getUTCDate(effectiveUTCTimeThruAnsiString);

    // User Story: Enhanced TimeCard-- Ignore check on WorkingTimeentry edit
    if ((effectiveUTCTimeThru.getTime() <= effectiveUTCTimeFrom.getTime()) && origLI.getDescription() !=="Working Time"){
      //Error
      newError = {
        "level" : "error",
        "objectClass" : "BoUserDailyReport",
        "messageID" : "CasUsrTimeEntryInvalidData",
        "messageParams" : {
          "item" : origLI.getDescription()
        }
      };
      messageCollector.add(newError);
    }

    var entry1 = origLI.getDescription();
    var entry1TimeFrame = copiedLI.getEffectiveTimeFrom() + " - " + copiedLI.getEffectiveTimeThru();
    var entry2;
    var entry2TimeFrame;

    for (var idxloTimeEntries = 0; idxloTimeEntries < loTimeEntriesFull.length; idxloTimeEntries++) {
      //remove seconds of UTC times
      var compFromUTC = dateTimeHelper.getUTCDateWithoutSeconds(loTimeEntriesFull[idxloTimeEntries].getEffectiveUTCTimeFrom());
      var compThruUTC = dateTimeHelper.getUTCDateWithoutSeconds(loTimeEntriesFull[idxloTimeEntries].getEffectiveUTCTimeThru());
      entry2 = loTimeEntriesFull[idxloTimeEntries].getDescription();
      entry2TimeFrame = loTimeEntriesFull[idxloTimeEntries].getEffectiveTimeFrom() + " - " + loTimeEntriesFull[idxloTimeEntries].getEffectiveTimeThru();

      // overlap check
      //  a |-----------------------------|
      //  b |----->
      //  b                     --------->|
      // User Story: Enhanced TimeCard-- Ignore overlap check on WorkingTimeentry edit
      if ((compFromUTC.getTime() == effectiveUTCTimeFrom.getTime() || compThruUTC.getTime() == effectiveUTCTimeThru.getTime()) && origLI.getDescription() !=="Working Time"){
        isOverlap = true;
        break;
      }

      // overlap check
      //  a |-----------------------------|
      //  b        |-----|
      // User Story: Enhanced TimeCard-- Ignore overlap check on WorkingTimeentry edit
      if ((compFromUTC.getTime() < effectiveUTCTimeThru.getTime() && effectiveUTCTimeFrom.getTime() < compThruUTC.getTime()) && origLI.getDescription() !=="Working Time"){
        isOverlap = true;
        break;
      }
    }

    var newError2;
    var timeRange;
    //check if changed TE is in working time slot
    if(listOfWorkingTimeTEs.length > 0 && origLI.getDescription() !=="Working Time"){
      var startWorkingTimeDate = dateTimeHelper.getUTCDateWithoutSeconds(listOfWorkingTimeTEs[0].getEffectiveUTCTimeFrom());
      var endWorkingTimeDate;

      if (listOfWorkingTimeTEs[listOfWorkingTimeTEs.length - 1].getEffectiveUTCTimeThru() != Utils.getMinDate()) {
        endWorkingTimeDate = dateTimeHelper.getUTCDateWithoutSeconds(listOfWorkingTimeTEs[listOfWorkingTimeTEs.length - 1].getEffectiveUTCTimeThru());
      }

      //check TE against start time of working time
      if (effectiveUTCTimeFrom.getTime() < startWorkingTimeDate.getTime()){
        timeRange = copiedLI.getEffectiveTimeFrom() + " - " + copiedLI.getEffectiveTimeThru();
        newError2 = {
          "level" : "error",
          "objectClass" : "BoUserDailyReport",
          "simpleProperty" : " ",
          "messageID" : "CasUsrTimeEntryOutOfBounds",
          "messageParams" : {
            "entry" : origLI.getDescription(),
            "time" : timeRange
          }
        };
      }

      //check TE against end time of working time
      if (Utils.isDefined(endWorkingTimeDate) && (effectiveUTCTimeFrom.getTime() > endWorkingTimeDate.getTime())){
        timeRange = copiedLI.getEffectiveTimeFrom() + " - " + copiedLI.getEffectiveTimeThru();
        newError2 = {
          "level" : "error",
          "objectClass" : "BoUserDailyReport",
          "simpleProperty" : " ",
          "messageID" : "CasUsrTimeEntryOutOfBounds",
          "messageParams" : {
            "entry" : origLI.getDescription(),
            "time" : timeRange
          }
        };
      }

    }

    // Check OutOfBound on WorkingTime edit against TEs
    if(origLI.getDescription() =="Working Time" && loTimeEntriesFull.length !== 0){

      // Get the earliest starttime & last endtime of TimeEntries for outofbound check on workingtime edit
      var timeEntriesStartTime=dateTimeHelper.getUTCDateWithoutSeconds(loTimeEntriesFull[0].getEffectiveUTCTimeFrom());
      var timeEntriesEndTime=dateTimeHelper.getUTCDateWithoutSeconds(loTimeEntriesFull[loTimeEntriesFull.length - 1].getEffectiveUTCTimeThru());

      if (effectiveUTCTimeFrom.getTime() > timeEntriesStartTime.getTime()){
        timeRange = loTimeEntriesFull[0].getEffectiveTimeFrom() + " - " + loTimeEntriesFull[0].getEffectiveTimeThru();
        newError2 = {
          "level" : "error",
          "objectClass" : "BoUserDailyReport",
          "simpleProperty" : " ",
          "messageID" : "CasUsrTimeEntryOutOfBounds",
          "messageParams" : {
            "entry" : loTimeEntriesFull[0].getDescription(),
            "time" : timeRange
          }
        };
      }
      // Check for Rejected timecard
      if ((effectiveUTCTimeThru.getTime() < timeEntriesEndTime.getTime()) && me.getPhase() =="Correction"){
        timeRange = loTimeEntriesFull[loTimeEntriesFull.length - 1].getEffectiveTimeFrom() + " - " + loTimeEntriesFull[loTimeEntriesFull.length - 1].getEffectiveTimeThru();
        newError2 = {
          "level" : "error",
          "objectClass" : "BoUserDailyReport",
          "simpleProperty" : " ",
          "messageID" : "CasUsrTimeEntryOutOfBounds",
          "messageParams" : {
            "entry" : loTimeEntriesFull[loTimeEntriesFull.length - 1].getDescription(),
            "time" : timeRange
          }
        };
      }
    }

    if (isOverlap) {
      newError = {
        "level" : "error",
        "objectClass" : "BoUserDailyReport",
        "simpleProperty" : " ",
        "messageID" : "CasUsrTimeEntryEditNoTimeOverlap",
        "messageParams" : {
          "entry1" : entry1,
          "entry2" : entry2,
          "time1" : entry1TimeFrame,
          "time2" : entry2TimeFrame
        }
      };

      messageCollector.add(newError);
    }

    if(Utils.isDefined(newError2)){
      messageCollector.add(newError2);
    }
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}