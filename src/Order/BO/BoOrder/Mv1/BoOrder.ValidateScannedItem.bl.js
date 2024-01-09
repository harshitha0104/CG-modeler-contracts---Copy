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
 * @function validateScannedItem
 * @this BoOrder
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {DomPKey} PrdMainPKey
 * @param {DomBool} FilterByBpaAssortment
 * @param {LiOrderItemMeta} CurrentItemTemplate
 * @param {DomString} Listing
 * @param {DomString} ListingWithModules
 * @param {DomBool} HitClosedListing
 * @param {DomBool} CollectClosedListing
 * @returns promise
 */
function validateScannedItem(PrdMainPKey, FilterByBpaAssortment, CurrentItemTemplate, Listing, ListingWithModules, HitClosedListing, CollectClosedListing){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise;
var items = [];
var result = "";

if ((Utils.isEmptyString(me.getSelectedPromotionPKey())) && !((me.getBoOrderMeta().getConsiderSelectablePromotion() == "1") && (me.getBoOrderMeta().getSpecialOrderHandling() == "ExclusiveSpecialOrder"))) {
  if (CurrentItemTemplate.getUseClosedListing() == "1") {
    // If listings for current customer are closed for hit algorithm
    if (HitClosedListing.getId() == 1) {
      if (Listing == "Hit")  {
        items = me.getLoProductForAdd().getItemsByParamArray([ {"prdMainPKey" : PrdMainPKey, "op" : "EQ"}, {"listing" : "Hit", "op" : "EQ"} ]);
      }
      else {
        if (ListingWithModules == "Hit") {
          items = me.getLoProductForAdd().getItemsByParamArray([ {"prdMainPKey" : PrdMainPKey, "op" : "EQ"}, {"listingWithModules" : "Hit", "op" : "EQ"} ]);
        }
      }
    }
    // If listings for current customer are closed for collection algorithm
    if (CollectClosedListing.getId() == 1) {
      if (Listing == "Collection") {
        items = me.getLoProductForAdd().getItemsByParamArray([ {"prdMainPKey" : PrdMainPKey, "op" : "EQ"}, {"listing" : "None", "op" : "NE"} ] );
      }
      else {
        if (ListingWithModules == "Collection") {
          items = me.getLoProductForAdd().getItemsByParamArray([ {"prdMainPKey" : PrdMainPKey, "op" : "EQ"}, {"listingWithModules" : "None", "op" : "NE"} ] );
        }
      }
    }
  }
  else {
    items = me.getLoProductForAdd().getItemsByParamArray([ {"prdMainPKey" : PrdMainPKey, "op" : "EQ"}]);
  }
}
else {
  if (me.getBoOrderMeta().getConsiderSelectablePromotion() == "1"){
    if (CurrentItemTemplate.getMain() == "1") {
      items = me.getLoItems().getItemsByParamArray([ {"prdMainPKey" : PrdMainPKey, "op" : "EQ"}, {"promotionPKey" : me.getSelectedPromotionPKey(), "op" : "EQ"} ] );
    }
  }
}

//If returned array is empty, the product is not valid for the current customer
if (items.length > 0) {
  promise = when.resolve("valid");
}
else {
  var buttonValues = {};
  buttonValues[Localization.resolve("OK")] = "ok";
  if (me.getBoOrderMeta().getConsiderSelectablePromotion() == "1") {
    promise = MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Validation"), Localization.resolve("Product_ScanProductProcess.ProductScannedNotInPromotionMsg"), buttonValues)
      .then(function (input) {
      return "notValid";
    });
  }
  else {
    promise = MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Warning"), Localization.resolve("OrderInvalidProductDuringBarcodeScan"), buttonValues)
      .then(function (input) {
      return "notValid";
    });
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}