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
 * @function validateDeliveryDate
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {messageCollector} messageCollector
 * @returns promise
 */
function validateDeliveryDate(messageCollector){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    var skipValidation = false;
var promise = when.resolve();

if(me.getPhase() != BLConstants.Order.PHASE_RELEASED && me.getPhase() != BLConstants.Order.PHASE_CANCELED && me.getSyncStatus() !== BLConstants.Order.NOT_SYNCABLE && me.getBoOrderMeta().getCheckDeliveryDate() == 1) {
  var newError;
  var level;
  var deliveryDate = Utils.convertAnsiDate2Date(me.getDeliveryDate());
  var maxDeliveryDate = Utils.convertAnsiDate2Date(Utils.addDays2AnsiFullDate(Utils.createAnsiToday(), me.getBoOrderMeta().getMaxLeadTime()));

  // Determine level of error message
  if (me.getBoOrderMeta().getCheckDeliveryDate() == 1) {
    level = "error";
  }
  else {
    level = "warning";
  }

  // Check Order.DeliveryDate > Order.CommitDate
  if(Utils.isDefined(deliveryDate)) {
    var commitDate = Utils.convertAnsiDate2Date(me.getCommitDate());
    if (commitDate > deliveryDate) {
      newError = {
        "level": level,
        "objectClass": "BoOrder",
        "simpleProperty": "deliveryDate",
        "messageID": "CasSdoCommitDateGreaterDeliveryDate"
      };
      messageCollector.add(newError);
      skipValidation = true;
    }
  }
  else {
    newError = {
      "level": level,
      "objectClass": "BoOrder",
      "simpleProperty": "deliveryDate",
      "messageID": "CasSdoDeliveryDateNull"
    };
    messageCollector.add(newError);
    skipValidation = true;
  }

  // Delivery date should not be larger than max lead time
  var maxLeadTime = me.getBoOrderMeta().getMaxLeadTime();

  if (deliveryDate > maxDeliveryDate && !skipValidation) {
    newError = {
      "level": level,
      "objectClass": "BoOrder",
      "simpleProperty": "deliveryDate",
      "messageParams": { "days": maxLeadTime },
      "messageID": "CasSdoMainDeliveryDateTooLarge"
    };
    messageCollector.add(newError);
    skipValidation = true;
  }

  if (!skipValidation) {

    // Check delivery date for saturday, sunday or public holiday
    // Load list of public holidays for check
    var deliveryDateValid = true;
    var jsonParams = [];
    jsonParams.push({ "field": "checkDate", "value": Utils.createAnsiToday() });
    jsonParams.push({ "field": "maxCheckDate", "value": Utils.convertFullDate2Ansi(maxDeliveryDate) });

    var jsonQuery = {};
    jsonQuery.params = jsonParams;

    promise = BoFactory.loadObjectByParamsAsync("LoPublicHolidays", jsonQuery)
      .then(function (loPublicHolidays) {

      var startDeliveryDateAnsi = Utils.createAnsiToday();
      var calculatedDeliveryDate = Utils.convertAnsiDate2Date(startDeliveryDateAnsi);
      var validDayCounter = 0;
      var numberOfDays = 1;
      var considerSaturday = me.getBoOrderMeta().getConsiderSaturday();
      var considerSunday = me.getBoOrderMeta().getConsiderSunday();

      // Calculate valid days between today and the delivery date
      while (calculatedDeliveryDate < deliveryDate) {
        if (me.checkDeliveryDate(calculatedDeliveryDate, considerSaturday, considerSunday, loPublicHolidays)) {
          validDayCounter = validDayCounter + 1;
        }
        calculatedDeliveryDate = Utils.convertAnsiDate2Date(Utils.addDays2AnsiFullDate(startDeliveryDateAnsi, numberOfDays));
        numberOfDays++;
      }

      // Check delivery date according to configurations regarding saturday, sunday and public holidays
      deliveryDateValid = me.checkDeliveryDate(deliveryDate, me.getBoOrderMeta().getConsiderSaturday(), me.getBoOrderMeta().getConsiderSunday(), loPublicHolidays);

      if (!deliveryDateValid) {
        var messageId;

        if ((deliveryDate.getDay() == 6) && (me.getBoOrderMeta().getConsiderSaturday())) {
          messageId = "CasSdoMainDeliveryDateSaturday";
        }
        else if ((deliveryDate.getDay() === 0) && (me.getBoOrderMeta().getConsiderSunday())) {
          messageId = "CasSdoMainDeliveryDateSunday";
        }
        else {
          messageId = "CasSdoMainNoWorkDay";
        }

        newError = {
          "level": level,
          "objectClass": "BoOrder",
          "simpleProperty": "deliveryDate",
          "messageID": messageId
        };

        messageCollector.add(newError);
        skipValidation = true;
      }

      // Delivery date should not be smaller than lead time
      if (me.getBoOrderMeta().getDeliveryDatePolicy() === "BuiltIn" && validDayCounter <= me.getBoOrderMeta().getLeadTime() && (!skipValidation)) {
        newError = {
          "level": level,
          "objectClass": "BoOrder",
          "simpleProperty": "deliveryDate",
          "messageParams": { "days": me.getBoOrderMeta().getLeadTime() },
          "messageID": "CasSdoMainDeliveryDateTooSmall"
        };
        messageCollector.add(newError);
      }
    });
  }
}
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}