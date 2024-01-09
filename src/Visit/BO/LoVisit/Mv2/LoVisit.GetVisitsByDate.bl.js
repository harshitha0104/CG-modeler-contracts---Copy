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
 * @function getVisitsByDate
 * @this LoVisit
 * @kind listobject
 * @async
 * @namespace CORE
 * @param {Date} currentDateStart
 * @param {Date} currentDateEnd
 * @param {String} dateFunction
 * @param {String} filterVisits
 * @returns promise
 */
function getVisitsByDate(currentDateStart, currentDateEnd, dateFunction, filterVisits){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var plannedStartDate;
var plannedEndDate;
var jsonQuery = {};
var jsonParams = [];

var dateDefer = when.resolve();


if (dateFunction.toUpperCase() === "NEXTDAY") {
  plannedStartDate = Utils.convertAnsiDate2Date(currentDateStart);
  plannedEndDate = Utils.convertAnsiDate2Date(currentDateEnd);
  plannedStartDate.setDate(plannedStartDate.getDate() + 1);
  plannedEndDate.setDate(plannedEndDate.getDate() + 1);
} 
else if (dateFunction.toUpperCase() === "PREVDAY") {
  plannedStartDate = Utils.convertAnsiDate2Date(currentDateStart);
  plannedEndDate = Utils.convertAnsiDate2Date(currentDateEnd);
  plannedStartDate.setDate(plannedStartDate.getDate() - 1);
  plannedEndDate.setDate(plannedEndDate.getDate() - 1);
} 
else{
  plannedStartDate = Utils.convertAnsiDate2Date(currentDateStart);
  plannedEndDate = Utils.convertAnsiDate2Date(currentDateEnd);
}

var currentDate;
var promise = dateDefer.then(
  function() {
    plannedStartDate.setHours(0, 0, 0, 0);
    plannedEndDate.setHours(0, 0, 0, 0);

    currentDate = plannedStartDate;

    if (filterVisits !== "All") {
      jsonParams.push({
        "field" : "VisitStatus",
        "operator" : "EQ",
        "value" : (filterVisits == "Open") ? "'Planned','InProgress'" : filterVisits
      });
    }


    jsonParams.push({
      "field" : "plannedStartDate",
      "operator" : "EQ",
      "value" : plannedStartDate
    });
    jsonParams.push({
      "field" : "plannedEndDate",
      "operator" : "EQ",
      "value" : plannedEndDate
    });
    jsonQuery.params = jsonParams;

    /** return BoFactory.loadObjectByParamsAsync("LuCurrentAddress", {});
  }).then(function(luCurrentAddress) {
  jsonQuery.params.push({ "field": "currentLatitude", "value": luCurrentAddress.latitude });
  jsonQuery.params.push({ "field": "currentLongitude", "value": luCurrentAddress.longitude });       **/     
    return Facade.getListAsync("LoVisit", jsonQuery);    
  }).then(function (list) {
  me.suspendListRefresh();
  me.removeAllItems();


  var loadParams;
  var prepend = false;
  var noItemSelectedEvent = true;
  var markerIdx = 1;
  me.addItems(list, loadParams, prepend, noItemSelectedEvent);
  me.orderBy({"plannedStartDate": "ASC"});

  me.forEach(function(visit) {
    if (markerIdx > 23) {
      visit.setMapPinImage("BlueGoogleMarkerEmpty");
    } else {
      visit.setMapPinImage("BlueGoogleMarker" + markerIdx);
    }
    visit.setMapPinId(markerIdx);
    markerIdx++;  
    visit.setToolTipText("<b>" + visit.getVisitName() + "</b>"); 
    visit.setVisibleInMap("1"); 

    //Address Handling
    var combinedVisitAddress = "";
    if(!Utils.isEmptyString(visit.getStreet()) || !Utils.isEmptyString(visit.getCity()) ) {

      if(!Utils.isEmptyString(visit.getStreet())) {
        combinedVisitAddress = combinedVisitAddress + visit.getStreet();
      }

      if(!Utils.isEmptyString(visit.getCity())) {
        if(!Utils.isEmptyString(combinedVisitAddress) ) {
          combinedVisitAddress += ", ";
        }
        combinedVisitAddress = combinedVisitAddress + visit.getCity();
      }
    } 
    visit.setCombinedAddress(combinedVisitAddress);
    
    //Date Handling
    visit.setPlannedStartDate(Utils.convertAnsiDateTime2AnsiDate(visit.getPlannedStartDateTime()));
    visit.setPlannedStartTime(visit.getPlannedStartDateTime().substring(11,16));
    visit.setPlannedEndDate(Utils.convertAnsiDateTime2AnsiDate(visit.getPlannedEndDateTime()));
    visit.setPlannedEndTime(visit.getPlannedEndDateTime().substring(11,16));
    
    visit.setObjectStatus(STATE.PERSISTED);


      

  });

  me.resumeListRefresh();  
  return Utils.convertDate2Ansi(currentDate);
});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}