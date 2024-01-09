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
 * @function addCheckInItem
 * @this LoTruckLoadItems
 * @kind listobject
 * @async
 * @namespace CORE
 * @param {DomPKey} checkInDocumentPKey
 * @param {LiInventoryMetaByItemMeta} inventoryMeta
 * @param {LiInventoryFinding} inventoryItem
 * @param {LiOrderItemMeta} itemTemplate
 * @param {String} mode
 * @returns promise
 */
function addCheckInItem(checkInDocumentPKey, inventoryMeta, inventoryItem, itemTemplate, mode){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
// - Creates new truck load item
// - Return: New truck load item

var truckLoadItem = {
  pKey: PKey.next(),
  sdoMainPKey: checkInDocumentPKey,
  text1: " ",
  prdId: " ",
  sdoParentItemPKey: " ",
  quantityLogisticUnit: " ",
  quantity: 0,
  targetQuantity: 0,
  suggestedQuantity: 0,
  piecesPerSmallestUnit: 0,
  basePrice: 0,
  basePriceReceipt: 0,
  price: 0,
  priceReceipt: 0,
  specialPrice: 0,
  specialPriceReceipt: 0,
  valueReceipt: 0,
  grossValue: 0,
  grossValueReceipt: 0,
  promoted: "0",
  listed: "0",
  history: "0",
  outOfStock: "0",
  discount: "0",
  erpId: " ",
  freeItemCreationStep: " ",
  modReason: " ",
  priceEffect: itemTemplate.getPriceEffect(),
  calculationGroup: itemTemplate.getCalculationGroup(),
  saveZeroQuantity: itemTemplate.getSaveZeroQuantity(),
  shortText: itemTemplate.getShortText(),
  metaId: " ",
  freeItemBalance: 0,
};

// this section will not be executed for "rest" items (if balance/ivc quantity to order unit qty conversion delivers a rest)
if (Utils.isDefined(inventoryMeta) && Utils.isDefined(inventoryItem)) {
  truckLoadItem.sdoItemMetaPKey = inventoryMeta.getSdoItemMetaPKey();
  truckLoadItem.prdMainPKey = inventoryItem.getPrdMainPKey();
  truckLoadItem.metaId = inventoryMeta.getMetaId();
  var ivcInformation = {};

  ivcInformation.ivcMeasure = inventoryMeta.getIvcMeasure();
  ivcInformation.ivcMainPKey = inventoryItem.getIvcMainPKey();
  ivcInformation.balance = inventoryItem.getBalance();
  truckLoadItem.refPKey = truckLoadItem.sdoMainPKey + truckLoadItem.prdMainPKey + truckLoadItem.sdoItemMetaPKey;
  ivcInformation.restItem = false;

  truckLoadItem.ivcInformationObject = ivcInformation;
}

var jsonParams = [];
var jsonQuery = {};
var prdMainPKey = truckLoadItem.prdMainPKey;

jsonQuery.addCond = "AND CndMain.ValidFrom <= #commitDate# AND CndMain.ValidThru >= #commitDate#";
jsonParams.push({ field: "itemTemplate", value: itemTemplate });
jsonParams.push({ field: "prdMainPKey", value: prdMainPKey });
jsonParams.push({ field: "commitDate", value: Utils.createAnsiDateTimeNow() });
jsonQuery.params = jsonParams;

var promise = BoFactory.loadObjectByParamsAsync("LuProductUom", jsonQuery).then(
  function (lookupData) {
    // Instantiate lookup from lookup data
    var productInformationLookup = BoFactory.instantiate("LuProductUom", lookupData);
    var uoM = truckLoadItem.quantityLogisticUnit;

    if (!Utils.isDefined(uoM) || Utils.isEmptyString(uoM)) {
      // Set unit information depending on default unit
      if (itemTemplate.getQuantityLogisticUnit() == "OrderUnit") {
        uoM = productInformationLookup.getOrderQuantityLogisticUnit();
      } else if (itemTemplate.getQuantityLogisticUnit() == "ConsumerUnit") {
        uoM = productInformationLookup.getConsumerQuantityLogisticUnit();
      } else if (itemTemplate.getQuantityLogisticUnit() == "PriceUnit") {
        uoM = productInformationLookup.getPriceQuantityLogisticUnit();
      } else {
        uoM = productInformationLookup.getOrderQuantityLogisticUnit();
      }
    }

    truckLoadItem.quantityLogisticUnit = uoM;
    truckLoadItem.piecesPerSmallestUnit = productInformationLookup.getPiecesPerSmallestUnit();
    if (uoM === productInformationLookup.getOrderQuantityLogisticUnit()) {
      truckLoadItem.isOrderUnit = "1";
    }

    //load free items(Total number of items to be delivered) to review current stock and add the balance
    if (mode == "ReviewStock") {
      var jsonParams = [];
      var jsonQuery = {};
      var tmgTourPKey = ApplicationContext.get("currentTourPKey");
      var prdMainPKey = truckLoadItem.prdMainPKey;
      var freeItemBalance = 0;

      jsonParams.push({ field: "tmgTourPKey", value: tmgTourPKey });
      jsonParams.push({ field: "prdMainPKey", value: prdMainPKey });
      jsonQuery.params = jsonParams;

      return BoFactory.loadObjectByParamsAsync("LoQuantityForFreeItems", jsonQuery).then(
        function (loQuantityForFreeItems) {
          if (Utils.isDefined(loQuantityForFreeItems)) {
            var freeItems = loQuantityForFreeItems.getAllItems();
            for (var mainIndex = 0; mainIndex < freeItems.length; mainIndex++) {
              freeItemBalance = freeItems[mainIndex].quantitySumPerProduct;
            }
          }

          truckLoadItem.freeItemBalance = freeItemBalance;
          truckLoadItem.selectPKey = truckLoadItem.pKey;
          me.addObjectItems([truckLoadItem]);

          return me.addMissingUoMsToItem(truckLoadItem, itemTemplate, mode).then(
            function () {
              return truckLoadItem;
            });
        });
    } else {
      truckLoadItem.selectPKey = truckLoadItem.pKey;
      me.addObjectItems([truckLoadItem]);

      return me.addMissingUoMsToItem(truckLoadItem, itemTemplate, mode).then(
        function () {
          return truckLoadItem;
        });
    }
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}