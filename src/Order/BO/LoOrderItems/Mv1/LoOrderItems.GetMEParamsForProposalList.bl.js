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
 * @function getMEParamsForProposalList
 * @this LoOrderItems
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {Object} jsonParams
 * @param {DomString} criterionFilterValue
 * @returns mergeEngineParams
 */
function getMEParamsForProposalList(jsonParams, criterionFilterValue){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var mergePropertyFilter = "FILTER";
var mergePropertyExclude = "EXCLUDE";
var mergePropertyNone = "NONE";
var mergeEngineParams = [];

//Unwrap JsonParams

var sdoMainPKey;
var mainItemTemplate;
var disposalListProposal;
var considerListing;
var listing;
var listingWithModules;
var considerPromotion;
var commitDate;
var customerPKey;
var useBpaAssortment;
var filterByBpaAssortment;
var allowForeignProducts;
var considerFieldState;
var useSalesDocAssortment;
var filterBySdoAssortment;
var considerNewProducts;
var phase;
var syncStatus;
var clbMainPKey;
var considerOutOfStock;
var addHistoryItem;
var sdoMetaPKey;
var considerMaxHistoryDays;
var flatItemListGroupingAttribute;
var criterionFilterAttribute;
var itemListOption;
var mobilityRelevant;
var sdoSubType;
var considerInventory;
var filterByCurrentInventory;
var ivcMetaPKeys ;
var bpaMainPKeys;
var tmgTourPKeys;
var etpVehiclePKeys;
var usrMainPKeys;
var hitClosedListing;
var collectClosedListing;

var index = 0;
for (index in jsonParams.params) {

  switch (jsonParams.params[index].field) {
    case "sdoMainPKey":
      sdoMainPKey = jsonParams.params[index].value;
      break;

    case "mainItemTemplate":
      mainItemTemplate = jsonParams.params[index].value;
      break;
    case "disposalListProposal":
      disposalListProposal = jsonParams.params[index].value;
      break;
    case "considerListing":
      considerListing = jsonParams.params[index].value;
      break;
    case "listing":
      listing = jsonParams.params[index].value;
      break;
    case "listingWithModules":
      listingWithModules = jsonParams.params[index].value;
      break;
    case "considerPromotion":
      considerPromotion = jsonParams.params[index].value;
      break;
    case "commitDate":
      commitDate = jsonParams.params[index].value;
      break;
    case "customerPKey":
      customerPKey = jsonParams.params[index].value;
      break;
    case "useBpaAssortment":
      useBpaAssortment = jsonParams.params[index].value;
      break;
    case "filterByBpaAssortment":
      filterByBpaAssortment = jsonParams.params[index].value;
      break;
    case "allowForeignProducts":
      allowForeignProducts = jsonParams.params[index].value;
      break;
    case "considerFieldState":
      considerFieldState = jsonParams.params[index].value;
      break;
    case "useSalesDocAssortment":
      useSalesDocAssortment = jsonParams.params[index].value;
      break;
    case "filterBySdoAssortment":
      filterBySdoAssortment = jsonParams.params[index].value;
      break;
    case "considerNewProducts":
      considerNewProducts = jsonParams.params[index].value;
      break;
    case "phase":
      phase = jsonParams.params[index].value;
      break;
    case "syncStatus":
      syncStatus = jsonParams.params[index].value;
      break;
    case "clbMainPKey":
      clbMainPKey = jsonParams.params[index].value;
      break;
    case "considerOutOfStock":
      considerOutOfStock = jsonParams.params[index].value;
      break;
    case "addHistoryItem":
      addHistoryItem = jsonParams.params[index].value;
      break;
    case "sdoMetaPKey":
      sdoMetaPKey = jsonParams.params[index].value;
      break;
    case "considerMaxHistoryDays":
      considerMaxHistoryDays = jsonParams.params[index].value;
      break;
    case "flatItemListGroupingAttribute":
      flatItemListGroupingAttribute = jsonParams.params[index].value;
      break;
    case "criterionFilterAttribute":
      criterionFilterAttribute = jsonParams.params[index].value;
      break;
    case "itemListOption":
      itemListOption = jsonParams.params[index].value;
      break;
    case "mobilityRelevant":
      mobilityRelevant = jsonParams.params[index].value;
      break;
    case "sdoSubType":
      sdoSubType = jsonParams.params[index].value;
      break;
    case "considerInventory":
      considerInventory = jsonParams.params[index].value;
      break;
    case "filterByCurrentInventory":
      filterByCurrentInventory = jsonParams.params[index].value;
      break;
    case "ivcMetaPKeys":
      ivcMetaPKeys = jsonParams.params[index].value;
      break;
    case "bpaMainPKeys":
      bpaMainPKeys = jsonParams.params[index].value;
      break;
    case "tmgTourPKeys":
      tmgTourPKeys = jsonParams.params[index].value;
      break;
    case "etpVehiclePKeys":
      etpVehiclePKeys = jsonParams.params[index].value;
      break;
    case "usrMainPKeys":
      usrMainPKeys = jsonParams.params[index].value;
      break;
      case "hitClosedListing":
      hitClosedListing = jsonParams.params[index].value;
      break;
    case "collectClosedListing":
      collectClosedListing = jsonParams.params[index].value;
      break;
  }
}


// Execute list finding datasources only if the order template is configured to propose products
// Execute list finding only if the order is not "Released", "Canceled", or "Ready" and the order is mobilityRelevant
// Existing products are added below this block!

if ((!((phase == BLConstants.Order.PHASE_RELEASED) || (phase == BLConstants.Order.PHASE_CANCELED) || (phase == BLConstants.Order.PHASE_READY ))) && (disposalListProposal == "Proposal") && (mobilityRelevant == "1") && (syncStatus !== BLConstants.Order.NOT_SYNCABLE)) {

  //Closed listing and Authorization List
  if (considerListing == 1) {
    var dsForAuthorizationList;
    if((mainItemTemplate.getUseClosedListing() == 1) && (hitClosedListing == 1 || collectClosedListing == 1)) {
      dsForAuthorizationList = me.getDSForAuthorizationList(mergePropertyFilter, customerPKey,listing, listingWithModules);
    }
    else {         
      dsForAuthorizationList = me.getDSForAuthorizationList(mergePropertyNone, customerPKey,listing, listingWithModules);
    }
    //add to ME-Params
    mergeEngineParams.push(dsForAuthorizationList);
  }

  //Promotion
  if (considerPromotion == 1) {
    mergeEngineParams.push(me.getDSForPromotion(mergePropertyNone, customerPKey, commitDate));
  }

  //Customer Assortment is not implemented for CGCloud
  if (!(Utils.isSfBackend())) {

    //Customer Selling Assortment
    if (useBpaAssortment == 1 ||filterByBpaAssortment == 1) {
      var dsForCustomerAssortment;
      var prdProposalItemMetaPosition = mainItemTemplate.getPrdProposalItemMetaPosition();
      var useAssortmentSdoItem = mainItemTemplate.getUseAssortmentSdoItem();

      if (filterByBpaAssortment == 1) {
        dsForCustomerAssortment = me.getDSForCustomerAssortment(mergePropertyFilter, customerPKey, prdProposalItemMetaPosition, useAssortmentSdoItem);
      }
      else {
        dsForCustomerAssortment = me.getDSForCustomerAssortment(mergePropertyNone, customerPKey, prdProposalItemMetaPosition, useAssortmentSdoItem);
      }


      //add to ME-Params
      mergeEngineParams.push(dsForCustomerAssortment);
    }
  }
  //Sales Document Assortment
  if (useSalesDocAssortment == 1 || filterBySdoAssortment == 1) {
    var dsForSdoAssortment;

    if (filterBySdoAssortment == 1) {
      dsForSdoAssortment = me.getDSForSdoAssortment(mergePropertyFilter, sdoMetaPKey, commitDate);
    }
    else {
      dsForSdoAssortment = me.getDSForSdoAssortment(mergePropertyNone, sdoMetaPKey, commitDate);
    }

    //add to ME-Params
    mergeEngineParams.push(dsForSdoAssortment);
  }


  //Out of stock products
  if (considerOutOfStock != "No") {
    if (Utils.isDefined(clbMainPKey) && !(Utils.isEmptyString(clbMainPKey))) {
      mergeEngineParams.push(me.getDSForOutOfStock(clbMainPKey));
    }
  }

  //Historic products
  if (addHistoryItem == 1) {
    var dateFrom = Utils.addDays2AnsiDate(commitDate, considerMaxHistoryDays * (-1));
    mergeEngineParams.push(me.getDSForHistoricProducts(customerPKey, sdoMetaPKey, dateFrom));
  }

  //Inventory items
  if (Utils.isDefined(tmgTourPKeys)) {
    if (considerInventory == 1 || filterByCurrentInventory == 1 ) {
      var dsForCurrentInventory;

      if (filterByCurrentInventory == 1) {
        dsForCurrentInventory = me.getDsForCurrentInventory(mergePropertyFilter,ivcMetaPKeys, bpaMainPKeys, tmgTourPKeys, etpVehiclePKeys, usrMainPKeys);
      }
      else {
        dsForCurrentInventory = me.getDsForCurrentInventory(mergePropertyNone,ivcMetaPKeys, bpaMainPKeys, tmgTourPKeys, etpVehiclePKeys, usrMainPKeys);
      }

      //add to ME-Params
      mergeEngineParams.push(dsForCurrentInventory);
    } 
  }
}

//Existing OrderItems
if ((phase == BLConstants.Order.PHASE_RELEASED) || (phase == BLConstants.Order.PHASE_CANCELED) || (phase == BLConstants.Order.PHASE_READY) || (syncStatus === BLConstants.Order.NOT_SYNCABLE)) {	 
  mergeEngineParams.push(me.getDSForOrderItems(mergePropertyFilter, sdoMainPKey, phase, mainItemTemplate, syncStatus));
}
else { 
  mergeEngineParams.push(me.getDSForOrderItems(mergePropertyNone, sdoMainPKey, phase, mainItemTemplate, syncStatus));	
}
//Product Information
//OBSOLETE with release 11.0: 'criterionFilterValue' is not relevant here any longer and no longer evaluated by getDSForProductInformation
var quantityLogisticUnit;
if (Utils.isDefined(mainItemTemplate)) {
  quantityLogisticUnit = mainItemTemplate.getQuantityLogisticUnit();
}
mergeEngineParams.push(me.getDSForProductInformation(mergePropertyFilter, allowForeignProducts, considerFieldState,
                                                      quantityLogisticUnit, considerNewProducts, commitDate, flatItemListGroupingAttribute, criterionFilterAttribute,
                                                       criterionFilterValue, itemListOption));

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return mergeEngineParams;
}