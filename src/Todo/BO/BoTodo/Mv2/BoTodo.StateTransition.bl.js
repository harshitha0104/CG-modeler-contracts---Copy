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
 * @function stateTransition
 * @this BoTodo
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {String} stateType
 * @returns promise
 */
function stateTransition(stateType){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = when.resolve();
//SF/CASDIF: no workflow for salesforce that why we emulate it
if(!Utils.isSfBackend()) {
  var boWorkflow = me.getBoWorkflow();
  var nextStates = boWorkflow.getNextStatesByStateType(me.getActualStatePKey(), stateType);
  var nextState;
  if (Utils.isDefined(nextStates) && (nextStates.length > 0)) {
    nextState = nextStates[0];
    //Set new responsible
    promise = boWorkflow.getNextResponsible(nextState.getPKey(), me.getResponsiblePKey(), me.getOwnerPKey()).then(
      function (nextResponsible) {
        if (Utils.isDefined(nextResponsible)) {
          //Transition to next State
          me.setNextStatePKey(nextState.getPKey());
          me.setResponsiblePKey(nextResponsible);
          if (boWorkflow.getRecentStatePolicy() == "1") {
            //Recent State History Code
            var newDate = Utils.createDateNow();
            newDate.setHours(0, 0, 0, 0);
            /* <!-- CW-REQUIRED: LI instantiation --> */
            var liRecentState = {
              "pKey": PKey.next(),
              "svcTodoPKey": me.getPKey(),
              "usrMainPKey": ApplicationContext.get('user').getPKey(),
              "wfeStatePKey": me.getActualStatePKey(),
              "salesOrg": me.getSalesOrg(),
              "done": newDate,
              "objectStatus": STATE.NEW | STATE.DIRTY
            };
            me.getLoRecentState().addListItems([liRecentState]);
          }
          me.setIssuePhase(stateType);
          //Finish transition
          me.setActualStatePKey(nextState.getPKey());
          me.setEARights();
        } else {
          var buttonValues = {};
          buttonValues[Localization.resolve("OK")] = "ok";
          promise = MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Error"), Localization.resolve("NoResponsibleFoundByWorkflow"), buttonValues);
        }
      });
  }
}
else {
  me.setIssuePhase(stateType);
  me.setResponsiblePKey(me.getOwnerPKey());
  me.setEARights();
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}