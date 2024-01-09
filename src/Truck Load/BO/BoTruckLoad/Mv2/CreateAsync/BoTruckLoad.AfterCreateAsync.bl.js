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
 * @function afterCreateAsync
 * @this BoTruckLoad
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} result
 * @param {Object} context
 * @returns promise
 */
function afterCreateAsync(result, context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
me.setLoModReasonCache(Utils.createDictionary());

var runningTour = " ";
if (Utils.isDefined(ApplicationContext.get("currentTourPKey"))) {
  runningTour = ApplicationContext.get("currentTourPKey");
}

me.setTmgMainPKey(runningTour);

if (
  Utils.isEmptyString(runningTour) &&
  Utils.isDefined(context.jsonQuery.tmgMainPKey)
) {
  me.setTmgMainPKey(context.jsonQuery.tmgMainPKey);
}

//Set default fields
me.setSalesOrg(
  ApplicationContext.get("user").getBoUserSales().getSalesOrg()
);

//Set date fields of order (delivery date is set later due to asynchronous call)
me.setInitiationDate(Utils.createAnsiDateTimeToday());
me.setCommitDate(Utils.createAnsiDateTimeToday());

//Set user references
me.setResponsiblePKey(ApplicationContext.get("user").getPKey());
me.setInitiatorPKey(ApplicationContext.get("user").getPKey());
me.setOwnerPKey(ApplicationContext.get("user").getPKey());
me.setSenderPKey(ApplicationContext.get("user").getPKey());
me.setRecipientPKey("");

//Set IvcRefPKeys
me.setIvcRefPKeys();

me.setTotalValue(0);
me.setTotalValueReceipt(0);
me.setGrossTotalValue(0);
me.setGrossTotalValueReceipt(0);
me.setMerchandiseValue(0);
me.setMerchandiseValueReceipt(0);
me.setTotalShippedQuantity(0);
me.setTotalReturnedQuantity(0);
me.setPaidAmount(0);
me.setPaidAmountReceipt(0);
me.setHeaderDiscount(0);

me.setDeliveryDate(Utils.getMinDate());
me.setCalculationTime(Utils.getMinDate());
me.setPricingDate(Utils.getMinDate());
me.setReleaseTime(Utils.getMinDate());

var promise = me
  .loadBoOrderMeta()
  .then(function () {
    //set calculation schema
    if (
      (me.getBoOrderMeta().getComputePrice() === "4" ||
        me.getBoOrderMeta().getComputePrice() === "5") &&
      !Utils.isEmptyString(me.getBoOrderMeta().getCndCpCalculationSchemaPKey())
    ) {
      me.setCndCpCalculationSchemaPKey(
        me.getBoOrderMeta().getCndCpCalculationSchemaPKey()
      );
    }

    //Set inventory search keys for item meta
    me.getBoOrderMeta().setIvcSearchKeysForItemMetas(
      me.getOrdererPKey(),
      me.getIvcRef1PKey(),
      me.getIvcRef2PKey(),
      me.getIvcRef3PKey(),
      me.getIvcRef4PKey(),
      me.getIvcRef5PKey()
    );

    //Set Document Type while creating a new document
    me.setDocumentType(me.getBoOrderMeta().getSdoSubType());

    //Set workflow information
    me.setWfeWorkflowPKey(me.getBoOrderMeta().getWfeWorkflowPKey());

    //set item Template
    var orderItemMeta = me
      .getBoOrderMeta()
      .getLoOrderItemMetas()
      .getMainItemTemplate();
    if (Utils.isDefined(orderItemMeta)) {
      me.setAddProduct_ItemMeta(orderItemMeta);
    }

    return BoFactory.loadObjectByParamsAsync(
      "BoWorkflow",
      me.getQueryBy("pKey", me.getWfeWorkflowPKey())
    );
  })
  .then(function (boWorkflow) {
    me.setBoWorkflow(boWorkflow);
    var wfeInitialStateJson = boWorkflow.getInitialState();
    if (Utils.isDefined(wfeInitialStateJson)) {
      me.setPhase("Initial");
      me.setActualStatePKey(wfeInitialStateJson.toStatePKey);
      me.setNextStatePKey(me.getActualStatePKey());
    }

    //################################################
    //### Create Recent State for workflow history ###
    //################################################
    return BoFactory.createListAsync(LO_ORDERRECENTSTATE, {});
  })
  .then(function (loTruckLoadWfeRecentState) {
    me.setLoWfeRecentState(loTruckLoadWfeRecentState);

    return BoFactory.loadObjectByParamsAsync(
      "LuInitialAndNextState",
      me.getQueryBy("wfeWorkflowPKey", me.getWfeWorkflowPKey())
    );
  })
  .then(function (luInitialAndNextState) {
    //Set ActualStatePKey to PKey of initial state
    me.setActualStatePKey(luInitialAndNextState.getInitialStatePKey());

    var initialStateType = luInitialAndNextState.getInitialStateType();

    if (initialStateType == "initial") {
      initialStateType = "Initial";
    }

    me.setPhase(initialStateType);

    //Set NextStatePKey to ActualStatePKey (setting to nextStatePKey would not be correct - save at Web after sync would do state transition)
    me.setNextStatePKey(luInitialAndNextState.getInitialStatePKey());

    if (me.getBoOrderMeta().getDocInvoiceNumberGenBehavior() === "Creation") {
      var sysNumberParams = [];
      var sysNumberQuery = {};

      sysNumberParams.push({
        field: "sdoMetaPKey",
        value: me.getSdoMetaPKey(),
      });
      sysNumberParams.push({
        field: "docTaType",
        value: me.getDocTaType(),
      });
      sysNumberQuery.params = sysNumberParams;

      return BoFactory.loadObjectByParamsAsync(
        "LuSdoMetaDocTATypeSysNumber",
        sysNumberQuery
      );
    }
  })
  .then(function (luSdoMetaDocTATypeSysNumber) {
    if (Utils.isDefined(luSdoMetaDocTATypeSysNumber)) {
      if (
        !Utils.isEmptyString(luSdoMetaDocTATypeSysNumber.getSysNumberPKey())
      ) {
        return SysNumber.getSysNumberAsync(
          luSdoMetaDocTATypeSysNumber.getSysNumberPKey()
        );
      } else {
        return SysNumber.getSysNumberAsync(
          me.getBoOrderMeta().getSysNumberPKey()
        );
      }
    }
  })
  .then(function (invoicenumber) {
    if (!Utils.isSfBackend()) {
      if (Utils.isDefined(invoicenumber)) {
        me.setInvoiceId(invoicenumber);
      }
    }

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

    return BoFactory.loadObjectByParamsAsync(
      LU_USER,
      me.getQueryBy("pKey", me.getResponsiblePKey())
    );
  })
  .then(function (luResponsible) {
    me.setLuResponsible(luResponsible);

    return BoFactory.loadObjectByParamsAsync(
      LU_USER,
      me.getQueryBy("pKey", me.getOwnerPKey())
    );
  })
  .then(function (luOwner) {
    me.setLuOwner(luOwner);

    return BoFactory.loadObjectByParamsAsync(
      LU_USER,
      me.getQueryBy("pKey", me.getSenderPKey())
    );
  })
  .then(function (luSender) {
    me.setLuSender(luSender);

    return BoFactory.loadObjectByParamsAsync(
      LU_ETPWAREHOUSE,
      me.getQueryBy("pKey", me.getEtpWarehousePKey())
    );
  })
  .then(function (luWarehouse) {
    me.setLuEtpWarehouse(luWarehouse);

    return BoFactory.loadObjectByParamsAsync(
      LU_TOURINFORMATION,
      me.getQueryBy("pKey", me.getTmgMainPKey())
    );
  })
  .then(function (luTourInformation) {
    me.setLuTourInformation(luTourInformation);

    //Set State
    me.setObjectStatus(STATE.NEW | STATE.DIRTY);

    return me;
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}