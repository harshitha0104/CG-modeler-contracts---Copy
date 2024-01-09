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
 * @function getUnsuccessfullVisitRateForCard
 * @this LoAgendaOverview
 * @kind listobject
 * @async
 * @namespace CORE
 * @param {String} setDateFunction
 * @param {String} filterCalls
 * @param {String} currentResponsiblePKey
 * @param {String} cardMode
 * @param {Date} currentDate
 * @returns promise
 */
function getUnsuccessfullVisitRateForCard(setDateFunction, filterCalls, currentResponsiblePKey, cardMode, currentDate){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
if(!Utils.isDefined(currentDate)){
  currentDate = Utils.createAnsiDateTimeToday();
} else{
  currentDate = Utils.createDateByString(currentDate);
}

var day = currentDate.getDay();
var sundayAdjustment = (day === 0 ? -7 : 0);
var mondayOfTheWeek = Utils.createSpecificDate(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() +(1 - day + sundayAdjustment));
var sundayOfTheWeek = Utils.createSpecificDate(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() +(7 - day + sundayAdjustment));

var promise = me.getCallsByDate(setDateFunction, filterCalls, Utils.convertFullDate2Ansi(mondayOfTheWeek), Utils.convertFullDate2Ansi(sundayOfTheWeek), currentResponsiblePKey, undefined, cardMode)
.then(function() {

  var items = me.getAllItems(); 
  var count = items.length;
  var unsuccessfullVisits = 0;

  items.forEach(function(item){
    if(item.hasOrder === "0"){
      unsuccessfullVisits++;
    }
  });

  if(count === 0 || unsuccessfullVisits === 0) {
    return 0;
  }
  else {
    return Number.parseFloat((unsuccessfullVisits/count) * 100).toFixed(1);
  }
});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}