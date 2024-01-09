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
 * @function buildQueryCondition
 * @this LoOrderItems
 * @kind listobject
 * @namespace CORE
 * @param {Object} jsonParams
 * @param {DomString} criterionFilterValue
 * @returns sqlParams
 */
function buildQueryCondition(jsonParams, criterionFilterValue){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    var mainItemTemplate;
var disposalListProposal;
var considerListing;
var listing;
var listingWithModules;
var considerPromotion;
var useBpaAssortment;
var filterByBpaAssortment;
var useSalesDocAssortment;
var filterBySdoAssortment;
var considerOutOfStock;
var addHistoryItem;
var flatItemListGroupingAttribute;
var criterionFilterAttribute = "";
var itemListOption;
var sdoSubType;
var phase;
var syncStatus;
var considerInventory;
var filterByCurrentInventory;
var ivcMetaPKeys ;
var bpaMainPKeys;
var tmgTourPKeys;
var etpVehiclePKeys;
var usrMainPKeys;
var hitClosedListing;
var collectClosedListing;
var sdoMainPKey;
var commitDate;
var specialOrderHandling;
var considerSelectablePromotion;
var customerPKey;
var useMergeEngine = jsonParams.useMergeEngine;
var callOutOfStockProducts;

var index = 0;
for (index in jsonParams.params) {

  switch (jsonParams.params[index].field) {
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
    case "useBpaAssortment":
      useBpaAssortment = jsonParams.params[index].value;
      break;
    case "filterByBpaAssortment":
      filterByBpaAssortment = jsonParams.params[index].value;
      break;
    case "useSalesDocAssortment":
      useSalesDocAssortment = jsonParams.params[index].value;
      break;
    case "filterBySdoAssortment":
      filterBySdoAssortment = jsonParams.params[index].value;
      break;
    case "considerOutOfStock":
      considerOutOfStock = jsonParams.params[index].value;
      break;
    case "addHistoryItem":
      addHistoryItem = jsonParams.params[index].value;
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
    case "sdoSubType":
      sdoSubType = jsonParams.params[index].value;
      break;
    case "phase":
      phase = jsonParams.params[index].value;
      break;
    case "syncStatus":
      syncStatus = jsonParams.params[index].value;
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
    case "sdoMainPKey":
      sdoMainPKey = jsonParams.params[index].value;
      break;
    case "commitDate":
      commitDate = jsonParams.params[index].value;
      break;
    case "specialOrderHandling":
      specialOrderHandling = jsonParams.params[index].value;
      break;
    case "considerSelectablePromotion":
      considerSelectablePromotion = jsonParams.params[index].value;
      break;
    case "customerPKey":
      customerPKey = jsonParams.params[index].value;
      break;
    case "callOutOfStockProducts":
      callOutOfStockProducts = jsonParams.params[index].value;
      break;
  }
}

//Reset the filters when none of lists considered
if ((considerListing === '0' && addHistoryItem === '0' && considerPromotion === '0' && useBpaAssortment == '0' && useSalesDocAssortment == '0' && considerInventory == '0')) {
  filterByCurrentInventory = '0';
  filterByBpaAssortment = '0';
  filterBySdoAssortment = '0';
}

// Result variable
var queryCondition;
var isCollection = 'Collection';
var isHit = 'Hit';
var isNone = 'None';
var presentDefault = '1';
var jsonQuerySelectPromotion = {};
var jsonQueryPersisted = {};
var sdoMetaPosition;
//Authorization list
var cndAL = "";
var cndALListing = "";
var cndALListingWithModules = "";
var cndALClosedListing = "";
//Promotion
var cndPrm = "";
//Sales document assortment
var cndSdo = "";
var cndFilterBySdoAssortment = "";
//Out of stock products
var cndOos = "";
//Historic products
var cndHist = "";
//Current Inventory
var cndCI = "";
var cndFilterByCurrentInventory = "";

if (Utils.isDefined(mainItemTemplate)) {
  sdoMetaPosition = mainItemTemplate.getPrdProposalItemMetaPosition();
}

if (Utils.isCasBackend()) {
  if ((sdoSubType == "Delivery") && (disposalListProposal == "None")) {
    // Handle delivery document prepopulation - only persisted items are in the list
    queryCondition = " (IsPersistedItem = #presentDefault#) ";
  }
  else {
    // Normal disposal list proposal
    if ((phase == BLConstants.Order.PHASE_RELEASED) || (phase == BLConstants.Order.PHASE_CANCELED) || (phase == BLConstants.Order.PHASE_READY) || (syncStatus === BLConstants.Order.NOT_SYNCABLE)) {
      queryCondition = " (IsPersistedItem = #presentDefault#) ";
    }
    else {
      //Authorization list
      cndAL = "";
      cndALListing = "";
      cndALListingWithModules = "";
      cndALClosedListing = "";

      if (considerListing == 1) {

        if (listing == "Collection") {
          cndALListing = "Listing = #isCollection# OR Listing = #isHit#";
        }
        else if (listing == "Hit") {
          cndALListing = "Listing = #isHit#";
        }

        if (listingWithModules == "Collection") {
          cndALListingWithModules = "(ListingWithModules = #isCollection# OR ListingWithModules = #isHit#)";
        }
        else if (listingWithModules == "Hit") {
          cndALListingWithModules = "ListingWithModules = #isHit#";
        }
        if ((listing == "Hit" && hitClosedListing == '1' ) || (listing == "Collection" && collectClosedListing == '1' )) {
          if (mainItemTemplate.getUseClosedListing() == 1) {
            cndALClosedListing = "Listed = #presentDefault#";
          }
        }

        if (!Utils.isEmptyString(cndALListing)) {
          cndAL = cndALListing;
        }

        if (!Utils.isEmptyString(cndALListingWithModules)) {
          if (!Utils.isEmptyString(cndAL)) {
            cndAL += " AND ";
          }

          cndAL += cndALListingWithModules;
        }
      }

      //Promotion
      cndPrm = "";

      if (considerPromotion == 1) {
        cndPrm = "Promoted = #presentDefault#";
      }

      //Customer selling assortment
      var cndBpa = "";
      var cndFilterByBpaAssortment = "";

      if (useBpaAssortment == 1) {
        cndBpa = "CustomerAssortment = #presentDefault#";
      }

      if (filterByBpaAssortment == 1) {
        //Fiter by Customer selling assortment
        cndFilterByBpaAssortment = "CustomerAssortment = #presentDefault#";

        //Further restricting the filter if configured on the item template
        if (mainItemTemplate.getUseAssortmentSdoItem() == 1) {
          cndFilterByBpaAssortment += " OR SdoItemMeta#sdoMetaPosition# = #presentDefault#";
        }
      }

      //Sales document assortment
      cndSdo = "";
      cndFilterBySdoAssortment = "";

      if (useSalesDocAssortment == 1) {
        cndSdo = "SdoAssortment = #presentDefault#";
      }

      if (filterBySdoAssortment == 1) {
        cndFilterBySdoAssortment = "SdoAssortment = #presentDefault#";

      }

      if (considerInventory == 1) {
        cndCI = "CurrentInventory = #presentDefault#";
      }
      if (filterByCurrentInventory == 1) {
        cndFilterByCurrentInventory = "CurrentInventory = #presentDefault#";

      }

      //Out of stock products
      cndOos = "";

      if (considerOutOfStock != "No") {
        cndOos = "OutOfStock = #presentDefault#";
      }

      //Historic products
      cndHist = "";

      if (addHistoryItem == 1) {
        cndHist = "History = #presentDefault#";
      }

      //Moved Historical/Promotional Products condition to align with the conditions when only one filter is on and either of them are on.
      queryCondition = "";
      if (!Utils.isEmptyString(cndHist) && !(!Utils.isEmptyString(cndSdo) && !Utils.isEmptyString(cndFilterBySdoAssortment)) &&
          !(!Utils.isEmptyString(cndBpa) && !Utils.isEmptyString(cndFilterByBpaAssortment))) {
        queryCondition = "(" + cndHist + ")";
      }

      if (!Utils.isEmptyString(cndPrm) && !(!Utils.isEmptyString(cndSdo) && !Utils.isEmptyString(cndFilterBySdoAssortment)) &&
          !(!Utils.isEmptyString(cndBpa) && !Utils.isEmptyString(cndFilterByBpaAssortment))) {
        if (Utils.isEmptyString(queryCondition)) {
          queryCondition = "(" + cndPrm + ")";
        }
        else {
          queryCondition += " OR (" + cndPrm + ")";
        }
      }
      //If authorization list is not closed, allow promoted products that are not contained in the listing => OR
      if ((Utils.isEmptyString(cndALClosedListing)) &&(filterByBpaAssortment == "0") && (filterBySdoAssortment == "0") && (filterByCurrentInventory == "0")) {

        //Build query condition
        if (!Utils.isEmptyString(cndAL)) {
          if (Utils.isEmptyString(queryCondition)) {
            queryCondition += " (" + cndAL + ")";
          }
          else {
            queryCondition += " OR (" + cndAL + ")";
          }
        }
        else {
          if (Utils.isEmptyString(queryCondition)) {
            queryCondition += "(1 = 0)";
          }
        }

        if (!Utils.isEmptyString(cndBpa)) {
          queryCondition += " OR (" + cndBpa + ")";
        }

        if (!Utils.isEmptyString(cndSdo)) {
          queryCondition += " OR (" + cndSdo + ")";
        }

        if (!Utils.isEmptyString(cndCI)) {
          queryCondition += " OR (" + cndCI + ")";
        }

        if (!Utils.isEmptyString(cndOos)) {
          queryCondition += " OR (" + cndOos + ")";
        }
      }
      else {
        //Build query condition
        if (!Utils.isEmptyString(cndAL)) {
          if (Utils.isEmptyString(queryCondition)) {
            queryCondition += "(" + cndAL + ")";
          }
          else {
            queryCondition += " OR (" + cndAL + ")";
          }
          // if all the filters are set to 0
          if (!Utils.isEmptyString(cndFilterByBpaAssortment) && !Utils.isEmptyString(cndBpa)) {
            queryCondition += " OR (" + cndBpa + ")";
          }

          if (!Utils.isEmptyString(cndFilterBySdoAssortment) && !Utils.isEmptyString(cndSdo)) {
            queryCondition += " OR (" + cndSdo + ")";
          }

          if (!Utils.isEmptyString(cndFilterByCurrentInventory) && !Utils.isEmptyString(cndCI) || Utils.isEmptyString(cndFilterByCurrentInventory) && !Utils.isEmptyString(cndCI)) {
            queryCondition += " OR (" + cndCI + ")";
          }

          // Wrap query condition in brackets
          queryCondition = "(" + queryCondition + ")";

          // Handle FilterByCustomerAssortment
          if (!Utils.isEmptyString(cndFilterByBpaAssortment) ) {
            queryCondition += " AND (" + cndFilterByBpaAssortment + ")";
          }

          // Handle FilterBySalesDocAssortment
          if (!Utils.isEmptyString(cndFilterBySdoAssortment) ) {
            queryCondition += " AND (" + cndFilterBySdoAssortment + ")";
          }

          // Handle FilterByCurrentInventory
          if (!Utils.isEmptyString(cndFilterByCurrentInventory) ) {
            queryCondition += " AND (" + cndFilterByCurrentInventory + ")";
          }

          // Handle Closed Listing
          if (!Utils.isEmptyString(cndALClosedListing)) {
            queryCondition += " AND (" + cndALClosedListing + ")";
          }
        }
        else {
          if (Utils.isEmptyString(queryCondition)) {
            if(((Utils.isEmptyString(cndSdo) && !Utils.isEmptyString(cndFilterBySdoAssortment)) &&
                (!Utils.isEmptyString(cndBpa) && Utils.isEmptyString(cndFilterByBpaAssortment))) ||
               ((!Utils.isEmptyString(cndSdo) && Utils.isEmptyString(cndFilterBySdoAssortment)) &&
                (Utils.isEmptyString(cndBpa) && !Utils.isEmptyString(cndFilterByBpaAssortment)))) {
              queryCondition += "(1 = 0)";
            }
            else {
              queryCondition += "(1 = 1)";
            }
          }

          // Wrap query condition in brackets
          queryCondition = "(" + queryCondition + ")";
          // Handle FilterByCustomerAssortment
          if (!Utils.isEmptyString(cndFilterByBpaAssortment)) {
            queryCondition += " AND (" + cndFilterByBpaAssortment + ")";
            {
              if (!Utils.isEmptyString(cndSdo) && Utils.isEmptyString(cndFilterBySdoAssortment))
              {
                queryCondition += " OR (" + cndSdo + ")";
              }
            }
          }

          // Handle FilterBySalesDocumentAssortment
          if (!Utils.isEmptyString(cndFilterBySdoAssortment)) {
            queryCondition += " AND (" + cndFilterBySdoAssortment + ")";
            {
              if (!Utils.isEmptyString(cndBpa) && Utils.isEmptyString(cndFilterByBpaAssortment)) {
                queryCondition += " OR (" + cndBpa + ")";
              }
            }
          }

          //Handle FilterByCurrentInventory
          if (!Utils.isEmptyString(cndFilterByCurrentInventory)) {
            queryCondition += " AND (" + cndFilterByCurrentInventory + ")";
          }
          else if (!Utils.isEmptyString(cndCI) && Utils.isEmptyString(cndFilterByCurrentInventory)) {
            queryCondition += " OR (" + cndCI + ")";
          }
        }
      }
      // Wrap query condition in brackets
      queryCondition = "(" + queryCondition + ")";

      //include the persisted Items
      queryCondition += " OR IsPersistedItem = #presentDefault#";
      // Wrap query condition in brackets
      queryCondition = "(" + queryCondition + ")";
      //Moved Historical/Promotional Products condition to align with the conditions when only one filter is on and either of them are on.
      if (!Utils.isEmptyString(cndHist)) {
        queryCondition += " OR (" + cndHist + ")";
      }

      if (!Utils.isEmptyString(cndPrm)) {
        queryCondition += " OR (" + cndPrm + ")";
      }
      // Wrap query condition in brackets
      queryCondition = "(" + queryCondition + ")";
      // Restriction of level in case of hierarchy
      if (itemListOption == "Hierarchy") {
        if (Utils.isDefined(criterionFilterAttribute) && Utils.isDefined(criterionFilterValue) && (criterionFilterValue != "ALL")) {
          queryCondition += " AND #criterionFilterAttribute# = #criterionFilterValue#";
        }
        else if (criterionFilterValue != "ALL") {
          queryCondition += " AND IsPersistedItem = #presentDefault#";
        }
      }

      // Persisted items that are invalid
      // NOTE: Invalidated items are returned (but without PrdMainPKey) and are still handled by LoOrderItems.processInvalidatedItems()
    }
  }
}
else {
  if ((sdoSubType == "Delivery") && (disposalListProposal == "None")) {
    // Handle delivery document prepopulation - only persisted items are in the list
    queryCondition = " (persistedProduct.IsPersistedItem = #presentDefault#) ";
  }
  else {
    // Normal disposal list proposal
    if ((phase == BLConstants.Order.PHASE_RELEASED ) || (phase == BLConstants.Order.PHASE_CANCELED) || (phase == BLConstants.Order.PHASE_READY) || (syncStatus == BLConstants.Order.NOT_SYNCABLE)) {
      queryCondition = " (persistedProduct.IsPersistedItem = #presentDefault#) ";
    }
    else {

      //Authorization list
      cndAL = "";
      cndALListing = "";
      cndALListingWithModules = "";
      cndALClosedListing = "";

      if (considerListing == 1) {

        if (listing == "Hit") {
          // LO_MEAUTHORIZATIONLIST_WITHOUT_MODULES
          cndALListing = "proposedProduct.Listing = #isHit#";
          cndALListingWithModules = "proposedProduct.ListingWithModules = #isNone#";
        }
        else {
          // LO_MEAUTHORIZATIONLIST
          cndALListing = "proposedProduct.Listing = #isNone#";
          cndALListingWithModules = "proposedProduct.ListingWithModules = #isHit#";
        }
        if (hitClosedListing == 1 || collectClosedListing == 1) {
          if (mainItemTemplate.getUseClosedListing() == 1) {
            cndALClosedListing = "proposedProduct.Listed = #presentDefault#";
          }
        }

        if (!Utils.isEmptyString(cndALListing)) {
          cndAL = cndALListing;
        }

        if (!Utils.isEmptyString(cndALListingWithModules)) {
          if (!Utils.isEmptyString(cndAL)) {
            cndAL += " AND ";
          }

          cndAL += cndALListingWithModules;
        }
      }

      //Promotion
      cndPrm = "";

      if (considerPromotion == 1) {
        cndPrm = "proposedProduct.Promoted = #presentDefault#";
      }

      //Sales document assortment
      cndSdo = "";
      cndFilterBySdoAssortment = "";

      if (useSalesDocAssortment == 1) {
        cndSdo = "proposedProduct.SdoAssortment = #presentDefault#";
      }

      if (filterBySdoAssortment == 1) {
        cndFilterBySdoAssortment = "proposedProduct.SdoAssortment = #presentDefault#";
      }

      //Out of stock products
      cndOos = "";

      if (considerOutOfStock != "No") {
        cndOos = "proposedProduct.OutOfStock = #presentDefault#";
      }

      //Historic products
      cndHist = "";

      if (addHistoryItem == 1) {
        cndHist = "proposedProduct.History = #presentDefault#";
      }

      //Moved Historical/Promotional Products condition to align with the conditions when only one filter is on and either of them are on.
      queryCondition = "";
      if (!Utils.isEmptyString(cndHist)) {
        queryCondition = "(" + cndHist + ")";
      }

      if (!Utils.isEmptyString(cndPrm)) {
        if (Utils.isEmptyString(queryCondition)) {
          queryCondition = "(" + cndPrm + ")";
        }
        else {
          queryCondition += " OR (" + cndPrm + ")";
        }
      }
      //If authorization list is not closed, allow promoted products that are not contained in the listing => OR
      if ((Utils.isEmptyString(cndALClosedListing)) && (filterBySdoAssortment == "0") && (filterByCurrentInventory == "0") ) {

        //Build query condition
        if (!Utils.isEmptyString(cndAL)) {
          if (Utils.isEmptyString(queryCondition)) {
            queryCondition += " (" + cndAL + ")";
          }
          else {
            queryCondition += " OR (" + cndAL + ")";
          }
        }
        else {
          if (Utils.isEmptyString(queryCondition)){
            queryCondition += "(1 = 0)";
          }
        }

        if (!Utils.isEmptyString(cndSdo)) {
          queryCondition += " OR (" + cndSdo + ")";
        }

        if (!Utils.isEmptyString(cndOos)) {
          queryCondition += " OR (" + cndOos + ")";
        }
      }
      else {
        //Build query condition
        if (!Utils.isEmptyString(cndAL)) {
          if (Utils.isEmptyString(queryCondition)) {
            queryCondition += "(" + cndAL + ")";
          }
          else {
            queryCondition += " OR (" + cndAL + ")";
          }

          if (!Utils.isEmptyString(cndFilterBySdoAssortment) && !Utils.isEmptyString(cndSdo)) {
            queryCondition += " OR (" + cndSdo + ")";
          }

          if (!Utils.isEmptyString(cndFilterByCurrentInventory) && !Utils.isEmptyString(cndCI) || Utils.isEmptyString(cndFilterByCurrentInventory) && !Utils.isEmptyString(cndCI)) {
            queryCondition += " OR (" + cndCI + ")";
          }

          // Wrap query condition in brackets
          queryCondition = "(" + queryCondition + ")";

          // Handle FilterBySalesDocAssortment
          if (!Utils.isEmptyString(cndFilterBySdoAssortment)) {
            queryCondition += " AND (" + cndFilterBySdoAssortment + ")";
          }

          // Handle FilterByCurrentInventory
          if (!Utils.isEmptyString(cndFilterByCurrentInventory)) {
            queryCondition += " AND (" + cndFilterByCurrentInventory + ")";
          }

          // Handle Closed Listing
          if (!Utils.isEmptyString(cndALClosedListing)) {
            queryCondition += " AND (" + cndALClosedListing + ")";
          }
        }
        else {
          if (Utils.isEmptyString(queryCondition)) {
            if((Utils.isEmptyString(cndSdo) && !Utils.isEmptyString(cndFilterBySdoAssortment)) || (!Utils.isEmptyString(cndSdo) && Utils.isEmptyString(cndFilterBySdoAssortment))) {
              queryCondition += "(1 = 0)";
            }
            else {
              queryCondition += "(1 = 1)";
            }
          }

          // Wrap query condition in brackets
          queryCondition = "(" + queryCondition + ")";

          // Handle FilterBySalesDocumentAssortment
          if (!Utils.isEmptyString(cndFilterBySdoAssortment)) {
            queryCondition += " AND (" + cndFilterBySdoAssortment + ")";
          }

          //Handle FilterByCurrentInventory
          if (!Utils.isEmptyString(cndFilterByCurrentInventory)) {
            queryCondition += " AND (" + cndFilterByCurrentInventory + ")";
          }
          else if (!Utils.isEmptyString(cndCI) && Utils.isEmptyString(cndFilterByCurrentInventory)) {
            queryCondition += " OR (" + cndCI + ")";
          }
        }
      }
      // Wrap query condition in brackets
      queryCondition = "(" + queryCondition + ")";

      //include the persisted Items
      queryCondition += " OR persistedProduct.IsPersistedItem = #presentDefault#";
      // Wrap query condition in brackets
      queryCondition = "(" + queryCondition + ")";
      // Wrap query condition in brackets
      queryCondition = "(" + queryCondition + ")";
      // Restriction of level in case of hierarchy
      if (itemListOption == "Hierarchy") {
        if (Utils.isDefined(criterionFilterAttribute) && Utils.isDefined(criterionFilterValue) && (criterionFilterValue != "ALL")) {
          queryCondition += " AND #criterionFilterAttribute# = #criterionFilterValue#";
        }
        else if (criterionFilterValue != "ALL") {
          queryCondition += " AND IsPersistedItem = #presentDefault#";
        }
      }

      // Persisted items that are invalid
      // NOTE: Invalidated items are returned (but without PrdMainPKey) and are still handled by LoOrderItems.processInvalidatedItems()
      //Selectable Promotion Query
      if (considerSelectablePromotion == '1') {
        queryCondition += " OR selectablePromoted = #presentDefault# ";
      }
    }
  }

  jsonQuerySelectPromotion.params = [];
  jsonQuerySelectPromotion.params.push({"field" : "commitDate", "value" : commitDate});
  jsonQuerySelectPromotion.params.push({"field" : "specialOrderHandling", "value" : specialOrderHandling});
  jsonQuerySelectPromotion.params.push({"field" : "considerSelectablePromotion", "value" : considerSelectablePromotion});
  jsonQuerySelectPromotion.params.push({"field" : "sdoMainPKey", "value" : sdoMainPKey});
  jsonQuerySelectPromotion.params.push({"field" : "customerPKey", "value" : customerPKey});
  jsonQuerySelectPromotion.params.push({"field" : "useMergeEngine", "value" : useMergeEngine});
  //Order Items Query
  jsonQueryPersisted.params = [];
  jsonQueryPersisted.params.push({"field" : "sdoMainPKey", "value" : sdoMainPKey});
}

if (!Utils.isDefined(criterionFilterValue)) {
  criterionFilterValue = "";
}

var sqlParams = [];
sqlParams.push({
  "field" : "queryCondition",
  "value" : queryCondition
});
sqlParams.push({
  "field" : "jsonQuerySelectPromotion",
  "value" : jsonQuerySelectPromotion
});
sqlParams.push({
  "field" : "jsonQueryPersisted",
  "value" : jsonQueryPersisted
});
sqlParams.push({
  "field" : "isCollection",
  "value" : isCollection
});
sqlParams.push({
  "field" : "isHit",
  "value" : isHit
});
sqlParams.push({
  "field" : "isNone",
  "value" : isNone
});
sqlParams.push({
  "field" : "sdoMetaPosition",
  "value" : sdoMetaPosition
});
sqlParams.push({
  "field" : "presentDefault",
  "value" : presentDefault
});
sqlParams.push({
  "field" : "criterionFilterAttribute",
  "value" : criterionFilterAttribute
});
sqlParams.push({
  "field" : "criterionFilterValue",
  "value" : criterionFilterValue
});
sqlParams.push({
  "field" : "sdoMainPKey",
  "value" : sdoMainPKey
});
sqlParams.push({
  "field" : "mainItemTemplate",
  "value" : mainItemTemplate
});
sqlParams.push({
  "field" : "callOutOfStockProducts",
  "value" : callOutOfStockProducts
});
sqlParams.push({
  "field" : "considerOutOfStock",
  "value" : considerOutOfStock
});
sqlParams.push({
  "field" : "useMergeEngine",
  "value" : useMergeEngine
});
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return sqlParams;
}