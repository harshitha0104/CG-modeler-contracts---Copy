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
 * @this BoWizardCreateNewCall
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 */
function setEARights(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var acl = me.getACL();

if(me.getCallMetaLookup().getCompanyRequired()==="Not required") {
  me.getCustomerLookup().getACL().removeRight(AclObjectType.PROPERTY, "name", AclPermission.VISIBLE);
  me.setCustomerPKey(" ");
}
else {
  me.getCustomerLookup().getACL().addRight(AclObjectType.PROPERTY, "name", AclPermission.EDIT);
  me.getCustomerLookup().getACL().addRight(AclObjectType.PROPERTY, "name", AclPermission.VISIBLE);
  me.setCustomerPKey(me.getCustomerLookup().getPKey());
}

if(me.getAllDay() == "1") {
  acl.removeRight(AclObjectType.PROPERTY, "timeFrom", AclPermission.VISIBLE);
}
else {
  acl.addRight(AclObjectType.PROPERTY, "timeFrom", AclPermission.EDIT);
  acl.addRight(AclObjectType.PROPERTY, "timeFrom", AclPermission.VISIBLE);
}

// additional info
me.getJobListLookup().getACL().removeRight(AclObjectType.OBJECT, "LuJobList", AclPermission.EDIT);
acl.removeRight(AclObjectType.PROPERTY, "tripListName", AclPermission.EDIT);

if(me.getMode() == "JobListPlanning") {
  acl.removeRight(AclObjectType.PROPERTY, "tripListName", AclPermission.VISIBLE);
  me.getCustomerLookup().getACL().removeRight(AclObjectType.PROPERTY, "name", AclPermission.VISIBLE);
  me.getCallMetaLookup().getACL().removeRight(AclObjectType.PROPERTY, "text", AclPermission.VISIBLE);
}
else if(me.getMode() == "TripListPlanning") {
  me.getJobListLookup().getACL().removeRight(AclObjectType.OBJECT, "LuJobList", AclPermission.VISIBLE);
  me.getCustomerLookup().getACL().removeRight(AclObjectType.PROPERTY, "name", AclPermission.VISIBLE);
  acl.removeRight(AclObjectType.PROPERTY, "timeFrom", AclPermission.VISIBLE);
}
else if(me.getMode() == "CustomerPlanning") {
  me.getJobListLookup().getACL().removeRight(AclObjectType.OBJECT, "LuJobList", AclPermission.VISIBLE);
  me.getCustomerLookup().getACL().removeRight(AclObjectType.PROPERTY, "name", AclPermission.EDIT);
  acl.removeRight(AclObjectType.PROPERTY, "tripListName", AclPermission.VISIBLE);
}
else {
  me.getJobListLookup().getACL().removeRight(AclObjectType.OBJECT, "LuJobList", AclPermission.VISIBLE);
  acl.removeRight(AclObjectType.PROPERTY, "tripListName", AclPermission.VISIBLE);
}

if(me.getMode() === "Overdue" || me.getMode() === "FollowUp") {
  me.getCustomerLookup().getACL().removeRight(AclObjectType.PROPERTY, "name", AclPermission.EDIT);
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}