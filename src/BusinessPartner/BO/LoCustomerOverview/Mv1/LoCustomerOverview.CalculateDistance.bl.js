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
 * @function calculateDistance
 * @this LoCustomerOverview
 * @kind listobject
 * @namespace CORE
 * @param {DomDegree} lat1
 * @param {DomDegree} lng1
 * @param {DomDegree} lat2
 * @param {DomDegree} lng2
 * @param {String} distanceUnit
 * @returns distance
 */
function calculateDistance(lat1, lng1, lat2, lng2, distanceUnit){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
//This function has been deprecated, we are using Utils.distanceBetween() to calculate distance now

var distance;
var latitudeInRadian = DegToRad(lat2-lat1);
var longitudeInRadian = DegToRad(lng2-lng1);
var lat1InRadian = DegToRad(lat1);
var lat2InRadian = DegToRad(lat2);

var chordLength = Math.sin(latitudeInRadian / 2) * Math.sin(latitudeInRadian / 2) +
    Math.sin(longitudeInRadian / 2) * Math.sin(longitudeInRadian / 2) *
    Math.cos(lat1InRadian) * Math.cos(lat2InRadian);
var angularDistance = 2 * Math.atan2(Math.sqrt(chordLength), Math.sqrt(1 - chordLength));

if (distanceUnit === "miles") {
  distance = 3956 * angularDistance;
}
else if (distanceUnit === "km") {
  distance = 6371 * angularDistance;
}

//Method to convert Degree to Radiance.
function DegToRad (deg) {
  return deg * Math.PI / 180;
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return distance;
}