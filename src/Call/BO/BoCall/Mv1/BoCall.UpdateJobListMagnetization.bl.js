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
 * @function updateJobListMagnetization
 * @this BoCall
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @returns promise
 */
function updateJobListMagnetization(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var loadType = "Magnetization";
var callDateChangedAfterLoad = me.getBoJobManager().getCallDateChangedAfterLoad() == "1";
if (callDateChangedAfterLoad) {
  loadType = "Remagnetization";
}

var promise = me.getBoJobManager().loadAndSetPrerequisites(loadType).then(
  function () {
    var loMagnetizedJobLists = me.getBoJobManager().getLoMagnetizedJobList().getAllItems();
    var idxJobList;
    var liMagnetizedJobList;
    var invalid = false;
    var jobInfoUpdated = false;
    var callCompletion = me.getClbStatus() === "Completed" && me.getOriginalClbStatus() !== "Completed" ? "1" : "0";

    for (idxJobList = 0; idxJobList < loMagnetizedJobLists.length; idxJobList++) {
      liMagnetizedJobList = loMagnetizedJobLists[idxJobList];
      if (callDateChangedAfterLoad) {
        // check whether joblist have become invalid due to date changes
        var dateFrom = Utils.convertDate2Ansi(me.getDateFrom());
        if (!(liMagnetizedJobList.getValidFrom() <= dateFrom && liMagnetizedJobList.getValidThru() >= dateFrom)) {
          if (!jobInfoUpdated) {
            me.getBoJobManager().getLoMagnetizedJobList().updateJobInfo(me.getBoJobManager());
            jobInfoUpdated = true;
          }
          invalid = liMagnetizedJobList.getJobExists() === "0";
        } else {
          invalid = false;
        }
      }
      if (liMagnetizedJobList.getDemagnetizeOnSave() == "1" || invalid) {
        liMagnetizedJobList.setClbMainPKey(" ");
      } else if (liMagnetizedJobList.getMagnetizeOnSave() == "1" || callCompletion == "1") {
        liMagnetizedJobList.setDone(callCompletion);
        liMagnetizedJobList.setClbMainPKey(me.getPKey());
      } else {
        liMagnetizedJobList.setObjectStatus(STATE.PERSISTED);
      }
    }
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}