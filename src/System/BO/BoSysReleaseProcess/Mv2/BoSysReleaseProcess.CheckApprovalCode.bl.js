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
 * @function checkApprovalCode
 * @this BoSysReleaseProcess
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {String} eventId
 * @returns promise
 */
function checkApprovalCode(eventId){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = when.resolve();
// Get number of step to check from event id
var splitResult = eventId.split("_");
if (splitResult.length > 1) {
  var stepNumber = splitResult[1];

  if (me.get("signatureApprovalSuccessful" + stepNumber) !== "1") {
    // Get signature step meta data
    var stepItems = me.getLoSysReleaseProcessStep().getAllItems();

    if (stepItems.length > stepNumber - 1) {
      var stepItem = stepItems[stepNumber - 1];

      var id = me.get("signatureId" + stepNumber);
      var code = me.get("signatureCode" + stepNumber);
      var usrRoleId = stepItem.getUsrRoleId();
      var etpWarehousePKey = me.getReferenceObject().getEtpWarehousePKey();

      if (Utils.isEmptyString(id) || Utils.isEmptyString(code)) {
        var buttonValues = {};
        buttonValues[Localization.resolve("OK")] = "ok";

        promise = Framework.displayMessage(Localization.resolve("MessageBox_Title_Validation"), Localization.resolve("ReleaseProcess_ApprovalCodeMissing"), buttonValues);
      } 
      else {
        // Check entered information
        code = Utils.sha256(code);

        var params = [];
        var jsonQuery = {};

        params.push({
          "field" : "id",
          "value" : id
        });
        params.push({
          "field" : "code",
          "value" : code
        });
        params.push({
          "field" : "usrRoleId",
          "value" : usrRoleId
        });
        params.push({
          "field" : "etpWarehousePKey",
          "value" : etpWarehousePKey
        });

        jsonQuery.params = params;

        promise = BoFactory.loadObjectByParamsAsync("LuUserApprovalCode", jsonQuery)
          .then(function (lookup) {
          if (!Utils.isDefined(lookup.getPKey()) || Utils.isEmptyString(lookup.getPKey())) {
            var buttonValues = {};
            buttonValues[Localization.resolve("OK")] = "ok";
            return Framework.displayMessage(Localization.resolve("MessageBox_Title_Validation"), Localization.resolve("ReleaseProcess_ApprovalCodeMismatch"), buttonValues);
          } else {
            me.set("signatureName" + stepNumber, lookup.getName());
            me.set("signatureApprovalSuccessful" + stepNumber, "1");
            // Disable approval code controls
            var acl = me.getACL();
            acl.removeRight(AclObjectType.PROPERTY, 'signatureCode' + stepNumber, AclPermission.EDIT);
            acl.removeRight(AclObjectType.PROPERTY, 'signatureId' + stepNumber, AclPermission.EDIT);
            BindingUtils.refreshEARights();
          }
        });
      }
    }
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}