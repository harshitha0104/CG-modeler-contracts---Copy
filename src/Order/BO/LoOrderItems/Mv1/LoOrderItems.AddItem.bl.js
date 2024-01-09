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
 * @function addItem
 * @this LoOrderItems
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {LoProductForAdd} ProductsForAdd
 * @param {DomPKey} ProductPKey
 * @param {DomPKey} SdoMainPKey
 * @param {DomPKey} CustomerPKey
 * @param {DomDate} CommitDate
 * @param {LiOrderItemMeta} itemTemplate
 * @param {DomPKey} clbMainPKey
 * @param {String} criterionAttribute
 * @param {DomSdoBarcodeScanBehavior} barcodeScanBehavior
 * @param {DomInteger} scanIncrementQuantity
 * @param {String} mode
 * @returns promise
 */
function addItem(ProductsForAdd, ProductPKey, SdoMainPKey, CustomerPKey, CommitDate, itemTemplate, clbMainPKey, criterionAttribute, barcodeScanBehavior, scanIncrementQuantity, mode){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var existingItems = this.getItemsByParam({ "prdMainPKey": ProductPKey, "sdoItemMetaPKey": itemTemplate.getPKey() });
var filterCountIncrements = [];
var promise;

//Check if there exists an item with the same ProductPKey
if (existingItems.length == 0) {

  var listedPromotedLookup = undefined;
  var productInformationLookup = undefined;

  var jsonParams_Lookup_listedPromoted = [];
  var jsonQuery_listedPromoted = {};

  jsonParams_Lookup_listedPromoted.push({ "field": "customerPKey", "value": CustomerPKey });
  jsonParams_Lookup_listedPromoted.push({ "field": "commitDate", "value": CommitDate });
  jsonParams_Lookup_listedPromoted.push({ "field": "clbMainPKey", "value": clbMainPKey });
  jsonParams_Lookup_listedPromoted.push({ "field": "prdMainPKey", "value": ProductPKey });

  jsonQuery_listedPromoted.params = jsonParams_Lookup_listedPromoted;

  promise = Facade.getObjectAsync("LuProductIsListedPromotedOutOfStock", jsonQuery_listedPromoted)
  .then(function (lookupData) {
    listedPromotedLookup = BoFactory.instantiate("LuProductIsListedPromotedOutOfStock", lookupData);

    // Get additonal product information like base price and unit information

    var jsonParams_Lookup_productInformation = [];
    var jsonQuery_productInformation = {};

    jsonParams_Lookup_productInformation.push({ "field": "prdMainPKey", "value": ProductPKey });
    jsonParams_Lookup_productInformation.push({ "field": "commitDate", "value": CommitDate });
    jsonParams_Lookup_productInformation.push({ "field": "criterionAttribute", "value": criterionAttribute });

    jsonQuery_productInformation.params = jsonParams_Lookup_productInformation;

    return Facade.getObjectAsync("LuProductInformation", jsonQuery_productInformation);

  })
  .then(function (lookupData) {

    // Instantiate lookup from lookup data
    productInformationLookup = BoFactory.instantiate("LuProductInformation", lookupData);

    var product = ProductsForAdd.getItemsByParam({"prdMainPKey": ProductPKey})[0];
    var result = {};
	// If the product is empty, then throw a error message otherwise get the data
	if (Utils.isDefined(product)) {
        var item = product.getData();

        // Prepare data to instantiate the LI from, give PKey and remove id property
        item.pKey = PKey.next();
        delete item.id;

        /* <!-- CW-REQUIRED: LI instantiation --> */
        // Set values from product information lookup
        item.simplePricingBasePrice = productInformationLookup.getBasePrice();
        item.eAN = productInformationLookup.getEAN();
        item.piecesPerSmallestUnitForBasePrice = productInformationLookup.getPiecesPerSmallestUnitForBasePrice();
        item.groupText = productInformationLookup.getGroupText();
        item.groupId = productInformationLookup.getGroupId();
        item.taxClassification = productInformationLookup.getTaxClassification();
        item.ivcInformationObject = " ";

        // Set unit information depending on default unit
        if (itemTemplate.getQuantityLogisticUnit() == "OrderUnit") {
          item.defaultQuantityLogisticUnit = productInformationLookup.getOrderQuantityLogisticUnit();
          item.defaultPiecesPerSmallestUnit = productInformationLookup.getOrderPiecesPerSmallestUnit();
        } else if (itemTemplate.getQuantityLogisticUnit() == "ConsumerUnit") {
          item.defaultQuantityLogisticUnit = productInformationLookup.getConsumerQuantityLogisticUnit();
          item.defaultPiecesPerSmallestUnit = productInformationLookup.getConsumerPiecesPerSmallestUnit();
        } else if (itemTemplate.getQuantityLogisticUnit() == "PriceUnit") {
          item.defaultQuantityLogisticUnit = productInformationLookup.getPriceQuantityLogisticUnit();
          item.defaultPiecesPerSmallestUnit = productInformationLookup.gePricePiecesPerSmallestUnit();
        } else {
          item.defaultQuantityLogisticUnit = productInformationLookup.getOrderQuantityLogisticUnit();
          item.defaultPiecesPerSmallestUnit = productInformationLookup.getOrderPiecesPerSmallestUnit();
        }

        // Set default values
        item.sdoMainPKey = SdoMainPKey;
        item.prdMainPKey = ProductPKey;

        item.piecesPerSmallestUnit = item.defaultPiecesPerSmallestUnit;
        item.quantityLogisticUnit = item.defaultQuantityLogisticUnit;

        item.priceEffect = itemTemplate.getPriceEffect();
        item.sdoItemMetaPKey = itemTemplate.getPKey();
        item.shortType = itemTemplate.getShortText();
        item.type = itemTemplate.getText();
        item.saveZeroQuantity = itemTemplate.getSaveZeroQuantity();
        item.calculationGroup = itemTemplate.getCalculationGroup();

        item.listed = listedPromotedLookup.getListed();
        item.promoted = listedPromotedLookup.getPromoted();
        item.itemState = listedPromotedLookup.getItemState();
        item.outOfStock = listedPromotedLookup.getOutOfStock();

        item.quantity = 0; 

        // Set object status
        item.objectStatus = STATE.NEW;

        me.addListItems([item]);

        // Call function to increment quantity (initially) if product is added via scanning
        if ((mode === "addScannedProduct") && ((barcodeScanBehavior.getId() === "SelectIncrease") || (barcodeScanBehavior.getId() === "UserExit"))) {
          me.incrementQuantityByScan(item, itemTemplate, barcodeScanBehavior, scanIncrementQuantity);
        }

        // Build return values
        if (item.getPromoted() == "1") {
          filterCountIncrements.push({ "key": "Promotion", "value": 1 });
        }

        if (item.getNewState() == "Available") {
          filterCountIncrements.push({ "key": "New", "value": 1 });
        }

        if (item.getOutOfStock() == "1") {
          filterCountIncrements.push({ "key": "OutOfStock", "value": 1 });
        }

        filterCountIncrements.push({ "key": "All", "value": 1 });

        result.selectPKey = item.getPKey();
        result.filterCountIncrements = filterCountIncrements;
    }
    return result;
  });

} else {          
  var existingItem = existingItems[0];

  // Increase quantity by scan increment if product is selected via scanning
  if ((mode === "addScannedProduct") && ((barcodeScanBehavior.getId() === "SelectIncrease") || (barcodeScanBehavior.getId() === "UserExit"))) {
    me.incrementQuantityByScan(existingItem, itemTemplate, barcodeScanBehavior, scanIncrementQuantity);
  } 

  var resultValue = {};
  resultValue.selectPKey = existingItem.getPKey();
  resultValue.filterCountIncrements = [];

  promise = when.resolve(resultValue);
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}