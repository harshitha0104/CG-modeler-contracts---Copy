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
 * @function prepareTargetFulfillmentData
 * @this LoSysPeriodsForTarget
 * @kind listobject
 * @async
 * @namespace CORE
 * @returns promise
 */
function prepareTargetFulfillmentData(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var targets = {};

//Create an instance of LoTargetFulFillment
var promise = BoFactory.createListAsync("LoTargetFulFillment", {})
.then(function(loItems){
  targets = loItems;
  //Run through all the targets and summarize only the first 2 targets into LoTargetFulFillment
  var numberofPeriod = 0;

  var addItem = function(items){
    var currentPeriodPKey = "";
    var targetItem = {};

    for(var i = 0; i < items.length; i++){
      if(items[i].getSysPeriodPKey() != currentPeriodPKey){
        numberofPeriod += 1;
        // Take only the first 2 periods
        if(numberofPeriod > 2){
          break;
        }
        currentPeriodPKey = items[i].getSysPeriodPKey();
        //Create a new item for the target fulfillment
        targetItem = {
          "periodText" : items[i].getPeriodText(),
          "plannedTarget" : items[i].getPlannedTarget(),
          "actualTarget" : 0,
          "validFrom" : items[i].getValidFrom(),
          "validThru" : items[i].getValidThru(),
        };
        //Add the new item to the targets
        targets.addListItems([targetItem]);
      }
      // Add planned target for the same period for other routes
      else{
        targetItem.setPlannedTarget(targetItem.getPlannedTarget() + items[i].getPlannedTarget());
      }
    }
  };

  var now = Utils.createDateNow();
  var itemsHasGreaterValidThru = [];
  var itemsHasLesserValidThru = [];

  me.getAllItems().forEach(function(item){
    if(Utils.convertAnsiDate2Date(item.getValidThru()) >= now){
      itemsHasGreaterValidThru.push(item);
    }
    else if(Utils.convertAnsiDate2Date(item.getValidThru()) < now){
      itemsHasLesserValidThru.push(item);
    }
  });

  // Get Current Period
  if(itemsHasGreaterValidThru.length === 0){
    numberofPeriod += 1;
  }else{
    addItem(itemsHasGreaterValidThru);
  }

  // Get one past period
  addItem(itemsHasLesserValidThru);

  return targets;
});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}