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
 * @function addQuestion
 * @this BoJobManager
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {String} jobDefMetaPKey
 * @param {String} jobDefMetaText
 * @param {String} dataLength
 * @param {Object} dataType
 * @param {String} toggleId
 * @param {String} pOS
 * @param {String} posId
 * @param {String} jobMetaPKey
 * @param {String} considerMinValue
 * @param {String} minValue
 * @param {String} considerMaxValue
 * @param {String} maxValue
 * @param {String} stepSize
 * @param {DomVariant} defaultValue
 * @param {String} useStepper
 * @param {String} pictureTaking
 */
function addQuestion(jobDefMetaPKey, jobDefMetaText, dataLength, dataType, toggleId, pOS, posId, jobMetaPKey, considerMinValue, minValue, considerMaxValue, maxValue, stepSize, defaultValue, useStepper, pictureTaking){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var currentpos = me.getLoPOS().getItemsByParam({"posId": posId});
var prdPosContentPKey = " ";

if (currentpos.length > 0) {
  prdPosContentPKey = currentpos[0].getPosContentPKey();
}

var questionitem = {
  "pKey": PKey.next(),
  "jobDefinitionListText": Localization.resolve("ClbManualQuestionGroupName"),
  "questionText": jobDefMetaText,
  "dataType": dataType.getId(),
  "dataLength": dataLength,
  "useStepper": useStepper ,
  "toggleId": toggleId,
  "pOS": pOS,
  "manual": "1",
  "posId": posId,
  "bpaMainPKey": me.getBpaMainPKey(),
  "clbMainPKey": me.getClbMainPKey(),
  "jobDefinitionMetaPKey": jobDefMetaPKey,
  "jobListPKey": " ",
  "jobMetaPKey": jobMetaPKey,
  "jobDefinitionPKey": " ",
  "listed": "0",
  "planned": "0",
  "prdMainPKey": " ",
  "clbPOSCheckPKey": posId,
  "prdPOSContentPKey": prdPosContentPKey,
  "lastValue": " ",
  "value" : (Utils.isEmptyString(defaultValue)) ? " ": defaultValue,
  "defaultValue": (Utils.isEmptyString(defaultValue)) ? " ": defaultValue,
  "maxValue": " ",
  "minValue": " ",
  "done": "0",
  "jobActionSuccess": " ",
  "sort": "0",
  "mandatory": "0",
  "mandatoryImageId": "EmptyImage",
  "cameraIcon" : (pictureTaking == "1") ? "CapturePictureIcon" : "EmptyImage",
  "visible" : "1",
  "visitDate": me.getReferenceDate(),
  "visitTime": me.getTimeFrom(),
  "history": " ",
  "targetValue": " ",
  "condition": " ",
  "conditionOperator": " ",
  "conditionAnswers": " ",
  "jobDefListPKey": " ",
  "thresholdViolation": "No",
  "objectStatus": STATE.NEW | STATE.DIRTY
};

if(questionitem.dataType === "Decimal") {
  questionitem.stepSize = stepSize;

  if(considerMinValue) {
    questionitem.considerMinValue = "1";
    questionitem.minValue = minValue;
  }
  else {
    questionitem.considerMinValue = "0";
    questionitem.minValue = "-9999999";
  }

  if(considerMaxValue) {
    questionitem.considerMaxValue = "1";
    questionitem.maxValue = maxValue;
  }
  else {
    questionitem.considerMaxValue = "0";
    questionitem.maxValue = "9999999";
  }
  questionitem.value = "0";
}

if(questionitem.dataType === "Date") {
  questionitem.minValue = minValue;
  questionitem.maxValue = maxValue;
}

me.getLoQuestions().addListItems([questionitem]);
me.getLoQuestions().setCurrent(questionitem);

if (pictureTaking != "1") {
  var aclRights = me.getLoQuestions().getCurrent().getACL();
  aclRights.removeRight(AclObjectType.PROPERTY, "cameraIcon", AclPermission.VISIBLE);
}

var loPOS = me.getLoPOS().getItemsByParam({"posId": posId});
var liPOS = loPOS[0];
liPOS.setQuestionCount(parseInt(liPOS.getQuestionCount(), 10)+1);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}