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
 * @function afterSaveAsync
 * @this BoUserDailyReport
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} result
 * @param {Object} context
 * @returns promise
 */
function afterSaveAsync(result, context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
/*****************************************************************
*  1 CGCloud table / 2 onPrem tables                                *
*                                                                *
*  CGCloud:    -Annotation is directly stored in User_Document__c   *
*  onPrem:  -Separate table for annotation                       *
******************************************************************/
var promise;

if (Utils.isSfBackend()) {
  promise = BoFactory.createObjectAsync("BoSfHelper", {}).then(
    function (helper) {
      return helper.saveTrackedObject(me, [{name: "annotation", dsColumn: "Annotation__c", value: me.getBoUserDRAnnotation().getText()}]);
    }
  );
}
else {
  //Save UsrDoc
  promise = Facade.saveObjectAsync(me).then(
    function () {
      return true;
    }
  );
}

//Resolve all promisises - Workaround for TQ Save.
promise = promise.then(
  function (boWasSaved) {
    var promises = [];
    if (boWasSaved) {
      me.setObjectStatus(STATE.PERSISTED);

      // Save UsrDocActivity
      if (Utils.isDefined(me.getLoUsrDRActivity())) {
        promises.push(me.getLoUsrDRActivity().saveAsync());
      }

      //Recent state and time entries not supported
      if (!Utils.isSfBackend()) {
        // Save UsrAnnotation 
        // In SF case an annotation is saved directly to Daily Report
        if (Utils.isDefined(me.getBoUserDRAnnotation())) {
          promises.push(me.getBoUserDRAnnotation().saveAsync());
        }

        // Save UsrDrRecentState
        if (Utils.isDefined(me.getLoUserDRRecentState())) {
          promises.push(me.getLoUserDRRecentState().saveAsync());
        }

        // Save UsrTimeEntries
        if (Utils.isDefined(me.getLoUsrTimeEntry())) {
          promises.push(me.getLoUsrTimeEntry().saveAsync());
        }
      }
    }

    return when.all(promises).then(
      function () {
        //Reset object status for all to prevent multiple saves
        me.traverse(function(node){
          node.setObjectStatus(STATE.PERSISTED);
          if(node.isList) {
            node.getAllItems().forEach(function(item){
              item.setObjectStatus(STATE.PERSISTED);
            });
          }
        },function (a, b, c){});
      }
    );
  }
);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}