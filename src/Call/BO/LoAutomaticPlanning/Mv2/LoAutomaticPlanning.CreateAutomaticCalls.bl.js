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
 * @function createAutomaticCalls
 * @this LoAutomaticPlanning
 * @kind listobject
 * @async
 * @namespace CORE
 * @param {String} currentWeekStartDate
 * @param {String} responsiblePKey
 * @param {Object} overviewList
 * @param {Object} completedAutomaticCallList
 * @param {Object} locationsList
 * @returns allfinished
 */
function createAutomaticCalls(currentWeekStartDate, responsiblePKey, overviewList, completedAutomaticCallList, locationsList){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var functions = [];
var seqence_arguments = [];
var customerCallSettingList;
var customerCallSetting;
var duration;
var customerPKey;
var clbMetaPKey;
var substitutedUsrPKey;
var isSubstituted;
var isManagedCustomer;
var dateFrom;
var timeFrom;
var timeThru;
var iCreatedCallCount = 0;
var iDuplicateCount = 0;
var clbStatus = "Planned";
var currentDay;
var jsDate;
var currentWeek;
var frequency;
var startWeek;
var validWeek;
var promise;
var completedAutomaticCallList;
var d1;
var d2;
var currentWeekMondayDate;
//Check if the week is valid for call creation in all the planning modes
var updateCallSettings = function(updateCurrentWeek, customerCallSetting, completedCallAvailable){  
  currentWeek = updateCurrentWeek ? Utils.getCalendarWeekISO(currentWeekMondayDate): currentWeek;
  frequency = customerCallSetting.frequency;
  startWeek = completedCallAvailable ? 1 : customerCallSetting.startWeek;
  validWeek = (((currentWeek - startWeek) % frequency) === 0);
};

var createBoCall = function(args) {
  var messageCollector;
  var query = args[0];
  var boCall;
  var promise = BoFactory.createObjectAsync("BoCall", query)
  .then(function (object) {
    boCall = object;
    //then create object, assign joblists ,validate, save
    boCall.setObjectStatus(this.self.STATE_NEW_DIRTY);
    messageCollector = new MessageCollector();
    return boCall.doValidateAsync(messageCollector);
  }).then(function () {
    if (messageCollector.containsNoErrors()) {
      iCreatedCallCount++;        
      return boCall.saveAsync();
    } 
    else {
      return boCall;
    }
  });
  args.shift();
  return promise;
};

Facade.startTransaction();
jsDate = Utils.convertAnsiDate2Date(currentWeekStartDate);
currentDay = jsDate.getDay() - 1;

//set day to Monday for current calendar week determination
jsDate.setDate(jsDate.getDate() - currentDay);
currentWeekMondayDate = Utils.convertFullDate2Ansi(jsDate);

var completedCallDictionary = Utils.createDictionary();
completedAutomaticCallList.getAllItems().forEach(function(item){
  completedCallDictionary.add(item.getClbMetaPKey()+item.getCustomerPKey(), item);
});

customerCallSettingList = me.getAllItems();

for (var i = 0; i < customerCallSettingList.length; i++) {
  customerCallSetting = customerCallSettingList[i];
  validWeek = false;
  customerPKey = customerCallSetting.pKey;  
  clbMetaPKey = customerCallSetting.clbMetaPKey;
  substitutedUsrPKey = customerCallSetting.substitutedUsrPKey;
  isSubstituted = customerCallSetting.substituted;
  isManagedCustomer = customerCallSetting.managed;
  timeFrom = customerCallSetting.timeOfDay;
  duration = customerCallSetting.duration;

  var splitString = timeFrom.split(":"),
      d1 = Utils.createDateNow(),
      d2 = Utils.createDateNow();
  d1.setHours(splitString[0], splitString[1], 0, 0);
  d2.setHours(splitString[0], splitString[1], 0, 0);
  d1.setMinutes(d1.getMinutes() + duration);
  if (d1.getDate() > d2.getDate()) {
    d1.setHours(23, 59, 0, 0);
  }
  timeThru = Utils.convertTime2Ansi(d1);

  // Check selected week validity via different planning modes
  /* Start Week Planning Mode - A call will be created if the selected planning week is valid. 
     In each year, the algorithm starts with the number of the week specified in StartWeek
     Algorithm: ValidWeek = (((currentWeek - startWeek) % frequency) === 0)
        where currentWeek = Current calendar week number
              frequency = Frequency in call setting
              startWeek = Start Week in call setting
              validWeek = If the week is valid for call creation */

  if(customerCallSetting.planningMode == "StartWeek") {
    updateCallSettings(true, customerCallSetting);
  }

  /* Start Week Year Planning Mode - A call will be created if the selected planning week is valid. 
     Algorithm: ValidWeek = (((currentWeek - startWeek) % frequency) === 0)
        where currentWeek = Current week is the difference of weeks between initial year and current year
              frequency = Frequency in call setting
              startWeek = Start Week in call setting
              validWeek = If the week is valid for call creation */

  if(customerCallSetting.planningMode == "StartWeekYear") {
    /* As per ISO definitions, week 01 of a year is the week that has 4 January in it. 
    Hence the earliest possible first week will extend from Monday 29 December (previous year) to Sunday 4 January, 
    the latest possible first week extends from Monday 4 January to Sunday 10 January, 
    so we are setting initial year starting as 4th January */
    
    d1= customerCallSetting.validFrom.slice(0,4) + "-01-04";
    d1= Utils.convertAnsiDate2Date(d1);
    d2= Utils.convertAnsiDate2Date(currentWeekMondayDate);
    currentWeek = Math.round((d2 - d1) / (7 * 24 * 60 * 60 * 1000)) +1  ;
    updateCallSettings(false, customerCallSetting);
  }

  /* Last Call Planning Mode - LastCall plannig mode leads to the same system behavior like 'Start Week', only the start week differs.
     If there is a completed last call that fulfill the criteria, then start week is determined based on call completion date 
     else the system works same as of Start Week planning mode */

  if(customerCallSetting.planningMode == "LastCall") {
    if(completedAutomaticCallList.getAllItems().length > 0) {
      if(completedCallDictionary.containsKey(clbMetaPKey+customerPKey)){
        var filteredCompletedCall = completedCallDictionary.get(clbMetaPKey+customerPKey);
        var completedDate = filteredCompletedCall.getCompletedDate();
        d2 = Utils.convertAnsiDate2Date(currentWeekMondayDate);

        /* As per ISO definitions, week 01 of a year is the week that has first Thursday of the year.
        Set last completed call day to closest thursday to find the exact week of the completed call.
        If call is completed on Jan 01 2016 which falls on a Friday it should be last week of 2015 and not the first week of 2016.
        */
        d1 = Utils.convertAnsiDate2Date(completedDate);
        currentDay = d1.getDay() + 3;
        if(d1.getDay() === 0){
          d1.setDate(d1.getDate() - currentDay);
        }
        else {
          d1.setDate((d1.getDate() + 7) - currentDay);
        }

        currentWeek = Math.round((d2 - d1) / (7 * 24 * 60 * 60 * 1000)) +1  ;
        updateCallSettings(false , customerCallSetting, true);

      }
      else { 
        // if no completed call of particular template present, consider setting as of start week
        updateCallSettings(true, customerCallSetting);        
      }
    }
    else { 
      // if no completed call present, consider setting as of start week
      updateCallSettings(true, customerCallSetting);
    }
  }

  if(validWeek) {
    switch(customerCallSetting.dayOfWeek) {
      case "mon":
        if(customerCallSetting.WorksOnMonday === "0") {
          continue;
        }
        dateFrom = currentWeekMondayDate;
        break;
      case "tue":
        if(customerCallSetting.WorksOnTuesday === "0") {
          continue;
        }
        dateFrom = Utils.addDays2AnsiDate(currentWeekMondayDate,1);
        break;
      case "wed":
        if(customerCallSetting.WorksOnWednesday === "0") {
          continue;
        }
        dateFrom = Utils.addDays2AnsiDate(currentWeekMondayDate,2);
        break;
      case "thu":
        if(customerCallSetting.WorksOnThursday === "0") {
          continue;
        }
        dateFrom = Utils.addDays2AnsiDate(currentWeekMondayDate,3);
        break;
      case "fri":
        if(customerCallSetting.WorksOnFriday === "0") {
          continue;
        }
        dateFrom = Utils.addDays2AnsiDate(currentWeekMondayDate,4);
        break;
      case "sat":
        if(customerCallSetting.WorksOnSaturday === "0") {
          continue;
        }
        dateFrom = Utils.addDays2AnsiDate(currentWeekMondayDate,5);
        break;
      case "sun":
        if(customerCallSetting.WorksOnSunday === "0") {
          continue;
        }
        dateFrom = Utils.addDays2AnsiDate(currentWeekMondayDate,6);
        break;
    }    
    var callAvailable = overviewList.containsItem({ "bpaMainPKey": customerPKey, "responsiblePKey": isSubstituted== "1"? substitutedUsrPKey:responsiblePKey, "dateFrom":dateFrom, "clbMetaPKey": clbMetaPKey, "creationMode": 'Automatically' }, [{"fieldName": "bpaMainPKey"},{"fieldName": "responsiblePKey"},{"fieldName": "clbMetaPKey"},{"fieldName": "creationMode"}]);
    if(callAvailable === true){
      iDuplicateCount++;
      continue;
    }
    var jsonQuery = {};
    var jsonParams = [];
    jsonParams.push({
      "field" : "clbMetaPKey",
      "operator" : "EQ",
      "value" : clbMetaPKey
    });
    jsonParams.push({
      "field" : "clbStatus",
      "operator" : "EQ",
      "value" : clbStatus
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
      "value" : customerPKey
    });
    jsonParams.push({
      "field" : "fixed",
      "operator" : "EQ",
      "value" : '0'
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
      "field" : "creationMode",
      "operator" : "EQ",
      "value" : "Automatically"
    });
    jsonParams.push({
      "field" : "substitutedUsrPKey",
      "operator" : "EQ",
      "value" : substitutedUsrPKey
    });
    jsonParams.push({
      "field" : "isSubstituted",
      "operator" : "EQ",
      "value" : isSubstituted
    });
    jsonParams.push({
      "field" : "isManagedCustomer",
      "operator" : "EQ",
      "value" : isManagedCustomer
    });
    jsonParams.push({
      "field" : "locationsList",
      "operator" : "EQ",
      "value" : locationsList
    });
    jsonQuery.params = jsonParams;
    seqence_arguments.push(jsonQuery);
    functions.push(createBoCall);
  }
}

var allfinished = when_sequence(functions, seqence_arguments)
.then(function () {
  return Facade.commitTransaction();
})
.then(function(){
  var buttonValues = {};
  buttonValues[Localization.resolve("OK")] = "ok";
  return MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Notification"),"Number of duplicates detected: " + iDuplicateCount + ".<br>Total calls created: " + iCreatedCallCount + ".", buttonValues);
});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return allfinished;
}