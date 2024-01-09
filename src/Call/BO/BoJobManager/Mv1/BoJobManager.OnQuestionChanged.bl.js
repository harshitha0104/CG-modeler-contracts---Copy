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
 * @function onQuestionChanged
 * @this BoJobManager
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} handlerParams
 * @param {String} jDTPKey
 * @returns promise
 */
function onQuestionChanged(handlerParams, jDTPKey){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = when.resolve();
var loQuestions = me.getLoQuestions();
var listItem;

if(Utils.isEmptyString(handlerParams)){
  //workaround: since buttons are not triggering event handler
  loQuestions.suspendListRefresh();
  listItem = loQuestions.getItemByPKey(jDTPKey);

  if(Utils.startsWith(listItem.getPKey(), 'Local___xxx')) {
    me.assimilateQuestion(listItem);
  } else {
    listItem.setDone("1");
  }

  loQuestions.resumeListRefresh(true);
  if(listItem.getDataType() === "Toggle" && listItem.getManual() == "0"){
    me.evaluateQuestions(loQuestions.getItems(), listItem.getJobDefListPKey());
    loQuestions.setEARights(false);
  }
}
else{
  var columnName;
  var value;
  var oldValue;

  for (var i = 0; i < handlerParams.modified.length; i++){
    columnName = handlerParams.modified[i];
    value = handlerParams.newValues[columnName];
    oldValue = handlerParams.oldValues[columnName];
    listItem = handlerParams.listItem;

    if (value !== oldValue){
      if (columnName == "value"){
        if(listItem.getDataType() === "Date") {
          var chosenDate = listItem.getValue();
          if(chosenDate === " " || chosenDate === null){
            chosenDate = Utils.getMinDate();
          }
          if(!(listItem.getMinValue() <= (chosenDate).slice(0,10) && listItem.getMaxValue() >= (chosenDate).slice(0,10))){
            listItem.setValue(oldValue);
            var messageCollector = new MessageCollector();
            var minDatePolicy = listItem.getMinDatePolicy();
            var maxDatePolicy = listItem.getMaxDatePolicy();
            var messageId = " ";
            if(minDatePolicy === "Today" && maxDatePolicy === "Today"){
              messageId = "CasClbDateMustBeTodayDatePolicy";
            } else if (minDatePolicy === "Today" && maxDatePolicy !== "NextYear"){
              messageId = "CasClbDateMustBeOnOrAfterTodayDatePolicy";
            } else if (maxDatePolicy === "Today"){
              messageId = "CasClbDateMustBeOnOrBeforeTodayDatePolicy";
            } else {
              messageId = "CasClbDateMustBeInBetweenMinAndMaxDatePolicy";
            }
            var newError = {
              "level": "error",
              "objectClass" : "BoCall",
              "messageID" : messageId,
              "messageParams" : {
                "minValue" : listItem.getMinValue(),
                "maxValue" : listItem.getMaxValue()
              }
            };
            messageCollector.add(newError);
            var buttonValues = {};
            var messages = messageCollector.getMessages().join("<br>");
            buttonValues[Localization.resolve("OK")] = "ok";
            promise = MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Validation"), messages, buttonValues);
          }
          if(listItem.getValue() === " " || listItem.getValue() === null){
            listItem.setValue(Utils.getMinDate());
          }
        }
        listItem.setDone("1");
        if(listItem.getDataType() === "Toggle" && listItem.getManual() == "0"){
          me.evaluateQuestions(loQuestions.getItems(), listItem.getJobDefListPKey());
          loQuestions.setEARights(false);
        }
        break;
      }

      if(columnName == "done"){

        if(listItem.getDone() === "2"){
          loQuestions.suspendListRefresh();
          listItem.setDone("0");
          loQuestions.resumeListRefresh(true);
          if(listItem.getDataType() === "Toggle" && listItem.getManual() == "0"){
            me.evaluateQuestions(loQuestions.getItems(), listItem.getJobDefListPKey());
            loQuestions.setEARights(false);
          }
          break;
        }

        if(listItem.getDone() == "1"){
          if(Utils.startsWith(listItem.getPKey(), 'Local___xxx')){
            me.assimilateQuestion(listItem);
          }
          if(listItem.getDataType() === "Toggle" && listItem.getManual() == "0"){
            me.evaluateQuestions(loQuestions.getItems(), listItem.getJobDefListPKey());
            loQuestions.setEARights(false);
          }
          break;
        }
      }

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