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
 * @function calculateTotalActivityDuration
 * @this BoUserDailyReport
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 */
function calculateTotalActivityDuration(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var totalDuration = 0;
var loActivities = me.getLoUsrDRActivity().getItemObjects();
var dateTimeHelper = ApplicationContext.get("dateTimeHelper");
var diff;
var i;

for (var idxloActivities = 0; idxloActivities < loActivities.length; idxloActivities++) {
  totalDuration = totalDuration + parseInt(loActivities[idxloActivities].getDuration(), 10);
}

me.setTotalHours(Math.floor(totalDuration / 60));
me.setTotalMinutes(totalDuration % 60);
me.setTotalLineString(me.getTotalHours() + ' / ' + me.getTotalMinutes());

//Update list item of daily report overview list
if (Utils.isDefined(Framework.getProcessContext().dailyReportList) && Utils.isDefined(Framework.getProcessContext().dailyReportList.getCurrent()) && Framework.getProcessContext().dailyReportList.getCurrent().getPKey() === me.getPKey()) {
  Framework.getProcessContext().dailyReportList.getCurrent().setHours(me.getTotalHours().toString());
  Framework.getProcessContext().dailyReportList.getCurrent().setMinutes(me.getTotalMinutes().toString());
}

if (me.getBoUserDocMeta().getUiGroup() !== "TimeCard" && ( Utils.isDefined(me.getWorkTimeFrom()) || Utils.isDefined(me.getWorkTimeThru()))) {
  var timeFrom = Utils.convertAnsiTime2Time(me.getWorkTimeFrom());
  var timeThru = Utils.convertAnsiTime2Time(me.getWorkTimeThru());
  diff = timeThru.getTime() - timeFrom.getTime();
  var mins = (diff/1000)/60;

  me.setTotalHours(Math.floor(mins/60));
  me.setTotalMinutes(mins%60);
  me.setTotalWorkingTime(me.getTotalHours() + ' / ' + me.getTotalMinutes());
}

if (me.getBoUserDocMeta().getUiGroup() === "TimeCard") {
  var workingTimeInMnts = 0;
  var nonProdTimeInMnts = 0;
  // UTC Time
  var now = Utils.createDateNow();
  var now_utc = Utils.createSpecificDate(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
  var filterArray = [];

  //remove the hidden dummy items
  var hiddenItems = me.getLoUsrTimeEntry().getItemsByParamArray([{
    "description": "Hidden",
    "op": "EQ"
  }]);
  if (hiddenItems.length > 0) {
    var pkeys = [];
    for (i = 0; i < hiddenItems.length; i++) {
      pkeys.push(hiddenItems[i].getPKey());
    }
    if (pkeys.length > 0) {
      me.getLoUsrTimeEntry().removeItems(pkeys);
    }
  }

  filterArray.push({ "usrTimeEntryMetaPKey": me.getBoUserDocMeta().getWorkUsrTimeEntryMetaPKey(), "op": "EQ" });
  var items = me.getLoUsrTimeEntry().getItemsByParamArray(filterArray);

  if (items.length > 0) {
    if (items[0].getSystemTimeThru() === Utils.getMinDate()) {
      diff = Math.abs(now_utc - Utils.convertAnsiDate2Date(items[0].getEffectiveUTCTimeFrom()));
      workingTimeInMnts = Math.floor((diff / 1000) / 60);
    }
    else {
      workingTimeInMnts = parseInt(items[0].getDuration(), 10);
    }

    if(workingTimeInMnts >= 0) {
      me.setTotalWorkingTime(dateTimeHelper.getFormattedTimeString(workingTimeInMnts));
      //refresh master list in UI
      if(Utils.isDefined(Framework.getProcessContext().dailyReportList) && Utils.isDefined(Framework.getProcessContext().dailyReportList.getCurrent())) {
        Framework.getProcessContext().dailyReportList.getCurrent().setHours(Math.floor(workingTimeInMnts/60));
        Framework.getProcessContext().dailyReportList.getCurrent().setMinutes(workingTimeInMnts%60);
      }
    }
    else {
      me.setTotalWorkingTime("00:00");
      if(Utils.isDefined(Framework.getProcessContext().dailyReportList) && Utils.isDefined(Framework.getProcessContext().dailyReportList.getCurrent())) {
        Framework.getProcessContext().dailyReportList.getCurrent().setHours("0");
        Framework.getProcessContext().dailyReportList.getCurrent().setMinutes("0");
      }
    }
  }

  filterArray = [];
  filterArray.push({ "productiveTimeEffect": "-1", "op": "EQ" });
  items = me.getLoUsrTimeEntry().getItemsByParamArray(filterArray);

  for (i = 0; i < items.length; i++) {
    nonProdTimeInMnts += items[i].getDuration();
  }

  //Set non productive time
  me.setNonProductiveTime(dateTimeHelper.getFormattedTimeString(nonProdTimeInMnts));

  //Set productive time
  var prodTimeInMnts = workingTimeInMnts - nonProdTimeInMnts;
  me.setProductiveTime(dateTimeHelper.getFormattedTimeString(prodTimeInMnts));
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}