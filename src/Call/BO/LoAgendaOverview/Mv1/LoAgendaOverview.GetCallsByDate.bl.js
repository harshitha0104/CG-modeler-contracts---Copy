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
 * @function getCallsByDate
 * @this LoAgendaOverview
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {String} setDateFunction
 * @param {String} filterCalls
 * @param {Date} currentDateStart
 * @param {Date} currentDateEnd
 * @param {String} currentResponsiblePKey
 * @param {DomInteger} numberOfListItems
 * @param {String} cardMode
 * @returns promise
 */
function getCallsByDate(setDateFunction, filterCalls, currentDateStart, currentDateEnd, currentResponsiblePKey, numberOfListItems, cardMode){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var dDateFromStart;
var dDateFromEnd;
var jsonQuery = {};
var jsonParams = [];

var dateDefer = when.resolve();

if (setDateFunction.toUpperCase() === "TODAY") {
  dDateFromStart = Utils.createDateNow();
  dDateFromEnd = Utils.createDateNow();
}
else if (setDateFunction.toUpperCase() === "NEXTDAY") {
  dDateFromStart = Utils.convertAnsiDate2Date(currentDateStart);
  dDateFromEnd = Utils.convertAnsiDate2Date(currentDateEnd);
  dDateFromStart.setDate(dDateFromStart.getDate() + 1);
  dDateFromEnd.setDate(dDateFromEnd.getDate() + 1);
} 
else if (setDateFunction.toUpperCase() === "PREVDAY") {
  dDateFromStart = Utils.convertAnsiDate2Date(currentDateStart);
  dDateFromEnd = Utils.convertAnsiDate2Date(currentDateEnd);
  dDateFromStart.setDate(dDateFromStart.getDate() - 1);
  dDateFromEnd.setDate(dDateFromEnd.getDate() - 1);
} 
else {
var currentTourPKey = ApplicationContext.get('currentTourPKey');
var currentTourPKeyDefined = Utils.isDefined(currentTourPKey) && !Utils.isEmptyString(currentTourPKey);
var currentTourStatus = ApplicationContext.get('currentTourStatus');
  if(currentTourPKeyDefined && Utils.isDefined(currentTourStatus) && currentTourStatus === "Running") {

    dateDefer = BoFactory.loadObjectByParamsAsync("LoTourRelatedCalls", {"TmgMainPKey" : currentTourPKey})
      .then(function(loTourRelCalls){
      if(Utils.isDefined(loTourRelCalls) && loTourRelCalls.getAllItems().length > 0){
        var items = loTourRelCalls.getAllItems().sort(function(a,b) {    
          return (Utils.convertAnsiDate2Date(a.getDateFrom()) === Utils.convertAnsiDate2Date(b.getDateFrom())) ? 0 : ((Utils.convertAnsiDate2Date(a.getDateFrom()) < Utils.convertAnsiDate2Date(b.getDateFrom())) ? -1 : 1);
        }); 

        dDateFromStart = Utils.convertAnsiDate2Date(items[0].getDateFrom());
        dDateFromEnd = Utils.convertAnsiDate2Date(items[items.length -1].getDateThru());

      }
      else {
        if(!Utils.isDefined(dDateFromStart)) {
          dDateFromStart = Utils.convertAnsiDate2Date(currentDateStart);
        }
        if(!Utils.isDefined(dDateFromEnd)) {
          dDateFromEnd = Utils.convertAnsiDate2Date(currentDateEnd);
        } 
      }
    });
  }
  else {
    dDateFromStart = Utils.convertAnsiDate2Date(currentDateStart);
    dDateFromEnd = Utils.convertAnsiDate2Date(currentDateEnd);
  }
}

var currentDate;
var promise = dateDefer.then(
  function() {
    dDateFromStart.setHours(0, 0, 0, 0);
    dDateFromEnd.setHours(0, 0, 0, 0);

    currentDate = dDateFromStart;

    if (filterCalls !== "All") {
      jsonParams.push({
        "field" : "ClbStatus",
        "operator" : "EQ",
        "value" : (filterCalls == "Open") ? "Planned" : filterCalls
      });
    }

    //this mode is for fetching the data for the unsuccesful visit card report --> if mode is activated some additional additions were added in DS
    //visit rate mode only count the number of completed and planned calls
    if (Utils.isDefined(cardMode) && (cardMode.toLowerCase() === "unsuccessfulvisits" || cardMode.toLowerCase() === "visitrate")) {
      {
        jsonParams.push({
          "field" : "cardMode",
          "operator" : "EQ",
          "value" : cardMode
        });
      }
    }

    jsonParams.push({
      "field" : "dateFromStart",
      "operator" : "EQ",
      "value" : dDateFromStart
    });
    jsonParams.push({
      "field" : "dateFromEnd",
      "operator" : "EQ",
      "value" : dDateFromEnd
    });
    jsonParams.push({
      "field" : "responsibleUserPKey",
      "operator" : "EQ",
      "value" : currentResponsiblePKey
    });
    jsonQuery.params = jsonParams;

    return BoFactory.loadObjectByParamsAsync("LuCurrentAddress", {});
  }).then(function(luCurrentAddress) {
  jsonQuery.params.push({ "field": "currentLatitude", "value": luCurrentAddress.latitude });
  jsonQuery.params.push({ "field": "currentLongitude", "value": luCurrentAddress.longitude });            
  return Facade.getListAsync("LoAgendaOverview", jsonQuery);    
}).then(function (list) {
  me.suspendListRefresh();
  me.removeAllItems();

  if(Utils.isDefined(numberOfListItems)){
    //reduce number if items ... needed for Cockpit cards
    me.cardItemCount = list.length;
    list = list.splice(0, numberOfListItems);
  } 

  var loadParams;
  var prepend = false;
  var noItemSelectedEvent = true;
  var markerIdx = 1;
  me.addItems(list, loadParams, prepend, noItemSelectedEvent);
  me.orderBy({"dateFrom": "ASC", "timeFrom": "ASC"});

  me.forEach(function(call) {
    if (!Utils.isEmptyString(call.getBpaMainPKey()) && call.getClbStatus() === "Planned" && call.getCompanyRequired() !== "Not required" && call.getClbMetaType() !== "Phone") {
      if (markerIdx > 23) {
        call.setMapPinImage("BlueGoogleMarkerEmpty");
      } else {
        call.setMapPinImage("BlueGoogleMarker" + markerIdx);
      }
      call.setMapPinId(markerIdx);
      call.setToolTipText("<b>" + call.getName() + "</b><br />" + call.getAddress()); 
      call.setVisibleInMap("1"); 
      markerIdx++;    
    } 
    else {
      call.setVisibleInMap("0");
    }
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