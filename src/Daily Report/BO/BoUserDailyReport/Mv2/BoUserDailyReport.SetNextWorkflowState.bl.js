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
 * @function setNextWorkflowState
 * @this BoUserDailyReport
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {String} actionName
 * @returns promise
 */
function setNextWorkflowState(actionName){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise;
var nextStates = [];

switch (actionName){
  case "Release":
    nextStates = me.getBoWorkflow().getNextStatesByStateType(me.getActualStatePKey(), "Released");
    break;
  case "Approve":
    nextStates = me.getBoWorkflow().getNextStatesByStateType(me.getActualStatePKey(), "Approved");
    break;  
  case "Reject":
    nextStates = me.getBoWorkflow().getNextStatesByStateType(me.getActualStatePKey(), "Correction");
    break;     
}

if(me.getBoWorkflow().getRecentStatePolicy() == "1"){
  me.getLoUserDRRecentState().addRecentState(me.getPKey(), me.getActualStatePKey(), me.getResponsiblePKey());    
}

if(Utils.isDefined(nextStates[0])){
  me.setActualStatePKey(nextStates[0].getPKey());
  me.setNextStatePKey(me.getActualStatePKey());
  switch(nextStates[0].getStateType()){
    case "Released":
      var origPhase = me.getPhase();
      me.setPhase("Released");

      //Time Card: close WorkingTime Time Entry:
      if(me.getBoUserDocMeta().getUiGroup()==="TimeCard"){

        ApplicationContext.set('openTimeCardPKey', "");
        ApplicationContext.set('openTimeCardBreakMetaPKey', "");

        if(origPhase!=="Correction"){
          var loTimeEntries = me.getLoUsrTimeEntry().getItemsByParamArray([{"usrTimeEntryMetaPKey":  me.getBoUserDocMeta().getWorkUsrTimeEntryMetaPKey()}]);
          for(var idxloTimeEntries = 0; idxloTimeEntries < loTimeEntries.length;  idxloTimeEntries++){
            if (loTimeEntries[idxloTimeEntries].getSystemTimeThru() == Utils.getMinDate()){
              var now = Utils.createDateNow();
              me.closeTimeEntry(loTimeEntries[idxloTimeEntries].getPKey(), false);
              TM.clear();
            }
          }
        }
        me.calculateTotalActivityDuration();

      }

      //Workaround for mapping released --> forapproval
      if(Utils.isSfBackend()) // <!-- CW-REQUIRED: Framework is now Utils -->
      {
        nextStates[0].setPKey("ForApproval");
      }

      break;
    case "Approved":
      me.setPhase("Approved");
      break;
    case "Correction":
      me.setPhase("Correction");
      break;
  }

  promise = me.getBoWorkflow().getNextResponsible(nextStates[0].getPKey(), me.getResponsiblePKey(), me.getOwnerUsrMainPKey()).then(
    function (respPKey) {
      if(me.getResponsiblePKey() != respPKey) {
        me.setResponsiblePKey(respPKey);

        return BoFactory.loadObjectByParamsAsync(LU_USER, me.getQueryBy("pKey", respPKey)).then(
          function (luUser){
            me.setResponsible(luUser.getName());

            //Update list item of daily report overview list
            if(Utils.isDefined(Framework.getProcessContext().dailyReportList)){
              if(Utils.isDefined(Framework.getProcessContext().dailyReportList.getCurrent())){
                Framework.getProcessContext().dailyReportList.getCurrent().setPhase(me.getPhase());
              }
            }

            //refresh EA rights for button visibility and detail area
            me.setEARights();
            BindingUtils.refreshEARights();
            return me;
          }
        );

      } else {
        //Update list item of daily report overview list
        if(Utils.isDefined(Framework.getProcessContext().dailyReportList.getCurrent())){
          Framework.getProcessContext().dailyReportList.getCurrent().setPhase(me.getPhase());
        }

        //refresh EA rights for button visibility and detail area
        me.setEARights();
        BindingUtils.refreshEARights();
        return me;
      }
    }
  );
} else {
  promise = when.resolve(); 
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}