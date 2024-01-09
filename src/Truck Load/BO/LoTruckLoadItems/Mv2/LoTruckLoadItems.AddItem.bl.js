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
 * @this LoTruckLoadItems
 * @kind listobject
 * @async
 * @namespace CORE
 * @param {DomPKey} ProductPKey
 * @param {DomPKey} SdoMainPKey
 * @param {LiOrderItemMeta} itemTemplate
 * @param {DomSdoBarcodeScanBehavior} barcodeScanBehavior
 * @param {DomInteger} scanIncrementQuantity
 * @param {String} mode
 * @param {DomPrdLogisticUnit} uoM
 * @param {BoOrderMeta} documentTemplate
 * @param {DomSdoSubType} documentType
 * @param {DomSdoPhase} phase
 * @returns promise
 */
function addItem(ProductPKey, SdoMainPKey, itemTemplate, barcodeScanBehavior, scanIncrementQuantity, mode, uoM, documentTemplate, documentType, phase){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var jsonQuery_productInformation = {};
jsonQuery_productInformation.params = [{ "field": "prdMainPKey", "value": ProductPKey }];
var productInformationLookup;

var promise = Facade.getObjectAsync("LuProductUom", jsonQuery_productInformation).then(
  function (lookupData) {
    // Instantiate lookup from lookup data
    productInformationLookup = BoFactory.instantiate("LuProductUom", lookupData);

    if (!Utils.isDefined(uoM) || Utils.isEmptyString(uoM)) {
      // Set unit information depending on default unit
      if (itemTemplate.getQuantityLogisticUnit() == "OrderUnit") {
        uoM = productInformationLookup.getOrderQuantityLogisticUnit();
      }
      else if (itemTemplate.getQuantityLogisticUnit() == "ConsumerUnit") {
        uoM = productInformationLookup.getConsumerQuantityLogisticUnit();
      }
      else if (itemTemplate.getQuantityLogisticUnit() == "PriceUnit") {
        uoM = productInformationLookup.getPriceQuantityLogisticUnit();
      }
      else {
        uoM = productInformationLookup.getOrderQuantityLogisticUnit();
      }
    }

    return BoFactory.loadObjectByParamsAsync("LuProduct", me.getQueryBy("pKey", ProductPKey));
  }).then(
  function (lookupData) {
    var existingItems = me.getItemsByParam({
      "prdMainPKey": ProductPKey,
      "sdoItemMetaPKey": itemTemplate.getPKey(),
      "quantityLogisticUnit": uoM
    });

    var result = {};
    var buttonValues = {};

    //Check if there exists an item with the same ProductPKey
    if (existingItems.length === 0) {
      if (itemTemplate.getAddAllowed() === '0' || (phase === "Released" || phase === "Canceled")) {
        buttonValues[Localization.resolve("OK")] = "ok";

        return Framework.displayMessage(Localization.resolve("MessageBox_Title_Warning"), Localization.resolve("AddNotAllowedMessage"), buttonValues).then(
          function () {
            return result;
          }
        );
      } else {
        var PrdText = "";
        var PrdId = "";
        if (Utils.isDefined(lookupData)) {
          PrdText = lookupData.getText1();
          PrdId = lookupData.getPrdId();
        }

        if (itemTemplate.getShortText() === "Prd Out") {
          itemTemplate.setShortText("");
        }

        var li = {
          "pKey": PKey.next(),
          "sdoMainPKey": SdoMainPKey,
          "prdMainPKey": ProductPKey,
          "quantityLogisticUnit": uoM,
          "isOrderUnit": "1",
          "text1": PrdText,
          "prdId": PrdId,
          "sdoItemMetaPKey": itemTemplate.getPKey(),
          "quantity": "0",
          "suggestedQuantity": 0,
          "targetQuantity": "0",
          "saveZeroQuantity": itemTemplate.getSaveZeroQuantity(),
          "edited": "0",
          "refPKey": SdoMainPKey + ProductPKey + itemTemplate.getPKey(),
          "shortText": itemTemplate.getShortText(),
          "objectStatus": STATE.NEW
        };

        me.addListItems([li]);

        return me.addMissingUoMsToItem(li, itemTemplate, "").then(
          function () {
            // Hide the Type selection box
            if (documentType === "ProductCheckOut") {
              li.getACL().removeRight(AclObjectType.PROPERTY, "sdoItemMetaPKey", AclPermission.VISIBLE);
            }

            if (Utils.isDefined(documentTemplate) &&
                (documentTemplate.getConsiderQuantitySuggestion() !== "No" || documentTemplate.getItemPresettingPolicy() === "Prepopulated")) {
              var unitOfMeasureItems = me.getUnitOfMeasureItemsForMainItem(li);

              for (var x = 0; x < unitOfMeasureItems.length; x++) {
                unitOfMeasureItems[x].setQtyDifference(unitOfMeasureItems[x].getQuantity() - unitOfMeasureItems[x].getTargetQuantity());
                unitOfMeasureItems[x].setOqtyInfo(Localization.resolve("oQtyId") + "  " + unitOfMeasureItems[x].getTargetQuantity());
                unitOfMeasureItems[x].setDifferenceInfo(Localization.resolve("DifferenceId") + "  " + unitOfMeasureItems[x].getQtyDifference());
              }
            }

            result.selectPKey = li.getPKey();
            result.countExistingItems = existingItems;

            if (Utils.isDefined(documentTemplate) && documentTemplate.getItemPresettingPolicy() === "BlindMode") {
              li.setEdited("1");
              var filterPrdMainPKey = me.getAllItems().filter(function (x){
                if (x.getPrdMainPKey() == li.prdMainPKey){
                  return x;
                }
              });
              for (var i = 0; i < filterPrdMainPKey.length; i++) {
                filterPrdMainPKey[i].setEdited("1");
              }
              me.resetFilter("edited");
              me.setFilter("edited", "1", "EQ");
            }

            // Call function to increment quantity (initially) if product is added via scanning
            if ((mode === "addScannedProduct") && ((barcodeScanBehavior === "SelectIncrease") || (barcodeScanBehavior === "UserExit"))) {
              me.incrementQuantityByScan(li, itemTemplate, barcodeScanBehavior, scanIncrementQuantity);
              li.setQuantity(li.getQuantity());
            }

            return result;
          });
      }
    } else if ((Utils.isDefined(documentType) && documentType === "TruckIvcTransferInward" && itemTemplate.getAddAllowed() == '0') || (phase === "Released" || phase === "Canceled")) {
      buttonValues[Localization.resolve("OK")] = "ok";

      return Framework.displayMessage(Localization.resolve("MessageBox_Title_Warning"), Localization.resolve("AddNotAllowedMessage"), buttonValues).then(
        function () {
          return result;
        });
    } else {
      var mainItem = existingItems[0];
      if (Utils.isDefined(documentTemplate) && documentTemplate.getItemPresettingPolicy() === "BlindMode") {
        mainItem.setEdited("1");
      }

      // Increase quantity by scan increment if product is selected via scanning
      if (mode === "addScannedProduct" && ((barcodeScanBehavior === "SelectIncrease") || (barcodeScanBehavior === "UserExit"))) {
        me.incrementQuantityByScan(mainItem, itemTemplate, barcodeScanBehavior, scanIncrementQuantity);
      }

      var resultValue = {};
      resultValue.selectPKey = mainItem.getPKey();
      resultValue.countExistingItems = existingItems;
      return resultValue;
    }
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}