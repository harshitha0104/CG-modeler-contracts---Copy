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
 * @function getDSForSelectablePromotions
 * @this LoOrderItems
 * @kind listobject
 * @namespace CORE
 * @param {Object} jsonParams
 * @param {Object} commitDate
 * @returns datasourceDefiniton
 */
function getDSForSelectablePromotions(jsonParams, commitDate){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var datasourceDefiniton = {
  "boName" : "LoMeSelectablePromotions",
  "dsParams" : {
    "params" : [{
      "field" : "customerPKey",
      "value" : jsonParams.customerPKey
    }, {
      "field" : "commitDate",
      "value" : commitDate
    }, {
      "field" : "sdoMainPKey",
      "value" : jsonParams.sdoMainPKey
    }, {
      "field" : "considerSelectablePromotion",
      "value" : jsonParams.considerSelectablePromotion
    }, {
      "field" : "specialOrderHandling",
      "value" : jsonParams.specialOrderHandling
    }, {
      "field" : "mainItemTemplate",
      "value" : jsonParams.mainItemTemplate.getPKey()
    }, {
      "field" : "useMergeEngine",
      "value" : jsonParams.useMergeEngine
    }]
  },
  "matchingColumn" : "prdMainPKey",
  "dataSourceColumns" : [{
    "name" : "promoted",
    "alias" : "promoted",
    "default" : "0"
  },{
    "name" : "pKey",
    "alias" : "pKey",
    "default" : " "
  }, {
    "name" : "sdoMainPKey",
    "alias" : "sdoMainPKey",
    "default" : jsonParams.sdoMainPKey
  }, {
    "name" : "sdoItemMetaPKey",
    "alias" : "sdoItemMetaPKey",
    "default" : jsonParams.mainItemTemplate.getPKey()          
  }, {
    "name" : "sdoParentItemPKey",
    "alias" : "sdoParentItemPKey",
    "default" : " "
  }, {
    "name" : "quantity",
    "alias" : "quantity",
    "default" : 0
  }, {
    "name" : "discount",
    "alias" : "discount",
    "default" : 0
  }, {
    "name" : "quantityLogisticUnit",
    "alias" : "quantityLogisticUnit",
    "default" : "copy#defaultQuantityLogisticUnit"
  }, {
    "name" : "type",
    "alias" : "type",
    "default" : jsonParams.mainItemTemplate.getText()
  }, {
    "name" : "erpId",
    "alias" : "erpId",
    "default" : " "
  }, {
    "name" : "shortType",
    "alias" : "shortType",
    "default" : jsonParams.mainItemTemplate.getShortText()
  }, {
    "name" : "priceEffect",
    "alias" : "priceEffect",
    "default" : jsonParams.mainItemTemplate.getPriceEffect()
  }, {
    "name" : "price",
    "alias" : "price",
    "default" : 0
  }, {
    "name" : "priceReceipt",
    "alias" : "priceReceipt",
    "default" : 0
  }, {
    "name" : "value",
    "alias" : "value",
    "default" : 0
  }, {
    "name" : "valueReceipt",
    "alias" : "valueReceipt",
    "default" : 0
  }, {
    "name" : "basePrice",
    "alias" : "basePrice",
    "default" : 0
  }, {
    "name" : "basePriceReceipt",
    "alias" : "basePriceReceipt",
    "default" : 0
  }, {
    "name" : "grossValue",
    "alias" : "grossValue",
    "default" : 0
  }, {
    "name" : "grossValueReceipt",
    "alias" : "grossValueReceipt",
    "default" : 0
  }, {
    "name" : "specialPrice",
    "alias" : "specialPrice",
    "default" : 0
  }, {
    "name" : "specialPriceReceipt",
    "alias" : "specialPriceReceipt",
    "default" : 0
  }, {
    "name" : "piecesPerSmallestUnit",
    "alias" : "piecesPerSmallestUnit",
    "default" : "copy#defaultPiecesPerSmallestUnit"
  }, {
    "name" : "saveZeroQuantity",
    "alias" : "saveZeroQuantity",
    "default" : jsonParams.mainItemTemplate.getSaveZeroQuantity()
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
    "default" : jsonParams.mainItemTemplate.getCalculationGroup()
  }, {
    "name" : "movementDirection",
    "alias" : "movementDirection",
    "default" : jsonParams.mainItemTemplate.getMovementDirection()          
  }, {
    "name" : "promotionPKey",
    "alias" : "promotionPKey",
    "default" : " "
  }, {
    "name" : "productClassifications",
    "alias" : "productClassifications",
    "default" : " "
  }, {
    "name" : "specialPromoted",
    "alias" : "specialPromoted",
    "default" : "0"
  }, {
    "name" : "specialQuantity",
    "alias" : "specialQuantity",
    "default" : 0
  }, {
    "name" : "rewardPKey",
    "alias" : "rewardPKey",
    "default" : " "
  }, {
    "name" : "groupName",
    "alias" : "groupName",
    "default" : " "
  }, {
    "name" : "groupSort",
    "alias" : "groupSort",
    "default" : " "
  }, {
    "name" : "groupIdSort",
    "alias" : "groupIdSort",
    "default" : " "
  }, {
    "name" : "prdMainPKey",
    "alias" : "prdMainPKey",
    "default" : " "    
  }, {
    "name" : "pricingInfo1",
    "alias" : "pricingInfo1",
    "default" : 0
  }, {
    "name" : "pricingInfo2",
    "alias" : "pricingInfo2",
    "default" : 0
  }, {
    "name" : "pricingInfo3",
    "alias" : "pricingInfo3",
    "default" : 0
  }, {
    "name" : "pricingInfo4",
    "alias" : "pricingInfo4",
    "default" : 0
  }, {
    "name" : "pricingInfo5",
    "alias" : "pricingInfo5",
    "default" : 0
  }, {
    "name" : "pricingInfo6",
    "alias" : "pricingInfo6",
    "default" : 0
   }, {
    "name" : "pricingInfo7",
    "alias" : "pricingInfo7",
    "default" : 0
  }, {
    "name" : "pricingInfo8",
    "alias" : "pricingInfo8",
    "default" : 0
   }, {
    "name" : "pricingInfo9",
    "alias" : "pricingInfo9",
    "default" : 0
  }, {
    "name" : "pricingInfo10",
    "alias" : "pricingInfo10",
    "default" : 0
  }, {
    "name" : "promotedPrice",
    "alias" : "promotedPrice",
    "default" : 0
  }, {
    "name" : "tacticProductPKey",
    "alias" : "tacticProductPKey",
    "default" : " "
  }, {
    "name" : "text1",
    "alias" : "text1",
    "default" : " "
  }, {
    "name" : "defaultValue",
    "alias" : "defaultValue",
    "default" : 0
  }, {
    "name" : "maxValue",
    "alias" : "maxValue",
    "default" : 0
  }],

  "mergeProperty" : "FILTER",
  "lookupDataSource" : "false",
  "persistedItems" : "true"
};


// Select listed, promoted, history, out of stock information from persisted items if order is released
if ((jsonParams.phase == BLConstants.Order.PHASE_RELEASED) || (jsonParams.phase == BLConstants.Order.PHASE_CANCELED) || (jsonParams.phase == BLConstants.Order.PHASE_READY) || (jsonParams.syncStatus === BLConstants.Order.NOT_SYNCABLE)) {
  datasourceDefiniton.dataSourceColumns.push({
    "name" : "listed",
    "alias" : "listed"
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
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return datasourceDefiniton;
}