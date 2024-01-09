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
 * @function setOpenDaysForItem
 * @this LoCustomerOpeningTime
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {DomPKey} pKey
 * @param {String} updateMode
 */
function setOpenDaysForItem(pKey, updateMode){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var openDaysString = "";
var noUpdate = (updateMode === "noUpdate");

if (pKey) {
  var liCustomerOpeningTime = me.getItemByPKey(pKey);
  if (Utils.isDefined(liCustomerOpeningTime)) {

    if (Utils.isSfBackend()) {
      // SF/CASDIF: Changed algorithm necessary as toggles are sorted differently in SF
      var days = [];

      //Add days to array only when those are configured as customer opening hours
      if(liCustomerOpeningTime.getMonday() == "1") {
        days.push('mon');
      }
      if(liCustomerOpeningTime.getTuesday() == "1") {
        days.push('tue');
      }
      if(liCustomerOpeningTime.getWednesday() == "1") {
        days.push('wed');
      }
      if(liCustomerOpeningTime.getThursday() == "1") {
        days.push('thu');
      }
      if(liCustomerOpeningTime.getFriday() == "1") {
        days.push('fri');
      }
      if(liCustomerOpeningTime.getSaturday() == "1") {
        days.push('sat');
      }
      if(liCustomerOpeningTime.getSunday() == "1") {
        days.push('sun');
      }

      days.forEach(function(day) {
        openDaysString = openDaysString + "\u00a0\u00a0" + AppManager.sysToggles.DomDayOfWeek.values[day].shortText;
      });

    }
    else {
      var actDayText;
      var arrayDaysOfWeek = Utils.getToggleListObject("DayOfWeek").getAllItems();

      for (var x in arrayDaysOfWeek) {
        var isActDay = false;
        var actDay = arrayDaysOfWeek[x].getId();
        actDayText = "\u00a0\u00a0" + arrayDaysOfWeek[x].getShortText();
        //SF/CASDIF: Not available in CW: Clockwork can not resolve html this is the only place in all contracts

        switch (actDay) {
          case "mon":
            if (liCustomerOpeningTime.getMonday() == "1") {
              isActDay = true;
            }
            break;
          case "tue":
            if (liCustomerOpeningTime.getTuesday() == "1") {
              isActDay = true;
            }
            break;
          case "wed":
            if (liCustomerOpeningTime.getWednesday() == "1") {
              isActDay = true;
            }
            break;
          case "thu":
            if (liCustomerOpeningTime.getThursday() == "1") {
              isActDay = true;
            }
            break;
          case "fri":
            if (liCustomerOpeningTime.getFriday() == "1") {
              isActDay = true;
            }
            break;
          case "sat":
            if (liCustomerOpeningTime.getSaturday() == "1") {
              isActDay = true;
            }
            break;
          case "sun":
            if (liCustomerOpeningTime.getSunday() == "1") {
              isActDay = true;
            }
            break;
        }

        if (isActDay) {
          openDaysString += actDayText;
        }
      }
    }
    liCustomerOpeningTime.setOpenDays(openDaysString, noUpdate);
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}