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
 * @function afterLoadAsync
 * @this BoSysReleaseProcess
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} result
 * @param {Object} context
 * @returns promise
 */
function afterLoadAsync(result, context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var newParams;
if (Utils.isDefined(context.jsonQuery)) {
  newParams = context.jsonQuery;
  if (Utils.isOldParamsFormat(newParams)) {
    newParams = Utils.convertDsParamsOldToNew(newParams);
  }
}
var promise = Facade.getObjectAsync(BO_SYSRELEASEPROCESS, context.jsonQuery).then(
  function(selfJson) {
    context.selfJson = selfJson;
    if (me.beforeInitialize) {
      me.beforeInitialize.apply(me, [context]);
    }
    me.setProperties(selfJson);
    if (me.afterInitialize) {
      me.afterInitialize.apply(me, [context]);
    }
    return BoFactory.loadListAsync(LO_SYSRELEASEPROCESSSTEP, me.getQueryBy("sysReleaseProcessPKey", me.getPKey()));
  }).then(
  function(loSysReleaseProcessStepJson) {
    if (Utils.isDefined(loSysReleaseProcessStepJson)) {
      me.setLoSysReleaseProcessStep(loSysReleaseProcessStepJson);
    }
    else {
      me.setLoSysReleaseProcessStep(null);
    }

    var signatureBlobParams = [];
    var signatureBlobQuery = {};

    signatureBlobParams.push({"field": "referencePKey", "value": newParams.referenceObject.getPKey()});

    if(Utils.isDefined(newParams.phaseFilter) && !Utils.isEmptyString(newParams.phaseFilter)) {

      if (Utils.isSfBackend()) {
        var additionalCondition = " AND ReferenceObjectPhase = #phaseFilter# " ;
        signatureBlobParams.push({"field" : "phaseFilter", "value" : newParams.phaseFilter});
        signatureBlobParams.push({"field": "additionalCondition", "value": additionalCondition});
      }
      else {
        signatureBlobParams.push({"field": "additionalCondition", "value": "AND ReferenceObjectPhase='" + newParams.phaseFilter + "'" });
      }
    }
    signatureBlobQuery.params = signatureBlobParams;
    return BoFactory.loadListAsync(LO_SYSSIGNATUREBLOB, signatureBlobQuery);
  }).then(
  function(loSysSignatureBlobJson) {
    if (Utils.isDefined(loSysSignatureBlobJson)) {
      me.setLoSysSignatureBlob(loSysSignatureBlobJson);
    }
    else {
      me.setLoSysSignatureBlob(null);
    }

    //check mode
    if (Utils.isDefined(newParams.readOnlyMode) && !Utils.isEmptyString(newParams.readOnlyMode)) {
      me.setReadOnlyMode(newParams.readOnlyMode);
    }
    else {
      me.setReadOnlyMode("0");
    }

    if(me.getReadOnlyMode() === "0") {
      //Create empty blobs
      me.createSignatureBlobs();
    }
    else {
      // Map loaded blobs to signatureMediaPath properties
      me.mapLoadedSignatureBlobs();
    }

    var signatureAttributeParams = [];
    var signatureAttributeQuery = {};
    var referencePKey = "";

    if (!Utils.isSfBackend()) {
      referencePKey = newParams.referenceObject.getPKey();
    }
    else {
      if (Utils.isDefined(me.getLoSysSignatureBlob())) {
        var signatureBlobItems = me.getLoSysSignatureBlob().getAllItems();
        if(signatureBlobItems.length > 0) {
          referencePKey = signatureBlobItems[0].getSignaturePKey();
        }
      }
    }

    signatureAttributeParams.push({"field": "referencePKey", "value": referencePKey});

    //Reference object phase is part of signature object in CGCloud.
    if (!Utils.isSfBackend()) {
      if(Utils.isDefined(newParams.phaseFilter) && !Utils.isEmptyString(newParams.phaseFilter)) {
        signatureAttributeParams.push({"field": "additionalCondition", "value": "AND ReferenceObjectPhase='" + newParams.phaseFilter + "'"});
      }
    }

    signatureAttributeQuery.params = signatureAttributeParams;
    return BoFactory.loadListAsync(LO_SYSSIGNATUREATTRIBUTE, signatureAttributeQuery);
  }).then(
  function(loSysSignatureAttributeJson) {
    if (Utils.isDefined(loSysSignatureAttributeJson)) {
      me.setLoSysSignatureAttribute(loSysSignatureAttributeJson);
    }
    else {
      me.setLoSysSignatureAttribute(null);
    }
    me.setObjectStatus(STATE.PERSISTED);
    //Set reference object
    if (Utils.isDefined(newParams.referenceObject)) {
      me.setReferenceObject(newParams.referenceObject);
    }
    //Set EA-Rights
    me.setEARights();
    me.setReleaseInProgress("0");
    return me;
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}