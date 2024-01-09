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
 * @function onPropertyChanged
 * @this BoCreateNewTimeEntry
 * @kind businessobject
 * @namespace CORE
 * @param {Object} handlerParams
 */
function onPropertyChanged(handlerParams){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var dateTimeHelper = ApplicationContext.get("dateTimeHelper");
var completeDate;
var time;
var offsets;

//Reset time to blank on clicking cross icon (X)
if(handlerParams.newValue === "") {
  handlerParams.newValue = undefined;
}

if(Utils.isDefined(handlerParams.newValue) && handlerParams.oldValue != handlerParams.newValue && me.getEventChanged() !== "1") {
  if(handlerParams.simpleProperty === "startdate") {
    me.setEventChanged("1");
    me.setEnddate(handlerParams.newValue);
    completeDate = Utils.convertAnsiDate2Date(handlerParams.newValue);
    time = Utils.convertAnsiTime2Time(me.getStarttime());
    completeDate.setHours(time.getHours());
    completeDate.setMinutes(time.getMinutes());
    offsets = dateTimeHelper.getTimeZoneOffset(completeDate);
    me.setTimeFromGeoOffset(offsets.geoOffset);
    me.setTimeFromDSTOffset(offsets.dstOffset);
    me.setTimeThruGeoOffset(offsets.geoOffset);
    me.setTimeThruDSTOffset(offsets.dstOffset);
    me.setEventChanged("0");
  }

  if(handlerParams.simpleProperty === "starttime") {
    completeDate = Utils.convertAnsiDate2Date(me.getStartdate());
    time = Utils.convertAnsiTime2Time(handlerParams.newValue);
    completeDate.setHours(time.getHours());
    completeDate.setMinutes(time.getMinutes());
    offsets = dateTimeHelper.getTimeZoneOffset(completeDate);
    me.setEventChanged("1");
    me.setTimeFromGeoOffset(offsets.geoOffset);
    me.setTimeFromDSTOffset(offsets.dstOffset);
    me.setStarttime((completeDate.getHours() < 10 ? "0" + completeDate.getHours() : completeDate.getHours()) + ":" + (completeDate.getMinutes() < 10 ? "0" + completeDate.getMinutes() : completeDate.getMinutes()));
    handlerParams.allowChange = false;

    if(completeDate.getHours() * 60 + completeDate.getMinutes() > Utils.convertAnsiTime2Time(me.getEndtime()).getHours() * 60 + Utils.convertAnsiTime2Time(me.getEndtime()).getMinutes()) {
      me.setTimeThruGeoOffset(offsets.geoOffset);
      me.setTimeThruDSTOffset(offsets.dstOffset);
      me.setEndtime((completeDate.getHours() < 10 ? "0" + completeDate.getHours() : completeDate.getHours()) + ":" + (completeDate.getMinutes() < 10 ? "0" + completeDate.getMinutes() : completeDate.getMinutes()));
    }
    me.setEventChanged("0");
  }

  if(handlerParams.simpleProperty === "enddate") {
    completeDate = Utils.convertAnsiDate2Date(handlerParams.newValue);
    time = Utils.convertAnsiTime2Time(me.getStarttime());
    completeDate.setHours(time.getHours());
    completeDate.setMinutes(time.getMinutes());
    offsets = dateTimeHelper.getTimeZoneOffset(completeDate);
    me.setTimeThruGeoOffset(offsets.geoOffset);
    me.setTimeThruDSTOffset(offsets.dstOffset);
  }

  if(handlerParams.simpleProperty === "endtime") {
    completeDate = Utils.convertAnsiDate2Date(me.getEnddate());
    time = Utils.convertAnsiTime2Time(handlerParams.newValue);
    completeDate.setHours(time.getHours());
    completeDate.setMinutes(time.getMinutes());
    offsets = dateTimeHelper.getTimeZoneOffset(completeDate);
    me.setEventChanged("1");
    me.setTimeThruGeoOffset(offsets.geoOffset);
    me.setTimeThruDSTOffset(offsets.dstOffset);
    me.setEndtime((completeDate.getHours() < 10 ? "0" + completeDate.getHours() : completeDate.getHours()) + ":" + (completeDate.getMinutes() < 10 ? "0" + completeDate.getMinutes() : completeDate.getMinutes()));
    handlerParams.allowChange = false;
    me.setEventChanged("0");
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}