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
 * @function presetDeliveryDate
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @returns promise
 */
function presetDeliveryDate(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise;
var deliveryDate;

var considerSaturday = me.getBoOrderMeta().getConsiderSaturday();
var considerSunday = me.getBoOrderMeta().getConsiderSunday();
var considerLeadTime = me.getBoOrderMeta().getConsiderLeadTime();
var leadTime = me.getBoOrderMeta().getLeadTime();

var validDeliveryDateFound = false;

switch (me.getBoOrderMeta().getDeliveryDatePolicy()) {
  case "Today":
    // Return current date
    deliveryDate = Utils.createAnsiDateTimeToday();

    promise = when.resolve(deliveryDate);

    break;
  case "BuiltIn":
    if (considerLeadTime == "0") {
      // Return current date
      deliveryDate = Utils.createAnsiDateTimeToday();

      promise = when.resolve(deliveryDate);
    } else {
      // Return calculated date

      // Precalculate max delivery date
      var maxDeliveryDate = Utils.convertAnsiDate2Date(
        Utils.createAnsiDateTimeToday(),
        me.getBoOrderMeta().getMaxLeadTime()
      );

      // Load list of public holidays for chekc
      var jsonParams = [];
      jsonParams.push({ field: "checkDate", value: Utils.createAnsiToday() });
      jsonParams.push({
        field: "maxCheckDate",
        value: Utils.convertFullDate2Ansi(maxDeliveryDate),
      });

      var jsonQuery = {};
      jsonQuery.params = jsonParams;

      promise = BoFactory.loadObjectByParamsAsync(
        "LoPublicHolidays",
        jsonQuery
      ).then(function (loPublicHolidays) {
        ///Double conversion is needed  here as no Utils Function is available to replace
        //returns Day Date Time
        var calculatedDeliveryDate = Utils.convertAnsiDate2Date(
          Utils.createAnsiToday()
        );
        var validDayCounter = 0;

        // Check delivery date according to configurations regarding saturday, sunday and public holidays
        while (!validDeliveryDateFound) {
          if (
            me.checkDeliveryDate(
              calculatedDeliveryDate,
              considerSaturday,
              considerSunday,
              loPublicHolidays
            )
          ) {
            validDayCounter = validDayCounter + 1;
          }

          if (validDayCounter <= leadTime + 1) {
            calculatedDeliveryDate = Utils.convertAnsiDate2Date(
              Utils.addDays2AnsiFullDate(
                Utils.convertFullDate2Ansi(calculatedDeliveryDate),
                1
              )
            );
          } else {
            validDeliveryDateFound = true;
          }

          // Stop if maximum lead time has been reached
          if (calculatedDeliveryDate.getTime() == maxDeliveryDate.getTime()) {
            validDeliveryDateFound = true;
          }
        }

        deliveryDate = Utils.convertFullDate2Ansi(calculatedDeliveryDate);

        return deliveryDate;
      });
    }
    break;
  case "No":
    if (me.getDocumentType() == "Replenishment") {
      deliveryDate = null;
    } else {
      // Return empty date
      deliveryDate = Utils.getMinDate();
    }

    promise = when.resolve(deliveryDate);

    break;
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}