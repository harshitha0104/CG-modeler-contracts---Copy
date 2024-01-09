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
 * @function setEARights
 * @this BoCall
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {Object} jsonQuery
 */
function setEARights(jsonQuery){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var aclBo = me.getACL();

if (jsonQuery) {
  var jsonQueryNew = jsonQuery;
}

//disable the responsible field
var aclLuUser = me.getLuUser().getACL();
aclLuUser.removeRight(AclObjectType.PROPERTY, "name", AclPermission.EDIT);

var isCallReadOnly = me.isReadOnly();

// Do not show the call end date and time if the call is not complete
if (me.getClbStatus() != "Completed") {
  aclBo.removeRight(AclObjectType.PROPERTY, "stopTimeEffectiveUI", AclPermission.VISIBLE);
}

if(Utils.isDefined(ApplicationContext.get('currentTourPKey')) && !Utils.isEmptyString(ApplicationContext.get('currentTourPKey')) && ApplicationContext.get('currentTourStatus') !== "Running") {
  isCallReadOnly = true;
}

if (isCallReadOnly) {
  aclBo.removeRight(AclObjectType.OBJECT, "BoCall", AclPermission.EDIT);
}

//if no substitude is active - Hide information
var isSubstitutionActive = !Utils.isEmptyString(me.getBpaMainPKey()) && me.getSubstitution() == "1";

if (!isSubstitutionActive) {
  aclBo.removeRight(AclObjectType.PROPERTY, "substitution", AclPermission.VISIBLE);

  var aclLuCustomerManagementInfo = me.getLuCustomerManagementInfo().getACL();
  aclLuCustomerManagementInfo.removeRight(AclObjectType.PROPERTY, "substitutedUsrName", AclPermission.VISIBLE);
}

if (me.getLuCallMeta().getMobilityRelevant() == "0") {
  aclBo.removeRight(AclObjectType.OBJECT, "BoCall", AclPermission.EDIT);
}

if (me.getLuCallMeta().getCompanyRequired() == "Not required") {
  var aclLuCustomer = me.getLuCustomer().getACL();
  aclLuCustomer.removeRight(AclObjectType.PROPERTY, "name", AclPermission.VISIBLE);
  aclLuCustomer.removeRight(AclObjectType.PROPERTY, "street", AclPermission.VISIBLE);
  aclLuCustomer.removeRight(AclObjectType.PROPERTY, "houseNumber", AclPermission.VISIBLE);
  aclLuCustomer.removeRight(AclObjectType.PROPERTY, "zipCode", AclPermission.VISIBLE);
  aclLuCustomer.removeRight(AclObjectType.PROPERTY, "city", AclPermission.VISIBLE);
  aclLuCustomer.removeRight(AclObjectType.PROPERTY, "state", AclPermission.VISIBLE);
  aclLuCustomer.removeRight(AclObjectType.PROPERTY, "mainAddress", AclPermission.VISIBLE);
}

// Check If the CaptureProceedingTime is configured to be Yes.

if (me.getLuCallMeta().getCaptureProceedingTime() == "0") {
  aclBo.removeRight(AclObjectType.PROPERTY, "startTimeEffective", AclPermission.VISIBLE);
  aclBo.removeRight(AclObjectType.PROPERTY, "stopTimeEffective", AclPermission.VISIBLE);
  aclBo.removeRight(AclObjectType.PROPERTY, "startTimeEffectiveUI", AclPermission.VISIBLE);
  aclBo.removeRight(AclObjectType.PROPERTY, "stopTimeEffectiveUI", AclPermission.VISIBLE);
  aclBo.removeRight(AclObjectType.PROPERTY, "durationEffective", AclPermission.VISIBLE);
}

// Hide TourId for Non Customer Related Calls and when the tour is not in context
if (Utils.isSfBackend() && me.getLuCallMeta().getMobilityUserGuidance() == "NonCustomer" || Utils.isEmptyString(ApplicationContext.get('currentTourPKey'))) {
  aclBo.removeRight(AclObjectType.PROPERTY, "tmgMainId", AclPermission.VISIBLE);
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}