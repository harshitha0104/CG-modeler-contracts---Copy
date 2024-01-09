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
 * @function getButtonVisibility
 * @this BoTruckLoad
 * @kind businessobject
 * @namespace CORE
 * @param {String} mode
 * @returns visible
 */
function getButtonVisibility(mode){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var visible = false;
var itemTemplate = me.getBoOrderMeta().getLoOrderItemMetas().getMainItemTemplate();
var runningTour = "";

if (Utils.isDefined(ApplicationContext.get('currentTourPKey')))  {
  runningTour = ApplicationContext.get('currentTourPKey');
}

//Show buttons only when a running tour is in context
if (runningTour === me.getTmgMainPKey()) {
  if(!(Utils.isDefined(ApplicationContext.get('currentTourStatus')) &&
       ApplicationContext.get('currentTourStatus').toLowerCase() !== "running")) {

    var nextStates;
    switch (mode) {
      case "ProductCheckOutRelease":
        //Show release button if next state is "released"
        nextStates = me.getBoWorkflow().getNextStatesByStateType(me.getActualStatePKey(), "Released");
        if(Utils.isDefined(nextStates[0])) {
          visible = true;
        }
        if(me.getDocumentType() === "TruckIvcTransferInward" || me.getPhase() == "Canceled") {
          visible = false;
        }
        break;

      case "AddProduct":
        nextStates = me.getBoWorkflow().getNextStatesByStateType(me.getActualStatePKey(), "Released");
        if(Utils.isDefined(nextStates[0])) {
          visible = true;
        }
        //Btn availability based on truck load document template
        if (Utils.isDefined(itemTemplate)) {
          if (itemTemplate.getAddAllowed() === "0" || (itemTemplate.getCreationPlatform() !== "Mobility" && itemTemplate.getCreationPlatform() !== "Both")) {
            visible = false;
          }
        }
        if(me.getPhase() == "Canceled") {
          visible = false;
        }
        break;

      case "ScanProduct":
        nextStates = me.getBoWorkflow().getNextStatesByStateType(me.getActualStatePKey(), "Released");
        if(Utils.isDefined(nextStates[0])) {
          visible = true;
        }
        if (me.getPhase() == "Canceled" || me.getDocumentType() === "TruckIvcTransferInward") {
          visible = false;
        }
        break;

      case "Calculate":
        nextStates = me.getBoWorkflow().getNextStatesByStateType(me.getActualStatePKey(), "Released");
        if(false && CP && Utils.isDefined(nextStates[0]) && me.getBoOrderMeta().getComputePrice() ==="4" && !Utils.isEmptyString(me.getBoOrderMeta().getCndCpCalculationSchemaPKey())){ // TODO: ComplexPricing
          visible = true;
        }
        break;

      case "Settings":
        //Settings menu only displayed if 'Scan Increment' has to be displayed or DocumentType = 'Product Check In'
        if(me.isEditable) {
          visible = true;
        }
        break;

      case "Approve":
        if(me.getDocumentType() == "TruckIvcTransferInward" && me.getPhase() === "Initial") {
          nextStates = me.getBoWorkflow().getNextStatesByStateType(me.getActualStatePKey(), "Released");
          if(Utils.isDefined(nextStates[0])) {
            if(me.getRecipientPKey() == ApplicationContext.get('user').getPKey()) {
              visible = true;
            }
          }
        }
        break;

      case "Reject":
        if(me.getDocumentType() == "TruckIvcTransferInward" && me.getPhase() === "Initial") {
          if(me.getRecipientPKey() == ApplicationContext.get('user').getPKey()) {
            visible = true;
          }
        }
        break;

      case "Confirm":
        if(me.getDocumentType() == "TruckIvcTransferInward" && me.getPhase() == "Initial" && me.getSenderPKey() == ApplicationContext.get('user').getPKey() && Utils.isEmptyString(me.getInwardTransferDocumentPKey())) {
          visible = true;
        }
        break;
    }
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return visible;
}