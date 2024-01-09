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
 * @function validateTimeEntries
 * @this BoUserDailyReport
 * @kind businessobject
 * @namespace CORE
 * @param {messageCollector} messageCollector
 * @returns messageCollector
 */
function validateTimeEntries(messageCollector){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var isOverlap = false;
var dateTimeHelper = ApplicationContext.get("dateTimeHelper");
var entry1 = "";
var entry2 = "";
var entry1TimeFrame = "";
var entry2TimeFrame = "";

if (me.getBoUserDocMeta().getUiGroup() === "TimeCard") {
  var loTimeEntries = me.getLoUsrTimeEntry().getItemsByParamArray([{
    "usrTimeEntryMetaPKey" : me.getBoUserDocMeta().getWorkUsrTimeEntryMetaPKey(),
    "op" : "NE"
  }, {
    "description" : "Hidden",
    "op" : "NE"
  }, {
    "objectStatus" : STATE.DIRTY | STATE.DELETED,
    "op" : "NE"
  }]);

  loTimeEntries = dateTimeHelper.sortTimeEntries(loTimeEntries);

  for (var idxloTimeEntries = 0; idxloTimeEntries < loTimeEntries.length; idxloTimeEntries++) {

    if (idxloTimeEntries + 1 < loTimeEntries.length) {

      var curDateEnd = dateTimeHelper.getUTCDateWithoutSeconds(loTimeEntries[idxloTimeEntries].getEffectiveUTCTimeThru());
      var nextStartDate = dateTimeHelper.getUTCDateWithoutSeconds(loTimeEntries[idxloTimeEntries + 1].getEffectiveUTCTimeFrom());

      if (nextStartDate.getTime() < curDateEnd.getTime()) {
        entry1 = loTimeEntries[idxloTimeEntries].getDescription();
        entry2 = loTimeEntries[idxloTimeEntries+1].getDescription();
        entry1TimeFrame = loTimeEntries[idxloTimeEntries].getEffectiveTimeFrom() + " - " + loTimeEntries[idxloTimeEntries].getEffectiveTimeThru();
        entry2TimeFrame = loTimeEntries[idxloTimeEntries+1].getEffectiveTimeFrom() + " - " + loTimeEntries[idxloTimeEntries+1].getEffectiveTimeThru();
        isOverlap = true;
        break;
      }
    }
  }

  var newError;
  if (isOverlap) {
    if (Utils.isDefined(me.getReleaseProcessActive()) && me.getReleaseProcessActive() == "1") {
      newError = {
        "level" : "error",
        "objectClass" : "BoUserDailyReport",
        "simpleProperty" : " ",
        "messageID" : "CasUsrTimeCardReleaseNoTimeOverlap",
        "messageParams": { "entry1": entry1 , "entry2": entry2, "time1":entry1TimeFrame , "time2":entry2TimeFrame }
      };
    }
    else {
      newError = {
        "level" : "error",
        "objectClass" : "BoUserDailyReport",
        "simpleProperty" : " ",
        "messageID" : "CasUsrTimeCardSaveNoTimeOverlap",
        "messageParams": { "entry1": entry1 , "entry2": entry2, "time1":entry1TimeFrame , "time2":entry2TimeFrame }
      };
    }
  }

  var newError2;
  if(me.getReleaseProcessActive()== "1" && loTimeEntries.length > 0) {

    var loWorkingTimeEntries = me.getLoUsrTimeEntry().getItemsByParamArray([{
      "usrTimeEntryMetaPKey" : me.getBoUserDocMeta().getWorkUsrTimeEntryMetaPKey(),
      "op" : "EQ"
    }, {
      "description" : "Hidden",
      "op" : "NE"
    }]);

    loWorkingTimeEntries = dateTimeHelper.sortTimeEntries(loWorkingTimeEntries);

    var startDate = dateTimeHelper.getUTCDateWithoutSeconds(loWorkingTimeEntries[0].getEffectiveUTCTimeFrom());
    var endNewDate = Utils.createDateNow();
    var utcAnsiEndDate = dateTimeHelper.getUTCAnsiString(endNewDate, loTimeEntries[loTimeEntries.length -1].getEffectiveTimeThruGeoOffset(), loTimeEntries[loTimeEntries.length -1].getEffectiveTimeThruDSTOffset());
    var endDate = dateTimeHelper.getUTCDateWithoutSeconds(utcAnsiEndDate);
    var timeRange;

    if(dateTimeHelper.getUTCDateWithoutSeconds(loTimeEntries[0].getEffectiveUTCTimeFrom()).getTime() < startDate.getTime()) {
      timeRange = loTimeEntries[0].getEffectiveTimeFrom() + " - " + loTimeEntries[0].getEffectiveTimeThru();
      newError2 = {
        "level" : "error",
        "objectClass" : "BoUserDailyReport",
        "simpleProperty" : " ",
        "messageID" : "CasUsrTimeEntryOutOfBoundsReleaseActive",
        "messageParams": { "entry": loTimeEntries[0].getDescription() , "time":timeRange}
      };
    }

    if(dateTimeHelper.getUTCDateWithoutSeconds(loTimeEntries[loTimeEntries.length -1].getEffectiveUTCTimeThru()).getTime() > endDate.getTime()) {
      //out of bound
      timeRange = loTimeEntries[loTimeEntries.length -1].getEffectiveTimeFrom() + " - " + loTimeEntries[loTimeEntries.length -1].getEffectiveTimeThru();
      newError2 = {
        "level" : "error",
        "objectClass" : "BoUserDailyReport",
        "simpleProperty" : " ",
        "messageID" : "CasUsrTimeEntryOutOfBoundsReleaseActive",
        "messageParams": { "entry": loTimeEntries[loTimeEntries.length -1].getDescription() , "time":timeRange}
      };
    }
  }

  if(Utils.isDefined(newError)) {
    messageCollector.add(newError);
    me.setReleaseProcessActive("0");
  }
  if(Utils.isDefined(newError2)) {
    messageCollector.add(newError2);
    me.setReleaseProcessActive("0");
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return messageCollector;
}