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
 * @function checkUserRelatedDocument
 * @this BoUser
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {Object} UsrRelatedDocReminderRule
 * @returns promise
 */
function checkUserRelatedDocument(UsrRelatedDocReminderRule){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
// Execution of Doc Expiration Reminder Rule
var CheckUsrDocExpirationReminderRule = function(documentType){
  return BoFactory.loadObjectByParamsAsync("LoUserRelatedDocExpirationRule", [{"userPKey" : me.getPKey(),"documentType" : documentType}]).then(
    function(loUserRelatedDocExpirationRule){
      if(Utils.isDefined(loUserRelatedDocExpirationRule)){
        var liUserRelatedDocExpirationRule = loUserRelatedDocExpirationRule.getAllItems();
        if(liUserRelatedDocExpirationRule.length > 0){

          for (var i = 0; i < liUserRelatedDocExpirationRule.length; i++){
            if(liUserRelatedDocExpirationRule[i].getDuration() !== 0){
              var currentDateTime = Utils.createAnsiToday();
              var expirationDateTime = Utils.convertDate2Ansi(liUserRelatedDocExpirationRule[i].getExpirationDate()); 
              var startTimeOffset = liUserRelatedDocExpirationRule[i].getStartTimeOffset();
              var duration = liUserRelatedDocExpirationRule[i].getDuration();
              var startReminderDateTime = Utils.addDays2AnsiDate(expirationDateTime, startTimeOffset);
              var endReminderDateTime = Utils.addDays2AnsiDate(startReminderDateTime, duration);

              //Check on Current date
              if((currentDateTime == startReminderDateTime || currentDateTime == endReminderDateTime) || (currentDateTime > startReminderDateTime && currentDateTime < endReminderDateTime)){
                var buttonValues = {};
                buttonValues[Localization.resolve("OK")] = "ok";
                var messageContent = liUserRelatedDocExpirationRule[i].getMessageContent() + "<br>" + "Expiration Date : " + Localization.localize(liUserRelatedDocExpirationRule[i].getExpirationDate(), "date");
                return MessageBox.displayMessage(liUserRelatedDocExpirationRule[i].getMessageTitle(), messageContent, buttonValues);
              }
            }
          }
        }
      }
    }
  );
};


// Execution of Doc Missing Reminder Rule
var CheckUsrDocMissingReminderRule = function(documentType){
  return BoFactory.loadObjectByParamsAsync("LuUserRelatedDocumentCount", [{"userPKey" : me.getPKey(),"documentType" : documentType}]).then(
    function(luUserRelatedDocumentCount){
      if(Utils.isDefined(luUserRelatedDocumentCount) && luUserRelatedDocumentCount.getUserRelatedDocsCount() === 0){  
        // get Document Missing reminder Rule Text      
        return BoFactory.loadObjectByParamsAsync("LuUserDocMissingReminderText", [{"userPKey" : me.getPKey(),"documentType" : documentType}]);
      }
    }).then(
    function (luUserDocMissingReminderText){
      if(Utils.isDefined(luUserDocMissingReminderText)){
        var buttonValues = {};
        buttonValues[Localization.resolve("OK")] = "ok";
        return MessageBox.displayMessage(luUserDocMissingReminderText.getMessageTitle(), luUserDocMissingReminderText.getMessageContent(), buttonValues);
      }           
    }
  );
};

// Get All User Related Documents Reminder Rules.
var promise = BoFactory.loadObjectByParamsAsync("LoUserRelatedDocReminderRule", [{"userPKey" : me.getPKey()}]).then(
  function(loUserRelatedDocReminderRule) {
    var deferreds = [];

    if(Utils.isDefined(loUserRelatedDocReminderRule)) {
      var liUserRelatedDocReminderRule = loUserRelatedDocReminderRule.getAllItems();
      if(liUserRelatedDocReminderRule.length > 0) {

        for (var i = 0; i < liUserRelatedDocReminderRule.length; i++){
          //Check for Doc Expiration Reminder Rule
          if(liUserRelatedDocReminderRule[i].getReminderRuleType() == "DocumentExpiration") {
            deferreds.push(CheckUsrDocExpirationReminderRule(liUserRelatedDocReminderRule[i].getDocumentType()));
          }
          //Check for Doc Missing Reminder Rule
          if(liUserRelatedDocReminderRule[i].getReminderRuleType() == "DocumentMissing") {
            deferreds.push(CheckUsrDocMissingReminderRule(liUserRelatedDocReminderRule[i].getDocumentType()));
          }
        } 
      }
    }

    return when.all(deferreds);
  }
);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}