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
 * @function afterLoadAsync
 * @this BoTruckLoad
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} result
 * @param {Object} context
 * @returns promise
 */
function afterLoadAsync(result, context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var mainItem;
var mainIndex;
var canceling = false;
var itemMeta;

me.setLoModReasonCache(Utils.createDictionary());

var newParams;
if (Utils.isDefined(context.jsonQuery)) {
  newParams = context.jsonQuery;
  if (Utils.isOldParamsFormat(newParams)) {
    newParams = Utils.convertDsParamsOldToNew(newParams);
  }

  if (Utils.isDefined(newParams.isCanceling) && newParams.isCanceling === "true") {
    canceling = true;
  }
}

var itemMetas = me.getBoOrderMeta().getItemMetaJsonDictionary();
var actualPrdCheckOutType = me.getActualPrdCheckOutType();

if (Utils.isEmptyString(actualPrdCheckOutType) && context.jsonQuery.mode && context.jsonQuery.mode === "Express") {
  actualPrdCheckOutType = "Express";
} else {
  actualPrdCheckOutType = "SKU";
}

//Set IvcRefPKeys
me.setIvcRefPKeys();
me.setValidateInventories("0");

//Set inventory search keys for item meta
me.getBoOrderMeta().setIvcSearchKeysForItemMetas(me.getOrdererPKey(), me.getIvcRef1PKey(), me.getIvcRef2PKey(), me.getIvcRef3PKey(), me.getIvcRef4PKey(), me.getIvcRef5PKey());

//set total value difference between oQty and aQty
me.setAmountDifference(me.getGrossTotalValueReceipt() - me.getBookInventoryValue());
me.setLoQuantitySums(BoFactory.instantiate("LoQuantitySums", {}));

var loMainItems = me.getLoItems();
var mainItems = loMainItems.getAllItems();

for (mainIndex = 0; mainIndex < mainItems.length; mainIndex++) {
  mainItem = mainItems[mainIndex];
  if (Utils.isEmptyString(mainItem.getPKey())) {
    mainItem.setPKey(PKey.next());
    mainItem.setObjectStatus(mainItem.self.STATE_NEW);
  }
}

var determineSysReleaseProcessPKey = function () {
  if (me.getPhase() === "Released" || (me.getPhase() === "Canceled" && me.getDocumentType() === "TruckIvcTransferInward")) {
    return me.determineSysReleaseProcessPKey();
  } else {
    return when.resolve("");
  }
};

var promise = determineSysReleaseProcessPKey().then(
  function (sysReleaseProcessPKey) {
    if (!Utils.isEmptyString(sysReleaseProcessPKey)) {
      return BoFactory.loadListAsync("LoSysReleaseProcessStep", me.getQueryBy("sysReleaseProcessPKey", sysReleaseProcessPKey));
    } else {
      return undefined;
    }
  }).then(
  function (loSysReleaseProcessStep) {
    if (Utils.isDefined(loSysReleaseProcessStep)) {

      var stepItems = loSysReleaseProcessStep.getAllItems();
      if (stepItems.length > 0) {
        me.setSysReleaseProcessStepsExists("1");
      } else {
        me.setSysReleaseProcessStepsExists("0");
      }
    } else {
      me.setSysReleaseProcessStepsExists("0");
    }

    if (me.getDocumentType() === "ProductCheckOut") {
      if (me.getBoOrderMeta().getItemPresettingPolicy() === "BlindMode") {
        for (mainIndex = 0; mainIndex < mainItems.length; mainIndex++) {
          mainItems[mainIndex].setOqtyInfo("");
          mainItems[mainIndex].setDifferenceInfo("");
        }
        //Filter items by Edited Field
        loMainItems.setFilter("edited", "0", "NE");
      } else if (me.getBoOrderMeta().getItemPresettingPolicy() === "Prepopulated") {
        loMainItems.resetFilter("edited");

        for (mainIndex = 0; mainIndex < mainItems.length; mainIndex++) {
          mainItem = mainItems[mainIndex];
          itemMeta = itemMetas.get(mainItem.getSdoItemMetaPKey());

          if (actualPrdCheckOutType === "SKU" && mainItem.getEdited() === "0") {
            mainItem.setQuantity(mainItem.getTargetQuantity());
            mainItem.setSuggestedQuantity(mainItem.getTargetQuantity());
            mainItem.setOqtyInfo(Localization.resolve("oQtyId") + "  " + mainItem.getTargetQuantity());
            mainItem.setDifferenceInfo(Localization.resolve("DifferenceId") + "  " + 0);
            mainItem.setEdited("1");

            //Control the display of red exclamatory mark in the item list page
            if (me.getBoOrderMeta().getConsiderItemModReason() == "1" &&
                itemMeta.modReasonRequired === "Mand" &&
                mainItem.getQtyDifference() !== 0 &&
                mainItem.getTargetQuantity() !== 0 &&
                Utils.isEmptyString(mainItem.getModReason())) {
              mainItem.setModReasonEntered('PrioHigh24');
            } else {
              mainItem.setModReasonEntered('EmptyImage');
            }
          } else if (actualPrdCheckOutType === "SKU" && mainItem.getEdited() == "1") {
            mainItem.setQtyDifference(mainItem.getQuantity() - mainItem.getTargetQuantity());

            mainItem.setOqtyInfo(Localization.resolve("oQtyId") + "  " + mainItem.getTargetQuantity());
            mainItem.setDifferenceInfo(Localization.resolve("DifferenceId") + "  " + mainItem.getQtyDifference());

            if (me.getBoOrderMeta().getConsiderItemModReason() == "1" &&
                itemMeta.modReasonRequired === "Mand" &&
                mainItem.getQtyDifference() !== 0 &&
                mainItem.getTargetQuantity() !== 0 &&
                Utils.isEmptyString(mainItem.getModReason())) {
              mainItem.setModReasonEntered('PrioHigh24');
            }
            else {
              mainItem.setModReasonEntered('EmptyImage');
            }
          }
        }
      } else {
        loMainItems.resetFilter("edited");

        for (mainIndex = 0; mainIndex < mainItems.length; mainIndex++) {
          mainItem = mainItems[mainIndex];
          if (mainItem.getEdited() === "0") {
            mainItem.setQuantity(null);
            mainItem.setOqtyInfo("");
            mainItem.setDifferenceInfo("");
          }
        }
      }

      if (actualPrdCheckOutType === "Express") {
        loMainItems.resetFilter("edited");
        for (mainIndex = 0; mainIndex < mainItems.length; mainIndex++) {
          mainItem = mainItems[mainIndex];
          mainItem.setQuantity(mainItem.getTargetQuantity());
          mainItem.setSuggestedQuantity(mainItem.getTargetQuantity());
          mainItem.setEdited("1");
        }
      }
    } else {
      for (mainIndex = 0; mainIndex < mainItems.length; mainIndex++) {
        mainItem = mainItems[mainIndex];
        mainItem.setQtyDifference(mainItem.getQuantity() - mainItem.getTargetQuantity());
        mainItem.setOqtyInfo(Localization.resolve("oQtyId") + "  " + mainItem.getTargetQuantity());
        mainItem.setDifferenceInfo(Localization.resolve("DifferenceId") + "  " + mainItem.getQtyDifference());
      }
    }

    me.addItemChangedEventListener('LoItems', me.onTruckLoadItemChanged); // TODO: workaround for listener not getting added when defined in BO contract

    var orderItemMeta = me.getBoOrderMeta().getLoOrderItemMetas().getMainItemTemplate();
    if (Utils.isDefined(orderItemMeta)) {
      me.setAddProduct_ItemMeta(orderItemMeta);

      if (Utils.isDefined(me.getAddProduct_ItemMeta() && me.getAddProduct_ItemMeta().getScanIncrementQuantity())) {
        me.setAddProduct_ScanIncrementQuantity(me.getAddProduct_ItemMeta().getScanIncrementQuantity());
      }
    }

    if (Utils.isDefined(itemMetas) && Utils.isDefined(itemMeta) && !Utils.isEmptyString(itemMeta)) {
      var acl = loMainItems.getACL();
      if (me.isEditable()) {
        //Set Visibility of Reason for quantity modification
        if (me.getBoOrderMeta().getConsiderItemModReason() == "1" && Utils.isDefined(orderItemMeta) && orderItemMeta.modReasonRequired !== "NotReq") {
          acl.addRight(AclObjectType.PROPERTY, "modReason", AclPermission.VISIBLE);
        } else {
          acl.removeRight(AclObjectType.PROPERTY, "modReason", AclPermission.VISIBLE);
        }
      }
    }

    var params = Utils.convertDsParamsOldToNew(context.jsonQuery);

    var boOrderMeta = me.getBoOrderMeta();
    var computePrice = boOrderMeta.getComputePrice();
    if ((!Utils.isDefined(params.process) || params.process !== "delete") && (computePrice === "4" || computePrice === "5") && !Utils.isEmptyString(boOrderMeta.getCndCpCalculationSchemaPKey()) && !canceling && (me.getPhase() !== "Released")) {
      return me.cpInitComplexPricing().then(
        function () {
          me.createDisplayInformationForList(mainItems);
          return result;
        }
      );
    } else {
      me.createDisplayInformationForList(mainItems);

      return result;
    }
  }
);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}