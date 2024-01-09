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
 * @function updateSubstitutionInfo
 * @this BoCall
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 */
function updateSubstitutionInfo(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
//If this is a substituted call, check attribut for EA-Rights
var customerManagementInfoLookup = me.getLuCustomerManagementInfo();

if (customerManagementInfoLookup.getIsSubstituted() == "1") {
  // if call calendar user is also regular manager of customer and responsible of the call, do not set substitution flag
  if (me.getResponsiblePKey() !== customerManagementInfoLookup.getReferenceUsrMainPKey()) {
    me.setSubstitution("1");
    me.setSubMainPKey(customerManagementInfoLookup.getSubstitutedSubMainPKey());

    if (customerManagementInfoLookup.getSubstitutedInLeadFollowUpTime() == "1") {
      me.setReadOnlyBySubstitution("1");
    }
  }
}
else if (customerManagementInfoLookup.getHasSubstitute() == "1") {
  me.setSubstitution("1");
  me.setSubMainPKey(customerManagementInfoLookup.getHasSubstituteSubMainPKey());
  customerManagementInfoLookup.set('substitutedUsrName', me.getLuUser().getName());

  if (me.getResponsiblePKey() === customerManagementInfoLookup.getReferenceUsrMainPKey() && (customerManagementInfoLookup.getHasSubstituteInLeadFollowUpTime() === "0")) {
    // read only if current user is responsible and being substituted on the call's date
    me.setReadOnlyBySubstitution("1");
  }
}
else if (customerManagementInfoLookup.getHasSubstitute() === "0") {
  if (me.getResponsiblePKey() !== customerManagementInfoLookup.getReferenceUsrMainPKey()) {
    // read only if current user is not responsible and not substituting the responsible
    // this is not a real substitution case, it is a fallback
    me.setReadOnlyBySubstitution("1");
    me.setSubMainPKey("FALLBACK");
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}