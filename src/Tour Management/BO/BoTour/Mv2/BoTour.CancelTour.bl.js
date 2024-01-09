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
 * @function cancelTour
 * @this BoTour
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {String} reasonCode
 * @param {String} cancelNote
 * @returns promise
 */
function cancelTour(reasonCode, cancelNote){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
//#######################################################
//### Cancel Visit + Delivery documents of the visits ###
//#######################################################
var cancelVisit = function (callPKey) {
  return BoFactory.loadObjectByParamsAsync("BoCall", { "pKey" : callPKey }).then(
    function (objBoCall) {
      objBoCall.cancel("CanceledByTour", true);
    }
  );
};

//############################################
//### Cancel Inventory/TruckLoad Documents ###
//############################################
var cancelInvDocument = function (pKey) {
  var jqueryParams = [];
  var jqueryQuery = {};
  jqueryParams.push({
    "field" : "pKey",
    "value" : pKey
  });
  jqueryParams.push({
    "field" : "isCanceling",
    "value" : "true"
  });
  jqueryQuery.params = jqueryParams;

  return BoFactory.loadObjectByParamsAsync("BoTruckLoad", jqueryQuery).then(
    function (objBoTruckLoad) {
      objBoTruckLoad.cancel("CanceledByTour");
      objBoTruckLoad.setObjectStatusIsFrozen(false);
      objBoTruckLoad.setObjectStatus(STATE.DIRTY | STATE.PERSISTED);
      return objBoTruckLoad.saveAsync();
    }
  );
};

//#############################
//### Cancel Cash Documents ###
//#############################
var cancelCashDocument = function (pKey) {
  return BoFactory.loadObjectByParamsAsync("BoCash", { "pKey" : pKey }).then(
    function (objBoCash) {
      objBoCash.cancel("CanceledByTour");
      objBoCash.setObjectStatusIsFrozen(false);
      objBoCash.setObjectStatus(STATE.DIRTY | STATE.PERSISTED);

      return objBoCash.saveAsync();
    }
  );
};

//##################################################
//### Cancel Order Entry -Non Delivery Documents ###
//##################################################
var cancelOrderDocument = function (pKey) {
  var jqueryQuery = {};

  jqueryQuery.params = [
    {
      "field" : "pKey",
      "value" : pKey
    },
    {
      "field" : "isCanceling",
      "value" : "true"
    }
  ];

  return BoFactory.loadObjectByParamsAsync("BoOrder", jqueryQuery).then(
    function (objBoOrder) {
      objBoOrder.cancel("CanceledByTour");
      objBoOrder.setObjectStatusFrozen(false);
      objBoOrder.setObjectStatus(STATE.DIRTY | STATE.PERSISTED);

      return objBoOrder.saveAsync();
    }
  );
};

//########################
//### Update Time Card ###
//########################
var updateTimeCard = function (pKey) {
  return BoFactory.loadObjectByParamsAsync(BO_USERDAILYREPORT, { "pKey" : pKey }).then(
    function (boUserDailyReport) {

      //Dont release the tiemcard if it is not related to the current user
      var currentUserPKey = ApplicationContext.get('user').getPKey();
      if (boUserDailyReport.getOwnerUsrMainPKey() === currentUserPKey && boUserDailyReport.getResponsiblePKey() === currentUserPKey) {
        return boUserDailyReport.setNextWorkflowState("Release").then(
          function (boUserDailyReport) {
            return boUserDailyReport.saveAsync();
          }
        );
      }
    }
  );
};

BusyIndicator.show();

Facade.startTransaction();

var deferreds = [];

//cancel open visits
var visits = me.getLoTourRelatedCalls().getAllItems();

if (Utils.isDefined(visits) && visits.length > 0) {
  for (var index = 0; index < visits.length; index++) {
    deferreds.push(cancelVisit(visits[index].getPKey()));
  }
}

//Check all open documents i.e. Not Released/Canceled
var cancelReason = Utils.isDefined(reasonCode) ? reasonCode : "";

var promise = BoFactory.loadObjectByParamsAsync("LoTourRelatedDocuments", { "tmgMainPKey" : me.getPKey() }).then(
  function (loTourRelatedDocuments) {

    if (Utils.isDefined(loTourRelatedDocuments)) {
      var documents = loTourRelatedDocuments.getAllItems();

      if (Utils.isDefined(documents) && documents.length > 0) {
        for (var idx = 0; idx < documents.length; idx++) {
          if (documents[idx].getDocMetaType() == "TruckLoad" || documents[idx].getDocMetaType() == "InventoryTransfer") {
            deferreds.push(cancelInvDocument(documents[idx].getPKey()));
          }

          if (documents[idx].getDocMetaType() == "CashDocument") {
            deferreds.push(cancelCashDocument(documents[idx].getPKey()));
          }

          if (documents[idx].getDocMetaType() == "OrderEntry") {
            deferreds.push(cancelOrderDocument(documents[idx].getPKey()));
          }
        }
      }
    }

    return when.all(deferreds).then(
      function () {

        //all calls and documents should be cancelled here
        //now time card can be updated
        var updateTimeCardPromise;

        //check if in current running tour context
        var currentTourPKey = ApplicationContext.get('currentTourPKey');
        var currentTourStatus = ApplicationContext.get('currentTourStatus');
        var openTimeCardPKey = ApplicationContext.get('openTimeCardPKey');

        if(Utils.isDefined(currentTourPKey) && !Utils.isEmptyString(currentTourPKey) && currentTourPKey == me.getPKey() && Utils.isDefined(currentTourStatus) && currentTourStatus === "Running" && Utils.isDefined(openTimeCardPKey) && !Utils.isEmptyString(openTimeCardPKey)){
          updateTimeCardPromise = updateTimeCard(ApplicationContext.get('openTimeCardPKey'));
        }
        else {
          updateTimeCardPromise = when.resolve();
        }

        return updateTimeCardPromise.then(
          function () {

            //time card is updated now
            //tour can be cancelled
            me.setTmgStatus("Canceled");
            me.setCancelReason(cancelReason);
            if (Utils.isDefined(cancelNote)) {
              me.setCancelNote(cancelNote);
            }

            //check if in current running tour context
            var currentTourPKey = ApplicationContext.get('currentTourPKey');
            var currentTourStatus = ApplicationContext.get('currentTourStatus');

            if(Utils.isDefined(currentTourPKey) && !Utils.isEmptyString(currentTourPKey) && currentTourPKey == me.getPKey() && Utils.isDefined(currentTourStatus) && currentTourStatus === "Running"){
              ApplicationContext.set('currentTourPKey', '');
              ApplicationContext.set('currentTourStatus', '');
              ApplicationContext.set('openTimeCardPKey', '');
            }

            return Facade.commitTransaction();
          }
        );
      }
    );
  }
);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}