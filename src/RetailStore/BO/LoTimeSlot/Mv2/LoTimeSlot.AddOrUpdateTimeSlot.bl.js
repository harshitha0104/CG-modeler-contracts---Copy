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
 * @function addOrUpdateTimeSlot
 * @this LoTimeSlot
 * @kind listobject
 * @namespace CORE
 * @param {Object} timeSlot
 */
function addOrUpdateTimeSlot(timeSlot){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
/**
This function gets a BoTimeSlot modified or created by UI.
Checks if the time slot exxists already in the list 
  - if yes: update item
  - if no: create item
*/

if(Utils.isDefined(timeSlot)){
  
  var calculateDaySort = function(dayOfWeek, startTime){
    var day;
    switch(dayOfWeek) {
      case 'mon':
        day = "Monday";
        break;
      case 'tue':
        day = "Tuesday";
        break;
      case 'wed':
        day = "Wednesday";
        break;
      case 'thu':
        day = "Thursday";
        break;
      case 'fri':
        day = "Friday";
        break;
      case 'sat':
        day = "Saturday";
        break;
      case 'sun':
        day = "Sunday";
        break;
    }
    return day + "_" + startTime;
  };
  
  //determine group text
  //if there exist already items just take the same group text (e.g. Deviation to current time: -9 hrs)
  var groupText = "";
  if(me.getAllItems().length > 0){
    groupText = me.getAllItems()[0].getGroupText();
  }
  

  var itemToUpdate = me.getItemByPKey(timeSlot.pKey);

  if(Utils.isDefined(itemToUpdate)){

    //################
    //###  update  ###
    //################
    itemToUpdate.setDayOfWeek(timeSlot.dayOfWeek);
    itemToUpdate.setStartTime(Localization.localize(timeSlot.startTime.substring(0,8),"time"));
    itemToUpdate.setEndTime(Localization.localize(timeSlot.endTime.substring(0,8),"time"));
    itemToUpdate.setStartTimeToSave(timeSlot.startTime.length === 5 ? timeSlot.startTime + ":00.000Z" : timeSlot.startTime);
    itemToUpdate.setEndTimeToSave(timeSlot.endTime.length === 5 ? timeSlot.endTime + ":00.000Z" : timeSlot.endTime);
    itemToUpdate.setDaySort(calculateDaySort(timeSlot.dayOfWeek, timeSlot.startTime));

  }else{

    //####################
    //###  create new  ###
    //####################
    
    //Name is also mandatory. Will be set to account name in save function of the BoCustomer
    var newItem = {
      "pKey" : PKey.next(),
      "operatingHoursId" : timeSlot.operatingHoursId,
      "dayOfWeek" : timeSlot.dayOfWeek,
      "type" : timeSlot.type,
      "startTime" :  Localization.localize(timeSlot.startTime.substring(0,8),"time"),
      "endTime" : Localization.localize(timeSlot.endTime.substring(0,8),"time"),
      "startTimeToSave" : timeSlot.startTime.length === 5 ? timeSlot.startTime + ":00.000Z" : timeSlot.startTime,
      "endTimeToSave" : timeSlot.endTime.length === 5 ? timeSlot.endTime + ":00.000Z" : timeSlot.endTime,
      "groupText" : groupText,
      "daySort" : calculateDaySort(timeSlot.dayOfWeek, timeSlot.startTime),
      "objectStatus": STATE.NEW | STATE.DIRTY
    };
    me.addItems([newItem]);
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}