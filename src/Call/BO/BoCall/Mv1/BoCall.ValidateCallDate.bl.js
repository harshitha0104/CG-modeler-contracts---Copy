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
 * @function validateCallDate
 * @this BoCall
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} messageCollector
 * @returns promise
 */
function validateCallDate(messageCollector){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise;
var newError;
var isValid = true;
var isValidDate = function(date) {
  return Utils.isDefined(date) && !Utils.isEmptyString(date);
};

if (messageCollector.containsNoErrors()) {
  if (!isValidDate(me.getDateFrom()) || !isValidDate(me.getDateThru()) || !isValidDate(me.getTimeFrom()) || !isValidDate(me.getTimeThru())) {
    isValid = false;
    messageCollector.add({
      "level": "error",
      "objectClass": "BoCall",
      "messageID": "CasClbFillInAllValues"
    });
  }

  if (me.getDateFrom() > me.getDateThru()) {
    isValid = false;
    messageCollector.add({
      "level": "error",
      "objectClass": "BoCall",
      "messageID": "CasClbDateFromGreaterDateThru"
    });
  }
  else if (me.getDateFrom() === me.getDateThru() && me.getTimeFrom() > me.getTimeThru()) {
    isValid = false;
    messageCollector.add({
      "level": "error",
      "objectClass": "BoCall",
      "messageID": "CasClbTimeFromGreaterTimeThru"
    });
  }

  //Validate Valid Thru if substitution
  if (!Utils.isEmptyString(me.getBpaMainPKey())) {
    if (me.getBoJobManager().getCallDateChangedAfterLoad() == "1") {

      //check management / substitution info for EA-Rights
      var cmiParams = [];
      var cmiQuery = {};

      cmiParams.push({
        "field" : "customerPKey",
        "value" : me.getBpaMainPKey()
      });
      cmiParams.push({
        "field" : "referenceDate",
        "value" : me.getDateFrom()
      });
      cmiParams.push({
        "field" : "referenceUserPKey",
        "value" : me.getLuCustomerManagementInfo().getReferenceUsrMainPKey()
      });
      cmiQuery.params = cmiParams;
      promise = BoFactory.loadObjectByParamsAsync("LuCustomerManagementInfo", cmiQuery)
        .then(function (customerManagementInfoLookup) {
        //If this is a substituted call, check attribut for EA-Rights
        if (Utils.isDefined(customerManagementInfoLookup)) {
          me.setLuCustomerManagementInfo(customerManagementInfoLookup);
          me.updateSubstitutionInfo();
        }
        var managementInfo = me.getLuCustomerManagementInfo();

        // substituted call outside of substitution timeframe
        if (me.getReadOnlyBySubstitution() == "1") {
          var stateNewDirty = STATE.NEW | STATE.DIRTY;
          if (me.getObjectStatus() === stateNewDirty) {
            newError = {
              "level" : "error",
              "objectClass" : "BoCall",
              "simpleProperty" : "substitution",
              "messageID" : "CasClbCannotCreateSubstitutedCall"
            };
          }
          else {
            newError = {
              "level" : "error",
              "objectClass" : "BoCall",
              "simpleProperty" : "substitution",
              "messageID" : "CasClbCallDateFromNotInSubstitutionTimeFrame"
            };
          }
          messageCollector.add(newError);
        }
        else if (me.getSubstitution() === "0" && me.getResponsiblePKey() !== managementInfo.getReferenceUsrMainPKey()) {
          // call of other user without substitution
          newError = {
            "level" : "warning",
            "objectClass" : "BoCall",
            "simpleProperty" : "substitution",
            "messageID" : "CasClbCallDateFromNotInSubstitutionTimeFrame"
          };
          messageCollector.add(newError);
        }
        return isValid;
      });
    }
    else {
      var isNewCall = function (call) {
        return (call.objectStatus & STATE.NEW) == STATE.NEW;
      };
      var isCallForUnmanagedCustomer = function (call) {
        return call.getIsManagedCustomer() !== "1" && Utils.isCasBackend() || Utils.isSfBackend();
      };
      var isCallOutsideOfSubstitutionTimeframe = function (call) {
        //fix datefrom and cut of the time part to compare only dates
        return (call.getDateFrom().substring(0, 10)) < call.getSubValidFrom() || (call.getDateFrom().substring(0, 10)) > call.getSubValidThru();
      };
      var isSubstitutedCallOutsideOfSubstitutionTimeframe = function (call) {
        return !Utils.isEmptyString(call.getSubstitutedUsrPKey()) && isCallOutsideOfSubstitutionTimeframe(call);
      };
      var isSubstitutedCallForUnmanagedCustomerOutsideOfSubstitutionTimeframe = function (call) {
        return isCallForUnmanagedCustomer(call) && isSubstitutedCallOutsideOfSubstitutionTimeframe(call);
      };

      if (isNewCall(me) && (isSubstitutedCallForUnmanagedCustomerOutsideOfSubstitutionTimeframe(me) || (me.getIsManagedCustomer() == "0" && me.getIsSubstituted() == "0"))) {
        messageCollector.add({
          "level" : "error",
          "objectClass" : "BoCall",
          "messageID" : "CasClbCannotCreateSubstitutedCall"
        });
      }
      if (isNewCall(me) && me.getHasSubstitute() == "1") {
        messageCollector.add({
          "level" : "error",
          "objectClass" : "BoCall",
          "messageID" : "CasClbCannotCreateCallWhileSubstituted"
        });
      }
      promise = when.resolve(isValid);
    }
  }
  else {
    promise = when.resolve(isValid);
  }
}
else {
  promise = when.resolve(isValid);
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}