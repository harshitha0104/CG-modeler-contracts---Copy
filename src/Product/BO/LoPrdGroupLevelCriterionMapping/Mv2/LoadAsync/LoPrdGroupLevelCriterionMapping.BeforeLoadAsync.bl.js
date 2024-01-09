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
 * @function beforeLoadAsync
 * @this LoPrdGroupLevelCriterionMapping
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} context
 * @returns promise
 */
function beforeLoadAsync(context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var item0;
var item1;
var item2;
var item3;
var item4;

if (Utils.isSfBackend()){
  item0 = {
    "groupLevel": "Category",
    "criterion": "Criterion_1_Product_Code__c"
  };

  item1 = {
    "groupLevel": "SubCategory",
    "criterion": "Criterion_2_Product_Code__c"
  };

  item2 = {
    "groupLevel": "Brand",
    "criterion": "Criterion_3_Product_Code__c"
  };

  item3 = {
    "groupLevel": "Flavor",
    "criterion": "Criterion_4_Product_Code__c"
  };

  item4 = {
    "groupLevel": "Package",
    "criterion": "Criterion_5_Product_Code__c"
  };
}
else {
  item0 = {
    "groupLevel": "Category",
    "criterion": "Criterion1"
  };

  item1 = {
    "groupLevel": "SubCategory",
    "criterion": "Criterion2"
  };

  item2 = {
    "groupLevel": "Brand",
    "criterion": "Criterion3"
  };

  item3 = {
    "groupLevel": "Flavor",
    "criterion": "Criterion4"
  };

  item4 = {
    "groupLevel": "Package",
    "criterion": "Criterion5"
  };
}

var listItems = [];
listItems.push(item0);
listItems.push(item1);
listItems.push(item2);
listItems.push(item3);
listItems.push(item4);

me.addItems(listItems);
me.setObjectStatus(STATE.PERSISTED);

var promise=when.resolve(context);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}