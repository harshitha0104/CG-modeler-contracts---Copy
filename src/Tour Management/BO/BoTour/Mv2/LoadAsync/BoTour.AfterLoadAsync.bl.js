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
 * @function afterLoadAsync
 * @this BoTour
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} result
 * @param {Object} context
 * @returns promise
 */
function afterLoadAsync(result, context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
if (
  Utils.isEmptyString(me.getTimeFrom()) ||
  me.getTimeFrom() === Utils.getMinDateTime()
) {
  me.setTimeFrom("00:00");
}
if (
  Utils.isEmptyString(me.getTimeThru()) ||
  me.getTimeThru() === Utils.getMinDateTime()
) {
  me.setTimeThru("00:00");
}
me.setActualUsrMainPKey(
  ApplicationContext.get("user").getPKey()
);

me.setReleaseButton(false);
me.setCompleteButton(false);
me.setReleaseInfoButton(false);
me.setCompleteInfoButton(false);
me.tourDate = Utils.createAnsiDateTimeToday();

if (me.getTmgStatus() === "Initial") {
  me.setTmgStatus("Open");
  me.setObjectStatus(STATE.PERSISTED | STATE.DIRTY);
  me.setReleaseButton(true);
  me.setCompleteButton(false);
}

if (me.getTmgStatus() === "Open") {
  me.setReleaseButton(true);
  me.setCompleteButton(false);

  //set current time as start time
  var startTime = Utils.createAnsiTimeNow();
  me.setTimeFrom(startTime);
}

if (
  me.getTmgStatus() === "Running" &&
  Utils.convertDsParamsOldToNew(context.jsonQuery).mode !== "StartOfDay"
) {
  me.setReleaseButton(false);
  me.setCompleteButton(true);
}

var promise = BoFactory.loadObjectByParamsAsync(
  BO_TOURMETA,
  me.getQueryBy("pKey", me.getTmgMetaPKey())
)
  .then(function (boTourMeta) {
    me.setBoTourMeta(boTourMeta);

    return BoFactory.loadListAsync(
      "LuTourTemplate",
      me.getQueryBy("pKey", me.getTmgMetaPKey())
    );
  })
  .then(function (luTemplate) {
    me.setLuTemplate(luTemplate);

    return BoFactory.loadListAsync(
      "LoTourRelatedCalls",
      me.getQueryBy("tmgMainPKey", me.getPKey())
    );
  })
  .then(function (loTourRelatedCalls) {
    me.setLoTourRelatedCalls(loTourRelatedCalls);

    return BoFactory.loadListAsync(
      "LoTmgTourObjectRelations",
      me.getQueryBy("tmgMainPKey", me.getPKey())
    );
  })
  .then(function (loTmgTourObjectRelations) {
    me.setLoTmgTourObjectRelations(loTmgTourObjectRelations);

    return BoFactory.loadListAsync(
      "LoSysSignatureAttribute",
      me.getQueryBy("referencePKey", me.getPKey())
    );
  })
  .then(function (loSysSignatureAttribute) {
    me.setLoSysSignatureAttribute(loSysSignatureAttribute);

    return BoFactory.loadListAsync(
      "LoSysSignatureBlob",
      me.getQueryBy("referencePKey", me.getPKey())
    );
  })
  .then(function (loSysSignatureBlob) {
    me.setLoSysSignatureBlob(loSysSignatureBlob);

    return BoFactory.loadListAsync(
      "LoCallLocation",
      me.getQueryBy("tmgMainPKey", me.getPKey())
    );
  })
  .then(function (loGeoLocation) {
    me.setLoGeoLocation(loGeoLocation);

    return BoFactory.loadListAsync(
      "LoTourDescription",
      me.getQueryBy("tmgTourPKey", me.getPKey())
    );
  })
  .then(function (loTourDescription) {
    me.setLoTourDescription(loTourDescription);

    return BoFactory.loadListAsync(
      "LoTmgMetaCheckRel",
      me.getQueryBy("tmgMetaPKey", me.getTmgMetaPKey())
    );
  })
  .then(function (loTmgMetaCheckRel) {
    me.setLoTmgMetaCheckRel(loTmgMetaCheckRel);

    return BoFactory.loadListAsync(
      "LoTmgTourCheckRelations",
      me.getQueryBy("tmgMainPKey", me.getPKey())
    );
  })
  .then(function (loTmgTourCheckRelations) {
    me.setLoTmgTourCheckRelations(loTmgTourCheckRelations);

    return BoFactory.loadListAsync(
      "LoTourChecks",
      me.getQueryBy("tmgMainPKey", me.getPKey())
    );
  })
  .then(function (loTourChecks) {
    me.setLoTourChecks(loTourChecks);

    return me.determineSysReleaseProcessPKey(me.getTmgStatus());
  })
  .then(function (pkey) {
    if (me.getTmgStatus().toLowerCase() === "running") {
      me.setStoredSysReleasePKey(pkey);
    }

    if (me.getTmgStatus().toLowerCase() === "completed") {
      me.setStoredSysCompletePKey(pkey);
    }

    if (
      me.getTmgStatus() === "Running" &&
      !Utils.isEmptyString(me.getStoredSysReleasePKey()) &&
      Utils.convertDsParamsOldToNew(context.jsonQuery).mode !== "EndOfDay"
    ) {
      me.setReleaseInfoButton(true);
      me.setCompleteInfoButton(false);
      if (
        Utils.convertDsParamsOldToNew(context.jsonQuery).navigationMode ==
        "StartOfDay"
      ) {
        me.setCompleteButton(false);
      }
    }
    if (
      me.getTmgStatus() === "Completed" &&
      !Utils.isEmptyString(me.getStoredSysCompletePKey()) &&
      Utils.convertDsParamsOldToNew(context.jsonQuery).mode !== "StartOfDay"
    ) {
      me.setReleaseInfoButton(true);
      me.setCompleteInfoButton(true);
      if (
        Utils.convertDsParamsOldToNew(context.jsonQuery).navigationMode ==
        "EndOfDay"
      ) {
        me.setReleaseInfoButton(false);
      }
    }

    return BoFactory.loadObjectByParamsAsync(
      "LuUser",
      me.getQueryBy("pKey", me.getCoDriverUsrMainPKey())
    );
  })
  .then(function (luuCoDriverLookUp) {
    me.setLuCoDriver(luuCoDriverLookUp);

    return BoFactory.loadObjectByParamsAsync(
      "LuEtpWarehouse",
      me.getQueryBy("pKey", me.getStartEtpWarehousePKey())
    );
  })
  .then(function (luEtpWarehouseLookUp) {
    me.setLuEtpWarehouse(luEtpWarehouseLookUp);

    return BoFactory.loadObjectByParamsAsync(
      "LuEtpWarehouse",
      me.getQueryBy("pKey", me.getEndEtpWarehousePKey())
    );
  })
  .then(function (luEndEtpWarehouseLookUp) {
    me.setLuEndEtpWarehouse(luEndEtpWarehouseLookUp);

    return BoFactory.loadObjectByParamsAsync(
      "LuEtpVehicle",
      me.getQueryBy("pKey", me.getEtpVehicleTruckPKey())
    );
  })
  .then(function (luTruckLookUp) {
    me.setLuTruck(luTruckLookUp);

    return BoFactory.loadObjectByParamsAsync(
      "LuEtpVehicle",
      me.getQueryBy("pKey", me.getEtpVehicleTrailer1PKey())
    );
  })
  .then(function (luTrailer1LookUp) {
    me.setLuTrailer1(luTrailer1LookUp);

    return BoFactory.loadObjectByParamsAsync(
      "LuEtpVehicle",
      me.getQueryBy("pKey", me.getEtpVehicleTrailer2PKey())
    );
  })
  .then(function (luTrailer2LookUp) {
    me.setLuTrailer2(luTrailer2LookUp);

    return BoFactory.loadObjectByParamsAsync("LuUser", {
      pKey: me.getActualUsrMainPKey(),
    });
  })
  .then(function (result) {
    me.setLuDriver(result);

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
            ApplicationContext.set(
              "currentTourStatus",
              me.getTmgStatus()
            );
          } else {
            me.setReleaseButton(false);
          }

          me.setEARights();

          return me;
        }
      );
    } else {
      ApplicationContext.set("currentTourPKey", me.getPKey());
      ApplicationContext.set(
        "currentTourStatus",
        me.getTmgStatus()
      );
      me.setEARights();

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