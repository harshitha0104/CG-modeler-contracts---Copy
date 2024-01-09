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
 * @function cpAttachDebugJSON
 * @this BoTruckLoad
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {Object} DebugJSON
 * @returns promise
 */
function cpAttachDebugJSON(DebugJSON){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = when.resolve(me);

if (Utils.isDefined(DebugJSON)) {
  var fileType = "json";
  var compressed = false;
  if (Utils.isSfBackend()) {
    compressed = true;
    fileType = "zip";
  }

  var curDate = Utils.createDateNow();
  var dateExtension =
      "_" +
      (curDate.getUTCMonth() + 1) +
      "_" +
      curDate.getUTCDate() +
      "_" +
      curDate.getUTCFullYear();
  var loadLoAttachmentsPromise = when.resolve();

  if (!Utils.isDefined(me.getLoOrderAttachment())) {
    loadLoAttachmentsPromise = BoFactory.loadObjectByParamsAsync(
      LO_ORDERATTACHMENT,
      me.getQueryBy("sdoMainPKey", me.getPKey())
    ).then(function (loAttachments) {
      me.setLoOrderAttachment(loAttachments);
    });
  }

  promise = loadLoAttachmentsPromise.then(function() {
    return Facade.saveJSONFileAsync(DebugJSON, compressed).then(function(mediaPath) {
      var items = me.getLoOrderAttachment().getItemsByParam({
        usage: "Pricing",
      });

      if (items.length > 0) {
        items[0].setType(fileType);
        items[0].setMediapath(mediaPath);
        items[0].setCreationDate(Utils.createAnsiDateTimeNow());
        items[0].setFileName("Pricing_" + me.getPKey() + dateExtension + "." + fileType);
      }
      else {
        var liNewAttachment = {
          pKey: PKey.next(),
          sdoMainPKey: me.getPKey(),
          attachmentBlobPKey: PKey.next(),
          attachmentTextPKey: PKey.next(),
          usage: "Pricing",
          attachmentText: "Pricing",
          type: fileType,
          fileName: "Pricing_" + me.getPKey() + dateExtension + "." + fileType,
          mediapath: mediaPath,
          creationDate: Utils.convertDate2Ansi(curDate),
          objectStatus: STATE.NEW | STATE.DIRTY,
        };
        me.getLoOrderAttachment().addListItems([liNewAttachment]);
      }
    });
  });
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}