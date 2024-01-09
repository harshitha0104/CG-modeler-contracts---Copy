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
 * @function createCalls
 * @this BoTripList
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {DomString} responsiblePKey
 * @param {DomDate} dateFrom
 * @param {DomPKey} clbMetaPKey
 * @param {DomDurationUnit} duration
 * @param {DomBool} allDay
 * @param {DomTime} workBegins
 * @param {Object} locationsList
 * @returns allfinished
 */
function createCalls(responsiblePKey, dateFrom, clbMetaPKey, duration, allDay, workBegins, locationsList){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var functions = [];
var seqence_arguments = [];
var customer;
var currentDay;
var jsonQuery = {};
var jsonParams = [];
var timeFrom;
var timeThru;
var weekDays;
var jsDate;
var iErrorCount = 0;
var totalSkippedCalls = 0;
var skippedCallsOfCurrentDay = 0;

if (me.getMetaType() === "Weekly") {
  weekDays = 6;
  jsDate = Utils.convertAnsiDate2Date(dateFrom);
  currentDay = jsDate.getDay() - 1;
  //check if sunday and set to 7
  if (currentDay === -1) {
    currentDay = 7;
  }
  //set day to Monday
  jsDate.setDate(jsDate.getDate() - currentDay);
} else {
  weekDays = 0;
}

dateFrom = Utils.convertAnsiDateTime2AnsiDate(dateFrom);

//Store triplist customers based on the respective dayOfWeek in dictionary
var triplistCustDict = Utils.createDictionary();

me.getLoTripListBpaRel().forEach(function(triplistCust) {
  if(!triplistCustDict.containsKey(triplistCust.getDayOfWeek())) {
    var customers = [];
    customers.push(triplistCust);
    triplistCustDict.add(triplistCust.getDayOfWeek(), customers);
  }
  else {
    triplistCustDict.get(triplistCust.getDayOfWeek()).push(triplistCust);
  }
});

Facade.startTransaction();

for (var idxWeek = 0; idxWeek <= weekDays; idxWeek++) {
  totalSkippedCalls = totalSkippedCalls + skippedCallsOfCurrentDay;
  skippedCallsOfCurrentDay = 0;
  if (me.getValidFrom() <= dateFrom && me.getValidThru() >= dateFrom) {
    var customerList = [];
    timeFrom = workBegins;
    //Get DayCode (+1 to match DomDayOfWeek)
    currentDay = (Utils.convertAnsiDate2Date(dateFrom).getDay() === 0) ? 7 : Utils.convertAnsiDate2Date(dateFrom).getDay();

    if(weekDays > 0) {
      if(triplistCustDict.containsKey(currentDay.toString())) {
        customerList = triplistCustDict.get(currentDay.toString());
      }
    }
    else {
      if(triplistCustDict.containsKey("0")) {
        customerList = triplistCustDict.get("0");
      }
    }

    for (var idxCustomers = 0; idxCustomers < customerList.length; idxCustomers++) {
      customer = customerList[idxCustomers];
      if ((customer.getValidFrom() <= dateFrom) && (customer.getValidThru() >= dateFrom)) {
        var splitString = timeFrom.split(":"),
            d1 = Utils.createDateNow(),
            d2 = Utils.createDateNow();
        d1.setHours(splitString[0], splitString[1], 0, 0);
        d2.setHours(splitString[0], splitString[1], 0, 0);
        d1.setMinutes(d1.getMinutes() + duration);
        if (d1.getDate() > d2.getDate()) {
          //Call in context can not be scheduled if end of day has reached
          skippedCallsOfCurrentDay++;
        }
        if(skippedCallsOfCurrentDay === 0){
          timeThru = Utils.convertTime2Ansi(d1);
          jsonQuery = {};
          jsonParams = [];
          jsonParams.push({
            "field" : "clbMetaPKey",
            "operator" : "EQ",
            "value" : clbMetaPKey
          });
          jsonParams.push({
            "field" : "clbStatus",
            "operator" : "EQ",
            "value" : "Planned"
          });
          jsonParams.push({
            "field" : "dateFrom",
            "operator" : "EQ",
            "value" : dateFrom
          });
          jsonParams.push({
            "field" : "dateThru",
            "operator" : "EQ",
            "value" : dateFrom
          });
          jsonParams.push({
            "field" : "timeFrom",
            "operator" : "EQ",
            "value" : timeFrom
          });
          jsonParams.push({
            "field" : "timeThru",
            "operator" : "EQ",
            "value" : timeThru
          });
          jsonParams.push({
            "field" : "bpaMainPKey",
            "operator" : "EQ",
            "value" : customer.getBpaMainPKey()
          });
          jsonParams.push({
            "field" : "fixed",
            "operator" : "EQ",
            "value" : '0'
          });
          jsonParams.push({
            "field" : "allDay",
            "operator" : "EQ",
            "value" : allDay
          });
          jsonParams.push({
            "field" : "reasonCode",
            "operator" : "EQ",
            "value" : ' '
          });
          jsonParams.push({
            "field" : "responsiblePKey",
            "operator" : "EQ",
            "value" : responsiblePKey
          });
          jsonParams.push({
            "field" : "duration",
            "operator" : "EQ",
            "value" : duration
          });
          jsonParams.push({
            "field" : "locationsList",
            "operator" : "EQ",
            "value" : locationsList
          });
          jsonQuery.params = jsonParams;
          seqence_arguments.push(jsonQuery);
          functions.push(createBoCall);
          timeFrom = timeThru;
        }
      }
    }
  }
  dateFrom = Utils.addDays2AnsiDate(dateFrom, 1);
  if(idxWeek == weekDays){
    totalSkippedCalls = totalSkippedCalls + skippedCallsOfCurrentDay;
  }
}
var allfinished = when_sequence(functions, seqence_arguments)
.then(function () {
  return Facade.commitTransaction();
})
.then(function(){
  var buttonValues = {};
  buttonValues[Localization.resolve("OK")] = "ok";
  if (iErrorCount > 0) {
    return MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Notification"),"" + iErrorCount + " " + Localization.resolve("CallCreateNewCallViaTripListUI_CallsNotValidForCreation"), buttonValues);
  } else if(totalSkippedCalls > 0){
    return MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Notification"),"" + totalSkippedCalls + " " + Localization.resolve("CallCreateNewCallViaTripListUI_EndOfDayReached"), buttonValues);
  }
});

function createBoCall(args) {
  var messageCollector;
  var query = args[0];
  var boCall;
  var promise = BoFactory.createObjectAsync("BoCall", query)
  .then(function (object) {
    boCall = object;
    //then create object, assign joblists ,validate, save
    boCall.setObjectStatus(STATE.NEW | STATE.DIRTY);
    messageCollector = new MessageCollector();
    return boCall.doValidateAsync(messageCollector);
  }).then(function () {
    if (messageCollector.containsNoErrors()) {
      return boCall.saveAsync();
    } 
    else {
      iErrorCount++;
      return boCall;
    }
  });
  args.shift();
  return promise;
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return allfinished;
}