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
 * @function loadOnDemand
 * @this BoCall
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {String} loadMode
 * @returns promise
 */
function loadOnDemand(loadMode){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = when.resolve(me);
var callParams = [];
var callQuery = {};

if (loadMode === "Attachments" && !Utils.isDefined(me.getLoCallAttachments())) {

  var callJobRestriction;
  if (me.getLuCallMeta().getConsiderPOSCheck() == "0") {
    callJobRestriction = " AND Visit_Job__c.POS__c = ' ' ";
  }
  else {
    callJobRestriction = " AND 1=1 ";
  }
  callQuery.params = callParams;

  callParams.push({
    "field" : "callPKey",
    "value" : me.getPKey()
  });

  callParams.push({
    "field" : "referencePKey",
    "value" : me.getPKey()
  });

  callParams.push({
    "field" : "referencePKeyComp",
    "value" : "EQ"
  });

  callParams.push({
    "field" : "callJobRestriction",
    "value" :  callJobRestriction
  });

  promise = BoFactory.loadListAsync("LoCallAttachments", callQuery).then(function (callAttachmentList) {
    me.setObjectStatusFrozen(true);
    me.setLoCallAttachments(callAttachmentList);
    me.setObjectStatusFrozen(false);
    return BoFactory.loadListAsync("LoAtmAttachment", callQuery);
  }).then(function(atmList) {
    me.setObjectStatusFrozen(true);
    me.setLoAtmAttachment(atmList);
    me.setObjectStatusFrozen(false);
    return me;
  });

}
else if (loadMode === "Assets" && !Utils.isDefined(me.getLoCallAssetOverview())) {

  callQuery.params = callParams;
  callParams.push({
    "field" : "customerPKey",
    "value" : me.getBpaMainPKey()
  });
  callParams.push({
    "field" : "clbPKey",
    "value" : me.getPKey()
  });
  callParams.push({
    "field" : "clbDate",
    "value" : me.getDateFrom()
  });

  promise = BoFactory.loadObjectByParamsAsync(LO_CALLASSETOVERVIEW, callQuery)
    .then(function (loAssetOverview) {
    me.setLoCallAssetOverview(loAssetOverview);
    me.addItemChangedEventListener('loCallAssetOverview', me.onAssetSurveyChanged);
    return me;
  });
}
else if (loadMode === "Assets" && Utils.isDefined(me.getLoCallAssetOverview())) {

  var existingitems = me.getLoCallAssetOverview().getItemObjects();
  if (existingitems.length > 0) {
    me.getLoCallAssetOverview().setCurrentByPKey(existingitems[0].getPKey());
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}