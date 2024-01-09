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
 * @function getChartData
 * @this LoCustomerSalesRevenueForCard
 * @kind listobject
 * @async
 * @namespace CORE
 * @param {DomPKey} user
 * @param {Integer} numberOfYears
 * @param {Integer} numberOfMonths
 * @param {Date} currentDate
 * @returns promise
 */
function getChartData(user, numberOfYears, numberOfMonths, currentDate){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var years = "";
var months = "";
numberOfYears = parseInt(numberOfYears, 10);
numberOfMonths = parseInt(numberOfMonths, 10);

if(!Utils.isDefined(currentDate)) {
  currentDate = Utils.createAnsiDateTimeToday();
}

var now = Utils.createDateByString(currentDate);
var currentYear = now.getUTCFullYear();
var currentMonth = now.getUTCMonth();
// set to 1st of month because getMonth method is returning wrong month for few dates
now.setDate(1);
var date = currentDate;
var keys = [];

for(var i = 0; i < numberOfYears; i++) {
  if(i !== 0) {
    now.setMonth(currentMonth);
    now.setYear(currentYear - i);
  }

  //ToDo: change loop from currentMonth-3 to current Month so that current month is at the botttom of the chart
  for(var j = 0; j < numberOfMonths; j++) {
    if(j !== 0) {
      now.setMonth(now.getMonth() - 1);
    }
    keys.push("'" + (now.getUTCMonth()+1).toString() + "_" + now.getUTCFullYear().toString() + "'");
  }
}

var newKey = [keys[2], keys[1], keys[0], keys[5], keys[4], keys[3]];
newKey = newKey.join(",");

var jsonQuery = {};
var jsonParams = [];

jsonParams.push({
  "field" : "user",
  "operator" : "EQ",
  "value" : user
});
jsonParams.push({
  "field" : "date",
  "operator" : "EQ",
  "value" : date
});
jsonParams.push({
  "field" : "keys",
  "operator" : "EQ",
  "value" : newKey
});
jsonQuery.params = jsonParams;

me.searchKeys = newKey;

var promise = Facade.getListAsync("LoCustomerSalesRevenueForCard", jsonQuery)
.then(function(data) {
  //needed because function is called in entry action of cockpit. After coming back from maximized Report function is called again
  me.removeAllItems();
  if(data.length === 0) {
    data.push({searchKeys:  me.searchKeys.replace(/'/g, '')});
  }
  else {
    data[0].searchKeys = me.searchKeys.replace(/'/g, '');
  }
  me.addItems(data);
  return true;
});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}