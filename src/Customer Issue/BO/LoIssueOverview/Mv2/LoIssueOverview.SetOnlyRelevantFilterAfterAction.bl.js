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
 * @function setOnlyRelevantFilterAfterAction
 * @this LoIssueOverview
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {BoIssue} issueDetail
 */
function setOnlyRelevantFilterAfterAction(issueDetail){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
// Get the current ListItem
var liSvcRequestIssue = me.getCurrent();

if (liSvcRequestIssue && Utils.isDefined(liSvcRequestIssue)) {
  // Preset attributes
  liSvcRequestIssue.setPKey(issueDetail.getPKey());
  liSvcRequestIssue.setIssuePhase(issueDetail.getIssuePhase());
  liSvcRequestIssue.setInitiationDate(issueDetail.getInitiationDate());
  liSvcRequestIssue.setBusinessModified(Utils.createAnsiDateTimeNow());
  liSvcRequestIssue.setDueDate(issueDetail.getDueDate());
  liSvcRequestIssue.setPriority(issueDetail.getPriority());
  liSvcRequestIssue.setResponsiblePKey(issueDetail.getResponsiblePKey());
  liSvcRequestIssue.setResponsibleName(
    issueDetail.getLuResponsible().getName()
  );
  liSvcRequestIssue.setOwnerPKey(issueDetail.getOwnerPKey());
  liSvcRequestIssue.setOwnerName(issueDetail.getLuOwner().getName());
  liSvcRequestIssue.setText(issueDetail.getText());
  liSvcRequestIssue.setCustomerName(issueDetail.getLuCustomer().getName());
  liSvcRequestIssue.setOwnerBpaMainPKey(issueDetail.getOwnerBpaMainPKey());
  liSvcRequestIssue.setInitiatorPKey(issueDetail.getInitiatorPKey());
  liSvcRequestIssue.setSvcMetaPKey(issueDetail.getSvcRequestMetaPKey());
  liSvcRequestIssue.setIsPrivate(
    issueDetail.getBoSvcRequestMeta().getIsPrivate()
  );
  liSvcRequestIssue.setWfeWorkflowPKey(issueDetail.getWfeWorkflowPKey());
  liSvcRequestIssue.setActualStatePKey(issueDetail.getActualStatePKey());
  liSvcRequestIssue.setIsActive(issueDetail.getBoSvcRequestMeta().getActive());

  var managementInfo = issueDetail.getLuCustomerManagementInfo();

  if (
    managementInfo.getIsManaged() === "0" &&
    managementInfo.getIsSubstituted() == "1"
  ) {
    liSvcRequestIssue.setResponsibleIcon("UserSubstitute24");
    liSvcRequestIssue.setSubstituteUsrPKey(
      managementInfo.getReferenceUsrMainPKey()
    );

    if (managementInfo.getSubstitutedInLeadFollowUpTime() == "1") {
      liSvcRequestIssue.setSubstitutionStatus("Inactive_Substitute");
    } else {
      liSvcRequestIssue.setSubstitutionStatus("Active_Substitute");
    }
  } else if (
    managementInfo.getIsManaged() === "0" &&
    managementInfo.getHasSubstitute() == "1"
  ) {
    liSvcRequestIssue.setResponsibleIcon("UserSubstituted24");
    liSvcRequestIssue.setSubstituteUsrPKey(
      managementInfo.getHasSubstituteUsrMainPKey()
    );

    if (managementInfo.getHasSubstituteInLeadFollowUpTime() == "1") {
      liSvcRequestIssue.setSubstitutionStatus("Active_Substituted");
    } else {
      liSvcRequestIssue.setSubstitutionStatus("Inactive_Substituted");
    }
  } else {
    liSvcRequestIssue.setResponsibleIcon("UserArrowDarkGrey16");
  }

  //Update filter condition
  if (
    liSvcRequestIssue.getIssuePhase().toLowerCase() === "initial" ||
    liSvcRequestIssue.getIssuePhase().toLowerCase() === "released"
  ) {
    liSvcRequestIssue.setFilterOpen("1");
  } else {
    liSvcRequestIssue.setFilterOpen("0");
  }
}

var FilterMap = me.getFilterMap();
if (Utils.isDefined(FilterMap.filterOpen)) {
  me.resetFilter("filterOpen");
  me.setFilter("filterOpen", "1", "EQ");
}

var items = me.getItemObjects();

if (items.length > 0) {
  me.setCurrentByPKey(items[0].getPKey());
} else {
  me.setCurrentByPKey(undefined);
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}