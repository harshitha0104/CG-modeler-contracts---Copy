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
 * @function setDeleted
 * @this BoCall
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @returns promise
 */
function setDeleted(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = me.getBoJobManager().loadAndSetPrerequisites("StatusChange_Delete")
.then(function () {
  me.getBoJobManager().getLoCurrentSurveys().delete();
  me.getBoJobManager().getLoPOS().delete();
  me.getBoJobManager().getLoQuestions().delete();
  me.getBoJobManager().getLoMagnetizedJobList().demagnetizeAll();
  // assign surveys to some POS so that the deletion will be saved
  me.getBoJobManager().getLoPOS().getFirstItem().setSurveys(me.getBoJobManager().getLoCurrentSurveys());
  return me.loadOnDemand("Attachments");
}).then(function () {
  if(Utils.isDefined(me.getLoCallAttachments())){
    me.getLoCallAttachments().delete();  
  }
  if(Utils.isDefined(me.getLoAtmAttachment())){
    me.getLoAtmAttachment().delete();  
  }
  return me.loadOnDemand("Assets");
}).then(function () {
  me.getLoCallAssetOverview().delete();
  if (Utils.isDefined(me.getBoUserDailyReport())) {
    if (Utils.isDefined(me.getBoUserDailyReport().getLoUsrTimeEntry())) {
      var timeEntries = me.getBoUserDailyReport().getLoUsrTimeEntry().getItemsByParamArray([{"clbMainPKey" : me.getPKey()}]);
      if (timeEntries.length > 0) {
        var stateNewDirty = STATE.NEW | STATE.DIRTY;
        for (var i = 0; i < timeEntries.length; i++) {
          if (timeEntries[i].getObjectStatus() === stateNewDirty) {
            timeEntries[i].setObjectStatus(0);
          } else {
            timeEntries[i].delete();
          }
        }
      }
    }
    me.getBoUserDailyReport().setObjectStatus(STATE.DIRTY | STATE.PERSISTED);
  }
  me.delete();
});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}