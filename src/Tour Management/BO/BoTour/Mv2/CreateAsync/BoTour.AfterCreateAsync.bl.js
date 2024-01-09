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
 * @this BoTour
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
    
me.updateProperties(context.jsonQuery);

var user = ApplicationContext.get("user");
var pKey = PKey.next();
me.setPKey(pKey);
me.setDateFrom(Utils.createAnsiDateTimeToday());
me.setDateThru(Utils.getMaxDate());
me.setTmgStatus("Open");
me.setReleaseButton(true);
me.setCompleteButton(false);
me.setReleaseInfoButton(false);
me.setCompleteInfoButton(false);
me.setDefaultUsrMainPKey(user.getPKey());
me.setActualUsrMainPKey(user.getPKey());
me.setTimeFrom(Utils.createAnsiTimeNow());
me.setTimeThru("00:00");
me.setCancelReason(" ");
me.setVehicleStatusStart(" ");
me.setVehicleStatusEnd(" ");
var jsonParams = me.prepareLookupsLoadParams(me);

var promise = Facade.loadLookupsAsync(jsonParams)
  .then(function (lookups) {
    me.assignLookups(lookups);

    return BoFactory.loadObjectByParamsAsync(
      "BoTourMeta",
      me.getQueryBy("pKey", me.getTmgMetaPKey())
    );
  })
  .then(function (object) {
    me.setBoTourMeta(object);
    me.setSalesOrg(ApplicationContext.get("user").getSalesOrg());
    me.setSealOK("0");
    me.setCashHandlingRequired(me.getBoTourMeta().getCashHandlingRequired());
    me.setExpressCheckOutAllowed(
      me.getBoTourMeta().getExpressCheckOutAllowed()
    );
    me.setPalletCheckOutAllowed(me.getBoTourMeta().getPalletCheckOutAllowed());
    me.setCountingGroupCheckOutAllowed(
      me.getBoTourMeta().getCountingGroupCheckOutAllowed()
    );
    me.setConsiderMileage(me.getBoTourMeta().getConsiderMileage());
    me.setConsiderVehicle(me.getBoTourMeta().getConsiderVehicle());
    me.setConsiderVehicleStatus(me.getBoTourMeta().getConsiderVehicleStatus());
    me.setConsiderSealCheck(me.getBoTourMeta().getConsiderSealCheck());
    me.setDeleteCallAllowed(me.getBoTourMeta().getDeleteCallAllowed());
    me.setDisplaySealWarning(me.getBoTourMeta().getDisplaySealWarning());
    me.setDeliveryListPreviewPrintout(
      me.getBoTourMeta().getDeliveryListPreviewPrintout()
    );
    me.setPrintUIGroup(me.getBoTourMeta().getPrintUIGroup());
    me.setSealCheckPresettingPolicy(
      me.getBoTourMeta().getSealCheckPresettingPolicy()
    );
    me.setAgendaScanBehavior(me.getBoTourMeta().getAgendaScanBehavior());
    me.setCoDriverRequired(me.getBoTourMeta().getCoDriverRequired());
    me.setCompletionReleaseTime(Utils.getMinDate());
    me.setCashCheckInRequired(me.getBoTourMeta().getCashCheckInRequired());
    me.setMultipleCashCheckInAllowed(
      me.getBoTourMeta().getMultipleCashCheckInAllowed()
    );
    me.setDefaultCurrency(me.getBoTourMeta().getDefaultCurrency());
    me.setAdvancedUOMAllowed(me.getBoTourMeta().getAdvancedUOMAllowed());
    me.setTSRLevelOfDetail(me.getBoTourMeta().getTSRLevelOfDetail());
    me.setTSRShowTourInfo(me.getBoTourMeta().getTSRShowTourInfo());
    me.setTSRShowVisitInfo(me.getBoTourMeta().getTSRShowVisitInfo());
    me.setTSRShowInventoryInfo(me.getBoTourMeta().getTSRShowInventoryInfo());
    me.setTSRShowDeliveryDocInfo(
      me.getBoTourMeta().getTSRShowDeliveryDocInfo()
    );
    me.setTSRShowSalesDocInfo(me.getBoTourMeta().getTSRShowSalesDocInfo());
    me.setTSRShowCashInfo(me.getBoTourMeta().getTSRShowCashInfo());
    me.setPreviewPrintout(me.getBoTourMeta().getPreviewPrintout());
    me.setInclDSDActivities(me.getBoTourMeta().getInclDSDActivities());
    me.setInclPreSalesActivities(
      me.getBoTourMeta().getInclPreSalesActivities()
    );
    me.setInclMerchActivities(me.getBoTourMeta().getInclMerchActivities());
    me.setInclOffRouteActivities(
      me.getBoTourMeta().getInclOffRouteActivities()
    );
    me.setUsrDocMetaPKey(me.getBoTourMeta().getUsrDocMetaPKey());
    me.setEARights();
    me.getACL().addRight(AclObjectType.PROPERTY, "message", AclPermission.EDIT);

    return BoFactory.loadObjectByParamsAsync("LoTmgMetaObjectRel", {
      tmgMetaPKey: me.getTmgMetaPKey(),
    });
  })
  .then(function (tmgMetaObjRel) {
    var objRels = BoFactory.instantiate("LoTmgTourObjectRelations");
    objRels.addItems(tmgMetaObjRel.serialize());
    var objRelItems = objRels.getAllItems();

    me.setLoTmgTourObjectRelations(objRels);
    for (var i = 0; i < objRels.getAllItems().length; i++) {
      objRelItems[i].setPKey(PKey.next());
      objRelItems[i].setTmgTourPKey(me.getPKey());
      objRelItems[i].setObjectStatus(STATE.NEW | STATE.DIRTY);
    }
    return BoFactory.loadObjectByParamsAsync("LoTmgMetaCheckRel", {
      tmgMetaPKey: me.getTmgMetaPKey(),
    });
  })
  .then(function (tmgMetaChkRel) {
    var chkRel = BoFactory.instantiate("LoTmgTourCheckRelations");
    chkRel.addItems(tmgMetaChkRel.serialize());
    me.setLoTmgTourCheckRelations(chkRel);

    var chkRelItems = chkRel.getAllItems();
    for (var i = 0; i < chkRel.getAllItems().length; i++) {
      chkRelItems[i].setPKey(PKey.next());
      chkRelItems[i].setTmgTourPKey(me.getPKey());
      chkRelItems[i].setObjectStatus(STATE.NEW | STATE.DIRTY);
    }
    //Call Number generator to create TourId
    if (!Utils.isEmptyString(me.getBoTourMeta().getSysNumberPKey())) {
      return SysNumber.getSysNumberAsync(me.getBoTourMeta().getSysNumberPKey());
    } else {
      return me.getPKey();
    }
  })
  .then(function (sysnumber) {
    //Set id
    me.setTourId(sysnumber);

    //create a description text for the newly created tour
    var tourDescription;
    if (!Utils.isEmptyString(me.getBoTourMeta().getSysNumberPKey())) {
      tourDescription = me.getTourId();
    } else {
      tourDescription = "";
    }

    var loTourDescription = BoFactory.instantiate("LoTourDescription");

    var liTourDescription = {
      pKey: PKey.next(),
      tmgTourPKey: me.getPKey(),
      language: user.getLanguageSpoken(),
      text: tourDescription,
      objectStatus: STATE.NEW | STATE.DIRTY,
    };

    loTourDescription.addListItems([liTourDescription]);
    loTourDescription.setCurrentByPKey(liTourDescription.getPKey());
    me.setLoTourDescription(loTourDescription);

    if (
      !Utils.isEmptyString(
        ApplicationContext.get("currentTourPKey")
      ) &&
      ApplicationContext.get("currentTourPKey") !== me.getPKey()
    ) {
      return BoFactory.loadObjectByParamsAsync("LuRunningTour", {}).then(
        function (result) {
          if (
            !Utils.isDefined(result) ||
            Utils.isEmptyString(result.getPKey())
          ) {
            ApplicationContext.set(
              "currentTourPKey",
              me.getPKey()
            );
          }

          return me;
        }
      );
    } else {
      ApplicationContext.set("currentTourPKey", me.getPKey());

      return me;
    }
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}