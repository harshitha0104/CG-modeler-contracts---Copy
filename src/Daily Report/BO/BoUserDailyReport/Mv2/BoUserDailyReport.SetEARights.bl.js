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
 * @this BoUserDailyReport
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
    
//#########################################################
// If the respective user document template is not Mobility
// Relevant, the user can not edit any daily report data.
// #########################################################
var acl = me.getACL();

// If the backend is SalesForce, Id field should not be displayed.
if (Utils.isSfBackend()){
  acl.removeRight(AclObjectType.PROPERTY, "id", AclPermission.VISIBLE);
}
else{
  acl.addRight(AclObjectType.PROPERTY, "id", AclPermission.VISIBLE);
}

if (me.getBoUserDocMeta().getMobilityRelevant() === "0" || me.getPhase().toLowerCase() === "approved" ||
    me.getResponsiblePKey() != ApplicationContext.get('user').getPKey()) {
  acl.removeRight(AclObjectType.OBJECT, "BoUserDailyReport", AclPermission.EDIT);

  //Annotation should be editable
  var aclAnnotation = me.getBoUserDRAnnotation().getACL();
  aclAnnotation.addRight(AclObjectType.OBJECT, "BoUserDRAnnotation", AclPermission.EDIT);
  var activitiesAcl = me.getLoUsrDRActivity().getACL();
  activitiesAcl.removeRight(AclObjectType.PROPERTY, "hours", AclPermission.EDIT);
  activitiesAcl.removeRight(AclObjectType.PROPERTY, "minutes", AclPermission.EDIT);

}else{
  acl.setAce({
    "objectType" : AclObjectType.OBJECT,
    "objectName" : "BoUserDailyReport",
    "rights" : AclPermission.ALL,
    "grant" : true
  });
}

if(me.getBoUserDocMeta().getUiGroup() === "TimeCard"){
  if(ApplicationContext.get('user').hasRole('TourUser')){
    acl.addRight(AclObjectType.PROPERTY,"tourId", AclPermission.VISIBLE);
  }
  else{
    acl.removeRight(AclObjectType.PROPERTY,"tourId", AclPermission.VISIBLE);
  }
  acl.addRight(AclObjectType.PROPERTY,"productiveTime", AclPermission.VISIBLE);
  acl.addRight(AclObjectType.PROPERTY,"nonProductiveTime", AclPermission.VISIBLE);
  acl.removeRight(AclObjectType.PROPERTY,"totalLineString", AclPermission.VISIBLE);
  acl.removeRight(AclObjectType.PROPERTY,"workTimeFrom", AclPermission.VISIBLE);
  acl.removeRight(AclObjectType.PROPERTY,"workTimeThru", AclPermission.VISIBLE);
  acl.removeRight(AclObjectType.PROPERTY,"dateFrom", AclPermission.EDIT);
  acl.addRight(AclObjectType.OBJECT, "BoUserDailyReport", AclPermission.VISIBLE);
  me.getLoUsrTimeEntryByVisitType().setVisible(true);
  me.getLoUsrDRActivity().setVisible(false);
}
else{
  acl.removeRight(AclObjectType.PROPERTY,"tourId", AclPermission.VISIBLE);
  acl.removeRight(AclObjectType.PROPERTY,"productiveTime", AclPermission.VISIBLE);
  acl.removeRight(AclObjectType.PROPERTY,"nonProductiveTime", AclPermission.VISIBLE);
  acl.addRight(AclObjectType.OBJECT, "BoUserDailyReport", AclPermission.VISIBLE);
  me.getLoUsrTimeEntryByVisitType().setVisible(false);
  me.getLoUsrDRActivity().setVisible(true);
}

BindingUtils.refreshEARights(false);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}