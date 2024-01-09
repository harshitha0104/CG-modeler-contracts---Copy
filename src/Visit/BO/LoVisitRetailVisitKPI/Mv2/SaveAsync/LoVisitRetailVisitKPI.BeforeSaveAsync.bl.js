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
 * @this LoVisitRetailVisitKPI
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
    
var items = me.getAllItems();

function convertTo24Hour(time) {
  AppLog.info("TimeConvert (IN)" + time);
  var timeToLowerCase = time.toLowerCase();   
  var timeSplit;
  var hours;
  var minutes = "00";
  
  if(timeToLowerCase.indexOf('am') != -1 || timeToLowerCase.indexOf('pm') != -1 ) {
    var isPM = timeToLowerCase.indexOf('pm');
    var cleanTime = timeToLowerCase.replace('am','').replace('pm','').replace(/ /g,'');
    timeSplit = cleanTime.split(':');

    if (timeSplit[0] === '12') {
      timeSplit[0] = '00';
    }
    if (isPM != -1) {
      timeSplit[0] = parseInt(timeSplit[0], 10) + 12;
    } 
     hours = ("0" + timeSplit[0]).slice(-2);
     if(Utils.isDefined(timeSplit[1])) minutes = (timeSplit[1] + "0").slice(0, 2);
    time = hours + ':'+ minutes;    
  } else {
     timeSplit = time.split(':');
     hours = ("0" + timeSplit[0]).slice(-2);
    if(Utils.isDefined( timeSplit[1])) 
      minutes = (timeSplit[1] + "0").slice(0, 2);
    time = hours +':'+ minutes;
    
  }

  AppLog.info("TimeConvert (OUT)" + time);
  return time;
}

items.forEach(function(item){
  if(item.getObjectStatus() === (STATE.DIRTY | STATE.PERSISTED)){
    switch (item.getAidDataType()) {
      case "Boolean":
        item.setActualBooleanValue(item.getActualValue());
        if(item.getActualValue() == "1")item.setActualBooleanValue("True");
        else if (item.getActualValue() === "0")item.setActualBooleanValue("False");
        break;
      case 'Number':
        item.setActualIntegerValue(item.getActualValue());
        break;
      case 'Decimal':
        item.setActualDecimalValue(item.getActualValue());
        break;
      case 'DateTime':
        /** 
        #  DateTime Handling
        #  DateTime is splitted up to Date and Time while load
        #  There exist 2 KPI records in the UI. One For Date and one for Time
        #  The records are linked. linkedRecordId of Date points to the time record vice versa
        #  Before save Date and Time Part must be merged to a DateTime which is used for save
        #  Note: System validated that if time part is defined date part must be defined too vice versa
        #        That is done in a seperate validation. No need to consider that case here
        */

        var mergedANSIDateTime;

        //handle Date part
        if(item.getDataType() === "NullableDate"){

          var childItem = me.getItemsByParam({ "linkedRecordId" : item.getPKey() });

          if(Utils.isDefined(item.getActualValue()) ){
            //check if it is a date time if so convert to date
            if(Utils.isDefined(item.getActualValue()) && item.getActualValue().length > 10) item.setActualDate(Utils.convertAnsiDateTime2AnsiDate((item.getActualValue())));

            if(childItem.length === 1){
              childItem[0].setActualTime(convertTo24Hour(childItem[0].getActualValue()));
              item.setActualTime(childItem[0].getActualTime());
              item.setActualDateTime(item.getActualDate() + " " + childItem[0].getActualTime() + ":00");

              //only save parent record
              childItem[0].setObjectStatus(STATE.PERSISTED);
            }
          }else{
            item.setActualDateTime(null);
            if(childItem.length === 1)childItem[0].setObjectStatus(STATE.PERSISTED);
          }

        }else if(item.getDataType() === "NullableString"){

          var parentItem = me.getItemsByParam({ "linkedRecordId" : item.getPKey() });

          if(Utils.isDefined(item.getActualValue())){
            //handle Time part
            item.setActualTime(convertTo24Hour(item.getActualValue()));

            if(parentItem.length === 1){

              //check if it is a date time if so convert to date
              if(Utils.isDefined(parentItem[0].getActualValue()) && parentItem[0].getActualValue().length > 10) parentItem[0].setActualDate(Utils.convertAnsiDateTime2AnsiDate(parentItem[0].getActualValue()));

              item.setActualDate(parentItem[0].getActualDate());
              mergedANSIDateTime = parentItem[0].getActualDate() + " " + item.getActualTime() + ":00";
              item.setActualDateTime(mergedANSIDateTime);
              parentItem[0].setActualDateTime(mergedANSIDateTime);

              //only save parent record
              item.setObjectStatus(STATE.PERSISTED);
            }
          }else{
            item.setActualDateTime(null);
            if(parentItem.length === 1){
              parentItem[0].setActualDateTime(null);
              item.setObjectStatus(STATE.PERSISTED);
            }
          }
        }

        break;
      case 'String':
        item.setActualStringValue(item.getActualValue());
        break;
    }
  }

});

promise = Facade.saveListAsync(me);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}