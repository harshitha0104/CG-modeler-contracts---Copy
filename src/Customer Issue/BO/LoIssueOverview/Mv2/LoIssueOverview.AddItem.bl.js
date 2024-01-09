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
 * @function addItem
 * @this LoIssueOverview
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {BoIssue} newIssueDetail
 */
function addItem(newIssueDetail){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var resIcon;
var substituteUserPKey;
var status;

var managementInfo = newIssueDetail.getLuCustomerManagementInfo();

if (
  managementInfo.getIsManaged() === "0" &&
  managementInfo.getIsSubstituted() == "1"
) {
  resIcon = "UserSubstitute24";
  substituteUserPKey = managementInfo.getReferenceUsrMainPKey();
  if (managementInfo.getSubstitutedInLeadFollowUpTime() == "1") {
    status = "Inactive_Substitute";
  } else {
    status = "Active_Substitute";
  }
} else if (
  managementInfo.getIsManaged() === "0" &&
  managementInfo.getHasSubstitute() == "1"
) {
  resIcon = "UserSubstituted24";
  substituteUserPKey = managementInfo.getHasSubstituteUsrMainPKey();
  if (managementInfo.getHasSubstituteInLeadFollowUpTime() == "1") {
    status = "Active_Substituted";
  } else {
    status = "Inactive_Substituted";
  }
} else {
  resIcon = "UserArrowDarkGrey16";
}

// Preset attributes
var liSvcRequestIssue = {
  pKey: newIssueDetail.getPKey(),
  issuePhase: newIssueDetail.getIssuePhase(),
  initiationDate: newIssueDetail.getInitiationDate(),
  businessModified: Utils.createAnsiDateTimeNow(),
  dueDate: newIssueDetail.getDueDate(),
  priority: newIssueDetail.getPriority(),
  responsiblePKey: newIssueDetail.getResponsiblePKey(),
  responsibleName: newIssueDetail.getLuResponsible().getName(),
  ownerPKey: newIssueDetail.getOwnerPKey(),
  ownerName: newIssueDetail.getLuOwner().getName(),
  text: newIssueDetail.getText(),
  customerName: newIssueDetail.getLuCustomer().getName(),
  ownerBpaMainPKey: newIssueDetail.getOwnerBpaMainPKey(),
  initiatorPKey: newIssueDetail.getInitiatorPKey(),
  svcMetaPKey: newIssueDetail.getSvcRequestMetaPKey(),
  isPrivate: newIssueDetail.getBoSvcRequestMeta().getIsPrivate(),
  wfeWorkflowPKey: newIssueDetail.getWfeWorkflowPKey(),
  actualStatePKey: newIssueDetail.getActualStatePKey(),
  isActive: newIssueDetail.getBoSvcRequestMeta().getActive(),
  responsibleIcon: resIcon,
  substituteUsrPKey: substituteUserPKey,
  substitutionStatus: status,
  priorityUIText:
    Localization.resolve("IssueOverviewCallUI_PrioLabel") +
    " " +
    Utils.getToggleText("DomABC", newIssueDetail.getPriority()),
};

// Add new Item to ListObject
me.addListItems([liSvcRequestIssue]);

// Set new ListItem as current Item in List
me.setCurrentByPKey(liSvcRequestIssue.getPKey());

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}