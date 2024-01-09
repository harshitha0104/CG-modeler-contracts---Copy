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
 * @function beforeLoadAsync
 * @this LoTruckLoadOverview
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} context
 * @returns promise
 */
function beforeLoadAsync(context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
if (Utils.isDefined(context.jsonQuery)) {
  var newParams = context.jsonQuery;
  if (Utils.isOldParamsFormat(newParams)) {
    newParams = Utils.convertDsParamsOldToNew(newParams);
  }

  if (!Utils.isDefined(newParams.tmgMainPKey) &&
      Utils.isDefined(ApplicationContext.get('currentTourPKey')) &&
      !Utils.isEmptyString(ApplicationContext.get('currentTourPKey'))) {
    newParams.tmgMainPKey = ApplicationContext.get('currentTourPKey');
  }

  var usrMainPKey = ApplicationContext.get('user').getPKey();
  newParams.usrMainPKey = usrMainPKey;
  context.jsonQuery = newParams;
}

var lookupMetaText;
var promise = BoFactory.loadObjectByParamsAsync("LuInventoryMetaText", context.jsonQuery).then(
  function (luInventoryMetaText) {
    lookupMetaText = luInventoryMetaText;
    return Facade.getListAsync("LoTruckLoadOverview", context.jsonQuery);
  }).then(
  function (loTruckLoadOverview) {
    for (var i = 0; i < loTruckLoadOverview.length; i++) {
      var item = loTruckLoadOverview[i];

      if (item.phase === "Released" || item.phase === "Initial" || item.phase === "Canceled") {
        var releaseTime = item.releaseTime;
        var user = ApplicationContext.get('user');
        if (item.phase === "Initial") {
          item.releaseTime = ' ';
        }        else if ((item.phase === "Released" && item.recipientPKey === user.getPKey() && item.documentType != "TruckIvcTransferInward") || (item.phase === "Canceled" && item.senderPKey === user.getPKey() && item.documentType == "TruckIvcTransferInward")) {
          item.releaseTime = ' ';
          item.documentId = ' ';
          if (Utils.isDefined(lookupMetaText)) {
            item.metaText = lookupMetaText.getMetaText();
          } else {
            item.metaText = "";
          }
          item.phase = 'Initial';
        } else {
          if (item.releaseTime === Utils.getMinDate() || item.releaseTime == " ") {
            item.releaseTime = ' ';
          } else {
            item.releaseTime = Localization.localize(releaseTime, 'date');
            item.releaseTime1 = Localization.localize(releaseTime, 'time');
          }
        }
      } else {
        item.releaseTime = ' ';
      }
    }

    me.addItems(loTruckLoadOverview, context.jsonQuery.params);
    me.orderBy({
      "sortOrder": "ASC",
      "sortReleaseTime": "DESC",
      "documentId": "DESC"
    });
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}