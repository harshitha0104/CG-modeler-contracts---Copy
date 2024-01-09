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
 * @function initializeInwardTransferDocument
 * @this BoTruckLoad
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {Object} outwardDocumentBO
 * @returns promise
 */
function initializeInwardTransferDocument(outwardDocumentBO){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var userPKey = ApplicationContext.get("user").getPKey();
var newMainPKey = PKey.next();
//Removed copy
//me = outwardDocumentBO.copy();
var sdoItemMetaPKey = "";
var tourPKey = "";
var etpWarehousePKey = "";
var jsonParams = [];
var jsonQuery = {};

if (
  Utils.isDefined(ApplicationContext.get("currentTourPKey")) &&
  !Utils.isEmptyString(ApplicationContext.get("currentTourPKey"))
) {
  tourPKey = ApplicationContext.get("currentTourPKey");
}

if (Utils.isDefined(ApplicationContext.get("currentTour"))) {
  etpWarehousePKey = ApplicationContext.get("currentTour").getStartEtpWarehousePKey();
}

jsonParams.push({ field: "tmgMainPKey", value: tourPKey });
jsonQuery.params = jsonParams;

var promise = BoFactory.loadObjectByParamsAsync(
  "LuInventoryMetaText",
  jsonQuery
)
  .then(function (luInventoryMeta) {
    //Get SdoMetaPkey, sdoItemMetaPKey
    if (Utils.isDefined(luInventoryMeta)) {
      me.setSdoMetaPKey(luInventoryMeta.getPKey());
      me.setWfeWorkflowPKey(luInventoryMeta.getWfeWorkflowPKey());
      sdoItemMetaPKey = luInventoryMeta.getSdoItemMetaPKey();
    }

    me.beginEdit();
    me.setPKey(newMainPKey);
    me.setInitiatorPKey(outwardDocumentBO.getInitiatorPKey());
    me.setResponsiblePKey(userPKey);
    me.setOwnerPKey(outwardDocumentBO.getOwnerPKey());
    me.setEtpWarehousePKey(etpWarehousePKey);
    me.setRecipientPKey(outwardDocumentBO.getRecipientPKey());
    me.setSenderPKey(outwardDocumentBO.getSenderPKey());
    me.setPhase("Initial");
    me.setDocumentType("TruckIvcTransferInward");
    me.setInwardTransferDocumentPKey("");
    me.setTmgMainPKey(tourPKey);
    me.setReleaseTime(Utils.getMinDate());
    me.setInitiationDate(Utils.createAnsiDateTimeToday());
    me.setCommitDate(Utils.createAnsiDateTimeToday());
    me.setDeliveryDate(Utils.createAnsiDateTimeToday());
    me.setGrossTotalValueReceipt(outwardDocumentBO.getGrossTotalValueReceipt());
    me.setCancelReason(outwardDocumentBO.getCancelReason());

    var jsonParams = me.prepareLookupsLoadParams(me);
    return Facade.loadLookupsAsync(jsonParams);
  })
  .then(function (lookups) {
    //Set Lookups
    me.assignLookups(lookups);

    return BoFactory.loadObjectByParamsAsync(
      "BoWorkflow",
      me.getQueryBy("pKey", me.getWfeWorkflowPKey())
    );
  })
  .then(function (boWorkflow) {
    // Set BoWorkflow
    me.setBoWorkflow(boWorkflow);
    var initialState = boWorkflow.getInitialState().toStatePKey;
    var liState = boWorkflow.getLoWfeState().getItemByPKey(initialState);
    if (Utils.isDefined(liState)) {
      me.setActualStatePKey(liState.getPKey());
      me.setNextStatePKey(liState.getPKey());
    }

    return BoFactory.loadObjectByParamsAsync(
      BO_ORDERMETA,
      me.getQueryBy("pKey", me.getSdoMetaPKey())
    );
  })
  .then(function (boOrderMeta) {
    // Set BoOrderMeta
    me.setBoOrderMeta(boOrderMeta);
    var itemTemplate = me
      .getBoOrderMeta()
      .getLoOrderItemMetas()
      .getMainItemTemplate();
    itemTemplate.setAddAllowed(0);
    me.setAddProduct_ItemMeta(itemTemplate);
    if (me.getBoOrderMeta().getDocNumberGenBehavior() == "Creation") {
      return SysNumber.getSysNumberAsync(
        me.getBoOrderMeta().getSysNumberPKey()
      );
    } else {
      return me.getPKey();
    }
  })
  .then(function (sysnumber) {
    //Set id (generated by number generator)
    me.setId(sysnumber);

    // Copy LoTruckLoadItems
    var idxLi;
    var liNewItem;
    var copiedItems = [];
    var loTruckLoadItems = BoFactory.instantiate("LoTruckLoadItems", {});
    var oldItems = outwardDocumentBO.getLoItems().getAllItems();

    for (idxLi = 0; idxLi < oldItems.length; idxLi++) {
      var itemMeta;
      //Copy doesn't work so directly storing in listItem
      liNewItem = oldItems[idxLi];
      liNewItem.beginEdit();
      liNewItem.setPKey(PKey.next());
      liNewItem.setSdoMainPKey(newMainPKey);
      if (!Utils.isEmptyString(sdoItemMetaPKey)) {
        liNewItem.setSdoItemMetaPKey(sdoItemMetaPKey);
        itemMeta = me
          .getBoOrderMeta()
          .getLoOrderItemMetas()
          .getItemTemplateByPKey(sdoItemMetaPKey);
        liNewItem.setShortText(itemMeta.getShortText());
      }
      //Set target quantity
      liNewItem.setTargetQuantity(liNewItem.getQuantity());
      liNewItem.setSuggestedQuantity(liNewItem.getQuantity());
      liNewItem.setIvcBalance(liNewItem.getQuantity());
      liNewItem.setQuantity(liNewItem.getQuantity());
      liNewItem.setQtyDifference(
        liNewItem.getQuantity() - liNewItem.getTargetQuantity()
      );
      liNewItem.setOqtyInfo(
        Localization.resolve("oQtyId") + "  " + liNewItem.getTargetQuantity()
      );
      liNewItem.setDifferenceInfo(
        Localization.resolve("DifferenceId") +
          "  " +
          liNewItem.getQtyDifference()
      );
      liNewItem.setObjectStatus(STATE.NEW | STATE.DIRTY);
      liNewItem.endEdit();
      copiedItems.push(liNewItem);
    }
    loTruckLoadItems.addObjectItems(copiedItems);
    me.setLoItems(loTruckLoadItems);

    // Set LoOrderRecentState, LoSdoConditions, LoOrderAttachment, LoSysSignatureAttribute, LoSysSignatureBlob & LoCallLocation
    me.setLoWfeRecentState(BoFactory.instantiate("LoOrderRecentState", {}));
    me.setLoSdoConditions(BoFactory.instantiate("LoSdoConditions", {}));
    me.setLoOrderAttachment(BoFactory.instantiate("LoOrderAttachment", {}));
    me.setLoSysSignatureAttribute(
      BoFactory.instantiate("LoSysSignatureAttribute", {})
    );
    me.setLoSysSignatureBlob(BoFactory.instantiate("LoSysSignatureBlob", {}));
    me.setLoGeoLocation(BoFactory.instantiate("LoCallLocation", {}));

    me.setValidateInventories(1);
    me.setObjectStatus(STATE.NEW | STATE.DIRTY);

    // EARight on New Document.

    var aclBO = me.getACL();
    aclBO.removeRight(AclObjectType.OBJECT, "BoTruckLoad", AclPermission.EDIT);
    me.endEdit();

    outwardDocumentBO.beginEdit();
    outwardDocumentBO.setInwardTransferDocumentPKey(newMainPKey);
    outwardDocumentBO.endEdit();
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}