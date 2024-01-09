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
 * @function createListItemBasedOnBO
 * @this LoOrderOverview
 * @kind listobject
 * @namespace CORE
 * @param {Object} orderBo
 */
function createListItemBasedOnBO(orderBo){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var initiatorName = '';
var initiatorPKey = orderBo.getInitiatorPKey();

if (initiatorPKey === ApplicationContext.get('user').getPKey()) {
  initiatorName = ApplicationContext.get('user').firstName + ' ' + ApplicationContext.get('user').lastName;
}
else if (initiatorPKey === orderBo.getOwnerPKey()) {
  initiatorName = orderBo.getLuOwner().getFirstName() + ' ' + orderBo.getLuOwner().getLastName();
} 

// Preset attributes
var liOrder = {
  "pKey" : orderBo.getPKey(),
  "id" : orderBo.getOrderId(),
  "phase" : orderBo.getPhase(),
  "commitDate" : orderBo.getCommitDate(),
  "deliveryDate" : orderBo.getDeliveryDate(),
  "responsiblePKey" : orderBo.getResponsiblePKey(),
  "responsibleName" : orderBo.getLuResponsible().getFirstName() + ' ' + orderBo.getLuResponsible().getLastName(),
  "initiatorPKey" : initiatorPKey,
  "initiatorName" : initiatorName,
  "grossTotalValue" : orderBo.getGrossTotalValue(),
  "customerName" : orderBo.getLuOrderer().getName(),
  "customerPKey" : orderBo.getLuOrderer().getPKey(),
  "deletionAllowed" : orderBo.getBoOrderMeta().getDeletionAllowed(),
  "orderType" : orderBo.getBoOrderMeta().getText(),
  "orderMetaPKey" : orderBo.getBoOrderMeta().getId(),
  "mobilityRelevant" : orderBo.getBoOrderMeta().getMobilityRelevant(),
  "message" : orderBo.getMessage(),
  "clbMainPKey" : Utils.isDefined(orderBo.getClbMainPKey()) ? orderBo.getClbMainPKey() : "",
  "sdoSubType" : orderBo.getBoOrderMeta().getSdoSubType(),
  "orderPhaseImage" : 'OrderphaseImage_' + orderBo.getPhase(),
  "syncStatusIcon"  : 'OrderAwaitingSync'
};

// Add new Item to ListObject
me.addListItems([liOrder]);
me.setCurrentByPKey(liOrder.getPKey());

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}