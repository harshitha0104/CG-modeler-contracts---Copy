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
 * @function applyChanges
 * @this LoUsrTimeEntry
 * @kind listobject
 * @namespace CORE
 * @param {Object} origObject
 * @returns me
 */
function applyChanges(origObject){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
//note: origObject is the changed object from the wizard - me.getCurrent() is object which has to be updated in the LO

var modified = false;
var stateNewDirty = STATE.NEW | STATE.DIRTY;

//### changed FromDate
if(me.getCurrent().getEffectiveDateFrom() !== origObject.getEffectiveDateFrom() ||
   me.getCurrent().getEffectiveTimeFrom() !== origObject.getEffectiveTimeFrom() ||
   me.getCurrent().getEffectiveTimeFromGeoOffset() !== origObject.getEffectiveTimeFromGeoOffset() ||
   me.getCurrent().getEffectiveTimeFromDSTOffset() !== origObject.getEffectiveTimeFromDSTOffset()) {

  modified = true;

  me.getCurrent().setEffectiveDateFrom(origObject.getEffectiveDateFrom());
  me.getCurrent().setEffectiveTimeFrom(origObject.getEffectiveTimeFrom());

  //set UTC Date
  var dateFrom = Utils.convertAnsiDate2Date(origObject.getEffectiveDateFrom());
  var timeFrom = Utils.convertAnsiTime2Time(origObject.getEffectiveTimeFrom());

  dateFrom.setHours(timeFrom.getHours());
  dateFrom.setMinutes(timeFrom.getMinutes());
  dateFrom.setSeconds(0);
  dateFrom.setMilliseconds(0);

  //calculate effectiveUTCTimeFrom considering Geo and DST offsets
  me.getCurrent().setEffectiveUTCTimeFrom(ApplicationContext.get("dateTimeHelper").getUTCAnsiString(dateFrom, origObject.getEffectiveTimeFromGeoOffset(), origObject.getEffectiveTimeFromDSTOffset()));

  me.getCurrent().setEffectiveTimeFromGeoOffset(origObject.getEffectiveTimeFromGeoOffset());
  me.getCurrent().setEffectiveTimeFromDSTOffset(origObject.getEffectiveTimeFromDSTOffset());
}

//### changed ThruDate
if(me.getCurrent().getEffectiveDateThru() !== origObject.getEffectiveDateThru() ||
   me.getCurrent().getEffectiveTimeThru() !== origObject.getEffectiveTimeThru() ||
   me.getCurrent().getEffectiveTimeThruGeoOffset() !== origObject.getEffectiveTimeThruGeoOffset() ||
   me.getCurrent().getEffectiveTimeThruDSTOffset() !== origObject.getEffectiveTimeThruDSTOffset()) {

  modified = true;

  me.getCurrent().setEffectiveDateThru(origObject.getEffectiveDateThru());
  me.getCurrent().setEffectiveTimeThru(origObject.getEffectiveTimeThru());

  //set UTC Date
  var dateThru = Utils.convertAnsiDate2Date(origObject.getEffectiveDateThru());
  var timeThru = Utils.convertAnsiTime2Time(origObject.getEffectiveTimeThru());

  dateThru.setHours(timeThru.getHours());
  dateThru.setMinutes(timeThru.getMinutes());
  dateThru.setSeconds(0);
  dateThru.setMilliseconds(0);

  //calculate effectiveUTCTimeFrom considering Geo and DST offsets
  me.getCurrent().setEffectiveUTCTimeThru(ApplicationContext.get("dateTimeHelper").getUTCAnsiString(dateThru, origObject.getEffectiveTimeThruGeoOffset(), origObject.getEffectiveTimeThruDSTOffset()));

  me.getCurrent().setEffectiveTimeThruGeoOffset(origObject.getEffectiveTimeThruGeoOffset());
  me.getCurrent().setEffectiveTimeThruDSTOffset(origObject.getEffectiveTimeThruDSTOffset());
}


//### changed note and reason code
if(me.getCurrent().getNote() !== origObject.getNote() ||
   me.getCurrent().getReasonCode() !== origObject.getReasonCode()) {

  modified = true;

  me.getCurrent().setNote(origObject.getNote());
  me.getCurrent().setReasonCode(origObject.getReasonCode());
}


if(modified){
  //calculate duration
  // User Story: Enhanced TimeCard-- Added check for WorkingTimeentry edit
  if(parseInt(ApplicationContext.get("dateTimeHelper").getDateDiff(me.getCurrent().getEffectiveUTCTimeFrom(), me.getCurrent().getEffectiveUTCTimeThru()), 10)>=0){
    me.getCurrent().setDuration(ApplicationContext.get("dateTimeHelper").getDateDiff(me.getCurrent().getEffectiveUTCTimeFrom(), me.getCurrent().getEffectiveUTCTimeThru()));
  }

  if (me.getCurrent().getManual() !== "1"){
    me.getCurrent().setSignImage("Edited");
  }
  me.getCurrent().setTimeFromThru(me.getCurrent().getEffectiveTimeFrom() + " - " + me.getCurrent().getEffectiveTimeThru());
}

//delete the hidden-helper entry
if (me.getCurrent().getObjectStatus() !== stateNewDirty){
  me.getCurrent().setObjectStatus(STATE.DIRTY | STATE.PERSISTED);
}
var li = me.getItemByPKey(origObject.getPKey());
if(Utils.isDefined(li)){
  li.delete();
}
me.removeItems([origObject.getPKey()]);

//store changes immediately because of recovery mode (message about current situation)
me.saveImmediately();

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return me;
}