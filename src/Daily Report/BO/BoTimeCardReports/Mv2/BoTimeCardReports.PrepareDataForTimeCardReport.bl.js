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
 * @function prepareDataForTimeCardReport
 * @this BoTimeCardReports
 * @kind businessobject
 * @namespace CORE
 * @param {Object} timeEntryData
 * @param {String} userName
 * @param {String} team
 * @param {String} startDate
 * @param {String} endDate
 * @param {Object} loActivityItem
 * @returns jsonData
 */
function prepareDataForTimeCardReport(timeEntryData, userName, team, startDate, endDate, loActivityItem){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var dateArray = timeEntryData.getAllItems();
var resultRaw = [];
var indices = Utils.createDictionary();
var colors = [];
var legendData = [];
var entryNames = [];
var workingTimeText = "";
var workingTimeIndex = -1;

if(!Utils.isDefined(loActivityItem) || loActivityItem.isDestroyed || !Utils.isDefined(loActivityItem.getAllItems()) || loActivityItem.getAllItems().length === 0) {
  return {  "noDataAvailable" : "1" };
}

var activityItems = loActivityItem.serialize();
var activityIndex = 0;

var activityItemProcessing = function(activityItem) {
  var activityTypeText = activityItem.text;
  var code = activityItem.code;
  var color = activityItem.validationCode;
  var duration = 0;

  indices.add(activityTypeText,resultRaw.length);
  resultRaw.push([activityTypeText, duration]);
  colors.push(color);

  legendData.push({id:activityTypeText, color:color, time:duration, legendEntry: "3"});

  if(code === "WorkingTime") {
    workingTimeIndex = activityIndex;
    workingTimeText = activityTypeText;
  }
  activityIndex++;
};

activityItems.forEach(activityItemProcessing);

var timeEntryProcessing = function(timeEntry) {
  var activityTypeText = Utils.getToggleText("DomUsrActivityType", timeEntry.getActivityType());
  var color = timeEntry.getActivityTypeColor();
  var duration = timeEntry.getDuration();

  if(duration === 0 && timeEntry.getActivityType() === "WorkingTime" && timeEntry.getSystemTimeThru() == Utils.getMinDate()) {
    var dtNow = Utils.createDateNow();
    var dtStart = Utils.convertAnsiDate2Date(timeEntry.getSystemTimeFrom());
    duration = Math.floor((dtNow - dtStart)/1000/60);
  }

  if(duration !== 0) {
    var index = -1;
    if(indices.containsKey(activityTypeText)) {
      index = indices.get(activityTypeText);
    }
    var newDuration = resultRaw[index][1] + duration;
    resultRaw[index][1] =  newDuration;
    legendData[index].time= newDuration;
  }
};

dateArray.forEach(timeEntryProcessing);

if(resultRaw.length !== 0 && workingTimeIndex != -1) {
  var legendtextPre = [];
  var legendtextPost = [];

  if(team == "1") {
    userName = userName + " ("+ (Localization.resolve("Report_TimeCard_Team")) + ")";
  }
  legendtextPre.push({id:userName, legendEntry: "0"});
  legendtextPre.push({id:Utils.convertAnsiDate2Date(startDate).toLocaleDateString() + "  -  " + Utils.convertAnsiDate2Date(endDate).toLocaleDateString(), legendEntry: "1"});
  legendtextPre.push({id:(Localization.resolve("Report_TimeCard_Dist")+":"), legendEntry: "2"});
  legendtextPost.push({id: Localization.resolve("Report_TimeCard_Total"), time: resultRaw[workingTimeIndex][1], legendEntry: "4"});


  var summedUpDuration = 0;
  for(var i = 0; i < resultRaw.length; i++) {
    if(i === workingTimeIndex) {
      continue;
    }
    summedUpDuration+= resultRaw[i][1];
  }

  resultRaw[workingTimeIndex][0] = Localization.resolve("Report_TimeCard_Unspec");
  resultRaw[workingTimeIndex][1] = resultRaw[workingTimeIndex][1] - summedUpDuration;

  legendData[workingTimeIndex].id = resultRaw[workingTimeIndex][0];
  legendData[workingTimeIndex].time = resultRaw[workingTimeIndex][1];

  legendData = legendtextPre.concat(legendData);
  legendData = legendData.concat(legendtextPost);
}

for(var legendIndex = 0; legendIndex < legendData.length; legendIndex++) {
  legendData[legendIndex].index = legendIndex;
}

var jsonData = {
  "noDataAvailable" : "0",
  "data" : {
    columns: resultRaw
  },
  colors:colors,
  legendData:legendData
};

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return jsonData;
}