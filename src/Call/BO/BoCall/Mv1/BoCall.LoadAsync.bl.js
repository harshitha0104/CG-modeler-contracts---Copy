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
 * @function loadAsync
 * @this BoCall
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} jsonQuery
 * @returns promise
 */
function loadAsync(jsonQuery){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var usrMainPKey = ApplicationContext.get('user').getPKey();
var defereds = [];
if (!jsonQuery) {
  jsonQuery = {};

}
var newParams;
if (Utils.isDefined(jsonQuery)) {
  newParams = jsonQuery;
  if (Utils.isOldParamsFormat(newParams)) {
    newParams = Utils.convertDsParamsOldToNew(newParams);
  }
}

var promise = Facade.getObjectAsync(BO_CALL, jsonQuery)
.then( function (selfJson) {
  if (Utils.isDefined(selfJson)) {
    me.setProperties(selfJson);
    me.setStartTimeEffectiveUI(Utils.convertTime2Ansi(Utils.convertAnsiTime2Time(me.getStartTimeEffective())));
    me.setStopTimeEffectiveUI(Utils.convertTime2Ansi(Utils.convertAnsiTime2Time(me.getStopTimeEffective())));
    me.setStopTimeEffectiveTimezoneOffset(Utils.createDateNow().getTimezoneOffset());
    var jsonParams = me.prepareLookupsLoadParams(selfJson);
    return Facade.loadLookupsAsync(jsonParams);
  }
}).then( function (lookups) {
  if (Utils.isDefined(lookups)){
    me.assignLookups(lookups);
  }
  if (me.getLuCallMeta().getCaptureProceedingTime() == "1" && me.getClbStatus() === "Planned") {
    var currentDateTime = Utils.createDateNow();
    //Double conversion is needed  here as no Utils Function is available to replace
    //returns only Time
    me.setStartTimeEffective(Utils.convertFullDate2Ansi(currentDateTime));
    me.setStartTimeEffectiveTimezoneOffset(currentDateTime.getTimezoneOffset());
    me.setStartTimeEffectiveUI(Utils.convertTime2Ansi(currentDateTime));
  }

  if (!Utils.isEmptyString(me.getBpaMainPKey())) {
    //check management / substitution info for EA-Rights
    var cmiParams = [];
    var cmiQuery = {};

    cmiParams.push({
      "field": "customerPKey",
      "value": me.getBpaMainPKey()
    });
    cmiParams.push({
      "field": "referenceDate",
      "value": me.getDateFrom()
    });
    cmiParams.push({
      "field": "referenceUserPKey",
      "value": newParams.referenceUserPKey
    });
    cmiQuery.params = cmiParams;

    return BoFactory.loadObjectByParamsAsync("LuCustomerManagementInfo", cmiQuery);
  } else {
    return undefined;
  }
})
.then(function (customerManagementInfoLookup) {

  //If this is a substituted call, check attribut for EA-Rights
  if (Utils.isDefined(customerManagementInfoLookup)) {
    me.setLuCustomerManagementInfo(customerManagementInfoLookup);
    me.updateSubstitutionInfo();
  }

  me.setBoJobManager(BoFactory.instantiate("BoJobManager", {
    "clbMainPKey": me.getPKey(),
    "clbMetaPKey": me.getClbMetaPKey(),
    "clbStatus": me.getClbStatus(),
    "originalClbStatus": me.getOriginalClbStatus(),
    "bpaMainPKey": me.getBpaMainPKey(),
    "referenceDate": me.getDateFrom(),
    "timeFrom": me.getTimeFrom(),
    "bpaName": me.getLuCustomer().getName(),
    "considerPOSCheck": me.getLuCallMeta().getConsiderPOSCheck(),
    "considerTargetValues": me.getLuCallMeta().getConsiderTargetValues(),
    "readOnlyBySubstitution": me.getReadOnlyBySubstitution(),
    "responsiblePKey": me.getResponsiblePKey(),
    "ownerPKey": me.getOwnerPKey(),
    "historicalProductConfig": me.getLuCallMeta().getHistoricalProducts(),
    "considerModule": me.getConsiderModule()
  }));

  me.setEARights(jsonQuery);
  me.setObjectStatus(STATE.PERSISTED);

  if (me.isReadOnly()) {
    me.setObjectStatusFrozen(true);
  }

  //Start-- Create new time entry
  //check for call UsrTimeEntry template 
  if((!Utils.isDefined(ApplicationContext.get('currentTourPKey')) || Utils.isEmptyString(ApplicationContext.get('currentTourPKey'))) || 
     (Utils.isDefined(ApplicationContext.get('currentTourPKey')) && !Utils.isEmptyString(ApplicationContext.get('currentTourPKey')) && 
      ApplicationContext.get('currentTourStatus') === "Running")){

    if (Utils.isDefined(me.getUsrTimeEntryMetaPKey()) && !Utils.isEmptyString(me.getUsrTimeEntryMetaPKey())) {

      if (Utils.isDefined(ApplicationContext.get('openTimeCardPKey')) && !Utils.isEmptyString(ApplicationContext.get('openTimeCardPKey'))) {
        return BoFactory.loadObjectByParamsAsync("BoUserDailyReport", me.getQueryBy("pKey", ApplicationContext.get('openTimeCardPKey')));
      } else {
        if (Utils.isDefined(ApplicationContext.get('user').getUsrDocMetaPKey()) && !Utils.isEmptyString(ApplicationContext.get('user').getUsrDocMetaPKey())) {
          // create Time card..
          return BoFactory.createObjectAsync("BoUserDailyReport", { "usrDocMetaPKey": ApplicationContext.get('user').getUsrDocMetaPKey(), "dateFrom": Utils.createAnsiToday() } );
        }
      }
    }
  }

})
.then(function (boUserDailyReport) {

  if (Utils.isDefined(boUserDailyReport)) {
    //Create a new time card if the current user is not realted to the open time card.
    if(boUserDailyReport.getOwnerUsrMainPKey() !== usrMainPKey || boUserDailyReport.getResponsiblePKey() !== usrMainPKey ) {
      if (Utils.isDefined(ApplicationContext.get('user').getUsrDocMetaPKey()) && !Utils.isEmptyString(ApplicationContext.get('user').getUsrDocMetaPKey())) {
        // create Time card..
        return BoFactory.createObjectAsync("BoUserDailyReport", { "usrDocMetaPKey": ApplicationContext.get('user').getUsrDocMetaPKey(), "dateFrom": Utils.createAnsiToday() } )
          .then(function (boUserDailyReport) {
          me.setBoUserDailyReport(boUserDailyReport);
          return createNewTimeEntry();});
      }
    } else {
      var userTimeEntries = boUserDailyReport.getLoUsrTimeEntry().getAllItems();
      var tempDate = Utils.createDateNow();
      var hours = tempDate.getHours() < 10 ? "0" + tempDate.getHours() : tempDate.getHours();
      var minutes = tempDate.getMinutes() < 10 ? "0" + tempDate.getMinutes() : tempDate.getMinutes();
      var tempTime = hours + ":" + minutes;
      var userTimeEntry = "";
      for (var i = 0; i< userTimeEntries.length ; i++) {
        if (userTimeEntries[i].activityType === "Break" || userTimeEntries[i].activityType === "CustomerVisits" || userTimeEntries[i].activityType === "PrivateAppointments" ) {
          if (userTimeEntries[i].effectiveTimeThru > tempTime) {
            userTimeEntry = userTimeEntries[i].pKey;
            break;
          }
        }
      }
      if (userTimeEntry) {
        return boUserDailyReport.closeTimeEntry(userTimeEntry, false)
          .then(function () {
          me.setBoUserDailyReport(boUserDailyReport);
          return createNewTimeEntry();
        });
      } else {
        me.setBoUserDailyReport(boUserDailyReport);
        return createNewTimeEntry();
      }
    }
  }
}).then(function(){
  return me;
});

function createNewTimeEntry() {
  var tempDate = Utils.createDateNow();
  var hours = tempDate.getHours() < 10 ? "0" + tempDate.getHours() : tempDate.getHours();
  var minutes = tempDate.getMinutes() < 10 ? "0" + tempDate.getMinutes() : tempDate.getMinutes();
  return me.getBoUserDailyReport().createTimeEntry(me.getUsrTimeEntryMetaPKey(), me.getPKey(), null, me.getSubject(),
                                                   Utils.convertFullDate2Ansi(tempDate), Utils.getMinDate(), hours + ":" + minutes, "00:00", null, null, "0", false)
    .then(function (timeEntryPKey) {
    me.setTimeEntryPKey(timeEntryPKey);
    if(me.getBoUserDailyReport().getObjectStatus() !== (STATE.NEW | STATE.DIRTY)){
      me.getBoUserDailyReport().setObjectStatus(STATE.DIRTY);
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