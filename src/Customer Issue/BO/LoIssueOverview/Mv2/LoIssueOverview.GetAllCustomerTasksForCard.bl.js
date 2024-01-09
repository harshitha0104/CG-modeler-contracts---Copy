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
 * @function getAllCustomerTasksForCard
 * @this LoIssueOverview
 * @kind listobject
 * @async
 * @namespace CORE
 * @param {DomInteger} numberOfListItems
 * @param {String} currentCustomerPKey
 * @returns promise
 */
function getAllCustomerTasksForCard(numberOfListItems, currentCustomerPKey){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var jsonQuery = {};
var jsonParams = [];
var minDate = Utils.convertForDBParam(Utils.getMinDate(), 'DomDate');
var dateTimeToday = Utils.convertForDBParam(Utils.createAnsiDateTimeToday(), 'DomDate');
var currentUsrMainPKey = ApplicationContext.get('user').getPKey();
var currentDate = Utils.convertDate2Ansi(Utils.createDateToday());
var customerSqlQuery = "'"+ currentCustomerPKey +"'";

jsonQuery.loadLoCustomerOverview = customerSqlQuery;
jsonQuery.params = jsonParams;

if (Utils.isSfBackend()){
  jsonQuery.cond = " AND issuePhase IN ('initial', 'Released') AND Account_Task__c.Due_Date__c <> #minDate# AND Account_Task__c.Due_Date__c <= #dateTimeToday# ";
  jsonQuery.cond += " AND ((Account_Task__c.Responsible__c =  #currentUsrMainPKey# AND (Sub.SubMainUsrMainPKey IS NULL OR Sub.SubIsLeadFollowUpTime = #subIsLeadFollowUpTime#)) OR Sub.SubBpaRelUsrMainPKey = #currentUsrMainPKey#) ";
}
else{
  jsonQuery.cond = " AND SvcIssue.IssuePhase IN ('initial', 'Released') AND SvcIssue.DueDate <> #minDate# AND SvcIssue.DueDate <= #dateTimeToday# ";
  jsonQuery.cond += " AND ((SvcIssue.ResponsiblePKey = #currentUsrMainPKey# AND (Sub.SubMainUsrMainPKey IS NULL OR Sub.SubIsLeadFollowUpTime = #subIsLeadFollowUpTime#)) OR Sub.SubBpaRelUsrMainPKey = #currentUsrMainPKey#) ";
}

jsonParams.push({"field" : "minDate", "value" : minDate});
jsonParams.push({"field" : "dateTimeToday", "value" : dateTimeToday});
jsonParams.push({"field" : "currentUsrMainPKey", "value" : currentUsrMainPKey});
jsonParams.push({"field" : "subIsLeadFollowUpTime", "value" : '1'});
jsonQuery.customerTask = "customerTask";

me.removeAllItems();

var promise = Facade.getListAsync("LoIssueOverview", jsonQuery).then(
  function(issue) {
    var numberOfTasks;
    if(!Utils.isDefined(numberOfListItems)){
      numberOfTasks = 5;
      if(Utils.isPhone()){
        numberOfTasks = 3;
      }
    } else{
      numberOfTasks = numberOfListItems;
    }

    me.cardItemCount = issue.length;
    issue = issue.splice(0,numberOfTasks);

    for(var i = 0; i < issue.length; i++){
      if(Utils.isPhone()){
        if(issue[i].text.length > 35){
          issue[i].text= issue[i].text.substr(0, 35);
          issue[i].text+= "...";
        }
      }
      else{
        if(issue[i].text.length > 30){
          issue[i].text= issue[i].text.substr(0, 30);
          issue[i].text+= "...";
        }
      }
      if(issue[i].dueDate == Utils.getMinDateTimeDB()){
        issue[i].dueDateText = "";
      }
      else{
        if(Utils.isSfBackend()) {
          issue[i].dueDateText = Localization.localize(Utils.unixepochToAnsiDate(issue[i].dueDate), "date");
        }
        else {
          issue[i].dueDateText = Localization.localize(issue[i].dueDate, "date");
        }
        if(issue[i].dueDateText === Localization.localize(currentDate, "date")){
          issue[i].dueDateText = Localization.resolve("CardCustomerTasks_CreatedToday");
        }else if(issue[i].dueDateText === Localization.localize(Utils.addDays2AnsiFullDate(currentDate, -1), "date")){
          issue[i].dueDateText = Localization.resolve("CardCustomerTasks_CreatedYesterday");
        }
        else if(issue[i].dueDateText === Localization.localize(Utils.addDays2AnsiFullDate(currentDate, 1), "date")){
          issue[i].dueDateText = Localization.resolve("CardCustomerTasks_DueTommorrow");
        }
      }
    }

    me.addItems(issue, jsonQuery.params);
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}