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
 * @function getDSForProductInformation
 * @this LoOrderItems
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {DomString} mergeProperty
 * @param {DomBool} allowForeignProducts
 * @param {DomBool} considerFieldState
 * @param {DomSdoPdaQuantityLogisticUnit} defaultQuantityLogisticUnit
 * @param {DomBool} considerNewProducts
 * @param {DomDate} commitDate
 * @param {DomString} flatItemListGroupingAttribute
 * @param {DomString} criterionFilterAttribute
 * @param {DomString} criterionFilterValue
 * @param {DomSdoItemListOption} itemListOption
 * @returns datasourceDefiniton
 */
function getDSForProductInformation(mergeProperty, allowForeignProducts, considerFieldState, defaultQuantityLogisticUnit, considerNewProducts, commitDate, flatItemListGroupingAttribute, criterionFilterAttribute, criterionFilterValue, itemListOption){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
// Datasource name (required by merge engine)
var LO_MEPRODUCTINFORMATION = "LoMeProductInformation";

var dsParams = "";
var dsParams_array = [];

dsParams_array.push({ "field": "commitDate", "value": commitDate });

if (itemListOption == "Hierarchy") {
  dsParams_array.push({ "field": "criterionAttribute", "value": criterionFilterAttribute });
} else {
  dsParams_array.push({ "field": "criterionAttribute", "value": flatItemListGroupingAttribute });
}

//Build datasource params depending on input parameters

//SF/CASDiff: General Difference
if(Utils.isSfBackend()) // <!-- CW-REQUIRED: Framework is now Utils -->
{
  dsParams_array.push({ "field": "addCond_ProductState", "value": " Product2.State__c='4' " });

  if ((typeof allowForeignProducts != "undefined") && (allowForeignProducts != 1)) {
    dsParams_array.push({ "field": "addCond_ForeignProduct", "value": " AND Product2.Competitive_Product__c = '0' " });
  }

  if ((typeof considerFieldState != "undefined") && (considerFieldState == 1)) {
    dsParams_array.push({ "field": "addCond_FieldState", "value": " AND (#compareAsDate('Product2.Field_Valid_From__c ', 'Date','<=',#TodayAsDate#, 'Date')#  AND #compareAsDate('Product2.Field_Valid_Thru__c', 'Date','>=',#TodayAsDate#, 'Date')#) " });
  }

  if ((typeof considerNewProducts != "undefined") && (considerNewProducts === 0)) {
    dsParams_array.push({ "field": "addCond_NewState", "value": " AND (#compareAsDate('Product2.New_Item_Valid_From__c ', 'Date','<=',#TodayAsDate#, 'Date')#  AND #compareAsDate('Product2.New_Item_Valid_Thru__c', 'Date','>=',#TodayAsDate#, 'Date')# ) " });
  }

}
else
{
  if ((typeof allowForeignProducts != "undefined") && (allowForeignProducts != 1)) {

    dsParams_array.push({ "field": "addCond_ForeignProduct", "value": " AND PrdProduct.ForeignProduct = '0' " });
  }

  if ((typeof considerFieldState != "undefined") && (considerFieldState == 1)) {

    dsParams_array.push({ "field": "addCond_FieldState", "value": " AND PrdStateAbstract.FieldState = 'Available' " });
  }

  if ((typeof considerNewProducts != "undefined") && (considerNewProducts === 0)) {

    dsParams_array.push({ "field": "addCond_NewState", "value": " AND PrdStateAbstract.NewState = 'NotAvailable' " });
  }
}
dsParams = { "params": dsParams_array };

//Build datasource columns depending on imput parameters
var dsColumns_array = [];

if (defaultQuantityLogisticUnit == "OrderUnit") {
  dsColumns_array.push({ "name": "orderQuantityLogisticUnit", "alias" : "defaultQuantityLogisticUnit" });
  dsColumns_array.push({ "name": "orderPiecesPerSmallestUnit", "alias" : "defaultPiecesPerSmallestUnit" });
} else if (defaultQuantityLogisticUnit == "ConsumerUnit") {
  dsColumns_array.push({ "name": "consumerQuantityLogisticUnit", "alias" : "defaultQuantityLogisticUnit" });
  dsColumns_array.push({ "name": "consumerPiecesPerSmallestUnit", "alias" : "defaultPiecesPerSmallestUnit" });
} else if (defaultQuantityLogisticUnit == "PriceUnit") {
  dsColumns_array.push({ "name": "priceQuantityLogisticUnit", "alias" : "defaultQuantityLogisticUnit" });
  dsColumns_array.push({ "name": "pricePiecesPerSmallestUnit", "alias" : "defaultPiecesPerSmallestUnit" });
} else {
  dsColumns_array.push({ "name": "orderQuantityLogisticUnit", "alias" : "defaultQuantityLogisticUnit" });
  dsColumns_array.push({ "name": "orderPiecesPerSmallestUnit", "alias": "defaultPiecesPerSmallestUnit" });
}

dsColumns_array.push({ "name": "pKey", "alias": "prdMainPKey" });
dsColumns_array.push({ "name": "text1", "alias": "text1" });
dsColumns_array.push({ "name": "text2", "alias": "text2" });
dsColumns_array.push({ "name": "prdId", "alias": "prdId" });
dsColumns_array.push({ "name": "shortId", "alias": "shortId" });
dsColumns_array.push({ "name": "taxClassification", "alias": "taxClassification" });
dsColumns_array.push({ "name": "simplePricingBasePrice", "alias": "simplePricingBasePrice" });
dsColumns_array.push({ "name": "deliveryState", "alias": "deliveryState" });
dsColumns_array.push({ "name": "fieldState", "alias": "fieldState" });
dsColumns_array.push({ "name": "foreignProduct", "alias": "foreignProduct" });
dsColumns_array.push({ "name": "eAN", "alias": "eAN" });
dsColumns_array.push({ "name": "newState", "alias": "newState" });
dsColumns_array.push({ "name": "piecesPerSmallestUnitForBasePrice", "alias": "piecesPerSmallestUnitForBasePrice" });
dsColumns_array.push({ "name": "groupText", "alias": "groupText" });
dsColumns_array.push({ "name": "groupId", "alias": "groupId" });
dsColumns_array.push({ "name": "prdType", "alias": "prdType" });
dsColumns_array.push({ "name": "criterion1", "alias": "criterion1" });
dsColumns_array.push({ "name": "criterion2", "alias": "criterion2" });
dsColumns_array.push({ "name": "criterion3", "alias": "criterion3" });
dsColumns_array.push({ "name": "criterion4", "alias": "criterion4" });
dsColumns_array.push({ "name": "criterion5", "alias": "criterion5" });
dsColumns_array.push({ "name": "criterion6", "alias": "criterion6" });
dsColumns_array.push({ "name": "category", "alias": "category" });

//Build datasource definiton
var datasourceDefiniton = {
  "boName": LO_MEPRODUCTINFORMATION,
  "dsParams": dsParams,
  "matchingColumn": "pKey",
  "dataSourceColumns": dsColumns_array,
  "mergeProperty": mergeProperty,
  "lookupDataSource": Utils.isSfBackend().toString()
};

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return datasourceDefiniton;
}