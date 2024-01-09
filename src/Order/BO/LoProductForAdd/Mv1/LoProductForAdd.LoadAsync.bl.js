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
 * @function loadAsync
 * @this LoProductForAdd
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} jsonParams
 * @returns promise
 */
function loadAsync(jsonParams){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var loadPromise;
var params = jsonParams.params;
var filterByBpaAssortment;
var customerPKey;
var filterBySdoAssortment;
var sdoMetaPKey;
var considerListing;
var commitDate;
var listing;
var listingWithModules;
var addCond_ProductPKeys;
var criterionAttribute;
var hitClosedListing;
var collectClosedListing;
var useClosedListing;
var considerPromotion;
var useConsiderModule;
var index = 0;

for (index in params) {

  switch (params[index].field) {
    case "filterByBpaAssortment":
      filterByBpaAssortment = params[index].value;
      break;
    case "customerPKey":
      customerPKey = params[index].value;
      break;
    case "filterBySdoAssortment":
      filterBySdoAssortment = params[index].value;
      break;
    case "sdoMetaPKey":
      sdoMetaPKey = params[index].value;
      break;
    case "considerListing":
      considerListing = params[index].value;
      break;
    case "useClosedListing":
      useClosedListing = params[index].value;
      break;
    case "commitDate":
      commitDate = params[index].value;
      break;
    case "listing":
      listing = params[index].value;
      break;
    case "listingWithModules":
      listingWithModules = params[index].value;
      break;
    case "addCond_ProductPKeys":
      addCond_ProductPKeys = params[index].value;
      break;
    case "criterionAttribute":
      criterionAttribute = params[index].value;
      break;
    case "considerPromotion":
      considerPromotion = params[index].value;
      break;
    case "hitClosedListing":
      hitClosedListing = params[index].value;
      break;
    case "collectClosedListing":
      collectClosedListing = params[index].value;
      break;
    case "useConsiderModule":
      useConsiderModule = params[index].value;
      break;
  }
}
var useMergeEngine = jsonParams.useMergeEngine;

if (Utils.isCasBackend() || !useMergeEngine) {
  // Load items from temporary table containing the merge result
  loadPromise = Facade.getListAsync("LoProductForAdd", jsonParams);
}
else {
  //Get merge engine parameters
  var mergeEngineParams = me.getMEParams(filterByBpaAssortment, customerPKey, filterBySdoAssortment, sdoMetaPKey, considerListing,
                                         listing, listingWithModules, commitDate, addCond_ProductPKeys, criterionAttribute, considerPromotion,
                                         useClosedListing, hitClosedListing, collectClosedListing, useConsiderModule);

  //Call merge engine
  loadPromise = Facade.getMergedListAsync(mergeEngineParams);
}

var promise = loadPromise.then(
  function (items) {
    me.addItems(items);
    me.orderBy({"text1":"ASC"});
    if(considerListing == '1' && useClosedListing == '1') {
      me.setClosedListingFilter(listing, listingWithModules, hitClosedListing,collectClosedListing);
    }
    // SF/CASDIF
    if (Utils.isCasBackend()) {
      jsonParams.params.push({
        "field" : "listing",
        "value" : listing
      });
      jsonParams.params.push({
        "field" : "listingWithModules",
        "value" : listingWithModules
      });
      jsonParams.params.push({
        "field" : "hitClosedListing",
        "value" : hitClosedListing
      });
      jsonParams.params.push({
        "field" : "collectClosedListing",
        "value" : collectClosedListing
      });
      jsonParams.params.push({
        "field" : "considerListing",
        "value" : considerListing
      });
      jsonParams.params.push({
        "field" : "useClosedListing",
        "value" : useClosedListing
      });
      jsonParams.params.push({
        "field" : "asoName",
        "value" : "AsoProductForAdd"
      });
      return me.addAsoInformation(jsonParams);
    }
    else if(!useMergeEngine && Utils.isSfBackend()) {
      jsonParams.params.push({
        "field" : "listing",
        "value" : listing
      });
      jsonParams.params.push({
        "field" : "listingWithModules",
        "value" : listingWithModules
      });
      jsonParams.params.push({
        "field" : "asoName",
        "value" : "AsoProductForAdd"
      });
      return me.addAsoInformation(jsonParams);
    }
    else {
      return when.resolve();
    }
  })
.then(function() {
  return me;
});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}