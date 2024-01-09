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
 * @function getScannedProducts
 * @this LoScannedProduct
 * @kind listobject
 * @async
 * @namespace CORE
 * @param {String} eAN
 * @param {String} uoMScanBehavior
 * @param {String} uoMScanDefaultUnit
 * @param {String} processType
 * @returns promise
 */
function getScannedProducts(eAN, uoMScanBehavior, uoMScanDefaultUnit, processType){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var jsonQuery = {};
var jsonParams = [];

jsonQuery.params = jsonParams;
jsonQuery.eAN = eAN;
jsonQuery.additionalCondition = "";

if (uoMScanBehavior === "Current"){
  if (Utils.isSfBackend()) {
    jsonQuery.additionalCondition = " AND Unit_of_Measure__c.Unit_Type__c = #uoMScanDefaultUnit# ";
  }
  else {
    jsonQuery.additionalCondition = " AND PrdLogistic.UnitType = #uoMScanDefaultUnit# ";
  }
  jsonParams.push({"field" : "uoMScanDefaultUnit", "value" : uoMScanDefaultUnit});
}
else if (uoMScanBehavior === "Standard"){
  if (Utils.isSfBackend()) {
    jsonQuery.additionalCondition = " AND Unit_of_Measure__c.Is_Order_Unit__c = #isOrderUnit# ";    
  }
  else {
    jsonQuery.additionalCondition = " AND PrdLogistic.IsOrderUnit = #isOrderUnit# ";
  }
  jsonParams.push({"field" : "isOrderUnit", "value" : '1'});
}

// filter by order ability in case of 'Order' & 'TruckLoad' process types,
// no filter for other ('Survey') process types
if (processType === 'Order' || processType === 'TruckLoad') {
  jsonQuery.additionalCondition += " AND Unit_of_Measure__c.Order_Ability__c = 1 ";
}
else if (processType === 'Survey') {
  jsonQuery.additionalCondition += " AND Product_Template__c.name = 'Product' ";
}

me.removeAllItems();

var promise = Facade.getListAsync("LoScannedProduct", jsonQuery).then(
  function(products) {
    me.addItems(products);
    return me;
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}