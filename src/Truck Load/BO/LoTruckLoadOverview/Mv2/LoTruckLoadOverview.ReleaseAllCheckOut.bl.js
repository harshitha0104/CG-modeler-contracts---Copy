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
 * @function releaseAllCheckOut
 * @this LoTruckLoadOverview
 * @kind listobject
 * @async
 * @namespace CORE
 * @param {LoTruckLoadOverview} checkOutItems
 * @returns promise
 */
function releaseAllCheckOut(checkOutItems){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var messageCollector;
var iErrorCount = 0;
var invActions;
var iLoopCounter = -1;

var truckLoadActions = [];

//function which executed the check out actions for the documents
invActions = function (truckLoadPKey) {
  iLoopCounter++;
  var currentPKey = truckLoadPKey[iLoopCounter];

  messageCollector = new MessageCollector();

  return BoFactory.loadObjectByParamsAsync("BoTruckLoad", { "pKey": currentPKey, "mode": "Express" }).then(
    function (boTruckLoad) {
      AppLog.log("Execute CheckOut: " + currentPKey + " loaded!");
      boTruckLoad.setReleaseTriggered("1");
      boTruckLoad.setValidateInventories("1");
      return boTruckLoad.doValidateAsync(messageCollector).then(
        function () {
          if (messageCollector.containsNoErrors()) {
            return boTruckLoad.setNextWorkflowState("release").then(
              function () {
                boTruckLoad.setActualPrdCheckOutType("Express");
                boTruckLoad.setObjectStatus(this.self.STATE_DIRTY);

                return boTruckLoad.saveAsync();
              }).then(
              function () {
                AppLog.log("Execute CheckOut: " + currentPKey + " released!");
              }
            );
          } else {
            iErrorCount++;
          }
        }
      );
    }
  );
};

BusyIndicator.show();
Facade.startTransaction();
var functions = [];
var seqence_arguments = [];

if (Utils.isDefined(checkOutItems)) {
  for (var i = 0; i < checkOutItems.length; i++) {
    functions.push(invActions);
    seqence_arguments.push(checkOutItems[i].getPKey());
  }
}

//Calling inventory actions in a sequence ... item n+1 should be executed if item n is finished
//That's necessary because complex pricing engine is implemented as a Singleton
var promise = when_sequence(functions, seqence_arguments).then(
  function () {
    return Facade.commitTransaction();
  }).then(
  function () {
    BusyIndicator.hide();
    if (iErrorCount > 0) {
      var buttonValues = {};
      var message;
      buttonValues[Localization.resolve("OK")] = "ok";
      var messageParams = {};
      messageParams.ErrorCount = iErrorCount;

      if (iErrorCount > 1) {
        message = "CasExpressCheckOutNotification";
      } else {
        message = "CasExpressCheckOutNotificationForSingleDocument";
      }

      return MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Notification"), MessageStore.getMessage("BoTruckLoad", message, messageParams), buttonValues);
    }
  }
);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}