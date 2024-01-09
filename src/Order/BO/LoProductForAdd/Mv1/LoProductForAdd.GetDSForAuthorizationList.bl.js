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
 * @function getDSForAuthorizationList
 * @this LoProductForAdd
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {DomString} mergeProperty
 * @param {DomPKey} customerPKey
 * @param {DomSdoPdaListingFinding} listing
 * @param {DomSdoPdaListingFinding} listingWithModules
 * @param {String} addCond_ProductPKeys
 * @returns datasourceDefiniton
 */
function getDSForAuthorizationList(mergeProperty, customerPKey, listing, listingWithModules, addCond_ProductPKeys){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
// Datasource name (required by merge engine)
var LO_MEAUTHORIZATIONLIST = "LoMeAuthorizationList";
var LO_MEAUTHORIZATIONLIST_WITHOUT_MODULES = "LoMeAuthorizationListWithoutModules";

var dsParams = "";
var dsParams_array = [];

var listobject = "";

if(Utils.isSfBackend()) // <!-- CW-REQUIRED: Framework is now Utils -->
{
  if (listing == "Hit")
  {
    listobject = LO_MEAUTHORIZATIONLIST_WITHOUT_MODULES;
    dsParams_array.push({ "field": "customerPKey", "value": customerPKey });
  } 
  else
  {
    listobject = LO_MEAUTHORIZATIONLIST;
    dsParams_array.push({ "field": "customerPKey", "value": customerPKey });
  }
}
else
{
  // Dermine parameter values for Listing and ListingWithModules
  if (typeof listing != "undefined") {
    if (listing == "Collection") {
      listobject = LO_MEAUTHORIZATIONLIST_WITHOUT_MODULES;
      dsParams_array.push({ "field": "addCond_Listing", "value": "AND (PrdProposalAuthListPrdRel.Listing = 'Collection' OR PrdProposalAuthListPrdRel.Listing = 'Hit') "});
    } else if (listing == "Hit") {
      listobject = LO_MEAUTHORIZATIONLIST_WITHOUT_MODULES;
      dsParams_array.push({ "field": "addCond_Listing", "value": "AND PrdProposalAuthListPrdRel.Listing = 'Hit' "});
    }
  }

  if (typeof listingWithModules != "undefined") {
    if (listingWithModules == "Collection") {
      listobject = LO_MEAUTHORIZATIONLIST;
      dsParams_array.push({ "field": "addCond_ListingWithModules", "value": " AND (PrdProposalAuthListPrdRel.ListingWithModules = 'Collection' OR PrdProposalAuthListPrdRel.ListingWithModules = 'Hit' )"});
    } else if (listingWithModules == "Hit") {
      listobject = LO_MEAUTHORIZATIONLIST;
      dsParams_array.push({ "field": "addCond_ListingWithModules", "value": " AND PrdProposalAuthListPrdRel.ListingWithModules = 'Hit' "});
    } 
  }  

  dsParams_array.push({ "field": "customerPKey", "value": customerPKey });

  // Add additional conditions for restricting products, e.g. invalid product check (called from LoOrderItems.processInvalidItems());  
  if (!Utils.isEmptyString(addCond_ProductPKeys)) {
    dsParams_array.push({ "field": "addCond_productPKeys", "value": " AND PrdMainPKey IN (" + addCond_ProductPKeys + ") " });
  }
}

dsParams = { "params": dsParams_array };

var datasourceDefiniton = {
  "boName": listobject,
  "dsParams": dsParams,
  "matchingColumn": "prdMainPKey",
  "dataSourceColumns": [
    { "name": "listed", "alias": "listed", "default": "0" },
    { "name": "listing", "alias": "listing" },
    { "name": "listingWithModules", "alias": "listingWithModules" },
    { "name": "customerProductNumber", "alias": "customerProductNumber"},
    { "name": "focusProductType", "alias": "focusProductType"},
    { "name": "focusProductImage", "alias": "focusProductImage"}
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