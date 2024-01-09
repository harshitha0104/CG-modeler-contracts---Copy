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
 * @function getDSForProducts
 * @this LoProductForAdd
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {DomString} mergeProperty
 * @param {DomDate} commitDate
 * @param {String} addCond_ProductPKeys
 * @param {String} criterionAttribute
 * @returns datasourceDefiniton
 */
function getDSForProducts(mergeProperty, commitDate, addCond_ProductPKeys, criterionAttribute){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
// Datasource name (required by merge engine)
var LO_MEPRODUCTS = "LoMeProducts";

var dsParams = "";
var dsParams_array = [];

//SF/CASDiff: General Difference
if(Utils.isSfBackend()) // <!-- CW-REQUIRED: Framework is now Utils -->
{
  dsParams_array.push({ "field": "addCond_ForeignProduct", "value": " AND Product2.Competitive_Product__c = '0' " });  
  dsParams_array.push({ "field": "addCond_FieldState", "value": " AND (#compareAsDate('Product2.Field_Valid_From__c ', 'Date','<=',#TodayAsDate#, 'Date')#  AND #compareAsDate('Product2.Field_Valid_Thru__c', 'Date','>=',#TodayAsDate#, 'Date')#) " }); 
  
 // Add additional conditions for restricting products, e.g. invalid product check (called from LoOrderItems.processInvalidItems());  
  if (!Utils.isEmptyString(addCond_ProductPKeys)) {
    dsParams_array.push({ "field": "addCond_productPKeys", "value": " AND Product2.Id IN (" + addCond_ProductPKeys + ") " });
  }
  
  dsParams_array.push({ "field": "criterionAttribute", "value": criterionAttribute });
}else{
  
  dsParams_array.push({ "field": "addCond_ForeignProduct", "value": " AND PrdProduct.ForeignProduct = '0' " });  
  dsParams_array.push({ "field": "addCond_FieldState", "value": " AND PrdStateAbstract.FieldState = 'Available' " });  

  // Add additional conditions for restricting products, e.g. invalid product check (called from LoOrderItems.processInvalidItems());  
  if (!Utils.isEmptyString(addCond_ProductPKeys)) {
    dsParams_array.push({ "field": "addCond_productPKeys", "value": " AND PrdMainPKey IN (" + addCond_ProductPKeys + ") " });
  }
}

dsParams_array.push({ "field": "commitDate", "value": commitDate });   
dsParams = { "params": dsParams_array };

var datasourceDefiniton = {
  "boName": LO_MEPRODUCTS,
  "dsParams": dsParams,
  "matchingColumn": "pKey",
  "dataSourceColumns": [
    { "name": "pKey", "alias": "pKey" },
    { "name": "prdMainPKey", "alias": "prdMainPKey" },
    { "name": "text1", "alias": "text1" },
    { "name": "text2", "alias": "text2" },
    { "name": "prdId", "alias": "prdId" },
    { "name": "shortId", "alias": "shortId" },    
    { "name": "deliveryState", "alias": "deliveryState" },
    { "name": "fieldState", "alias": "fieldState" },
    { "name": "newState", "alias": "newState" },
    { "name": "groupingAttribute", "alias": "groupingAttribute" },
    { "name": "eAN", "alias": "eAN" },
    { "name": "foreignProduct", "alias": "foreignProduct" },
    { "name": "category", "alias": "category" },
    { "name": "prdType", "alias": "prdType" },
    { "name": "productGroup", "alias": "productGroup" },
    { "name": "groupId", "alias": "groupId" },
    { "name": "groupText", "alias": "groupText" }
  ],
  "mergeProperty": mergeProperty,
  "lookupDataSource": "false"
};

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return datasourceDefiniton;
}