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
 * @function rescheduleTourDate
 * @this BoTour
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {Object} newDate
 * @returns promise
 */
function rescheduleTourDate(newDate){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise;

if (!Utils.isDefined(newDate)) {
  promise = when.resolve();
} else {

  var nDate = Utils.convertAnsiDate2Date(newDate).setHours(0,0,0,0);
  var oDate = Utils.convertAnsiDate2Date(me.getDateFrom()).setHours(0,0,0,0);

  if (nDate === oDate) {
    var buttonValues = {};
    buttonValues[Localization.resolve("OK")] = "ok";
    promise = MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Warning"), "The choosen date is the already planned date for this tour. Nothing will be changed.", buttonValues);
  } else {
    //get movement range for call moving:
    var dateDiff = (nDate - oDate) / (24*60*60*1000);

    //set dateThru of tour
    var thruDate = Utils.convertAnsiDate2Date(me.getDateThru()).setHours(0,0,0,0);
    var dateDiffTour = (thruDate - oDate) / (24*60*60*1000) ;
    me.setDateFrom(newDate);
    if (dateDiffTour !== 0) {
      var dateThruTour = Utils.convertAnsiDate2Date(me.getDateFrom());
      dateThruTour.setDate(dateThruTour.getDate() + dateDiffTour);
      if (Utils.convertDate2Ansi(dateThruTour) < Utils.getMaxDateAnsi()) {
        me.setDateThru(Utils.convertDate2Ansi(dateThruTour));
      }
    } else {
      me.setDateThru(me.getDateFrom());
    }

    var moveCallDate = function (call, dateDiff) {
      var dateFromCall = Utils.convertAnsiDate2Date(call.getDateFrom());
      dateFromCall.setDate(dateFromCall.getDate() + dateDiff);
      call.setDateFrom(Utils.convertDateTime2Ansi(dateFromCall));

      var dateThruCall = Utils.convertAnsiDate2Date(call.getDateThru());
      dateThruCall.setDate(dateThruCall.getDate() + dateDiff);
      call.setDateThru(Utils.convertDateTime2Ansi(dateThruCall));

      call.setObjectStatus(Utils.data.Model.STATE_DIRTY);
    };

    if(Utils.isDefined(me.getLoTourRelatedCalls())) {
      var calls = me.getLoTourRelatedCalls().getAllItems();

      for(var i = 0; i<calls.length;i++) {   
        moveCallDate(calls[i], dateDiff);
      }

      me.getLoTourRelatedCalls().setObjectStatus(Utils.data.Model.STATE_DIRTY);

      promise = when.resolve();
    } else {
      promise = BoFactory.loadObjectByParamsAsync(LO_TOURRELATEDCALLS, {"tmgMainPKey" : me.getPKey()}).then(
        function(result){
          if(Utils.isDefined(result)) {
            me.setLoTourRelatedCalls(result);
            var calls = me.getLoTourRelatedCalls().getAllItems();

            for(var i = 0; i < calls.length; i++) {
              moveCallDate(calls[i], dateDiff);
            }

            me.getLoTourRelatedCalls().setObjectStatus(Utils.data.Model.STATE_DIRTY);       
          }
        }
      );
    }
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}