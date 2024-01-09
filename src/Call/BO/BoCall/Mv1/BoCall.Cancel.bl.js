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
 * @function cancel
 * @this BoCall
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} reasonCode
 * @param {String} disableTransactionHandling
 * @returns promise
 */
function cancel(reasonCode, disableTransactionHandling){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
//the system deletes jobs and detaches job lists.
var deliveryCancelPromises = [];
//needed for cancelTour case because transaction handling is managed in BoTour.cancelTour
var executeTransaction = true;

if(Utils.isDefined(disableTransactionHandling) &&
   (disableTransactionHandling == "1" || disableTransactionHandling === "true" || disableTransactionHandling === true)){
  executeTransaction = false;
}
if(executeTransaction){
  Facade.startTransaction();
}
if (Utils.isDefined(reasonCode)) {
  me.setReasonCode(reasonCode);
}

//Delete JobLists and standard JobDefLists
//capture after Status set to Abandoned
me.setClbStatus("Abandoned");
me.captureProceedingTime("true");

var promise = me.getBoJobManager().loadAndSetPrerequisites("StatusChange_Delete").then(
  function () {
    me.getBoJobManager().getLoCurrentSurveys().delete();
    me.getBoJobManager().getLoQuestions().delete();
    me.getBoJobManager().getLoMagnetizedJobList().demagnetizeAll();
    // assign surveys to some POS so that the deletion will be saved
    me.getBoJobManager().getLoPOS().getFirstItem().setSurveys(me.getBoJobManager().getLoCurrentSurveys());

    if (me.getLuCallMeta().getLocCaptureDuringCancel() == "1") {
      return me.getPosition();
    }
  }).then(function(){
  // Parameters to load the Deliveries
  var jqueryParams = [];
  var jqueryQuery = {};
  jqueryParams.push({"field" : "callCustomerPKey", "value" : me.getBpaMainPKey()});
  jqueryParams.push({"field" : "uIPosition", "value" : "Delivery"});
  jqueryParams.push({"field" : "callPKey", "value" : me.getPKey()});
  jqueryQuery.params = jqueryParams;

  //TourCase: Check if Call/Visit is in current running tour context
  if(Utils.isDefined(ApplicationContext.get('currentTourPKey')) && !Utils.isEmptyString(ApplicationContext.get('currentTourPKey')) &&
     ApplicationContext.get('currentTourPKey') == me.getTmgMainPKey() && Utils.isDefined(ApplicationContext.get('currentTourStatus')) && ApplicationContext.get('currentTourStatus') === "Running"){

    //load all kinds of open sales documents assigned to the visit
    return BoFactory.loadObjectByParamsAsync("LoCallRelatedDocuments", jqueryQuery);
  }
  else{
    //load call related delivery documents
    return BoFactory.loadObjectByParamsAsync("LoDeliveryOverview", jqueryQuery);
  }
}).then(function (loDocuments) {
  if (Utils.isDefined(loDocuments)) {
    var documents = loDocuments.getAllItems();
    if (Utils.isDefined(documents) && documents.length > 0) {
      for (var index = 0; index < documents.length; index++) {
        if (documents[index].getPhase() === "Initial") {
          //Using cancelDeliveries method for cancelling all kind of documents
          deliveryCancelPromises.push(me.cancelDeliveries(documents[index].getPKey(), "CanceledByCall"));
        }
      }
    }
    return when.all(deliveryCancelPromises).then(function () {
      me.setObjectStatus(STATE.DIRTY | STATE.PERSISTED);
      return me.saveAsync().then(
        function () {
          if(executeTransaction){
            return Facade.commitTransactionAsync();
          }
        });
    });
  }
});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}