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
 * @function copyBO
 * @this BoPrmContract
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {String} userPKey
 * @param {String} prmMetaPKey
 * @param {String} bpaCustomerPKey
 * @param {String} dateFrom
 * @param {String} isManagedCustomer
 * @param {String} substitutedUsrPKey
 * @returns promise
 */
function copyBO(userPKey, prmMetaPKey, bpaCustomerPKey, dateFrom, isManagedCustomer, substitutedUsrPKey){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
//REMOVE WORKAROUND WHEN FW FIX IS AVAILABLE (CHECK FOR UNDEFINED IN COPY METHOD (ENGINE.JS))
if(!Utils.isDefined(me.getLoRecentState()))
{
  me.setLoRecentState(BoFactory.instantiate("LoPrmCttRecentState"));
}
//REMOVE WORKAROUND WHEN FW FIX IS AVAILABLE (CHECK FOR UNDEFINED IN COPY METHOD (ENGINE.JS))

var copyBO = me.copy();

var oldDateFrom = Utils.convertAnsiDate2Date(copyBO.getDateFrom());
oldDateFrom.setHours(0, 0, 0, 0);
var newDateFrom = Utils.convertAnsiDate2Date(dateFrom);
newDateFrom.setHours(0, 0, 0, 0);

//Calculate Day Offset
var dayOffset = (newDateFrom - oldDateFrom) / (1000 * 60 * 60 * 24);

var newDateThru = Utils.convertAnsiDate2Date(copyBO.getDateThru());
if(Utils.convertDate2Ansi(newDateThru)!=Utils.getMaxDateTime())
{
  newDateThru.setDate(newDateThru.getDate() + dayOffset);
}

var newMainPKey = PKey.next();
copyBO.setPKey(newMainPKey);
copyBO.setPrmId(newMainPKey);
copyBO.setPrmMetaPKey(prmMetaPKey);
copyBO.setResponsiblePKey(userPKey);
copyBO.setInitiatorPKey(userPKey);
copyBO.setDateInitiation(newDateFrom);
copyBO.setOwnerPKey(userPKey);
copyBO.setBpaCustomerPKey(bpaCustomerPKey);
copyBO.setDateFrom(newDateFrom);
copyBO.setDateThru(newDateThru);
copyBO.setPhase("Planning");

// set responsible / owner to substituted user if it is a substituted customer
if ((!isManagedCustomer || isManagedCustomer.getId()=="0") && substitutedUsrPKey && !Utils.isEmptyString(substitutedUsrPKey))
{
  copyBO.setResponsiblePKey(substitutedUsrPKey);
  copyBO.setOwnerPKey(substitutedUsrPKey);
}

var jsonParams = copyBO.prepareLookupsLoadParamsFromObject(copyBO);

var promise = Facade.loadLookupsAsync(jsonParams).then(
  function (lookups) {
    copyBO.assignLookups(lookups);

    return BoFactory.loadObjectByParamsAsync("BoWorkflow", copyBO.getQueryBy("pKey", copyBO.getWfeWorkflowPKey()));
  }).then(
  function (boWorkflow) {
    copyBO.setBoWorkflow(boWorkflow);
    var initialState = boWorkflow.getInitialState().toStatePKey;
    var liState = boWorkflow.getLoWfeState().getItemByPKey(initialState);
    if (Utils.isDefined(liState)) {
      copyBO.setActualStatePKey(liState.getPKey());
      copyBO.setNextStatePKey(liState.getPKey());
      copyBO.setWfeStateText(liState.getText());
      copyBO.setPhaseType(liState.getStateType());
    }

    //Load SloganBO
    return BoFactory.createObjectAsync(BO_PRMCTTSLOGAN, {
      "params" : [{
        "field" : "prmContractPKey",
        "operator" : "EQ",
        "value" : newMainPKey
      }, {
        "field" : "text",
        "operator" : "EQ",
        "value" : copyBO.getBoSlogan().getText()
      }, {
        "field" : "salesOrg",
        "operator" : "EQ",
        "value" : copyBO.getSalesOrg()
      }, {
        "field" : "language",
        "operator" : "EQ",
        "value" : copyBO.getBoSlogan().getLanguage()
      }
                 ]
    });
  }).then(
  function (boSlogan) {
    copyBO.setBoSlogan(boSlogan);
    copyBO.getBoSlogan().setObjectStatus(Utils.data.Model.STATE_NEW_DIRTY);
    //Set Recent state & comment empty
    copyBO.setLoRecentState(BoFactory.instantiate("LoPrmCttRecentState", {}));
    copyBO.setLoPrmCttComment(BoFactory.instantiate("LoPrmCttComment", {}));

    var idxLi;
    var liNewItem;
    var copiedItems = [];

    // Copy tactics
    var loPrmCttTactics = BoFactory.instantiate("LoPrmCttTactics", {});
    var oldTactics = me.getLoPrmCttTactics().getAllItems();
    var newTctDateFrom = Utils.createDateNow(),
        newTctDateThru = Utils.createDateNow();
    for (idxLi = 0; idxLi < oldTactics.length; idxLi++) {

      liNewItem = oldTactics[idxLi].copy();
      if(Utils.isSfBackend())
      {
        newTctDateFrom = Utils.convertAnsiDate2Date(Utils.getISODateTimeUTC(liNewItem.getDateFrom()));
        newTctDateFrom.setDate(newTctDateFrom.getDate() + dayOffset);
        newTctDateThru = Utils.convertAnsiDate2Date(Utils.getISODateTimeUTC(liNewItem.getDateThru()));
        newTctDateThru.setHours(0, 0, 0, 0);
      }
      else
      {
        newTctDateFrom = Utils.convertAnsiDate2Date(liNewItem.getDateFrom());
        newTctDateFrom.setDate(newTctDateFrom.getDate() + dayOffset);
        newTctDateThru = Utils.convertAnsiDate2Date(liNewItem.getDateThru());
        newTctDateThru.setHours(0, 0, 0, 0);
      }

      if(Utils.convertDate2Ansi(newTctDateThru)!=Utils.getMaxDateTime() && (Utils.convertAnsiDate2Date(me.getDateThru()) >= newTctDateThru))
      {
        newTctDateThru.setDate(newTctDateThru.getDate() + dayOffset);
      }

      liNewItem.setDateFrom(newTctDateFrom);
      liNewItem.setDateThru(newTctDateThru);

      liNewItem.setPKey(PKey.next());
      liNewItem.setTacticParentPKey(newMainPKey);
      liNewItem.setObjectStatus(Utils.data.Model.STATE_NEW_DIRTY);
      copiedItems.push(liNewItem);
    }
    loPrmCttTactics.addObjectItems(copiedItems);
    copyBO.setLoPrmCttTactics(loPrmCttTactics);

    // Copy products
    copiedItems = [];
    var loPrmCttProducts = BoFactory.instantiate("LoPrmCttProducts", {});
    var oldProducts = me.getLoPrmCttProducts().getAllItems();
    for (idxLi = 0; idxLi < oldProducts.length; idxLi++) {
      liNewItem = oldProducts[idxLi].copy();
      liNewItem.setPKey(PKey.next());
      liNewItem.setPrmContractPKey(newMainPKey);
      liNewItem.setObjectStatus(Utils.data.Model.STATE_NEW_DIRTY);
      copiedItems.push(liNewItem);
    }
    loPrmCttProducts.addObjectItems(copiedItems);
    copyBO.setLoPrmCttProducts(loPrmCttProducts);

    //Copy Annotation
    copiedItems = [];
    var loComment = BoFactory.instantiate("LoPrmCttComment", {});
    var oldComments = me.getLoPrmCttComment().getAllItems();
    for (idxLi = 0; idxLi < oldComments.length; idxLi++) {
      liNewItem = oldComments[idxLi].copy();
      liNewItem.setPKey(PKey.next());
      liNewItem.setPrmContractPKey(newMainPKey);
      liNewItem.setObjectStatus(Utils.data.Model.STATE_NEW_DIRTY);
      copiedItems.push(liNewItem);
    }
    loComment.addObjectItems(copiedItems);
    copyBO.setLoPrmCttComment(loComment);
    copyBO.setObjectStatus(Utils.data.Model.STATE_NEW_DIRTY);
    copyBO.setLuPrmCttTacticProductCount(me.getLuPrmCttTacticProductCount());

    var aclBO = copyBO.getACL();
    aclBO.addRight(AclObjectType.OBJECT, "BoPrmContract", AclPermission.EDIT);  

    return copyBO;
  }
);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}