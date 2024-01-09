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
 * @function getCallsForFollowUpCard
 * @this LoAgendaOverview
 * @kind listobject
 * @async
 * @namespace CORE
 * @param {String} callCustomer
 * @param {DomDate} dateFrom
 * @param {DomTime} timeFrom
 * @returns promise
 */
function getCallsForFollowUpCard(callCustomer, dateFrom, timeFrom){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    var jsonParams = [];
var jsonQuery = {};
var splitString = timeFrom.split(":");
var newDateFrom = Utils.convertAnsiDate2Date(dateFrom);
newDateFrom.setHours(splitString[0], splitString[1], 0, 0);

jsonParams.push({"field": "followUpCardMode", "operator": "EQ", "value": "FollowUp"});
jsonParams.push({"field": "dateFromStart", "operator": "EQ", "value": newDateFrom});
jsonParams.push({"field": "ClbStatus", "operator": "EQ", "value": "Planned"});
jsonParams.push({"field": "callCustomer", "operator": "EQ", "value": callCustomer});
jsonQuery.params = jsonParams;

var promise = BoFactory.loadObjectByParamsAsync("LoAgendaOverview", jsonQuery).then(
  function(loAgendaOverview) {
    var followUpVisits = loAgendaOverview.getAllItems();
    var followUpVisitsCount = followUpVisits.length;
    var visibleVisitsCount = 5;

    if(Utils.isPhone()) {
      visibleVisitsCount = 3;
    }
    if(followUpVisitsCount <= visibleVisitsCount) {
      visibleVisitsCount = followUpVisitsCount;
    }
    var info = " ";
    if(visibleVisitsCount > 0) {
      info = visibleVisitsCount.toString() + " / " + followUpVisitsCount;
    }

    followUpVisits = followUpVisits.splice(0, visibleVisitsCount);

    var currentUser = ApplicationContext.get('user').getPKey();
    followUpVisits.forEach(function(currentVisit){
      if(currentVisit.getResponsiblePKey() === currentUser){
        currentVisit.setResponsibleName("");
      }
      var dateFrom = Localization.localize(currentVisit.getDateFrom(), "date");
      var timeFrom = currentVisit.getTimeFrom();
      currentVisit.setDateFromTimeFrom(dateFrom + "  " + timeFrom);
    });

    me.removeAllItems();
    me.addItems(followUpVisits);
    return when.resolve(info);
  });
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}