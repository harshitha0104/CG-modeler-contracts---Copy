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
 * @function getJsonQueryForLoItems
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @returns orderItemsQuery
 */
function getJsonQueryForLoItems(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var orderItemsParams = [];
var orderItemsQuery = {};
var allowForeignProducts = me.getBoOrderMeta().getAllowForeignProducts();
var considerFieldState = me.getBoOrderMeta().getConsiderFieldStatus();
var considerNewProducts = me.getBoOrderMeta().getConsiderNewProducts();
var itemListOption = me.getBoOrderMeta().getItemListOption();
var criterionFilterAttribute = me.getBoOrderMeta().getCriterionAttributeForLevel(me.getBoOrderMeta().getNumberOfHierarchyLevels());
var flatItemListGroupingAttribute = me.getBoOrderMeta().getCriterionAttributeForFlatList();
var considerMaxHistoryDays = me.getBoOrderMeta().getConsiderMaxHistoryDays();
var commitDate = me.getCommitDate();
var listing = me.getBoOrderMeta().getListing();
var customerPKey = me.getOrdererPKey();
var clbMainPKey = me.getClbMainPKey();
var sdoMetaPKey = me.getSdoMetaPKey();
var sdoMainPKey = me.getPKey();
var criterionAttribute;
var addCond_ForeignProduct = " ";
var addCond_FieldState = " ";
var addCond_NewState = " ";
var dateFrom = Utils.addDays2AnsiDate(commitDate, considerMaxHistoryDays * (-1));
var considerListing = me.getBoOrderMeta().getConsiderListing();
var considerPromotion = me.getBoOrderMeta().getConsiderPromotion();
var useSalesDocAssortment = me.getBoOrderMeta().getUseSalesDocAssortment();
var filterBySdoAssortment = me.getBoOrderMeta().getFilterBySdoAssortment();
var considerOutOfStock = me.getBoOrderMeta().getConsiderOutOfStock();
var addHistoryItem = me.getBoOrderMeta().getAddHistoryItem();
var phase = me.getPhase();
var syncStatus = me.getSyncStatus();
var mainItemTemplate;
var addCond_ProductState;

//merge engine switch
orderItemsQuery.useMergeEngine = me.useMergeEngine();

orderItemsParams.push( { "field" : "sdoMainPKey", "value" : sdoMainPKey});
orderItemsParams.push( { "field" : "disposalListProposal", "value" : me.getBoOrderMeta().getDisposalListProposal()});
orderItemsParams.push( { "field" : "considerListing", "value" : considerListing});
orderItemsParams.push( { "field" : "considerPromotion", "value" : considerPromotion});
orderItemsParams.push( { "field" : "useBpaAssortment", "value" : me.getBoOrderMeta().getUseBpaAssortment()});
orderItemsParams.push( { "field" : "filterByBpaAssortment", "value" : me.getBoOrderMeta().getFilterByBpaAssortment()});

if (Utils.isDefined(me.getBoOrderMeta().getLoOrderItemMetas().getMainItemTemplate())) {
  mainItemTemplate = me.getBoOrderMeta().getLoOrderItemMetas().getMainItemTemplate();
  orderItemsParams.push({ "field": "mainItemTemplate", "value" : mainItemTemplate});
}
else {
  mainItemTemplate = me.getBoOrderMeta().getLoOrderItemMetas().getFirstItem();
  orderItemsParams.push({ "field": "mainItemTemplate", "value" : mainItemTemplate});
}
orderItemsParams.push( { "field" : "listing", "value" : listing});
orderItemsParams.push( { "field" : "listingWithModules", "value" : me.getBoOrderMeta().getListingWithModules()});
orderItemsParams.push( { "field" : "commitDate", "value" : commitDate});
orderItemsParams.push( { "field" : "customerPKey", "value" : customerPKey});
orderItemsParams.push( { "field" : "allowForeignProducts", "value" : allowForeignProducts});
orderItemsParams.push( { "field" : "considerFieldState", "value" : considerFieldState});
orderItemsParams.push( { "field" : "useSalesDocAssortment", "value" : useSalesDocAssortment});
orderItemsParams.push( { "field" : "filterBySdoAssortment", "value" : filterBySdoAssortment});
orderItemsParams.push( { "field" : "considerNewProducts", "value" : considerNewProducts});
orderItemsParams.push( { "field" : "phase", "value" : phase});
orderItemsParams.push( { "field" : "syncStatus", "value" : syncStatus});
orderItemsParams.push( { "field" : "clbMainPKey", "value" : clbMainPKey});
orderItemsParams.push( { "field" : "considerOutOfStock", "value" : considerOutOfStock});
orderItemsParams.push( { "field" : "addHistoryItem", "value" : addHistoryItem});
orderItemsParams.push( { "field" : "sdoMetaPKey", "value" : sdoMetaPKey});
orderItemsParams.push( { "field" : "considerMaxHistoryDays", "value" : considerMaxHistoryDays});
orderItemsParams.push( { "field" : "considerInventory", "value" : me.getBoOrderMeta().getConsiderInventory()});
orderItemsParams.push( { "field" : "filterByCurrentInventory", "value" : me.getBoOrderMeta().getFilterByCurrentInventory()});
orderItemsParams.push( { "field" : "hitClosedListing", "value": me.getLuOrderer().getHitClosedListing()});
orderItemsParams.push( { "field" : "collectClosedListing", "value": me.getLuOrderer().getCollectClosedListing()});
orderItemsParams.push( { "field" : "considerSelectablePromotion", "value": me.getBoOrderMeta().getConsiderSelectablePromotion()});
orderItemsParams.push( { "field" : "specialOrderHandling", "value": me.getBoOrderMeta().getSpecialOrderHandling()});

if (me.getBoOrderMeta().getItemListOption() == "Hierarchy") {
  orderItemsParams.push( { "field" : "criterionFilterAttribute", "value" : criterionFilterAttribute});
}
else {
  orderItemsParams.push({ "field": "flatItemListGroupingAttribute", "value": flatItemListGroupingAttribute});
}

orderItemsParams.push( { "field" : "itemListOption", "value" : itemListOption});
orderItemsParams.push( { "field" : "mobilityRelevant", "value" : me.getBoOrderMeta().getMobilityRelevant()});
orderItemsParams.push( { "field" : "sdoSubType", "value" : me.getBoOrderMeta().getSdoSubType()});

if (clbMainPKey == me.getCallInContext_clbMainPKey()) {
  orderItemsParams.push({ "field": "callOutOfStockProducts", "value": me.getCallOutOfStockProducts()});
}

//Adding to get inventory items
if((me.getBoOrderMeta().getConsiderInventory() == "1") || (me.getBoOrderMeta().getFilterByCurrentInventory() == "1")) {
  if (me.getBoOrderMeta().getDisposalListProposal() === "Proposal" &&  ApplicationContext.get('currentTourStatus') === "Running") {

    //#########################
    //### Inventory Finding ###
    //#########################

    //Inventory Finding
    var params = {"prdPolicy" : "One"};
    var ivcMetasByItemMeta = me.getBoOrderMeta().getLoInventoryMetaByItemMeta().getItemsByParam(params);

    var ivcMetaPKeys = [];
    var bpaMainPKeys = [];
    var tmgTourPKeys = [];
    var vehiclePKeys = [];
    var usrMainPKeys = [];

    for (var mainIndex = 0; mainIndex < ivcMetasByItemMeta.length; mainIndex++) {
      ivcMetaPKeys.push(ivcMetasByItemMeta[mainIndex].getIvcMetaPKey());

      if (ivcMetasByItemMeta[mainIndex].getBpaPolicy() === "One") {
        bpaMainPKeys.push(ivcMetasByItemMeta[mainIndex].getBpaMainPKey());
      }
      bpaMainPKeys.push(" ");

      if (ivcMetasByItemMeta[mainIndex].getUsrPolicy() === "One") {
        usrMainPKeys.push(ApplicationContext.get('user').getPKey());
      }
      usrMainPKeys.push(" ");

      if (ivcMetasByItemMeta[mainIndex].getTmgPolicy() === "One") {
        tmgTourPKeys.push(ApplicationContext.get('currentTourPKey'));
      }
      tmgTourPKeys.push(" ");
      
      if (Utils.isDefined(ApplicationContext.get('currentTour'))) {
        if (ivcMetasByItemMeta[mainIndex].getVehiclePolicy() === "One") {
          vehiclePKeys.push(ApplicationContext.get('currentTour').getEtpVehicleTruckPKey());
        }
      }
      vehiclePKeys.push(" ");
    }

    orderItemsParams.push(
      {
        "field" : "ivcMetaPKeys",
        "value" : "'" + ivcMetaPKeys.join("','") + "'"
      }
    );
    orderItemsParams.push(
      {
        "field" : "usrMainPKeys",
        "value" : "'" + usrMainPKeys.join("','") + "'"
      }
    );
    orderItemsParams.push(
      {
        "field" : "bpaMainPKeys",
        "value" : "'" + bpaMainPKeys.join("','") + "'"
      }
    );
    orderItemsParams.push(
      {
        "field" : "tmgTourPKeys",
        "value" : "'" + tmgTourPKeys.join("','") + "'"
      }
    );
    orderItemsParams.push(
      {
        "field" : "etpVehiclePKeys",
        "value" : "'" + vehiclePKeys.join("','") + "'"
      }
    );
  }
}

if(!orderItemsQuery.useMergeEngine) {
  if (itemListOption == "Hierarchy") {
    criterionAttribute = criterionFilterAttribute;
    orderItemsParams.push({ "field": "criterionAttribute", "value": criterionFilterAttribute });
  }
  else {
    criterionAttribute = flatItemListGroupingAttribute;
    orderItemsParams.push({ "field": "criterionAttribute", "value": flatItemListGroupingAttribute });
  }
  if (Utils.isSfBackend()) {
    addCond_ProductState = " Product2.State__c='4' ";
    orderItemsParams.push({ "field": "addCond_ProductState", "value": addCond_ProductState });
    if ((typeof allowForeignProducts != "undefined") && (allowForeignProducts != 1)) {
      addCond_ForeignProduct = " AND Product2.Competitive_Product__c = '0' ";
      orderItemsParams.push({ "field": "addCond_ForeignProduct", "value": addCond_ForeignProduct });
    }
    if ((typeof considerFieldState != "undefined") && (considerFieldState == 1)) {
      addCond_FieldState = " AND (#compareAsDate('Product2.Field_Valid_From__c ', 'Date','<=',#TodayAsDate#, 'Date')#  AND #compareAsDate('Product2.Field_Valid_Thru__c', 'Date','>=',#TodayAsDate#, 'Date')#) ";
      orderItemsParams.push({ "field": "addCond_FieldState", "value": addCond_FieldState });
    }
    if ((typeof considerNewProducts != "undefined") && (considerNewProducts === 0)) {
      addCond_NewState = " AND (#compareAsDate('Product2.New_Item_Valid_From__c ', 'Date','<=',#TodayAsDate#, 'Date')#  AND #compareAsDate('Product2.New_Item_Valid_Thru__c', 'Date','>=',#TodayAsDate#, 'Date')# ) ";
      orderItemsParams.push({ "field": "addCond_NewState", "value": addCond_NewState });
    }
  }
  else {
    if ((typeof allowForeignProducts != "undefined") && (allowForeignProducts != 1)) {
      orderItemsParams.push({ "field": "addCond_ForeignProduct", "value": " AND PrdProduct.ForeignProduct = '0' " });
    }
    if ((typeof considerFieldState != "undefined") && (considerFieldState == 1)) {
      orderItemsParams.push({ "field": "addCond_FieldState", "value": " AND PrdStateAbstract.FieldState = 'Available' " });
    }
    if ((typeof considerNewProducts != "undefined") && (considerNewProducts === 0)) {
      orderItemsParams.push({ "field": "addCond_NewState", "value": " AND PrdStateAbstract.NewState = 'NotAvailable' " });
    }
  }
  orderItemsParams.push({ "field": "dateFrom", "value": dateFrom });

  var quantityLogisticUnit = mainItemTemplate.getQuantityLogisticUnit();
  var defaultQuantityLogisticUnit;
  var defaultPiecesPerSmallestUnit;

  if (quantityLogisticUnit == "Order") {
    defaultQuantityLogisticUnit = "product.orderQuantityLogisticUnit";
    defaultPiecesPerSmallestUnit = "product.orderPiecesPerSmallestUnit";
  }
  else if (quantityLogisticUnit == "Consumer") {
    defaultQuantityLogisticUnit = "product.consumerQuantityLogisticUnit";
    defaultPiecesPerSmallestUnit = "product.consumerPiecesPerSmallestUnit";
  }
  else if (quantityLogisticUnit == "Price") {
    defaultQuantityLogisticUnit = "product.priceQuantityLogisticUnit";
    defaultPiecesPerSmallestUnit = "product.pricePiecesPerSmallestUnit";
  }
  else {
    defaultQuantityLogisticUnit = "product.orderQuantityLogisticUnit";
    defaultPiecesPerSmallestUnit = "product.orderPiecesPerSmallestUnit";
  }

  // create jsonQueries
  var jsonQueryProduct = {};
  jsonQueryProduct.params = [];
  jsonQueryProduct.params.push({"field" : "commitDate", "value" : commitDate});
  jsonQueryProduct.params.push({"field" : "criterionAttribute", "value" : criterionAttribute});
  jsonQueryProduct.params.push({"field" : "addCond_ProductState", "value" : addCond_ProductState});
  jsonQueryProduct.params.push({"field" : "addCond_FieldState", "value" : addCond_FieldState});
  jsonQueryProduct.params.push({"field" : "addCond_NewState", "value" : addCond_NewState});
  jsonQueryProduct.params.push({"field" : "addCond_ForeignProduct", "value" : addCond_ForeignProduct});

  var jsonQueryListing = {};
  jsonQueryListing.params = [];
  jsonQueryListing.params.push({"field" : "customerPKey", "value" : customerPKey});

  var jsonQueryListingWithoutModules = {};
  jsonQueryListingWithoutModules.params = [];
  jsonQueryListingWithoutModules.params.push({"field" : "customerPKey", "value" : customerPKey});

  var jsonQuerySda = {};
  jsonQuerySda.params = [];
  jsonQuerySda.params.push({"field" : "sdoMetaPKey", "value" : sdoMetaPKey});
  jsonQuerySda.params.push({"field" : "commitDate", "value" : commitDate});

  var jsonQueryPromotion = {};
  jsonQueryPromotion.params = [];
  jsonQueryPromotion.params.push({"field" : "customerPKey", "value" : customerPKey});

  var jsonQueryHistoric = {};
  jsonQueryHistoric.params = [];
  jsonQueryHistoric.params.push({"field" : "ordererPKey", "value" : customerPKey});
  jsonQueryHistoric.params.push({"field" : "dateFrom", "value" : dateFrom});
  jsonQueryHistoric.params.push({"field" : "sdoMetaPKey", "value" : sdoMetaPKey});

  var jsonQueryOos = {};
  jsonQueryOos.params = [];
  jsonQueryOos.params.push({"field" : "clbMainPKey", "value" : clbMainPKey});

  // create sql statements
  var queryParams = [];
  var loadProductQuery = Facade.myProxy.getLoadStatement("LoMeProductInformation", jsonQueryProduct);
  var productSqlQuery = "SELECT * FROM (" + loadProductQuery.sql + ") ";
  

  var listingSqlQuery = Facade.myProxy.getLoadStatement("LoMeAuthorizationList", jsonQueryListing);

  var listingWithoutModulesSqlQuery = Facade.myProxy.getLoadStatement("LoMeAuthorizationListWithoutModules", jsonQueryListingWithoutModules);

  var sdaSqlQuery = Facade.myProxy.getLoadStatement("LoMeSdoAssortment", jsonQuerySda);

  var promotionSqlQuery = Facade.myProxy.getLoadStatement("LoMePromotion", jsonQueryPromotion);

  var historicSqlQuery = Facade.myProxy.getLoadStatement("LoMeHistoricProducts", jsonQueryHistoric);

  var oosSqlQuery = Facade.myProxy.getLoadStatement("LoMeOutOfStock", jsonQueryOos);

  var query = "( " + productSqlQuery + ") AS product ";
  queryParams = queryParams.concat(loadProductQuery.params);
  if (considerListing == 1) {
    if (listing == "Hit") {
      query += "LEFT OUTER JOIN (" + listingWithoutModulesSqlQuery.sql + ") AS listing ON listing.prdMainPKey = product.pKey ";
      queryParams = queryParams.concat(listingWithoutModulesSqlQuery.params);
    }
    else {
      query += "LEFT OUTER JOIN (" + listingSqlQuery.sql + ") AS listing ON listing.prdMainPKey = product.pKey ";
      queryParams = queryParams.concat(listingSqlQuery.params);
    }
  }
  else {
    query += "LEFT OUTER JOIN (" + listingSqlQuery.sql + ") AS listing ON 1=0 ";
    queryParams = queryParams.concat(listingSqlQuery.params);
  }
  if (useSalesDocAssortment == 1 || filterBySdoAssortment == 1) {
    query += "LEFT OUTER JOIN (" + sdaSqlQuery.sql + ") AS sda ON sda.prdMainPKey = product.pKey ";
    queryParams = queryParams.concat(sdaSqlQuery.params);
  }
  else {
    query += "LEFT OUTER JOIN (" + sdaSqlQuery.sql + ") AS sda ON 1=0 ";
    queryParams = queryParams.concat(sdaSqlQuery.params);
  }
  if (considerPromotion == 1) {
    query += "LEFT OUTER JOIN (" + promotionSqlQuery.sql + ") AS promotion ON promotion.prdMainPKey = product.pKey ";
    queryParams = queryParams.concat(promotionSqlQuery.params);
  }
  else {
    query += "LEFT OUTER JOIN (" + promotionSqlQuery.sql + ") AS promotion ON 1=0 ";
    queryParams = queryParams.concat(promotionSqlQuery.params);
  }
  if (addHistoryItem == 1) {
    query += "LEFT OUTER JOIN (" + historicSqlQuery.sql + ") AS historic ON historic.prdMainPKey = product.pKey ";
    queryParams = queryParams.concat(historicSqlQuery.params);
  }
  else {
    query += "LEFT OUTER JOIN (" + historicSqlQuery.sql + ") AS historic ON 1=0 ";
    queryParams = queryParams.concat(historicSqlQuery.params);
  }
  if (considerOutOfStock != "No") {
    if (Utils.isDefined(clbMainPKey) && !(Utils.isEmptyString(clbMainPKey))) {
      query += "LEFT OUTER JOIN (" + oosSqlQuery.sql + ") AS oos ON oos.prdMainPKey = product.pKey ";
      queryParams = queryParams.concat(oosSqlQuery.params);
    }
    else {
      query += "LEFT OUTER JOIN (" + oosSqlQuery.sql + ") AS oos ON 1=0 ";
      queryParams = queryParams.concat(oosSqlQuery.params);
    }
  }
  else {
    query += "LEFT OUTER JOIN (" + oosSqlQuery.sql + ") AS oos ON 1=0 ";
    queryParams = queryParams.concat(oosSqlQuery.params);
  }

  orderItemsParams.push({ "field": "query", "value": query });
  orderItemsParams.push({ "field": "queryParams", "value": queryParams });
}

orderItemsQuery.params = orderItemsParams;

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return orderItemsQuery;
}