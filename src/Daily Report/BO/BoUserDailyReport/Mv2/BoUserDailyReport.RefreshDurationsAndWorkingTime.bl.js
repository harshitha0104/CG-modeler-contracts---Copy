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
 * @function refreshDurationsAndWorkingTime
 * @this BoUserDailyReport
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {DomPKey} timeEntryPKey
 * @returns promise
 */
function refreshDurationsAndWorkingTime(timeEntryPKey){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise;
var currentTimeEntry;
var dateTimeHelper = ApplicationContext.get("dateTimeHelper");

//take current if pkey is empty
if (Utils.isEmptyString(timeEntryPKey)) {
  currentTimeEntry = me.getLoUsrTimeEntry().getCurrent();
} else {
  //get updated or inserted time entry list item
  var listOfTimeEntries = me.getLoUsrTimeEntry().getAllItems();
  for (var idxTE = 0; idxTE < listOfTimeEntries.length; idxTE++) {
    if (listOfTimeEntries[idxTE].getPKey() === timeEntryPKey) {
      currentTimeEntry = listOfTimeEntries[idxTE];
      break;
    }
  }
}

if (Utils.isDefined(currentTimeEntry)) {

  promise = BoFactory.loadObjectByParamsAsync("LuTimeEntryType", me.getQueryBy("pKey", currentTimeEntry.getUsrTimeEntryMetaPKey())).then(
    function (luTimeEntryType) {

      // Refresh total durations
      if (Utils.isDefined(luTimeEntryType) && luTimeEntryType.getShowAggregation() == "1") {
        var listTimeEntryByVisitType = me.getLoUsrTimeEntryByVisitType().getItemObjects();
        var timeEntryFound = false;

        // check if time entry type is already in list
        var liBreakTimeEntry;
        var listTimeEntries;

        for (var i = 0; i < listTimeEntryByVisitType.length; i++) {

          //if type already in list
          if (listTimeEntryByVisitType[i].getPKey() === currentTimeEntry.getUsrTimeEntryMetaPKey() || listTimeEntryByVisitType[i].getText() === currentTimeEntry.getUsrTimeEntryMetaText()){

            // refresh duration of matching time entry type
            var newTimeEntryTypeDuration = 0;
            listTimeEntries = me.getLoUsrTimeEntry().getItemObjects();
            for (var j = 0; j < listTimeEntries.length; j++) {
              if (listTimeEntries[j].getUsrTimeEntryMetaPKey() === currentTimeEntry.getUsrTimeEntryMetaPKey()) {							
                newTimeEntryTypeDuration += listTimeEntries[j].getDuration();
                timeEntryFound = true;
              }
            }
            listTimeEntryByVisitType[i].setDuration(dateTimeHelper.getFormattedTimeString(newTimeEntryTypeDuration));
            break;
          }
        }//end update time entry type

        //add new time entry type if type was not found
        if (!timeEntryFound) {
          listTimeEntries = me.getLoUsrTimeEntry().getItemObjects();
          for (var k = 0; k < listTimeEntries.length; k++) {
            if (listTimeEntries[k].getPKey() === currentTimeEntry.getPKey()) {

              var newLiDuration = listTimeEntries[k].getDuration();
              var newliUsrTimeEntryType = {
                "pKey": luTimeEntryType.getPKey(),
                "text": luTimeEntryType.getText(),
                "duration": dateTimeHelper.getFormattedTimeString(newLiDuration),
                "objectStatus": STATE.NEW
              };
              me.getLoUsrTimeEntryByVisitType().addListItems([newliUsrTimeEntryType]);
              break;
            }
          }
        }//end add time entry type
      }
      // Refresh total working time
      me.calculateTotalActivityDuration();
    }
  );
} else {
  // Refresh total working time
  me.calculateTotalActivityDuration();
  promise = when.resolve();
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}