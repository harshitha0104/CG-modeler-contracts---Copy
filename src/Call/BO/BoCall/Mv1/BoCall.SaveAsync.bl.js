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
 * @function saveAsync
 * @this BoCall
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @returns promise
 */
function saveAsync(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
/********************************************************************************************
*  2 CGCloud tables / 1 onPrem table                                                           *
*                                                                                           *
*  CGCloud:	-Customer related calls: Store Visit and Event record                         *
*           -Non customer related calls: Store only Event                                   *
*  onPrem:  -Only a call record for customer related and non customer related calls         *
*********************************************************************************************/

// check and correct start/end time timestamps (timezone differences)
me.checkStartEndTime();

var deferreds = [];
// Preserve Substitution Flag
var substitution = me.getSubstitution();
var subMainPKey = me.getSubMainPKey();
// Reset substitution flag in order not to be saved as long as the call is not completed
if ((me.getSubstitution() == "1" || !Utils.isEmptyString(me.getSubMainPKey())) && me.getClbStatus() !== "Completed") {
  me.setSubstitution("0");
  me.setSubMainPKey(" ");
}
//Update responsible to current user if required
var usrMainPKey = ApplicationContext.get('user').getPKey();
if (me.getResponsiblePKey() != usrMainPKey && me.getClbStatus() === "Completed" && me.getOriginalClbStatus() !== "Completed") {
  me.setResponsiblePKey(usrMainPKey);
}
// SF/CASDIF: General Dif
if (Utils.isSfBackend()) { // <!-- CW-REQUIRED: Framework is now Utils -->
  // In SF, we need to store a record to "Event" as well 
  deferreds.push(BoFactory.createObjectAsync("BoSfHelper", {}).then(
    function (helper) {
      //in case of normal save dateFrom/DateThru is a ANSI Datestring
      //in case od drag and drop of the call in the agenda date from is a javascript date
      if (me.getDateFrom() instanceof Date) {
        me.setDateFrom(Utils.convertDate2Ansi(me.getDateFrom()));
      }
      if (me.getDateThru() instanceof Date) {
        me.setDateThru(Utils.convertDate2Ansi(me.getDateThru()));
      }
      var ansi_sf_startDateTime = me.getDateFrom().substr(0,10) + " " + ("0" + me.getTimeFrom()).slice(-5) + ":00";
      var additionalMappings = [
        { name: "sf_activityDateTime", dsColumn: "ActivityDateTime", value: Utils.convertAnsiDate2Date(ansi_sf_startDateTime).getTime() }
      ];

      // Store to Visit only, if it is a customer related call
      if (me.getLuCallMeta().getCompanyRequired() !== "Not required") {
        additionalMappings.push({ name: "sf_startDateTime", dsColumn: "PlannedVisitStartTime", value: Utils.convertAnsiDate2Date(ansi_sf_startDateTime).getTime() });
        additionalMappings.push({ name: "sf_endDateTime", dsColumn: "PlannedVisitEndTime", value: Utils.convertAnsiDate2Date(me.getDateThru().substr(0,10) + " " + me.getTimeThru() + ":00").getTime() });
        return helper.saveTrackedObject(me, additionalMappings);
      } else {

        // Combine activity date time for Event, needs to be set - required by SF
        if ((me.getObjectStatus() & STATE.NEW) > 0) {
          additionalMappings.push({name: "eventId", dsColumn: "Id", value: PKey.next()});
        }    
        var eventMapping = {
          "subject": "Subject",
          "duration": "DurationInMinutes",
          "eventId": "Id",
          "isPrivate" : "IsPrivate",  
          // Combined date/time fields
          "allDay": "IsAllDayEvent",
          "note": "Description"
        };

        additionalMappings.push({ name: "sf_startDateTime", dsColumn: "StartDateTime", value: Utils.convertAnsiDate2Date(ansi_sf_startDateTime).getTime() });
        additionalMappings.push({ name: "sf_endDateTime", dsColumn: "EndDateTime", value: Utils.convertAnsiDate2Date(me.getDateThru().substr(0,10) + " " + me.getTimeThru() + ":00").getTime() });

        // In case of non-customer call, the template needs to be stored with the event record
        if (me.getLuCallMeta().getCompanyRequired() === "Not required") {     
          eventMapping.clbMetaPKey = "Visit_Template__c";
          additionalMappings.push({name: "sf_call_template_name", dsColumn: "Type", value: me.getLuCallMeta().getId()});
        } else {
          eventMapping.bpaMainPKey = "AccountId";
          eventMapping.pKey = "WhatId";
        }
        var mapping = {
          tableName: "Event",
          idColumn: "Id",
          idProperty: "eventId",
          columnMapping: eventMapping
        };
        return helper.saveTrackedObjectWithMapping(me, mapping, additionalMappings);
      }
    }));
} else {
  deferreds.push(Facade.saveObjectAsync(me));
}

// save list(s)
if(!Utils.isSfBackend()) {
  if (Utils.isDefined(me.getLoCallLocation())) {
    deferreds.push(Facade.saveListAsync(me.getLoCallLocation()));
  }
  if (Utils.isDefined(me.getLoAtmAttachment())) {
    deferreds.push(me.getLoAtmAttachment().saveAsync());
  }
}
if (Utils.isDefined(me.getLoCssBLProcessingSchedule())) {
  deferreds.push(me.getLoCssBLProcessingSchedule().saveAsync());
}
if (Utils.isDefined(me.getLoCallAssetOverview())) {
  deferreds.push(me.getLoCallAssetOverview().saveAsync());
}
if (Utils.isDefined(me.getLoBpaUsrCallSettings())) {
  deferreds.push(me.getLoBpaUsrCallSettings().saveAsync());
}

// save nested object(s)
var boJobManagerPromise = me.getBoJobManager().saveAsync();

if (Utils.isDefined(me.getLoCallAttachments())){
  deferreds.push(boJobManagerPromise.then(function(historicalQuestionKeyMapping){
    //CGCloud: call attachments should be saved after BoJobManager is saved since pictures depend upon LoQuestions
    if(Utils.isSfBackend() && Utils.isDefined(me.getBoJobManager().getLoQuestions())){
      var loCallAttachments = me.getLoCallAttachments().getAllItems();
      var loQuestions = me.getBoJobManager().getLoQuestions().getAllItems();
      var questionsId = loQuestions.map(function(question){return question.getPKey();});
      var invalidPictures = [];
      var currentAttachment;
      var currentParentId;

      for(var idxAttachments=0; idxAttachments < loCallAttachments.length; idxAttachments++){
        currentAttachment = loCallAttachments[idxAttachments];
        currentParentId = currentAttachment.getClbMainPKey();

        //only question attachments will be processed further
        if(currentParentId != me.getPKey()){
          //check if attachment reference was replaced while saving question in boJobManager .. if so replace reference key in attachment too
          if(historicalQuestionKeyMapping.containsKey(currentParentId)){
            currentAttachment.setClbMainPKey(historicalQuestionKeyMapping.get(currentParentId));
          } else if(!questionsId.includes(currentParentId)){
            //check if there exist attachments without questions relation (e.g. if question done flag was removed) .. if so remove the attachment
            invalidPictures.push(currentAttachment);
          }
        }
      }

      invalidPictures.forEach(function(invalidPicture){
        invalidPicture.delete();
      });
    }
    return me.getLoCallAttachments().saveAsync();
  }));
} else{
  deferreds.push(boJobManagerPromise);
}

//no time entries when call is cancelled
if (me.getClbStatus() !== "Abandoned") {
  if (Utils.isDefined(me.getBoUserDailyReport())) {
    if (!Utils.isEmptyString(me.getTimeEntryPKey())) {
      if (me.getObjectStatus() !== Utils.data.Model.STATE_DELETED) {
        if (Utils.isDefined(me.getCloseTimeEntry()) && me.getCloseTimeEntry() === '1') {
          deferreds.push(me.getBoUserDailyReport().closeTimeEntry(me.getTimeEntryPKey(), false).then(function () {
            return me.getBoUserDailyReport().saveAsync();
          }));
        } else {
          deferreds.push(me.getBoUserDailyReport().saveAsync());
        }

      } else {
        deferreds.push(me.getBoUserDailyReport().saveAsync());
      }
    }
  }
}

//Calculate KPI
if(me.getKpiRelevant() === "All"){
  deferreds.push(me.calculateKpi());
}

var promise = when.all(deferreds)
  .then(function () {
  // Restore preserved substitution flag
  me.setSubstitution(substitution);
  me.setSubMainPKey(subMainPKey);
  // initiate background sync if configured
  var syncOption = me.getLuCallMeta().getSyncOptions();
  if (me.getClbStatus() === "Completed" && me.getOriginalClbStatus() !== "Completed") {
    if (syncOption == "CompleteCall" || syncOption == "CompleteCancelCall") {
      Facade.startBackgroundReplication();
    }
  } else if (me.getClbStatus() === "Abandoned" && me.getOriginalClbStatus() !== "Abandoned") {
    if (syncOption == "CancelCall" || syncOption == "CompleteCancelCall") {
      Facade.startBackgroundReplication();
    }
  }
  //Reset object status for all to prevent multiple saves
  me.traverse(function(node){
    node.setObjectStatus(STATE.PERSISTED);
    if(node.isList) {
      node.getAllItems().forEach(function (item){
        item.setObjectStatus(STATE.PERSISTED);
      });
    }
  },function (a, b, c){});
});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}