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
 * @function onAssetSurveyChanged
 * @this BoCall
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} handlerParams
 * @returns promise
 */
function onAssetSurveyChanged(handlerParams){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise;
var listItem = handlerParams.listItem;
var Presence = listItem.getPresence();
var varHandlerParams = handlerParams.modified[0];

if (Presence !== "0") {
  listItem.setCreationDate(Utils.createAnsiDateTimeToday());
  listItem.setLatestSurveyDate(listItem.getCreationDate());
} else if (
  Presence === "0" &&
  varHandlerParams !== "presence" &&
  varHandlerParams !== "present" &&
  varHandlerParams !== "latestSurveyDate"
) {
  listItem.setCreationDate(Utils.createAnsiDateTimeToday());
  listItem.setLatestSurveyDate(listItem.getCreationDate());
}
if (
  handlerParams.modified.length > 0 &&
  varHandlerParams === "presence" &&
  Presence === "0"
) {
  listItem.setLatestSurveyDate(listItem.getLatestSurveyDateBackup());
}
if (Presence === "3") {
  listItem
    .getACL()
    .removeRight(AclObjectType.PROPERTY, "presence", AclPermission.EDIT);
}
if (
  Utils.isPhone() &&
  listItem.getSurveyAvailable() === "0" &&
  Presence == "1"
) {
  var luHistSurveyQuery = {};
  luHistSurveyQuery.params = [
    {
      field: "astPKey",
      value: listItem.getPKey(),
    },
    {
      field: "bpaPKey",
      value: me.getBpaMainPKey(),
    },
    {
      field: "clbPKey",
      value: me.getPKey(),
    },
    {
      field: "clbDate",
      value: me.getDateFrom(),
    },
  ];
  me.getLoCallAssetOverview().setCurrentByPKey(listItem.getPKey());
  promise = BoFactory.loadObjectByParamsAsync(
    "LuPreviousSurvey",
    luHistSurveyQuery
  ).then(function (luHistSurveys) {
    me.getLoCallAssetOverview().prepareAstSurveyItem(
      me.getBpaMainPKey(),
      me.getPKey(),
      luHistSurveys
    );
  });
} else {
  promise = when.resolve(me);
}

//Called on Sight button clicked
if (handlerParams.modified.length > 0 && varHandlerParams === "presence") {
  //Register Manual Site
  if (Presence === "0" && listItem.getScanRequired() === "0") {
    listItem.setMethod("M");
    //Below code is not necessary as it's avoids setting back to not sighted
    me.getLoCallAssetOverview().setCurrentByPKey(listItem.getPKey());
  }
  if (Presence !== "3") {
    listItem.setPresence(Presence === "0" || Presence === "2" ? "0" : "1");
  }
  listItem.setPresent(Presence === "0" || Presence === "2" ? "0" : "1");
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}