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
 * @function setNextWorkflowState
 * @this BoTruckLoad
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {String} actionName
 * @returns promise
 */
function setNextWorkflowState(actionName){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = when.resolve();
var orderMeta = me.getBoOrderMeta();
var nextStates = [];

if (actionName === "release") {
  nextStates = me.getBoWorkflow().getNextStatesByStateType(me.getActualStatePKey(), "Released");
}

//create recent state item
if(me.getBoWorkflow().getRecentStatePolicy() == "1") {
  var liRecentState = {
    "pKey" : PKey.next(),
    "done" : Utils.createDateNow(),
    "sdoMainPKey" : me.getPKey(),
    "usrMainPKey" : me.getResponsiblePKey(),
    "wfeStatePKey" : me.getActualStatePKey(),
    "objectStatus" : STATE.NEW | STATE.DIRTY
  };
  me.getLoWfeRecentState().addListItems([liRecentState]);
}

//set next state
if(Utils.isDefined(nextStates[0])) {
  me.setActualStatePKey(nextStates[0].getPKey());
  me.setNextStatePKey(me.getActualStatePKey());

  if(nextStates[0].getStateType() === "Released") {
    if(me.getDocumentType() === "ProductCheckOut") {
      me.setActualPrdCheckOutType("SKU");
    }
    me.setPhase("Released");

    if(me.getDocumentType() !== "TruckIvcTransferOutward" && me.getDocumentType() !== "TruckIvcTransferInward") {
      me.setValidateInventories("1");
    }
    if(me.getBoOrderMeta().getCaptureReleaseTime() == "1") {
      var currentDateTime = Utils.createDateNow();
      me.setReleaseTime(Utils.convertFullDate2Ansi(currentDateTime));
    }
  }

  //set next responsible
  promise = me.getBoWorkflow().getNextResponsible(nextStates[0].getPKey(), me.getResponsiblePKey(), me.getOwnerPKey()).then(
    function(responsiblePKey) {
      if(me.getResponsiblePKey() != responsiblePKey) {
        me.setResponsiblePKey(responsiblePKey);
      }

      //Create Notification and Sync along with released document
      if((me.getPhase() === "Released" && me.getDocumentType() === "TruckIvcTransferOutward") || (me.getDocumentType() == "TruckIvcTransferInward" && me.getPhase() == "Canceled")) {
        var jsonQuery = {};
        var jsonParams = [];
        var senderName = " ";

        if(Utils.isDefined(me.getLuSender())) {
          senderName = me.getLuSender().getName();
        }
        var recipientName = " ";
        if(Utils.isDefined(me.getLuRecipientDriver())) {
          recipientName = me.getLuRecipientDriver().getName();
        }

        jsonParams.push({"field" : "priority","value" : 'A'});
        jsonParams.push({"field" : "isRead","value" : '0'});
        jsonParams.push({"field" : "objectType","value" : 'TruckInventoryTransfer'});
        jsonParams.push({"field" : "referencePKey","value" : me.getPKey()});
        jsonParams.push({"field" : "usrNotificationMetaPKey","value" : orderMeta.getUsrNotificationMetaPKey()});
        var dueDateTime = Utils.createDateNow();
        jsonParams.push({"field" : "dueDate","value" : Utils.convertFullDate2Ansi(dueDateTime)});
        jsonParams.push({"field" : "private","value" : '0'});

        if(me.getPhase() === "Released" && me.getDocumentType() === "TruckIvcTransferOutward") {
          jsonParams.push({"field" : "category","value" : 'Inventory Transfer ready for Approval'});
          jsonParams.push({"field" : "initiatorUsrMainPKey","value" : me.getSenderPKey()});
          jsonParams.push({"field" : "usrMainPKey","value" : me.getRecipientPKey()});
          jsonParams.push({"field" : "subject","value" : senderName + " " + Localization.resolve("NotificationToRecipient")});
        }

        if(me.getDocumentType() == "TruckIvcTransferInward" && me.getPhase() == "Canceled") {
          jsonParams.push({"field" : "category","value" : 'Inventory Transfer has been rejected'});
          jsonParams.push({"field" : "initiatorUsrMainPKey","value" : me.getRecipientPKey()});
          jsonParams.push({"field" : "usrMainPKey","value" : me.getSenderPKey()});

          var reasonText ="";
          if(!Utils.isEmptyString(me.getCancelReason())) {
            reasonText = "Reason: " + me.getCancelReason();
          }
          jsonParams.push({"field" : "subject","value" : recipientName + " " + Localization.resolve("NotificationToSender") + "\n" + reasonText});
        }

        jsonQuery.params = jsonParams;
        return BoFactory.createObjectAsync("BoUsrNotification", jsonQuery);
      }
    }).then(
    function (boUsrNotification) { 
      if(Utils.isDefined(boUsrNotification)){
        me.setBoUsrNotification(boUsrNotification);
        me.getBoUsrNotification().setObjectStatus(STATE.NEW | STATE.DIRTY);
      }
    }
  );
}
else if(me.getDocumentType() == "TruckIvcTransferInward" && me.getPhase() == "Canceled") { //Create Notification for Sender on Rejection of the Inward Transfer

  var jsonParams = [];
  var jsonQuery = {};
  jsonParams.push({ "field" : "code", "value" : me.getCancelReason()});
  jsonQuery.params = jsonParams;
  var reasonText ="";

  promise = BoFactory.loadObjectByParamsAsync("LuSysToggleItemText", jsonQuery).then(
    function(luSysToggleItemText) {

      if(Utils.isDefined(luSysToggleItemText) && !Utils.isEmptyString(me.getCancelReason())) {
        reasonText = "Reason: " + luSysToggleItemText.getText();
      }
      var jsonParams = [];
      var jsonQuery = {};
      jsonParams.push({"field" : "priority","value" : 'A'});
      jsonParams.push({"field" : "isRead","value" : '0'});
      jsonParams.push({"field" : "category","value" : 'Inventory Transfer has been rejected'});
      jsonParams.push({"field" : "initiatorUsrMainPKey","value" : me.getRecipientPKey()});
      jsonParams.push({"field" : "usrMainPKey","value" : me.getSenderPKey()});

      var recipientName = " ";
      if(Utils.isDefined(me.getLuRecipientDriver())) {
        recipientName = me.getLuRecipientDriver().getName();
      }
      jsonParams.push({"field" : "subject","value" : recipientName + " " + Localization.resolve("NotificationToSender") + "\n" + reasonText});
      jsonParams.push({"field" : "objectType","value" : 'TruckInventoryTransfer'});
      jsonParams.push({"field" : "referencePKey","value" : me.getPKey()});
      jsonParams.push({"field" : "usrNotificationMetaPKey","value" : orderMeta.getUsrNotificationMetaPKey()});
      var dueDateTime = Utils.createDateNow();
      jsonParams.push({"field" : "dueDate","value" : Utils.convertFullDate2Ansi(dueDateTime)});
      jsonParams.push({"field" : "private","value" : '0'});
      jsonQuery.params = jsonParams;

      return BoFactory.createObjectAsync("BoUsrNotification", jsonQuery);
    }).then(
    function(boUsrNotification) {
      if(Utils.isDefined(boUsrNotification)) {
        me.setBoUsrNotification(boUsrNotification);
        me.getBoUsrNotification().setObjectStatus(STATE.NEW | STATE.DIRTY);
      }
    }
  );
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}