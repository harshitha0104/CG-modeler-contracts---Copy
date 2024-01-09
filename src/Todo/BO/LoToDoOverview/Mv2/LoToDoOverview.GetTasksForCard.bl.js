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
 * @function getTasksForCard
 * @this LoToDoOverview
 * @kind listobject
 * @async
 * @namespace CORE
 * @param {Object} teamList
 * @param {DomInteger} numberOfListItems
 * @param {String} cardDate
 * @returns promise
 */
function getTasksForCard(teamList, numberOfListItems, cardDate){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var jsonQuery = {};
var jsonParams = [];
var convertedCardDate;
jsonQuery.params = jsonParams;
jsonQuery.teamList = teamList;

if (Utils.isSfBackend()) {
  convertedCardDate = Utils.convertForDBParam(cardDate, "DomDate");
  jsonQuery.cond = " AND issuePhase IN (#released#, #initial#) AND Task.ActivityDate <> #minimumDate# AND Task.ActivityDate <= #cardDate# ";
  jsonQuery.params.push({"field" : "released", "value" : 'Released'});
  jsonQuery.params.push({"field" : "initial", "value" : 'initial'});
  jsonQuery.params.push({"field" : "minimumDate", "value" : Utils.convertForDBParam(Utils.getMinDate(), "DomDate")});
  jsonQuery.params.push({"field" : "cardDate", "value" : convertedCardDate});
}
else {
  convertedCardDate = Utils.convertAnsiDate2Date(cardDate);
  convertedCardDate.setHours(0, 0, 0, 0);
  convertedCardDate = Utils.convertForDBParam(convertedCardDate, "DomDateTime");
  jsonQuery.cond = " AND SvcTodo.IssuePhase IN (#released#, #initial#) AND DATETIME(SvcTodo.DueDate) <> #minimumDate# AND DATETIME(SvcTodo.DueDate) <= #cardDate# ";
  jsonQuery.params.push({"field" : "released", "value" : 'Released'});
  jsonQuery.params.push({"field" : "initial", "value" : 'initial'});
  jsonQuery.params.push({"field" : "minimumDate", "value" : Utils.convertForDBParam(Utils.getMinDate(), "DomDate")});
  jsonQuery.params.push({"field" : "cardDate", "value" : convertedCardDate});
}
me.removeAllItems();

var promise = Facade.getListAsync("LoToDoOverview", jsonQuery).then(
  function(todo) {
    var numberOfTasks;
    if(!Utils.isDefined(numberOfListItems)) {
      if(Utils.isPhone()) {
        numberOfTasks = 3;
      }
      else {
        numberOfTasks = 5;
      }
    }
    else {
      numberOfTasks = numberOfListItems;
    }

    me.addItems(todo, jsonQuery.params);
    me.orderBy({"dueDate":"DESC", "priority": "ASC"});
    todo = me.getAllItems();
    me.cardItemCount = todo.length;
    me.removeAllItems();
    todo = todo.splice(0,numberOfTasks);

    for(var i=0; i<todo.length; i++) {
      if(Utils.isPhone()) {
        if(todo[i].text.length > 35) {
          todo[i].text= todo[i].text.substr(0, 35);
          todo[i].text+= "...";
        }
      }
      else {
        if(todo[i].text.length > 40) {
          todo[i].text= todo[i].text.substr(0, 40);
          todo[i].text+= "...";
        }
      }
    }
    me.addItems(todo, jsonQuery.params);
    return me;
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}