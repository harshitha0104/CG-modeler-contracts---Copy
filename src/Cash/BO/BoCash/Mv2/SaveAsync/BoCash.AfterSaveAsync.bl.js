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
 * @this BoCash
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
    
var deferreds = [];

if (me.isEditable()) {
  deferreds.push(Facade.saveObjectAsync(me));

  if (Utils.isDefined(me.getLoWfeRecentState())) {
    deferreds.push(me.getLoWfeRecentState().saveAsync());
  }

  if (Utils.isDefined(me.getLoPayments())) {
    deferreds.push(me.getLoPayments().saveAsync());
  }

  if (Utils.isDefined(me.getLoInventories())) {
    deferreds.push(me.getLoInventories().saveAsync());
  }

  if (Utils.isDefined(me.getLoInventoryTransactions())) {
    deferreds.push(me.getLoInventoryTransactions().saveAsync());
  }

  if (Utils.isDefined(me.getLoSysSignatureAttribute())) {
    deferreds.push(me.getLoSysSignatureAttribute().saveAsync());
  }

  if (Utils.isDefined(me.getLoSysSignatureBlob())) {
    deferreds.push(me.getLoSysSignatureBlob().saveAsync());
  }

  if (Utils.isDefined(me.getLoGeoLocation())) {
    deferreds.push(Facade.saveListAsync(me.getLoGeoLocation()));
  }
}

var promise = when.all(deferreds).then(
  function () {
    if (me.getValidateForRelease() == "1"  && me.getSetPhaseInBeforeSave() == "1" && me.getOrgPhase() == me.getPhase()) {
      var buttonValues = {};
      buttonValues[Localization.resolve("OK")] = "ok";

      return MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Error"), Localization.resolve("NoResponsibleFoundByWorkflow"), buttonValues).then(
        function () {
          return result;
        }
      );

    } else {

      var syncOption = me.getBoCashMeta().getSyncOptions();

      if (me.getPhase()==="Released" && me.getOrgPhase()!=="Released")
      { 
        if  (syncOption == "Release"|| syncOption == "ReleaseCancel")
        {
          Facade.startBackgroundReplication();
        } 
      }
      else if (me.getPhase()==="Canceled" && me.getOrgPhase()!=="Canceled")
      {
        if  (syncOption == "Cancel"|| syncOption == "ReleaseCancel")
        {
          Facade.startBackgroundReplication();
        } 
      }
      //Reset object status for all to prevent multiple saves
      me.traverse(function(node){
        node.setObjectStatus(STATE.PERSISTED);
        if(node.isList){
          node.getAllItems().forEach(function(item){
            item.setObjectStatus(STATE.PERSISTED);
          });
        }
      },function (a, b, c){});

      return result;
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