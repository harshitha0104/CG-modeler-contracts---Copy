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
 * @function getCreateCashButtonVisibility
 * @this LoCashOverview
 * @kind listobject
 * @namespace CORE
 * @param {String} mode
 * @returns visible
 */
function getCreateCashButtonVisibility(mode){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var visible = false;
var isTourRunning = false;
var navigation = "";
var listActiveObjectRelations;
var currentTour = "";
var runningTour = "";
var endOfDayPossible = "";
var items;
var i;

if (Utils.isDefined(ApplicationContext.get('currentTourPKey'))){
  runningTour = ApplicationContext.get('currentTourPKey');
}

//Reading endOfDayPossible variable value returned from DSDDashboardProcess includes the check on open Call/ Sales / Not related doc
if (Utils.isDefined(ApplicationContext.get('endOfDayPossible'))){
  endOfDayPossible = ApplicationContext.get('endOfDayPossible');
}

if (Utils.isDefined(Framework.getProcessContext().currentTourPKey)){
  currentTour = Framework.getProcessContext().currentTourPKey;
  if((currentTour !== runningTour) || (Utils.isEmptyString(currentTour) && Utils.isEmptyString(runningTour))){
    return false;
  }
}

//Available object relations for running tour
if (Utils.isDefined(Framework.getProcessContext().activeObjectRelations)){
  listActiveObjectRelations = Framework.getProcessContext().activeObjectRelations;
}

if(Utils.isDefined(ApplicationContext.get("currentTourPKey")) &&
   ApplicationContext.get("currentTourStatus") === "Running") {
  isTourRunning = true;
}
else {
  return false;
}

if (Utils.isDefined(Framework.getProcessContext().navigationMode)) {
  navigation = Framework.getProcessContext().navigationMode;
}

switch (mode) {
    //CheckOut
  case "checkOut":
    if(isTourRunning && (navigation === "StartOfDay")) {
      //Initial check out document exists --> check out button opens it
      if (me.getAllItems().length > 0) {
        items = me.getAllItems();
        for (i = 0; i < items.length; i++) {
          if (items[i].getDocumentType() === "CashCheckOut" && items[i].getPhase() === "Initial" && items[i].getUsedForStartOfDay() == "1") {
            visible = true;
            break;
          }
        }
      }

      //There exists at least one check-out template related to the running tour
      if (!visible && Utils.isDefined(listActiveObjectRelations) && listActiveObjectRelations.getAllItems().length > 0) {
        items = listActiveObjectRelations.getAllItems();

        for (i = 0; i < items.length; i++) {
          if (items[i].getUsage() === "SdoMeta.CashCheckOut" && items[i].getUsedForStartOfDay() == "1") {
            visible = true;
            break;
          }
        }
      }
    }
    break;

    //CheckIn
  case "checkIn":
    if(isTourRunning && (navigation === "EndOfDay")) {
      //Initial check in document exists --> check out button opens it
      if (me.getAllItems().length > 0) {
        items = me.getAllItems();
        for (i = 0; i < items.length; i++) {
          if (items[i].getDocumentType() === "CashCheckIn" && items[i].getPhase() === "Initial" && items[i].getUsedForEndOfDay() == "1") {
            visible = true;
            break;
          }
        }
      }

      //There exists at least one check-in template related to the running tour
      if (!visible && Utils.isDefined(listActiveObjectRelations) && listActiveObjectRelations.getAllItems().length > 0) {
        items = listActiveObjectRelations.getAllItems();

        for (i = 0; i < items.length; i++) {
          if (items[i].getUsage() === "SdoMeta.CashCheckIn" && items[i].getUsedForEndOfDay() == "1") {
            visible = true;
            break;
          }
        }
      }
      //There exists at least one open Call/ Sales / Not related doc
      if(endOfDayPossible == '0') {
        visible = false;
      }
    }
    break;
    //New Document
  case "New":
    if(isTourRunning && (navigation === "Overview"))  {

      //There exists at least one Truck Load template related to the running tour
      if (!visible && Utils.isDefined(listActiveObjectRelations) && listActiveObjectRelations.getAllItems().length > 0) {
        items = listActiveObjectRelations.getAllItems();

        for (i = 0; i < items.length; i++) {
          if ((items[i].getUsage() === "SdoMeta.CashCheckIn" || items[i].getUsage() === "SdoMeta.CashCheckOut") &&
              (items[i].getUsedForStartOfDay() === "0" && items[i].getUsedForEndOfDay() === "0")) {
            visible = true;
            break;
          }
        }
      }
    }
    break;
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return visible;
}