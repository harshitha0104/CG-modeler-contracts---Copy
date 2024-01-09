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
 * @function updateActivities
 * @this BoUserDailyReport
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @returns promise
 */
function updateActivities(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var callStatisticItems;
var dicActivityUpdate = Utils.createDictionary();
var dateFrom;

if(Utils.isSfBackend()) {
  dateFrom = Utils.convertForDBParam(me.getDateFrom(), "DomDate");
}
else {
  dateFrom = me.getDateFrom();
}

//########################
//### Load UserDocCalls
//########################
var callParams = [];
var callQuery = {};
callParams.push({ "field" : "dateFrom", "value" : dateFrom});
callParams.push({ "field" : "usrDocMetaPKey", "value" :  me.getUsrDocMetaPKey()});
callParams.push({ "field" : "ownerPKey", "value" :  me.getOwnerUsrMainPKey()});
callQuery.params = callParams;

var promise = BoFactory.loadObjectByParamsAsync(LO_USERDRCALLSTATISTIC, callQuery).then(
  function (loUserDRCallStatistic) {

    callStatisticItems = loUserDRCallStatistic.getAllItems();

    //#############################
    //### Update UserDocActivities
    //#############################
    //loop over new call items from db
    for ( var i = 0, len = callStatisticItems.length; i < len; i++) {
      if(!dicActivityUpdate.containsKey(callStatisticItems[i].getClbMetaPKey())){
        var activityItem = {
          "hours" : parseInt(callStatisticItems[i].getHours(), 10),
          "minutes" : parseInt(callStatisticItems[i].getMinutes(), 10)
        };
        dicActivityUpdate.add(callStatisticItems[i].getClbMetaPKey(), activityItem);
      }else{
        dicActivityUpdate.get(callStatisticItems[i].getClbMetaPKey()).hours =  dicActivityUpdate.get(callStatisticItems[i].getClbMetaPKey()).hours + parseInt(callStatisticItems[i].getHours(), 10);
        dicActivityUpdate.get(callStatisticItems[i].getClbMetaPKey()).minutes =  dicActivityUpdate.get(callStatisticItems[i].getClbMetaPKey()).minutes + parseInt(callStatisticItems[i].getMinutes(), 10);
      }
    }

    //loop over dic
    var currentDicItem;
    var key;
    var currentActivityItem;
    var duration = 0;
    for (var j = 0, lenj = dicActivityUpdate.keys().length; j < lenj; j++) {
      key = dicActivityUpdate.keys()[j];
      duration = 0;
      currentDicItem = dicActivityUpdate.get(key);
      currentActivityItem = me.getLoUsrDRActivity().getItemsByParam({"clbMetaPKey":key});

      if(Utils.isDefined(currentActivityItem[0])){
        duration += currentDicItem.minutes;
        duration += currentDicItem.hours * 60;
        currentActivityItem[0].setDuration(duration.toString());
        currentActivityItem[0].setHours(Math.floor(duration/60));
        currentActivityItem[0].setMinutes((duration % 60).toString());
      }
    }

    me.calculateTotalActivityDuration();
  }
);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}