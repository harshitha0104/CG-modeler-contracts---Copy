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
 * @function getDSForOrderItems
 * @this LoOrderItems
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {DomString} mergeProperty
 * @param {DomPKey} sdoMainPKey
 * @param {DomSdoPhase} phase
 * @param {LiOrderItemMeta} mainItemTemplate
 * @param {DomInteger} syncStatus
 * @returns datasourceDefiniton
 */
function getDSForOrderItems(mergeProperty, sdoMainPKey, phase, mainItemTemplate, syncStatus){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
// Datasource name (required by merge engine)
var LO_MEORDERITEMS = "LoMeOrderItems";

var datasourceDefiniton = {
  "boName" : LO_MEORDERITEMS,
  "dsParams" : {
    "params" : [{
      "field" : "sdoMainPKey",
      "value" : sdoMainPKey
    },{
      "field" : "addCond",
      "value" : " AND Order_Item__c.Promotion__c = ' '"
    }]
  },
  "matchingColumn" : "prdMainPKey",
  "dataSourceColumns" : [{
    "name" : "pKey",
    "alias" : "pKey",
    "default" : " "
  }, {
    "name" : "sdoMainPKey",
    "alias" : "sdoMainPKey",
    "default" : sdoMainPKey
  }, {
    "name" : "sdoItemMetaPKey",
    "alias" : "sdoItemMetaPKey",
    "default" : mainItemTemplate.getPKey()          
  }, {
    "name" : "sdoParentItemPKey",
    "alias" : "sdoParentItemPKey",
    "default" : " "
  }, {
    "name" : "quantity",
    "alias" : "quantity",
    "default" : "0"
  }, {
    "name" : "discount",
    "alias" : "discount",
    "default" : "0"
  }, {
    "name" : "quantityLogisticUnit",
    "alias" : "quantityLogisticUnit",
    "default" : "copy#defaultQuantityLogisticUnit"
  }, {
    "name" : "type",
    "alias" : "type",
    "default" : mainItemTemplate.getText()
  }, {
    "name" : "erpId",
    "alias" : "erpId",
    "default" : " "
  }, {
    "name" : "shortType",
    "alias" : "shortType",
    "default" : mainItemTemplate.getShortText()
  }, {
    "name" : "priceEffect",
    "alias" : "priceEffect",
    "default" : mainItemTemplate.getPriceEffect()
  }, {
    "name" : "price",
    "alias" : "price",
    "default" : "0"
  }, {
    "name" : "priceReceipt",
    "alias" : "priceReceipt",
    "default" : "0"
  }, {
    "name" : "value",
    "alias" : "value",
    "default" : "0"
  }, {
    "name" : "valueReceipt",
    "alias" : "valueReceipt",
    "default" : "0"
  }, {
    "name" : "basePrice",
    "alias" : "basePrice",
    "default" : "0"
  }, {
    "name" : "basePriceReceipt",
    "alias" : "basePriceReceipt",
    "default" : "0"
  }, {
    "name" : "grossValue",
    "alias" : "grossValue",
    "default" : "0"
  }, {
    "name" : "grossValueReceipt",
    "alias" : "grossValueReceipt",
    "default" : "0"
  }, {
    "name" : "specialPrice",
    "alias" : "specialPrice",
    "default" : "0"
  }, {
    "name" : "specialPriceReceipt",
    "alias" : "specialPriceReceipt",
    "default" : "0"
  }, {
    "name" : "piecesPerSmallestUnit",
    "alias" : "piecesPerSmallestUnit",
    "default" : "copy#defaultPiecesPerSmallestUnit"
  }, {
    "name" : "saveZeroQuantity",
    "alias" : "saveZeroQuantity",
    "default" : mainItemTemplate.getSaveZeroQuantity()
  }, {
    "name" : "suggestedQuantity",
    "alias" : "suggestedQuantity",
    "default" : 0
  }, {
    "name" : "freeItemCreationStep",
    "alias" : "freeItemCreationStep",
    "default" : " "
  }, {
    "name" : "calculationGroup",
    "alias" : "calculationGroup",
    "default" : mainItemTemplate.getCalculationGroup()
  }, {
    "name" : "movementDirection",
    "alias" : "movementDirection",
    "default" : mainItemTemplate.getMovementDirection()          
  }, {
    "name" : "targetQuantity",
    "alias" : "targetQuantity",
    "default" : "0"
  }, {
    "name" : "modReason",
    "alias" : "modReason",
    "default": " "
  }, {
    "name" : "isPersistedItem",
    "alias" : "isPersistedItem",
    "default" : "0"
  }, {
    "name" : "allowCriticalStock",
    "alias" : "allowCriticalStock",
    "default" : "0"
  }, {
    "name" : "splittingGroup",
    "alias" : "splittingGroup",
    "default" : " "
  }, {
    "name" : "prdMainPKey",
    "alias" : "prdMainPKey",
    "default" : " "    
  }],
  "mergeProperty" : mergeProperty,
  "lookupDataSource" : "false",
  "persistedItems" : "true"
};

// Select listed, promoted, history, out of stock information from persisted items if order is released
if ((phase == BLConstants.Order.PHASE_RELEASED) || (phase == BLConstants.Order.PHASE_CANCELED) || (phase == BLConstants.Order.PHASE_READY) || (syncStatus === BLConstants.Order.NOT_SYNCABLE)) {
  datasourceDefiniton.dataSourceColumns.push({
    "name" : "listed",
    "alias" : "listed"
  });
  datasourceDefiniton.dataSourceColumns.push({
    "name" : "promoted",
    "alias" : "promoted"
  });
  datasourceDefiniton.dataSourceColumns.push({
    "name" : "history",
    "alias" : "history"
  });
  datasourceDefiniton.dataSourceColumns.push({
    "name" : "outOfStock",
    "alias" : "outOfStock"
  });
}

if (Utils.isSfBackend()) {
  datasourceDefiniton.dataSourceColumns.push({
    "name" : "refPKey",
    "alias" : "refPKey"
  });
  datasourceDefiniton.dataSourceColumns.push({
    "name" : "sort",
    "alias" : "sort"
  });
  datasourceDefiniton.dataSourceColumns.push({
    "name" : "isOrderUnit",
    "alias" : "isOrderUnit"
  });
  datasourceDefiniton.dataSourceColumns.push({
    "name" : "pricingInformation",
    "alias" : "pricingInformation"
  });
  datasourceDefiniton.dataSourceColumns.push({
    "name" : "parentType",
    "alias" : "parentType",
    "default" : " "
  });
  datasourceDefiniton.dataSourceColumns.push({
    "name" : "promotionPKey",
    "alias" : "promotionPKey",
    "default" : " "
  });
  datasourceDefiniton.dataSourceColumns.push({
    "name" : "rewardPKey",
    "alias" : "rewardPKey",
    "default" : " "
  });
  datasourceDefiniton.dataSourceColumns.push({
    "name" : "pricingInfo1",
    "alias" : "pricingInfo1",
    "default" : 0
  });
  datasourceDefiniton.dataSourceColumns.push({
    "name" : "pricingInfo2",
    "alias" : "pricingInfo2",
    "default" : 0
  });
  datasourceDefiniton.dataSourceColumns.push({
    "name" : "pricingInfo3",
    "alias" : "pricingInfo3",
    "default" : 0
  });
  datasourceDefiniton.dataSourceColumns.push({
    "name" : "pricingInfo4",
    "alias" : "pricingInfo4",
    "default" : 0
  });
  datasourceDefiniton.dataSourceColumns.push({
    "name" : "pricingInfo5",
    "alias" : "pricingInfo5",
    "default" : 0
  });
  datasourceDefiniton.dataSourceColumns.push({
    "name" : "pricingInfo6",
    "alias" : "pricingInfo6",
    "default" : 0
  });
  datasourceDefiniton.dataSourceColumns.push({
    "name" : "pricingInfo7",
    "alias" : "pricingInfo7",
    "default" : 0
  });
  datasourceDefiniton.dataSourceColumns.push({
    "name" : "pricingInfo8",
    "alias" : "pricingInfo8",
    "default" : 0
  });
  datasourceDefiniton.dataSourceColumns.push({
    "name" : "pricingInfo9",
    "alias" : "pricingInfo9",
    "default" : 0
  });
  datasourceDefiniton.dataSourceColumns.push({
    "name" : "pricingInfo10",
    "alias" : "pricingInfo10",
    "default" : 0
  });
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return datasourceDefiniton;
}