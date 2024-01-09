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
 * @function getJsonQueryForProductForAdd
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @returns productForAddQuery
 */
function getJsonQueryForProductForAdd(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var productForAddParams = [];
var productForAddQuery = {};		
var filterBySdoAssortment = me.getBoOrderMeta().getFilterBySdoAssortment();
var allowForeignProducts = me.getBoOrderMeta().getAllowForeignProducts();

/** Order Attributes */
productForAddParams.push({"field" : "customerPKey", "value" : me.getOrdererPKey()});
productForAddParams.push({"field" : "orderPKey" , "value" : me.getPKey()});

/** Customer Assortment */
productForAddParams.push( { "field" : "useBpaAssortment", "value" : me.getBoOrderMeta().getUseBpaAssortment()});
if (me.getBoOrderMeta().getFilterByBpaAssortment() == '1'){
  productForAddParams.push( { "field" : "filterByBpaAssortment", "value" : '1'});
}

/** Sales Document Assortment */
productForAddParams.push( { "field" : "useSalesDocAssortment", "value" : me.getBoOrderMeta().getUseSalesDocAssortment()});
if (filterBySdoAssortment == '1'){
  productForAddParams.push( { "field" : "filterBySdoAssortment", "value" : '1'});
}

/** Listing (with modules) */
productForAddParams.push( { "field" : "considerListing", "value" : me.getBoOrderMeta().getConsiderListing()});
productForAddParams.push( { "field" : "listing", "value" : me.getBoOrderMeta().getListing()});		
productForAddParams.push( { "field" : "listingWithModules", "value" : me.getBoOrderMeta().getListingWithModules()});
productForAddParams.push( {"field" : "useConsiderModule" , "value" : me.getLuOrderer().getConsiderModule()});

/** Closed Listing */
productForAddParams.push( {"field" : "hitClosedListing", "value": me.getLuOrderer().getHitClosedListing()});
productForAddParams.push( {"field" : "collectClosedListing", "value": me.getLuOrderer().getCollectClosedListing()});

/** Promotions */
productForAddParams.push( { "field" : "considerPromotion", "value" : me.getBoOrderMeta().getConsiderPromotion()});
productForAddParams.push( { "field" : "considerSelectablePromotion", "value": me.getBoOrderMeta().getConsiderSelectablePromotion()});

productForAddParams.push( { "field" : "sdoMetaPKey", "value" : me.getSdoMetaPKey()});
productForAddParams.push( { "field" : "commitDate", "value" : me.getCommitDate()});

/** Items List Mode (Hierarchy vs. Flat List) */
if (me.getBoOrderMeta().getItemListOption() == "Hierarchy"){
  productForAddParams.push( { "field" : "criterionAttribute", "value" : me.getBoOrderMeta().getCriterionAttributeForLevel(me.getBoOrderMeta().getNumberOfHierarchyLevels())});    
} else{
  productForAddParams.push({ "field": "criterionAttribute", "value": me.getBoOrderMeta().getCriterionAttributeForFlatList()});
}

if (allowForeignProducts != '1'){
  productForAddParams.push( { "field" : "filterOutCompetitorProducts", "value" : '1'});
}

/** Query Condition */
var queryCondition = "1=1 ";

if (filterBySdoAssortment == '1') {
  queryCondition += " AND SdoAssortment = '1' ";
}

productForAddParams.push({"field" : "queryCondition", "value" : queryCondition });

productForAddQuery.params = productForAddParams;
productForAddQuery.useMergeEngine = me.useMergeEngine();

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return productForAddQuery;
}