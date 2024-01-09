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
 * @function prepareAstSurveyItem
 * @this LoCallAssetOverview
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {String} bpaCustomerPKey
 * @param {String} clbMainPKey
 * @param {LuPreviousSurvey} previousSurvey
 */
function prepareAstSurveyItem(bpaCustomerPKey, clbMainPKey, previousSurvey){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var currentUserPKey = ApplicationContext.get("user").getPKey();

var oldItem = me.getCurrent();
var currentItem = me.getCurrent();
if (currentItem && Utils.isDefined(currentItem)) {
  var status = currentItem.getObjectStatus();

  //prevent the change handler from triggering
  me.suspendListRefresh();

  currentItem.beginEdit();

  //Set historical d//ata
  if (
    currentItem.getAssetPKey() != " " &&
    Utils.isDefined(previousSurvey) &&
    !Utils.isEmptyString(previousSurvey.getPKey())
  ) {
    currentItem.setUsageHist(previousSurvey.getUsage());
    currentItem.setLocationHist(previousSurvey.getLocation());
    currentItem.setLocationRatingHist(previousSurvey.getLocationRating());
    currentItem.setConditionHist(previousSurvey.getCondition());
    currentItem.setNoteHist(previousSurvey.getNote());
    currentItem.setMethod(previousSurvey.getMethod());
  } else {
    currentItem.setUsageHist(" ");
    currentItem.setLocationHist(" ");
    currentItem.setLocationRatingHist(" ");
    currentItem.setConditionHist(" ");
    currentItem.setNoteHist(" ");
  }

  //Resetting the original Status of the item.
  currentItem.setObjectStatus(status);

  //Check if survey has to be created
  if (currentItem.getSurveyAvailable() === "0") {
    //Get new PKey for the Survey whose record we are creating here.
    // currentItem.setPKey(PKey.next());
    currentItem.setSurveyAvailable("1");
    currentItem.setClbMainPKey(clbMainPKey);
    currentItem.setCreationDate(Utils.createAnsiDateTimeToday());
    currentItem.setUsrUserPKey(currentUserPKey);
    currentItem.setAstSurveySerialNumber(currentItem.getSerialNumber());
    currentItem.setAstSurveyAstAssetPKey(currentItem.getAssetPKey());

    //prepopulate with previous survey data
    if (
      currentItem.getAssetPKey() != " " &&
      Utils.isDefined(previousSurvey) &&
      !Utils.isEmptyString(previousSurvey.getPKey())
    ) {
      currentItem.setUsage(previousSurvey.getUsage());
      currentItem.setLocation(previousSurvey.getLocation());
      currentItem.setLocationRating(previousSurvey.getLocationRating());
      currentItem.setCondition(previousSurvey.getCondition());
    }

    currentItem.setNote(" ");
    currentItem.setBpaCustomerPKey(bpaCustomerPKey);
    currentItem.setIsNewSurvey("1");

    //set state to new (so that it is not saved until the user changes something)
    if (currentItem.getPresent() == "1") {
      currentItem.setObjectStatus(STATE.NEW | STATE.DIRTY);
    } else {
      currentItem.setObjectStatus(STATE.NEW);
    }
    //reorder the list when an unregistered asset is added
    if (currentItem.getRegisteredAsset() == "0") {
      me.orderBy({ registeredAsset: "DESC", astSurveySerialNumber: "ASC" });
    }
  }
  currentItem.endEdit();

  //prevent the change handler from triggering
  me.resumeListRefresh(true);

  //Highlight asset
  me.setCurrent(currentItem);
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}