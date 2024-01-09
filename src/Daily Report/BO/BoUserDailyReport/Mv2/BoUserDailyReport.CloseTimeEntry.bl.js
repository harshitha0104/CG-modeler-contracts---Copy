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
 * @function closeTimeEntry
 * @this BoUserDailyReport
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {String} timeEntryPKey
 * @param {Boolean} saveImmediately
 * @returns promise
 */
function closeTimeEntry(timeEntryPKey, saveImmediately){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var dateTimeHelper = ApplicationContext.get("dateTimeHelper");
var promise;

if(!Utils.isDefined(saveImmediately)) {
  saveImmediately = true;
}

if (!Utils.isDefined(me.getLoUsrTimeEntry()) || (Utils.isDefined(me.getLoUsrTimeEntry()) && me.getLoUsrTimeEntry().getItemObjects().length === 0)) {
  promise = BoFactory.loadListAsync(LO_USRTIMEENTRY, me.getQueryBy("UsrDailyReportPKey", me.getPKey())).then(
    function (result) {
      me.setLoUsrTimeEntry(result);
    }
  );
}
else {
  promise = when.resolve();
}

var promise = promise.then(
  function() {
    if (Utils.isDefined(me.getLoUsrTimeEntry())) {
      var li = me.getLoUsrTimeEntry().getItemByPKey(timeEntryPKey);

      if (Utils.isDefined(li)) {
        li.beginEdit();

        //calculate end date and time
        var now = Utils.createDateNow();
        var hours = now.getHours() > 9 ? now.getHours() : "0" + now.getHours();
        var minutes = now.getMinutes() > 9 ? now.getMinutes() : "0" + now.getMinutes();
        var time = hours + ":" + minutes;

        var nowWithoutTime = Utils.createDateByMilliSec(now.getTime());
        nowWithoutTime.setHours(0);
        nowWithoutTime.setMinutes(0);
        nowWithoutTime.setSeconds(0);

        li.setEffectiveDateThru(Utils.convertFullDate2Ansi(nowWithoutTime));
        li.setEffectiveTimeThru(time);
        li.setSystemTimeThru(Utils.convertFullDate2Ansi(now));
        li.setTimeFromThru(li.getEffectiveTimeFrom() + " - " + time);

        //set geo and dst offsets for EffectiveTimeThru and SystemTimeThru
        var offsets = dateTimeHelper.getTimeZoneOffset(now);
        if(Utils.isDefined(offsets)) {
          li.setEffectiveTimeThruGeoOffset(offsets.geoOffset);
          li.setEffectiveTimeThruDSTOffset(offsets.dstOffset);
          li.setSystemTimeThruGeoOffset(offsets.geoOffset);
          li.setSystemTimeThruDSTOffset(offsets.dstOffset);
        }

        // UTC Time (effectiveUTCTimeThru)
        var effectiveUTCTimeThru = dateTimeHelper.getUTCAnsiString(now, li.getSystemTimeThruGeoOffset(), li.getSystemTimeThruDSTOffset());

        if(Utils.isDefined(effectiveUTCTimeThru)) {
          li.setEffectiveUTCTimeThru(effectiveUTCTimeThru);
        }

        //calculate duration of timeEntry
        var dateDiffMins = dateTimeHelper.getDateDiff(li.getEffectiveUTCTimeFrom(), li.getEffectiveUTCTimeThru());

        li.setDuration(parseInt(dateDiffMins, 10));
        li.endEdit();

        //check if there already exist timer with current activity type
        var availableTimer = TM.getAllTimers(li.getActivityType());

        if (availableTimer.length > 0) {
          //stop available timer
          for (var idxTimer = 0; idxTimer < availableTimer.length; idxTimer++) {
            TM.stopTimer(availableTimer[idxTimer].getTimerId());
          }
        }

        //Calculate Time entry Duration
        me.calculateTotalActivityDuration();

        //Set State
        var stateNewDirty = STATE.NEW | STATE.DIRTY;
        if (me.getObjectStatus() !== stateNewDirty) {
          me.setObjectStatus(STATE.DIRTY);
        }

        if(me.getObjectStatus() !== stateNewDirty && saveImmediately) {
          return me.getLoUsrTimeEntry().saveImmediately().then(
            function () {
              return li.getPKey();
            }
          );
        }
      }
    }
  }
);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}