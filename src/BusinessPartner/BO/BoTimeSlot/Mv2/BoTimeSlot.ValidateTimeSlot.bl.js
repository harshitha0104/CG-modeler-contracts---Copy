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
 * @function validateTimeSlot
 * @this BoTimeSlot
 * @kind businessobject
 * @namespace CORE
 * @param {messageCollector} messageCollector
 */
function validateTimeSlot(messageCollector){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
/** This function validated newly created or changed time Slots 
      - Day of week is mandatory and must be filled 
      - End Time must be after start time
      - No overlap of time slot records is allowed
**/


//validate only if list of time slots exists
//even if there is no existing time slot the Lo itself exists
if(Utils.isDefined(me.getListTimeSlots())){

  var stateNewDirty = STATE.NEW | STATE.DIRTY;
  var stateDirty = STATE.DIRTY | STATE.PERSISTED;
  var objectStatus = me.getObjectStatus();

  if(objectStatus === STATE.NEW || objectStatus === stateNewDirty || objectStatus === stateDirty){
    /** ###############################################
    # Day of week is mandatory and must be filled # 
    ###############################################**/
    if (!Utils.isDefined(me.getDayOfWeek()) || Utils.isEmptyString(me.getDayOfWeek())){
      messageCollector.add({
        "level": "error", 
        "objectClass": "BoTimeSlot", 
        "messageID": "CasBoTimeSlotDayOfWeekMandatory",
        "messageParams": {}
      });
    }


    /** #####################################
    # End Time must be after start time # 
    #####################################**/

    var startTimeTicks =  me.getComparableTicksFromTime(me.getStartTime());
    var endTimeTicks =  me.getComparableTicksFromTime(me.getEndTime());

    if (startTimeTicks >= endTimeTicks){
      messageCollector.add({
        "level": "error", 
        "objectClass": "BoTimeSlot", 
        "messageID": "CasBoTimeSlotStartTimeBiggerEndTime",
        "messageParams": {}
      });
    }


    /** ##############################################
    # No overlap of time slot records is allowed # 
    ##############################################**/

    if(Utils.isDefined(me.getListTimeSlots())){

      // get time slots with the same day ... there might exist several with same day
      //ignore deleted ones
      //ignore ones with same pKey
      var timeSlotsToCheck = me.getListTimeSlots().getItems().filter(function (item){
        if(item.dayOfWeek === me.getDayOfWeek() && item.pKey !=  me.getPKey()){
          return item;
        }
      });

      var bTimeZoneValid = true;

      var startTimeTicksToCheck;
      var endTimeTicksToCheck;
      var bCurrentTSInOtherTS;
      var bOtherTSInCurrentTS;

      bTimeZoneValid = timeSlotsToCheck.every(function(timeSlot){ 

        startTimeTicksToCheck = me.getComparableTicksFromTime(timeSlot.getStartTime());
        endTimeTicksToCheck = me.getComparableTicksFromTime(timeSlot.getEndTime());
        bCurrentTSInOtherTS = false;
        bOtherTSInCurrentTS = false;

        if(
          //check if start/end time of current time slot is in other timeslot
          ((startTimeTicks >= startTimeTicksToCheck) && (startTimeTicks < endTimeTicksToCheck)) ||
          ((endTimeTicks > startTimeTicksToCheck) && (endTimeTicks <= endTimeTicksToCheck))
        ){
          bCurrentTSInOtherTS = true;
        }else if(
          //check if start/end of other timeslot is in current timeslot
          ((startTimeTicksToCheck >= startTimeTicks) && (startTimeTicksToCheck < endTimeTicks))||
          ((endTimeTicksToCheck > startTimeTicks) && (endTimeTicksToCheck <= endTimeTicks))
        ){
          bOtherTSInCurrentTS = true;
        }

        if(bCurrentTSInOtherTS || bOtherTSInCurrentTS){
          //every iterator stop when first time callback returns false
          return false;
        }else{
          return true;
        }
      });
    }



    if (!bTimeZoneValid){
      messageCollector.add({
        "level": "error", 
        "objectClass": "BoTimeSlot", 
        "messageID": "CasBoTimeSlotOverlap",
        "messageParams": {}
      });
    }
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}