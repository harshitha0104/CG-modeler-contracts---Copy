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
 * @function getUTCAnsiString
 * @this BoDateTimeHelper
 * @kind businessobject
 * @namespace CORE
 * @param {Object} fullDate
 * @param {Object} geoOffset
 * @param {Object} dstOffset
 * @returns utcDateString
 */
function getUTCAnsiString(fullDate, geoOffset, dstOffset){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
//calculate UTC date with given date and geo and dst offset
var helperDate = Utils.createDateByMilliSec(0);
var utcDateString = "";
var utcDate;

helperDate.setHours(fullDate.getHours());
helperDate.setMinutes(fullDate.getMinutes());
helperDate.setSeconds(fullDate.getSeconds());

if(Utils.isDefined(fullDate) &&
   Utils.isDefined(geoOffset) && !Utils.isEmptyString(geoOffset) &&
   Utils.isDefined(dstOffset) && !Utils.isEmptyString(dstOffset)){

  var offset = parseFloat(parseFloat(geoOffset) + parseFloat(dstOffset))*60*60*1000*-1;
  var utcDateTime = Utils.createDateByMilliSec(helperDate.getTime() + offset);
  utcDate = Utils.createDateByMilliSec(fullDate.getTime() + offset);
  var month = (utcDate.getMonth() +1) < 10 ? "0" + (utcDate.getMonth() +1) : utcDate.getMonth() +1;
  var day = utcDate.getDate() < 10 ? "0" + utcDate.getDate() : utcDate.getDate();
  var hours = utcDateTime.getHours() < 10 ? "0" + utcDateTime.getHours() : utcDateTime.getHours();
  var minutes = utcDateTime.getMinutes() < 10 ? "0" + utcDateTime.getMinutes() : utcDateTime.getMinutes();
  var seconds = utcDateTime.getSeconds() < 10 ? "0" + utcDateTime.getSeconds() : utcDateTime.getSeconds();

  utcDateString = "" + utcDate.getFullYear()  + "-" + month + "-" + day +
    " " + hours + ":" + minutes + ":" + seconds;
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return utcDateString;
}