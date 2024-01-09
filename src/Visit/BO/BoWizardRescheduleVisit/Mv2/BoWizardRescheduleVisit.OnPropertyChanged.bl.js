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
 * @function onPropertyChanged
 * @this BoWizardRescheduleVisit
 * @kind businessobject
 * @namespace CORE
 * @param {Object} handlerParams
 */
function onPropertyChanged(handlerParams){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
//if any of the fields has currently been set to nothing, duration calculation can't be executed, will always result in 0
if(handlerParams.newValue!==null && handlerParams.newValue!==""){
  //read old values from object
  var currentTimeFrom = me.getTimeFrom();
  var currentTimeThru = me.getTimeThru();
  //depending if date is still initial or changed earlier, it might have "00:00:00" added or not; substring will lead ensure ansi date without time portion; it can also be null from earlier clearance
  var currentDateFrom = me.getDateFrom()===null ? null : me.getDateFrom().substring(0,10);
  var currentDateThru = me.getDateThru()===null ? null : me.getDateThru().substring(0,10);

  //depending on changed field, read that value from handlerParams; note that date fields from date picker are returned as "yyyy-mm-dd 00:00:00", so they have to be converted to "yyyy-mm-dd"
  if(handlerParams.simpleProperty === "timeFrom"){
    var currentTimeFrom = handlerParams.newValue;
  }else if(handlerParams.simpleProperty === "timeThru"){
    var currentTimeThru = handlerParams.newValue;
  }else if(handlerParams.simpleProperty === "dateFrom"){
    var currentDateFrom = Utils.convertAnsiDateTime2AnsiDate(handlerParams.newValue);
  }else if(handlerParams.simpleProperty === "dateThru"){
    var currentDateThru = Utils.convertAnsiDateTime2AnsiDate(handlerParams.newValue);
  }
  
  //it could be that two or more fields have been empty, and only one has been refilled again - so this check is needed; if one value is empty or null, duration calculation can't be executed, will always result in 0
  if(currentDateFrom===null || currentTimeFrom==="" || currentDateThru===null || currentTimeThru===""){
    me.setDuration(0);
  }else{
    //check if Begin is < than End (note: since we have ANSI only, comparison via String concat should be working fine)
    if(currentDateFrom + currentTimeFrom < currentDateThru + currentTimeThru){
      var timeDifference = me.getBoVisit().getCallDuration(currentDateFrom, currentTimeFrom, currentDateThru, currentTimeThru);
      me.setDuration(timeDifference);
    }else{
      me.setDuration(0);
    }
  }
}else{
  me.setDuration(0);
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}