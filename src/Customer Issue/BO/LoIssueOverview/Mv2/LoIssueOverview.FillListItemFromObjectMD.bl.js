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
 * @function fillListItemFromObjectMD
 * @this LoIssueOverview
 * @kind listobject
 * @namespace CORE
 * @param {LiIssueOverview} listItem
 * @param {BoIssue} detailBO
 */
function fillListItemFromObjectMD(listItem, detailBO){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
// Preset attributes
listItem.setPKey(detailBO.getPKey());
listItem.setIssuePhase(detailBO.getIssuePhase());
listItem.setInitiationDate(detailBO.getInitiationDate());
listItem.setBusinessModified(Utils.createAnsiDateTimeNow());
listItem.setDueDate(detailBO.getDueDate());
listItem.setPriority(detailBO.getPriority());
listItem.setResponsiblePKey(detailBO.getResponsiblePKey());
listItem.setResponsibleName(detailBO.getLuResponsible().getName());
listItem.setOwnerPKey(detailBO.getOwnerPKey());
listItem.setOwnerName(detailBO.getLuOwner().getName());
listItem.setText(detailBO.getText());
listItem.setCustomerName(detailBO.getLuCustomer().getName());
listItem.setOwnerBpaMainPKey(detailBO.getOwnerBpaMainPKey());
listItem.setInitiatorPKey(detailBO.getInitiatorPKey());
listItem.setSvcMetaPKey(detailBO.getSvcRequestMetaPKey());
listItem.setIsPrivate(detailBO.getBoSvcRequestMeta().getIsPrivate());
listItem.setWfeWorkflowPKey(detailBO.getWfeWorkflowPKey());
listItem.setActualStatePKey(detailBO.getActualStatePKey());
listItem.setIsActive(detailBO.getBoSvcRequestMeta().getActive());

var managementInfo = detailBO.getLuCustomerManagementInfo();

if (
  managementInfo.getIsManaged() === "0" &&
  managementInfo.getIsSubstituted() == "1"
) {
  listItem.setResponsibleIcon("UserSubstitute24");
  listItem.setSubstituteUsrPKey(managementInfo.getReferenceUsrMainPKey());

  if (managementInfo.getSubstitutedInLeadFollowUpTime() == "1") {
    listItem.setSubstitutionStatus("Inactive_Substitute");
  } else {
    listItem.setSubstitutionStatus("Active_Substitute");
  }
} else if (
  managementInfo.getIsManaged() === "0" &&
  managementInfo.getHasSubstitute() == "1"
) {
  listItem.setResponsibleIcon("UserSubstituted24");
  listItem.setSubstituteUsrPKey(managementInfo.getHasSubstituteUsrMainPKey());

  if (managementInfo.getHasSubstituteInLeadFollowUpTime() == "1") {
    listItem.setSubstitutionStatus("Active_Substituted");
  } else {
    listItem.setSubstitutionStatus("Inactive_Substituted");
  }
} else {
  listItem.setResponsibleIcon("UserArrowDarkGrey16");
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}