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
 * @function createTimeEntry
 * @this BoUserDailyReport
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {String} usrTimeEntryMetaPKey
 * @param {String} clbMainPKey
 * @param {String} tmgTourPKey
 * @param {String} description
 * @param {String} dateFrom
 * @param {String} dateThru
 * @param {String} timeFrom
 * @param {String} timeThru
 * @param {String} reason
 * @param {String} note
 * @param {String} manual
 * @param {Boolean} saveImmediately
 * @param {DomUsrGeoTimeOffset} timeFromGeoOffset
 * @param {DomUsrGeoTimeOffset} timeThruGeoOffset
 * @param {DomUsrDSTTimeOffset} timeFromDSTOffset
 * @param {DomUsrDSTTimeOffset} timeThruDSTOffset
 * @returns promise
 */
function createTimeEntry(usrTimeEntryMetaPKey, clbMainPKey, tmgTourPKey, description, dateFrom, dateThru, timeFrom, timeThru, reason, note, manual, saveImmediately, timeFromGeoOffset, timeThruGeoOffset, timeFromDSTOffset, timeThruDSTOffset){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = when.resolve();
var fullFromDate;
var fullThruDate;
var timeentryMetaText;
var timeEntryMetaProductiveTimeEffect;
var dateTimeHelper = ApplicationContext.get("dateTimeHelper");
var minDate = Utils.convertAnsiDate2Date(Utils.getMinDate());
var tmpTime;
var tmpDate;

//save handling
if (!Utils.isDefined(saveImmediately)){
  saveImmediately = true;
}

//Create TimeEntryList Item
var newliUsrTimeEntry = BoFactory.instantiate("LiUsrTimeEntry").serialize() ;
newliUsrTimeEntry.pKey =  PKey.next();
newliUsrTimeEntry.objectStatus = STATE.NEW | STATE.DIRTY;

if (!Utils.isDefined(dateFrom) && !Utils.isDefined(timeFrom)) {
  fullFromDate = Utils.createDateNow();
}else if(!Utils.isDefined(dateFrom) && Utils.isDefined(timeFrom)  && !Utils.isEmptyString(timeFrom)){
  fullFromDate = Utils.createDateNow();
  tmpTime = Utils.convertAnsiTime2Time(timeFrom);
  fullFromDate.setMinutes(tmpTime.getMinutes());
  fullFromDate.setHours(tmpTime.getHours());
}else {
  tmpDate = Utils.createDateNow();
  if (Utils.isDefined(dateFrom)){
    tmpDate = Utils.convertAnsiDate2Date(dateFrom);
  }
  tmpTime = tmpDate.getHours() + ":" + tmpDate.getMinutes();
  if (Utils.isDefined(timeFrom)){
    tmpTime = Utils.convertAnsiTime2Time(timeFrom);
  }
  fullFromDate = Utils.createSpecificDate(tmpDate.getFullYear(), tmpDate.getMonth(), tmpDate.getDate(), tmpTime.getHours(), tmpTime.getMinutes(), tmpDate.getSeconds());
}

if (!Utils.isDefined(dateThru) && !Utils.isDefined(timeThru)) {
  fullThruDate = minDate;
} else {
  tmpDate = minDate;
  if (Utils.isDefined(dateThru)){
    tmpDate = Utils.convertAnsiDate2Date(dateThru);
  }
  tmpTime = minDate.getHours() + ":" + minDate.getMinutes();
  if (Utils.isDefined(timeThru)){
    tmpTime = Utils.convertAnsiTime2Time(timeThru);
  }
  fullThruDate = Utils.createSpecificDate(tmpDate.getFullYear(), tmpDate.getMonth(), tmpDate.getDate(), tmpTime.getHours(), tmpTime.getMinutes(), tmpDate.getSeconds());
}

if (Utils.isDefined(usrTimeEntryMetaPKey)) {
  promise = BoFactory.loadObjectByParamsAsync("LuTimeEntryType", me.getQueryBy("pKey", usrTimeEntryMetaPKey)).then(
    function (luTimeEntryType) {
      timeentryMetaText = luTimeEntryType.getText();
      timeEntryMetaProductiveTimeEffect = luTimeEntryType.getProductiveTimeEffect();

      // Start
      var TmgTourPKey;
      if (Utils.isDefined(ApplicationContext.get('currentTourPKey')) && !Utils.isEmptyString(ApplicationContext.get('currentTourPKey'))) {
        TmgTourPKey = ApplicationContext.get('currentTourPKey');
      }

      if (Utils.isDefined(clbMainPKey)){
        newliUsrTimeEntry.clbMainPKey = clbMainPKey;
      }
      if (Utils.isDefined(tmgTourPKey) && !Utils.isEmptyString(tmgTourPKey)){
        newliUsrTimeEntry.tmgTourPKey = tmgTourPKey;
      }
      if (Utils.isDefined(description) && !Utils.isEmptyString(description)) {
        newliUsrTimeEntry.description = description;
      } else {
        newliUsrTimeEntry.description = timeentryMetaText;
      }
      if (Utils.isDefined(reason)){
        newliUsrTimeEntry.reasonCode = reason;
      }
      if (Utils.isDefined(note)){
        newliUsrTimeEntry.note = note;
      }
      if (Utils.isDefined(timeEntryMetaProductiveTimeEffect)){
        newliUsrTimeEntry.productiveTimeEffect = timeEntryMetaProductiveTimeEffect;
      }
      if (Utils.isDefined(manual)) {
        newliUsrTimeEntry.manual = manual;
      } else {
        newliUsrTimeEntry.manual = "0";
      }
      newliUsrTimeEntry.signImage = "Blank";
      if (newliUsrTimeEntry.manual == "1"){
        newliUsrTimeEntry.signImage = "Manual";
      }

      if (Utils.isDefined(luTimeEntryType.getActivityType())){
        newliUsrTimeEntry.activityType = luTimeEntryType.getActivityType();
      }

      //set EffectiveTimes and SystemTimes
      newliUsrTimeEntry.effectiveTimeFrom = (fullFromDate.getHours() < 10 ? "0" + fullFromDate.getHours() : fullFromDate.getHours()) + ":" + (fullFromDate.getMinutes() < 10 ? "0" + fullFromDate.getMinutes() : fullFromDate.getMinutes());
      newliUsrTimeEntry.orgTimeFrom= newliUsrTimeEntry.effectiveTimeFrom ;
      newliUsrTimeEntry.effectiveTimeThru= (fullThruDate.getHours() < 10 ? "0" + fullThruDate.getHours() : fullThruDate.getHours()) + ":" + (fullThruDate.getMinutes() < 10 ? "0" + fullThruDate.getMinutes() : fullThruDate.getMinutes());
      newliUsrTimeEntry.orgTimeThru= newliUsrTimeEntry.effectiveTimeThru;
      newliUsrTimeEntry.timeFromThru= newliUsrTimeEntry.effectiveTimeFrom + " - " + newliUsrTimeEntry.effectiveTimeThru;
      newliUsrTimeEntry.systemTimeFrom = Utils.convertFullDate2Ansi(fullFromDate);
      newliUsrTimeEntry.systemTimeThru = Utils.convertFullDate2Ansi(fullThruDate);
      var fullFromDateWithoutTime = Utils.createDateByMilliSec(fullFromDate.getTime());
      fullFromDateWithoutTime.setHours(0);
      fullFromDateWithoutTime.setMinutes(0);
      fullFromDateWithoutTime.setSeconds(0);
      newliUsrTimeEntry.effectiveDateFrom = Utils.convertFullDate2Ansi(fullFromDateWithoutTime);
      var fullThruDateWithoutTime = Utils.createDateByMilliSec(fullThruDate.getTime());
      fullThruDateWithoutTime.setHours(0);
      fullThruDateWithoutTime.setMinutes(0);
      fullThruDateWithoutTime.setSeconds(0);
      newliUsrTimeEntry.effectiveDateThru = Utils.convertFullDate2Ansi(fullThruDateWithoutTime);

      //start set Geo and DST offsets
      //EffectiveTimeFrom and SystemTimeFrom
      var offsets = {};
      if (Utils.isDefined(timeFromGeoOffset) && Utils.isDefined(timeFromDSTOffset)){
        newliUsrTimeEntry.effectiveTimeFromGeoOffset = timeFromGeoOffset;
        newliUsrTimeEntry.effectiveTimeFromDSTOffset = timeFromDSTOffset;
        newliUsrTimeEntry.systemTimeFromGeoOffset = timeFromGeoOffset;
        newliUsrTimeEntry.systemTimeFromDSTOffset = timeFromDSTOffset;
      }else{
        offsets = dateTimeHelper.getTimeZoneOffset(fullFromDate);
        if(Utils.isDefined(offsets)){
          newliUsrTimeEntry.effectiveTimeFromGeoOffset = offsets.geoOffset;
          newliUsrTimeEntry.effectiveTimeFromDSTOffset = offsets.dstOffset;
          newliUsrTimeEntry.systemTimeFromGeoOffset = offsets.geoOffset;
          newliUsrTimeEntry.systemTimeFromDSTOffset = offsets.dstOffset;
        }
      }

      //EffectiveTimeThru and SystemTimeThru
      if (Utils.isDefined(timeThruGeoOffset) && Utils.isDefined(timeThruDSTOffset)){
        newliUsrTimeEntry.effectiveTimeThruGeoOffset = timeThruGeoOffset;
        newliUsrTimeEntry.effectiveTimeThruDSTOffset = timeThruDSTOffset;
        newliUsrTimeEntry.systemTimeThruGeoOffset = timeThruGeoOffset;
        newliUsrTimeEntry.systemTimeThruDSTOffset = timeThruDSTOffset;
      }else{
        offsets = dateTimeHelper.getTimeZoneOffset(fullThruDate);
        if(Utils.isDefined(offsets)){
          newliUsrTimeEntry.effectiveTimeThruGeoOffset = offsets.geoOffset;
          newliUsrTimeEntry.effectiveTimeThruDSTOffset = offsets.dstOffset;
          newliUsrTimeEntry.systemTimeThruGeoOffset = offsets.geoOffset;
          newliUsrTimeEntry.systemTimeThruDSTOffset = offsets.dstOffset;
        }
      }
      //end set Geo and DST offsets

      //set UTC time
      //EffectiveUTCTimeFrom
      var effectiveUTCTimeFrom = dateTimeHelper.getUTCAnsiString(fullFromDate, newliUsrTimeEntry.systemTimeFromGeoOffset, newliUsrTimeEntry.systemTimeFromDSTOffset);
      if(Utils.isDefined(effectiveUTCTimeFrom)){
        newliUsrTimeEntry.effectiveUTCTimeFrom = effectiveUTCTimeFrom;
      }

      //EffectiveUTCTimeThru
      if (newliUsrTimeEntry.systemTimeThru == Utils.convertFullDate2Ansi(minDate)) {
        newliUsrTimeEntry.effectiveUTCTimeThru = Utils.convertFullDate2Ansi(minDate);
      } else {
        var effectiveUTCTimeThru = dateTimeHelper.getUTCAnsiString(fullThruDate, newliUsrTimeEntry.systemTimeThruGeoOffset, newliUsrTimeEntry.systemTimeThruDSTOffset);
        if(Utils.isDefined(effectiveUTCTimeThru)){
          newliUsrTimeEntry.effectiveUTCTimeThru = effectiveUTCTimeThru;
          //calculate timethru and timefrom difference in  minutes..
          newliUsrTimeEntry.duration = dateTimeHelper.getDateDiff(effectiveUTCTimeFrom, effectiveUTCTimeThru);
        }
      }
      //end set UTC time

      newliUsrTimeEntry.usrDailyReportPKey = me.getPKey();

      if (Utils.isDefined(usrTimeEntryMetaPKey)) {
        newliUsrTimeEntry.usrTimeEntryMetaPKey = usrTimeEntryMetaPKey;
      } else{
        newliUsrTimeEntry.usrTimeEntryMetaText = "";
      }
      if (Utils.isDefined(timeentryMetaText)) {
        newliUsrTimeEntry.usrTimeEntryMetaText = timeentryMetaText;
      } else{
        newliUsrTimeEntry.usrTimeEntryMetaText = "";
      }


      //check if there already exist timer with current activity type - only needs to be done if entry is not closed already (manual entries with end-date defined)
      if(newliUsrTimeEntry.manual === "0"){
        var availableTimer = TM.getAllTimers(luTimeEntryType.getActivityType());
        if (availableTimer.length > 0) {
          //start available timer
          for (var idxTimer = 0; idxTimer < availableTimer.length; idxTimer++) {
            TM.startTimer(availableTimer[idxTimer].getTimerId());
          }
        }
      }

      if (!Utils.isDefined(me.getLoUsrTimeEntry())) {
        return BoFactory.loadObjectByParamsAsync("LoUsrTimeEntry", me.getQueryBy("pKey", me.getPKey())).then(
          function (loUsrTimeEntry) {
            loUsrTimeEntry.addListItems([newliUsrTimeEntry]);
            loUsrTimeEntry.setObjectStatus(STATE.NEW | STATE.DIRTY);
            me.setLoUsrTimeEntry(loUsrTimeEntry);

            //Calculate Time entry Duration
            me.calculateTotalActivityDuration();

            //Set State
            me.setObjectStatus(STATE.DIRTY);
            //Sort the Items
            var items = dateTimeHelper.sortTimeEntries(me.getLoUsrTimeEntry().getAllItems());
            me.getLoUsrTimeEntry().removeAllItems();
            me.getLoUsrTimeEntry().addObjectItems(items);
            //store changes immediately because of recovery mode (message about current situation)
            if(saveImmediately) {
              return me.getLoUsrTimeEntry().saveImmediately().then(
                function () {
                  return newliUsrTimeEntry.pKey;
                });
            } else {
              return newliUsrTimeEntry.pKey;
            }
          });
      } else {
        me.getLoUsrTimeEntry().addListItems([newliUsrTimeEntry]);
        me.getLoUsrTimeEntry().setObjectStatus(STATE.NEW | STATE.DIRTY);
        //Sort the Items
        var items = dateTimeHelper.sortTimeEntries(me.getLoUsrTimeEntry().getAllItems());
        me.getLoUsrTimeEntry().removeAllItems();
        me.getLoUsrTimeEntry().addObjectItems(items);
        me.calculateTotalActivityDuration();
        if (me.getObjectStatus() !== (STATE.NEW | STATE.DIRTY)  && saveImmediately) {
          return me.getLoUsrTimeEntry().saveImmediately().then(
            function () {
              return newliUsrTimeEntry.pKey;
            });
        } else {
          return newliUsrTimeEntry.pKey;
        }
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