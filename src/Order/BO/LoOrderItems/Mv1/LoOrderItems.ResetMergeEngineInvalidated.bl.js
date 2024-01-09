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
 * @function resetMergeEngineInvalidated
 * @this LoOrderItems
 * @kind listobject
 * @async
 * @namespace CORE
 * @param {String} addProductCriterionAttribute
 * @returns promise
 */
function resetMergeEngineInvalidated(addProductCriterionAttribute){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
/* This method is called only for non-Initial orders,
since in this case temp table returns missing information for those persisted reward products which are not part of tactic.
Hence, we will set the missing information of such products in this function.

This function receives Criterion Attribute as an input which is used to load product information. */

var promise = when.resolve();
var jsonParams = [];
var jsonQuery = {};
var columnName = "";

if(Utils.isSfBackend()){
  columnName = "Order_Item__c.Id";
}
else{
  columnName = "SdoItem.PKey";
}

var invalidItems = me.getAllItems().filter(function(item){return item.mergeEngine_invalidated == '1';});
var invalidItemPKeys = invalidItems.map(function(item){return item.getPKey();});
var addCondSdoItemPKeys = columnName + " IN ('" + invalidItemPKeys.toString() + "') ";

jsonParams.push({
  "field" : "addCondSdoItemPKeys",
  "value" : addCondSdoItemPKeys.split(",").join("','")
});
jsonParams.push({
  "field" : "criterionAttribute",
  "value" : addProductCriterionAttribute
});

jsonQuery.params = jsonParams;
promise = BoFactory.loadObjectByParamsAsync("LoProductInformationForInvalidated", jsonQuery).then(function(productInformation){

  var productInformationDic = Utils.createDictionary();
  productInformation.forEach(function(item){
    productInformationDic.add(item.getPKey(), item);
  });

  invalidItems.forEach(function(invalidItem){
    var currentPrdInfo = productInformationDic.get(invalidItem.getPKey());
    if(Utils.isDefined(currentPrdInfo)){
      invalidItem.setText1(currentPrdInfo.getText1());
      invalidItem.setShortId(currentPrdInfo.getShortId());
      invalidItem.setGroupText(currentPrdInfo.getGroupText());
      invalidItem.setGroupId(currentPrdInfo.getGroupId());
      invalidItem.setMergeEngine_invalidated('0');
    }
  });
});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}