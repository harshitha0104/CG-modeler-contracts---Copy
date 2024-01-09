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
 * @function createAsync
 * @this BoCall
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} jsonQuery
 * @returns promise
 */
function createAsync(jsonQuery){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = when.resolve();
if (!jsonQuery) {
  jsonQuery = {};
}

if (
  jsonQuery.clbMetaPKey !== null &&
  !Utils.isEmptyString(jsonQuery.clbMetaPKey)
) {
  var currentUsrMainPKey = ApplicationContext.get("user").getPKey();

  //Unwrap parameters
  var newParams = jsonQuery;
  if (Utils.isOldParamsFormat(jsonQuery)) {
    newParams = Utils.convertDsParamsOldToNew(jsonQuery);
  }

  var pKey = PKey.next();
  me.setPKey(pKey);
  var dDateFrom = me.getDateFrom();
  me.setDateFrom(dDateFrom);
  me.setClbStatus("Planned");
  me.setOriginalClbStatus("Planned");
  me.updateProperties(jsonQuery);

  // Determine substitution Info
  var managementInfoParams = [];
  var managementInfoQuery = {};

  managementInfoParams.push({
    field: "customerPKey",
    value: newParams.bpaMainPKey,
  });
  managementInfoParams.push({
    field: "referenceDate",
    value: newParams.dateFrom,
  });
  managementInfoParams.push({
    field: "referenceUserPKey",
    value: newParams.responsiblePKey,
  });

  managementInfoQuery.params = managementInfoParams;

  promise = BoFactory.loadObjectByParamsAsync(
    "LuCustomerManagementInfo",
    managementInfoQuery
  )
    .then(function (customerManagementInfoLookup) {
      if (customerManagementInfoLookup) {
        me.setHasSubstitute(customerManagementInfoLookup.getHasSubstitute());
        me.setSubstitutedUsrPKey(
          customerManagementInfoLookup.getSubstitutedUsrMainPKey()
        );
        me.setIsManagedCustomer(customerManagementInfoLookup.getIsManaged());
        me.setIsSubstituted(customerManagementInfoLookup.getIsSubstituted());
        me.setSubValidFrom(customerManagementInfoLookup.getSubstitutedFrom());
        me.setSubValidThru(customerManagementInfoLookup.getSubstitutedThru());
      }

      // workaround until allDay flag is delivered in proper format by call calendar
      if (
        typeof newParams.allDay !== "object" &&
        Utils.isDefined(newParams.allDay) &&
        newParams.allDay &&
        newParams.allDay !== "0"
      ) {
        me.setAllDay("1");
      }
      //Set original responsible if a call is created in substitution
      if (
        !Utils.isEmptyString(newParams.substitutedUsrPKey) &&
        (newParams.isManagedCustomer.getId() !== "1" ||
          newParams.isSubstituted == "1")
      ) {
        me.setResponsiblePKey(newParams.substitutedUsrPKey);
        me.setOwnerPKey(newParams.substitutedUsrPKey);
      } else {
        if (Utils.isEmptyString(me.getResponsiblePKey())) {
          me.setResponsiblePKey(currentUsrMainPKey);
        }
        if (Utils.isEmptyString(me.getOwnerPKey())) {
          me.setOwnerPKey(me.getResponsiblePKey());
        }
      }

      me.setInitiatorPKey(currentUsrMainPKey);

      //check if working in tour context
      if (
        Utils.isDefined(
          ApplicationContext.get("currentTourPKey")
        )
      ) {
        me.setTmgMainPKey(
          ApplicationContext.get("currentTourPKey")
        );
      } else {
        me.setTmgMainPKey(" ");
      }

      me.setCreationDateTime(Utils.createAnsiDateTimeNow());
      var jsonParams = me.prepareLookupsLoadParams(me);
      return Facade.loadLookupsAsync(jsonParams);
    })
    .then(function (lookups) {
      me.assignLookups(lookups);
      if (Utils.isEmptyString(me.getLuCustomer().getName())) {
        me.setSubject(me.getLuCallMeta().getText());
      } else {
        me.setSubject(
          me.getLuCustomer().getName() + " " + me.getLuCallMeta().getText()
        );
      }

      // set private flag
      if (me.getLuCallMeta().getMetaType() === "Private") {
        me.setIsPrivate("1");
      }

      //Calculate TimeThru
      var duration = me.getDuration();
      if (duration === 0) {
        duration = me.getLuCallMeta().getDefaultDuration();
      }

      var splitString = me.getTimeFrom().split(":");

      var d1 = Utils.convertAnsiDate2Date(me.getDateFrom());

      d1.setHours(splitString[0], splitString[1], 0, 0);
      d1.setMinutes(d1.getMinutes() + duration);
      me.setTimeThru(Utils.convertTime2Ansi(d1));

      d1.setHours(0, 0, 0, 0);
      me.setDateThru(Utils.convertFullDate2Ansi(d1));
      me.setDuration(duration);
    
      //update duration for all day calls and multiple all day calls. Time part must be ignored
      if(me.getAllDay() == '1'){
        if(me.getDateFrom() === me.getDateThru())me.setDuration(24*60);
        else me.setDuration(me.getCallDuration(me.getDateFrom(), "00:00", me.getDateThru(), "00:00") + (24*60));
      }

      if (me.getLuCallMeta().getCaptureProceedingTime() == "1") {
        var currentDateTime = Utils.createDateNow();
        me.setStartTimeEffective(Utils.convertFullDate2Ansi(currentDateTime));
        me.setStartTimeEffectiveTimezoneOffset(currentDateTime.getTimezoneOffset());
        me.setStartTimeEffectiveUI(Utils.convertFullDate2Time(currentDateTime));
      }

      var locationsList = newParams.locationsList.getAllItems();
      var defaultLocation = locationsList.find(function(location) {
        return location.name === "Default Location";
      });

      if (defaultLocation) {
        me.setPlaceId(defaultLocation.pKey);
      }
    
      me.setBoJobManager(
        BoFactory.instantiate("BoJobManager", {
          clbMainPKey: me.getPKey(),
          clbMetaPKey: me.getClbMetaPKey(),
          clbStatus: me.getClbStatus(),
          originalClbStatus: me.getOriginalClbStatus(),
          bpaMainPKey: me.getBpaMainPKey(),
          referenceDate: me.getDateFrom(),
          timeFrom: me.getTimeFrom(),
          bpaName: me.getLuCustomer().getName(),
          considerPOSCheck: me.getLuCallMeta().getConsiderPOSCheck(),
          considerTargetValues: me.getLuCallMeta().getConsiderTargetValues(),
          responsiblePKey: me.getResponsiblePKey(),
          ownerPKey: me.getOwnerPKey(),
          historicalProductConfig: me.getLuCallMeta().getHistoricalProducts(),
          considerModule: me.getConsiderModule(),
        })
      );

      //check management / substitution info for EA-Rights
      if (!Utils.isEmptyString(me.getBpaMainPKey())) {
        var cmiParams = [];
        var cmiQuery = {};

        cmiParams.push({
          field: "customerPKey",
          value: me.getBpaMainPKey(),
        });
        cmiParams.push({
          field: "referenceDate",
          value: me.getDateFrom(),
        });
        cmiParams.push({
          field: "referenceUserPKey",
          value: newParams.responsiblePKey,
        });
        cmiQuery.params = cmiParams;

        return BoFactory.loadObjectByParamsAsync(
          "LuCustomerManagementInfo",
          cmiQuery
        );
      } else {
        return undefined;
      }
    })
    .then(function (customerManagementInfoLookup) {
      //If this is a substituted call, check attribut for EA-Rights
      if (Utils.isDefined(customerManagementInfoLookup)) {
        me.setLuCustomerManagementInfo(customerManagementInfoLookup);
        me.updateSubstitutionInfo();
      }
      me.setEARights();
      me.setObjectStatus(STATE.NEW | STATE.DIRTY);
      return me.updateJobListMagnetization();
    })
    .then(function () {
      return me;
    });
} else {
  var messageCollector = new MessageCollector();
  var newError = {
    level: "error",
    objectClass: "BoCall",
    messageID: "CasClbCallCannotBeCreated",
  };
  messageCollector.add(newError);
  var buttonValues = {};
  var messages = messageCollector.getMessages().join("<br>");
  buttonValues[Localization.resolve("OK")] = "ok";
  promise = MessageBox.displayMessage(
    Localization.resolve("MessageBox_Title_Validation"),
    messages,
    buttonValues
  ).then(function () {
    return when.resolve("callCreationFailed");
  });
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}