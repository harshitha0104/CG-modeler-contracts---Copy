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
 * @function checkButtonVisibility
 * @this BoUserDailyReport
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {String} mode
 * @returns visible
 */
function checkButtonVisibility(mode){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var visible = false;
var isResponsible = false;
var nextStates;

// Check if current user is responsible
if (me.getResponsiblePKey() === ApplicationContext.get('user').getPKey()) {
  isResponsible = true;
}

if (!(me.getBoUserDocMeta().getMobilityRelevant() === "0" || me.getPhase().toLowerCase() === "approved")) {
  switch (mode) {

      //Detail Flyout Done-Button
    case "detailDone":
      if(me.getPhase().toLowerCase() !== "approved" && me.getPhase().toLowerCase() !== "released" && isResponsible) {
        visible = true;
      }
      break;

      // Execute Break Button for initial time cards
    case "break":
      if(!(me.getBoUserDocMeta().getUiGroup() !== "TimeCard" ||
           !Utils.isDefined(ApplicationContext.get("openTimeCardPKey")) ||
           Utils.isEmptyString(ApplicationContext.get("openTimeCardPKey")) ||
           me.getPhase().toLowerCase() !== "initial" ||
           Utils.isEmptyString(me.getBoUserDocMeta().getBreakUsrTimeEntryMetaPKey()) || !isResponsible)) {
        visible = true;
      }
      break;

      // Check if manual time card creation is allowed
      // 1: If there is already an open time card for the current user (UsrDailyReport.Phase = 'Initial', UsrDailyReport.ResponsiblePKey = current user) no second running time card can be created
      // 2: If the user has role 'Tour User', manual time card creation is not available (the time card will be created via tour).
    case "add":
      if(!((Utils.isDefined(ApplicationContext.get("openTimeCardPKey")) &&
            !Utils.isEmptyString(ApplicationContext.get("openTimeCardPKey"))) ||
           ApplicationContext.get('user').hasRole('TourUser'))) {
        visible = true;
      }
      break;

    case "approveAll":
      if(ApplicationContext.get('user').getIsSupervisor() == "1") {
        visible = true;
      }
      break;

    case "update":
      if(me.getBoUserDocMeta().getUiGroup()!=="TimeCard" && ((me.getPhase().toLowerCase() === "initial"|| me.getPhase().toLowerCase() === "correction") && isResponsible)) {
        visible = true;
      }
      break;

    case "release":
      nextStates = me.getBoWorkflow().getNextStatesByStateType(me.getActualStatePKey(), "Released");
      if(Utils.isDefined(nextStates[0]) && isResponsible) {
        visible = true;
      }
      // Manual Release should not be possible if TimeCard is created
      // automatically within the tour

      if(me.getBoUserDocMeta().getUiGroup() === "TimeCard" && Utils.isDefined(me.getLoUsrTimeEntry())) {
        var tourPKey = me.getLoUsrTimeEntry().getItemsByParamArray([{"tmgTourPKey": " ", "op":"NE"}]);
        if (tourPKey.length > 0) {
          visible =  false;
        }
      }
      break;

    case "reject":
      // Note: Reject is internally mapped to correction
      nextStates = me.getBoWorkflow().getNextStatesByStateType(me.getActualStatePKey(), "Correction");
      if(Utils.isDefined(nextStates[0]) && isResponsible) {
        visible = true;
      }
      break;

    case "approve":
      nextStates = me.getBoWorkflow().getNextStatesByStateType(me.getActualStatePKey(), "Approved");
      if(Utils.isDefined(nextStates[0]) && isResponsible) {
        visible = true;
      }
      break;
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return visible;
}