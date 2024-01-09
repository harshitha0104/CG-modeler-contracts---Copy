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
 * @function executeBreak
 * @this BoUserDailyReport
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {BoCall} clbMainBo
 * @param {DomPKey} timeEntryPKey
 * @param {DomDateTime} effectiveUTCTimeFrom
 * @returns promise
 */
function executeBreak(clbMainBo, timeEntryPKey, effectiveUTCTimeFrom){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise;
var closeTimeEntryPKey = "";
var clbMainPKey = " ";
var breakTimeEntryPKey = "";
var dateTimeHelper = ApplicationContext.get("dateTimeHelper");

// define timer
var timer = {
  // get Date out of UTC time ANSI string
  getTimeEntryStartDate : function (effectiveUTCTimeFromAnsi) {
    var teStartDate = Utils.createDateNow();
    var splittedDateTime = effectiveUTCTimeFromAnsi.split(" ");
    var splittedDate = splittedDateTime[0].split("-");
    var splittedTime = splittedDateTime[1].split(":");
    teStartDate.setUTCFullYear(splittedDate[0]);
    teStartDate.setUTCMonth(splittedDate[1] - 1);
    teStartDate.setUTCDate(splittedDate[2]);
    teStartDate.setUTCHours(splittedTime[0]);
    teStartDate.setUTCMinutes(splittedTime[1]);
    teStartDate.setUTCSeconds(splittedTime[2]);
    return teStartDate;
  },

  init : function (id) {
    me[id] = {
      obj : document.getElementById(id)
    };
  },

  start : function (id, timeEntryStartDate) {
    var obj = me[id];
    if (Utils.isDefined(timeEntryStartDate)) {
      obj.srt = me.getTimeEntryStartDate(timeEntryStartDate);
    }
    else {
      obj.srt = Utils.createDateNow();
    }
    clearTimeout(obj.to);
    me.tick(id);
  },

  stop : function (id) {
    var obj = me[id];
    obj.obj.innerHTML = " ";
    clearTimeout(me[id].to);
  },

  tick : function (id) {
    me.stop(id);
    var obj = me[id];
    var sec = Math.round((Utils.createDateNow() - obj.srt) / 1000);
    var min = Math.floor(sec / 60);
    sec = sec % 60;
    var hrs = 0;
    if (min > 59) {
      hrs = Math.floor(min / 60);
      min = min % 60;
    }

    // format time strings
    sec = sec > 9 ? sec : "0" + sec;
    min = min > 9 ? min : "0" + min;
    hrs = hrs > 9 ? hrs : "0" + hrs;

    obj.obj.innerHTML = hrs + ":" + min + ":" + sec;
    obj.to = setTimeout(function () {
      timer.tick(id);
    }, 1000);
  }
};

var buttonValues = {};
var breakMessage = Localization.resolve("BoUserDailyReport_BreakMessageText");
buttonValues[Localization.resolve("BoUserDailyReport_BreakMessageEndButton")] = "ok";

//recovery
if(Utils.isDefined(timeEntryPKey) && !Utils.isEmptyString(timeEntryPKey) && Utils.isDefined(effectiveUTCTimeFrom) && !Utils.isEmptyString(effectiveUTCTimeFrom)){
  // task for showing timer in message box

  var breakerMessage = "Break is running since: " + timer.getTimeEntryStartDate(effectiveUTCTimeFrom)  +" .";

  promise = MessageBox.displayMessage(me.getBoUserDocMeta().getBreakUsrTimeEntryText(), breakerMessage, buttonValues).then(
    function () {
      // close break time entry
      return me.closeTimeEntry(timeEntryPKey, false);
    }
  ).then(
    function (timeEntryPKey) {
      me.setEARights();
    });
}
else {
  // standard
  // get time entry of call which has to be closed
  if (Utils.isDefined(clbMainBo)) {
    clbMainPKey = clbMainBo.getPKey();
    closeTimeEntryPKey = clbMainBo.getTimeEntryPKey();
  }

  promise = me.closeTimeEntry(closeTimeEntryPKey, true).then(
    function (timeEntryPKey) {
      if (Utils.isDefined(clbMainBo)) {
        clbMainBo.setTimeEntryPKey("");
      }

      // calculate start date and time
      var now = Utils.createDateNow();
      var time = dateTimeHelper.getFormattedTimeString(now.getHours() * 60 + now.getMinutes());
      var breakTemplateText = me.getBoUserDocMeta().getBreakUsrTimeEntryText();
      return me.createTimeEntry(me.getBoUserDocMeta().getBreakUsrTimeEntryMetaPKey(), clbMainPKey, " ", breakTemplateText, Utils.convertFullDate2Ansi(now), Utils.getMinDateTime(), time, "00:00", " ", " ", "0");
    }
  ).then(
    function (timeEntryPKey) {
      // error handling ... start no timer if time entry for break could not be created
      if ((!Utils.isDefined(timeEntryPKey) || Utils.isEmptyString(timeEntryPKey)) && !Utils.isEmptyString(closeTimeEntryPKey)) {
        // create new time entry for call if time entry was closed before
        var now = Utils.createDateNow();
        var time = dateTimeHelper.getFormattedTimeString(now.getHours() * 60 + now.getMinutes());
        return me.createTimeEntry(clbMainBo.getUsrTimeEntryMetaPKey(), clbMainPKey, " ", clbMainBo.getSubject(), Utils.convertFullDate2Ansi(now), Utils.getMinDateTime(), time, "00:00", " ", " ", "0").then(
          function (timeEntryPKey) {
            clbMainBo.setTimeEntryPKey(timeEntryPKey);
            return timeEntryPKey;
          });
      }
      else {
        return timeEntryPKey;
      }
    }
  ).then(
    function () {
      // task for showing timer in message box
      var newBreakerMessage = "Break is running since: " + Utils.createDateNow()  +" .";
      return MessageBox.displayMessage(me.getBoUserDocMeta().getBreakUsrTimeEntryText(), newBreakerMessage, buttonValues);
    }
  ).then(
    function (result) {
      if (result === "ok") {
        return me.closeTimeEntry(timeEntryPKey, true).then(
          function () {
            breakTimeEntryPKey = timeEntryPKey;
            // create new time entry for call if time entry was
            // closed before
            if (!Utils.isEmptyString(closeTimeEntryPKey)) {
              var now = Utils.createDateNow();
              var time = dateTimeHelper.getFormattedTimeString(now.getHours() * 60 + now.getMinutes());
              return me.createTimeEntry(clbMainBo.getUsrTimeEntryMetaPKey(), clbMainPKey, " ", clbMainBo.getSubject(), Utils.convertFullDate2Ansi(now), Utils.getMinDateTime(), time, "00:00", " ", " ", "0").then(
                function (timeEntryPKey) {
                  clbMainBo.setTimeEntryPKey(timeEntryPKey);
                });
            }
          }
        ).then(
          function(){
            return BoFactory.loadObjectByParamsAsync(LU_TIMEENTRYTYPE, me.getQueryBy("pKey", me.getBoUserDocMeta().getBreakUsrTimeEntryMetaPKey())).then(
              function (luTimeEntryType) {

                // Refresh total durations
                if (Utils.isDefined(luTimeEntryType) && luTimeEntryType.getShowAggregation() == "1") {
                  var listTimeEntryByVisitType = me.getLoUsrTimeEntryByVisitType().getItemObjects();
                  var timeEntryFound = false;

                  // check if time entry type is already in list
                  var liBreakTimeEntry;
                  var listTimeEntries;
                  for (var i = 0; i < listTimeEntryByVisitType.length; i++) {

                    if (listTimeEntryByVisitType[i].getPKey() === me.getBoUserDocMeta().getBreakUsrTimeEntryMetaPKey()) {
                      // refresh duration of matching time
                      listTimeEntries = me.getLoUsrTimeEntry().getItemObjects();
                      for (var j = 0; j < listTimeEntries.length; j++) {
                        if (listTimeEntries[j].getPKey() === breakTimeEntryPKey) {
                          var duration = listTimeEntryByVisitType[i].getDuration().split(":");
                          var durationInMinutes = duration[0] * 60 + duration[1] * 1 + listTimeEntries[j].getDuration();
                          listTimeEntryByVisitType[i].setDuration(dateTimeHelper.getFormattedTimeString(durationInMinutes));
                          timeEntryFound = true;
                          break;
                        }
                      }
                      break;
                    }
                  }

                  // add new time entry type if type was not found
                  if (!timeEntryFound) {
                    listTimeEntries = me.getLoUsrTimeEntry().getItemObjects();
                    for (var k = 0; k < listTimeEntries.length; k++) {
                      if (listTimeEntries[k].getPKey() === breakTimeEntryPKey) {

                        var newLiDuration = listTimeEntries[k].getDuration();
                        var newliUsrTimeEntryType = {
                          "pKey": luTimeEntryType.getPKey(),
                          "text": luTimeEntryType.getText(),
                          "duration": dateTimeHelper.getFormattedTimeString(newLiDuration)
                        };
                        me.getLoUsrTimeEntryByVisitType().addListItems([newliUsrTimeEntryType]);
                        break;
                      }
                    }
                  }
                }
                // Refresh total working time
                me.calculateTotalActivityDuration();
                me.setEARights();
              });
          });
      }
      else {
        me.setEARights();
      }
    });
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}