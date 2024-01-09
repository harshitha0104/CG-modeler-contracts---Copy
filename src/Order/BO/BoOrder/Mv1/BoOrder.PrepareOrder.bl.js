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
 * @function prepareOrder
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @returns promise
 */
function prepareOrder(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
//Set ClbMainPKey
if (!Utils.isDefined(me.getClbMainPKey())) {
  me.setClbMainPKey(" ");
}

//Set default fields
me.setSalesOrg(
   ApplicationContext.get("user").getBoUserSales().getSalesOrg()
);
me.setOrgPhase(me.getPhase());
me.setValidateForRelease("0");

//Set date fields of order (delivery date is set later due to asynchronous call)
me.setInitiationDate(Utils.createAnsiDateTimeToday());
me.setCommitDate(Utils.createAnsiDateTimeToday());
me.setDocumentType(me.getBoOrderMeta().getSdoSubType());

//Set value of order
me.setTotalValue(0);
me.setGrossTotalValue(0);
me.setDebitCredit("Debit");

//Set user references
me.setResponsiblePKey(ApplicationContext.get("user").getPKey());
me.setInitiatorPKey(ApplicationContext.get("user").getPKey());
me.setOwnerPKey(ApplicationContext.get("user").getPKey());

//Set IvcRefPKeys
me.setIvcRefPKeys();

//Set inventory search keys for item meta and payment meta
me.getBoOrderMeta().setIvcSearchKeysForItemMetas(
  me.getOrdererPKey(),
  me.getIvcRef1PKey(),
  me.getIvcRef2PKey(),
  me.getIvcRef3PKey(),
  me.getIvcRef4PKey(),
  me.getIvcRef5PKey()
);

me.getBoOrderMeta().setIvcSearchKeysForPaymentMetas(
  me.getPayerCustomerPKey(),
  me.getIvcRef1PKey(),
  me.getIvcRef2PKey(),
  me.getIvcRef3PKey(),
  me.getIvcRef4PKey(),
  me.getIvcRef5PKey()
);

//Set workflow information

me.setWfeWorkflowPKey(me.getBoOrderMeta().getWfeWorkflowPKey());

var promise = BoFactory.loadObjectByParamsAsync(
  "LuInitialAndNextState",
  me.getQueryBy("wfeWorkflowPKey", me.getWfeWorkflowPKey())
)
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

  return me.presetDeliveryDate();
})
.then(function (deliveryDate) {
  me.setDeliveryDate(deliveryDate);

  //Set business partner relations
  return me.presetOrderRoles(me.getOrdererPKey());
})
.then(function () {
  // Set TmgMainPKey before loading LuTour
  if (
    me.getBoOrderMeta().getSdoSubType() === "Delivery" ||
    me.getBoOrderMeta().getSdoSubType() === "OrderEntry"
  ) {
    if (
      Utils.isDefined(
        ApplicationContext.get("currentTourPKey")
      )
    ) {
      me.setTmgMainPKey(
        ApplicationContext.get("currentTourPKey")
      );
    }
  }
  // Load object lookups for owner and responsible
  var jsonParams = JSON.parse(
    '[{"objectClass": "LuUser", "pKey": "' +
    me.getOwnerPKey() +
    '", "reference": "luOwner"}, {"objectClass": "LuUser", "pKey": "' +
    me.getResponsiblePKey() +
    '", "reference": "luResponsible"}, {"objectClass": "LuTourInformation", "pKey": "' +
    me.getTmgMainPKey() +
    '", "reference": "luTour"}]'
  );

  return Facade.loadLookupsAsync(jsonParams);
})
.then(function (lookups) {
  me.setLuOwner(lookups.luOwner);
  me.setLuResponsible(lookups.luResponsible);
  me.setLuTour(lookups.luTour);

  if (Utils.isSfBackend()) {
    if ( me.getBoOrderMeta().getConsiderBpaDocTaType() == "1" ) {
      if (me.getBoOrderMeta().getSdoSubType() === "OrderEntry") {
        me.setDocTaType(me.getLuOrderer().getOrderDocTaType());
      }
      else if (me.getBoOrderMeta().getSdoSubType() === "Invoice") {
        me.setDocTaType(me.getLuOrderer().getInvoiceDocTaType());
      }
      else if (me.getBoOrderMeta().getSdoSubType() === "Delivery") {
        me.setDocTaType(me.getLuOrderer().getPayerDocTaType());
      }
    } 
    else {
      me.setDocTaType(me.getBoOrderMeta().getDocTaType());
    }
  } else {
    if (me.getBoOrderMeta().getSdoSubType() === "Delivery") {
      if (
        Utils.isDefined(
          ApplicationContext.get("currentTourPKey")
        )
      ) {
        me.setTmgMainPKey(
          ApplicationContext.get("currentTourPKey")
        );
      }
      if (me.getBoOrderMeta().getConsiderBpaDocTaType() == "1") {
        if (!Utils.isEmptyString(me.getPayerCustomerPKey())) {
          return BoFactory.loadObjectByParamsAsync(
            "BoPayerRole",
            me.getQueryBy("customerPKey", me.getPayerCustomerPKey())
          );
        } else {
          me.setDocTaType("NonValuatedDeliveryNote");
        }
      } else {
        me.setDocTaType(me.getBoOrderMeta().getDocTaType());
      }
    } else {
      me.setDocTaType("ValuatedDeliveryNote");
    }
  }
})
.then(function (boPayerRole) {
  if (Utils.isDefined(boPayerRole) && !Utils.isSfBackend()) {
    me.setDocTaType(boPayerRole.getDocTaType());
  }

  if (me.getBoOrderMeta().getDocInvoiceNumberGenBehavior() === "Creation") {
    var sysNumberParams = [];
    var sysNumberQuery = {};

    sysNumberParams.push({
      field: "sdoMetaPKey",
      value: me.getSdoMetaPKey(),
    });
    sysNumberParams.push({ field: "docTaType", value: me.getDocTaType() });
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
  if (Utils.isDefined(invoicenumber)) {
    me.setInvoiceId(invoicenumber);
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
  me.setOrderId(sysnumber);
  //Set Pricing date according to commit or delivery date
  if (
    me.getBoOrderMeta().getComputePrice() === BLConstants.Order.BUTTON_MODE ||
    me.getBoOrderMeta().getComputePrice() === BLConstants.Order.EDIT_MODE
  ) {
    if (me.getBoOrderMeta().getCpPricingDate() === "OrderDate") {
      me.setPricingDate(me.getCommitDate());
    } else if (me.getBoOrderMeta().getCpPricingDate() === "DeliveryDate") {
      me.setPricingDate(me.getDeliveryDate());
    }
  } else {
    me.setPricingDate(me.getCommitDate());
  }
  return me.determinePaymentMethods();
});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}