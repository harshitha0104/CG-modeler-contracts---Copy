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
 * @function beforeSaveAsync
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} context
 * @returns promise
 */
function beforeSaveAsync(context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
// ----------------------------------------------------------------
// Process workflow actions (Set next state, phase and responsible)
// ----------------------------------------------------------------
var tmgMainPKey = "";
var isOrderPhaseChangeInProgress = me.getSetPhaseInBeforeSave() == "1";

if (Utils.isDefined(ApplicationContext.get('currentTourPKey')) && ApplicationContext.get('currentTourStatus') === "Running") {
  tmgMainPKey = ApplicationContext.get('currentTourPKey');
}
if (me.getDocumentType() == 'Replenishment') {
  me.setTmgMainPKey(tmgMainPKey);
}
if (Utils.isDefined(me.getLoItems())) {
  me.setItemErpIds();
}
if (Utils.isDefined(me.getHurdleEvaluationHelper())) {
  me.storeRewardInformation();
}

var auditTrailPromise = when.resolve();
if (Utils.isSfBackend() && me.getBoOrderMeta().getGenerateRewardsLog() == "Yes" && me.getBoOrderMeta().getConsiderSelectablePromotion() == "1" && 
    me.getPhase() !== "Canceled" && me.getOrderStatus() !== "copy" && me.getOrderStatus() !== "delete") {
  auditTrailPromise = me.createAuditTrailJSON();
}

var pricingJsonPromise = auditTrailPromise.then(
  function () {
    if (me.getBoOrderMeta().getGeneratePricingLog() == "Yes" && me.getOrderStatus() !== "delete") {
      return me.cpAttachDebugJSON(me.getPricingJSON());
    }
  });

/*Reset special rewards on initial order save - will be reapplied on order load
Resetting should be done after creation of audit trail and pricing json*/
var userExitPromise = pricingJsonPromise.then(
  function () {
    var isOrderPhaseInitial = !isOrderPhaseChangeInProgress && me.getPhase() === "Initial" &&
        me.getOrderStatus() !== "copy" && me.getOrderStatus() !== "delete";

    if (Utils.isSfBackend() && isOrderPhaseInitial && me.getBoOrderMeta().getConsiderSelectablePromotion() == "1") {
      var deferreds = [];
      var specialRewards = me.getHurdleEvaluationHelper().getLoRewards().getItemsByParamArray([{"rewardType" : "Special"}, {"isApplicable" : "1"}, {"selected" : "1"}]);
      specialRewards.forEach(function(item) {
        deferreds.push(me.getHurdleEvaluationHelper().userExitForSpecialReward(item, true));
      });
      return when.all(deferreds);
    }
  });

var promise = userExitPromise.then(
  function () {
    if (isOrderPhaseChangeInProgress && Utils.isDefined(me.getBoWorkflow())) {
      var actualState_beforeTransiton = me.getActualStatePKey();
      var actualStatePKey_afterTransition = " ";
      var nextStatePKey_afterTransition = " ";
      var phase_afterTransition = " ";
      //Determine ActualStatePKey to PKey of next phase
      var nextStates = me.getBoWorkflow().getNextStates(me.getActualStatePKey());

      if (nextStates.length > 0) {
        actualStatePKey_afterTransition = nextStates[0].toStatePKey;
        phase_afterTransition = nextStates[0].stateType;
        //Set NextStatePKey to ActualStatePKey (setting to nextStatePKey would not be correct - save at Web after sync would do state transition)
        nextStatePKey_afterTransition = nextStates[0].toStatePKey;
      }

      //Determine next responsible
      return me.getBoWorkflow().getNextResponsible(nextStatePKey_afterTransition, me.getResponsiblePKey(), me.getOwnerPKey()).then(
        function (nextResponsible) {
          //Reset internal property to avoid duplicate phase and responsible setting
          me.setSetPhaseInBeforeSave("0");

          //Set next responsible, states and, phase
          //Note: If no responsible has been found, a message is displayed in after save
          if (Utils.isDefined(nextResponsible)) {
            me.setResponsiblePKey(nextResponsible);
            me.setActualStatePKey(actualStatePKey_afterTransition);
            me.setNextStatePKey(nextStatePKey_afterTransition);
            me.setPhase(phase_afterTransition);

            if (Utils.isSfBackend()) {
              //<!-- SF/CASDIF  needed for Workflow handling in the SF backend (via approval processes)-->
              me.setSf_mobilityRelease("1");
            }

            if (me.getBoWorkflow().getRecentStatePolicy() == "1") {
              return BoFactory.createListAsync(LO_ORDERRECENTSTATE, {});
            }
          }
        }).then(
        function (loRecentState) {
          if (Utils.isDefined(loRecentState)) {
            me.setLoRecentState(loRecentState);

            //Write recent state entry
            var jsonData = {};
            jsonData.pKey = PKey.next();
            jsonData.done = Utils.createDateToday();
            jsonData.sdoMainPKey = me.getPKey();
            jsonData.usrMainPKey = ApplicationContext.get('user').getPKey();
            jsonData.wfeStatePKey = actualState_beforeTransiton;

            me.getLoRecentState().addItems([jsonData]);
            me.getLoRecentState().getItemsByParam({
              "pKey": jsonData.pKey
            })[0].setObjectStatus(me.self.STATE_NEW_DIRTY);
          }

          if (me.getDocTaType() === "NonValuatedDeliveryNote") {
            if (Utils.isDefined(me.getLoSdoConditions())) {
              me.getLoSdoConditions().delete();
            } else {
              return BoFactory.loadObjectByParamsAsync(LO_SDOCONDITIONS, me.getQueryBy("sdoMainPKey", me.getPKey())).then(
                function (lo) {
                  me.setLoSdoConditions(lo);
                  me.getLoSdoConditions().delete();
                });
            }
          }
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