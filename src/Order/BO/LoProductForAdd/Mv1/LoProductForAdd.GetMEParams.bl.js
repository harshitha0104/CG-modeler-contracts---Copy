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
 * @function getMEParams
 * @this LoProductForAdd
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {DomBool} filterByBpaAssortment
 * @param {DomPKey} customerPKey
 * @param {DomBool} filterBySdoAssortment
 * @param {DomPKey} sdoMetaPKey
 * @param {DomBool} considerListing
 * @param {DomSdoPdaListingFinding} listing
 * @param {DomSdoPdaListingFinding} listingWithModules
 * @param {DomDate} commitDate
 * @param {String} addCond_ProductPKeys
 * @param {Object} criterionAttribute
 * @param {DomBool} considerPromotion
 * @param {Object} useClosedListing
 * @param {Object} hitClosedListing
 * @param {Object} collectClosedListing
 * @param {String} useConsiderModule
 * @returns mergeEngineParams
 */
function getMEParams(filterByBpaAssortment, customerPKey, filterBySdoAssortment, sdoMetaPKey, considerListing, listing, listingWithModules, commitDate, addCond_ProductPKeys, criterionAttribute, considerPromotion, useClosedListing, hitClosedListing, collectClosedListing, useConsiderModule){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
// OBSOLETE!! - No longer called by core - Data is retrieved via datasource from temp table containing the merge result

var mergePropertyFilter = "FILTER";
var mergePropertyExclude = "EXCLUDE";
var mergePropertyNone = "NONE";

var mergeEngineParams = [];

//Customer Assortment is not implemented for CGCloud
if(!(Utils.isSfBackend())){
  //Filter by Customer Selling Assortment
  if (filterByBpaAssortment == 1){
    mergeEngineParams.push(this.getDSForCustomerAssortment(mergePropertyFilter, customerPKey, addCond_ProductPKeys));
  }
}

//Filter by Sales Document Assortment
if (filterBySdoAssortment == 1){
  mergeEngineParams.push(this.getDSForSdoAssortment(mergePropertyFilter, sdoMetaPKey, commitDate, addCond_ProductPKeys));
} 

//Handle closed listing
if (considerListing == 1){
  if((useClosedListing == 1) && (hitClosedListing == 1 || collectClosedListing == 1)){
    mergeEngineParams.push(this.getDSForAuthorizationList(mergePropertyFilter, customerPKey, listing, listingWithModules, addCond_ProductPKeys));
  }
  else{   
    mergeEngineParams.push(this.getDSForAuthorizationList(mergePropertyNone, customerPKey, listing, listingWithModules, addCond_ProductPKeys));
  }
}

//Promotion
if (considerPromotion == 1){
  mergeEngineParams.push(this.getDSForPromotion(mergePropertyNone, customerPKey, commitDate));
}

//Products
mergeEngineParams.push(this.getDSForProducts(mergePropertyFilter, commitDate, addCond_ProductPKeys, criterionAttribute));

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return mergeEngineParams;
}