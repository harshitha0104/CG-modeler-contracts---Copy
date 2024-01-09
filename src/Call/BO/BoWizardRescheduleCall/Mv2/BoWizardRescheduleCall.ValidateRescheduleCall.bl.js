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
 * @function validateRescheduleCall
 * @this BoWizardRescheduleCall
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {messageCollector} messageCollector
 */
function validateRescheduleCall(messageCollector){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var updateDateThru = function() {
  var dateThru = Utils.convertAnsiDate2Date(me.getDateFrom());
  var splitString = me.getTimeFrom().split(":");
  dateThru.setHours(splitString[0],splitString[1],0,0);
  dateThru.setMinutes(dateThru.getMinutes() + me.getDuration());
  //Setting the dateThru to check if call gets extended to the next day
  dateThru.setHours(0,0,0,0);
  return dateThru;
};

var newDateThru;
if (me.getCalledByWizard() == "1") {
  if (!Utils.isDefined(me.getDateFrom()) || !Utils.isDefined(me.getDateThru()) || !Utils.isDefined(me.getTimeFrom()) || Utils.isEmptyString(me.getTimeFrom()) || !Utils.isDefined(me.getTimeThru()) || Utils.isEmptyString(me.getTimeThru())) {
    messageCollector.add({
      "level" : "error",
      "objectClass" : "BoCall",
      "messageID" : "CasClbFillInAllValues"
    });
  }
  else {
    if (me.getTimeFrom() > me.getTimeThru()) {
      newDateThru = updateDateThru();
      if (newDateThru > Utils.convertAnsiDate2Date(me.getDateFrom())) {
        messageCollector.add({
          "level" : "error",
          "objectClass" : "BoCall",
          "messageID" : "CasClbCallsMayNotSpanSeveralDays"
        });
      }
      else {
        messageCollector.add({
          "level" : "error",
          "objectClass" : "BoCall",
          "messageID" : "CasClbTimeFromGreaterTimeThru"
        });
      }

    }
    else if (me.getTimeFrom() === me.getTimeThru()) {
      messageCollector.add({
        "level" : "error",
        "objectClass" : "BoCall",
        "messageID" : "CasClbCannotCreateCallWithZeroCallDuration"
      });
    }
  }
}
else {
  newDateThru = updateDateThru();
  if (newDateThru > Utils.convertAnsiDate2Date(me.getDateFrom())) {
    messageCollector.add({
      "level" : "error",
      "objectClass" : "BoCall",
      "messageID" : "CasClbCallsMayNotSpanSeveralDays"
    });
  }
}

if (messageCollector.containsNoErrors() && !Utils.isEmptyString(me.getCustomerPKey())) {
  var callDateFrom = Utils.convertAnsiDate2Date(me.getDateFrom());
  var managementRelValidFrom = Utils.convertAnsiDate2Date(me.getManagementRelationValidFrom());
  var managementRelValidThru = Utils.convertAnsiDate2Date(me.getManagementRelationValidThru());

  // Validate customer management relation while rescheduling a call
  if (callDateFrom < managementRelValidFrom || callDateFrom > managementRelValidThru) {
    messageCollector.add({
      "level" : "error",
      "objectClass" : "BoWizardRescheduleCall",
      "messageID" : "CasClbCannotRescheduleInvalidManagementRelation"
    });
  }

  var substitutedFrom = Utils.convertAnsiDate2Date(me.getSubstitutedFrom());
  var substitutedThru = Utils.convertAnsiDate2Date(me.getSubstitutedThru());
  var isSubstitutedOutsideTimeFrame = (me.getIsSubstituted() == "1" && (callDateFrom < substitutedFrom || substitutedThru < callDateFrom));
  if (me.getIsManaged() == "0" && (me.getHasSubstitute() == "0" || isSubstitutedOutsideTimeFrame)) {
    messageCollector.add({
      "level" : "error",
      "objectClass" : "BoWizardRescheduleCall",
      "messageID" : "CasClbCannotRescheduleSubstitutedCall"
    });
  }
  if (me.getHasSubstitute() == "1") {
    messageCollector.add({
      "level" : "error",
      "objectClass" : "BoWizardRescheduleCall",
      "messageID" : "CasClbCannotRescheduleCallWhileSubstituted"
    });
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}