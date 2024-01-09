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
 * @function filterProducts
 * @this LoScannedProduct
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {String} fieldStateFilter
 * @param {String} allowForeignProducts
 * @returns scannedProductResult
 */
function filterProducts(fieldStateFilter, allowForeignProducts){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var scannedProductResult = "ONEPRODUCT";
var bIsForeignProduct = false;
var bIsInvalidProduct = false;
var sProductId;

if (me.getAllItems().length === 0){
  scannedProductResult = "NOPRODUCTS";
}
else{
  me.resetAllFilters();

  // Look for products not field state available
  if (fieldStateFilter == "1"){
    me.setFilter("fieldStateValid", "1");

    if (me.getItemObjects().length === 0){
      bIsInvalidProduct = true;
    }

    me.resetFilter("fieldStateValid");
  }

  // Look for foreign products
  if (allowForeignProducts === "0"){
    me.setFilter("foreignProduct", "0");

    if (me.getItemObjects().length === 0){
      bIsForeignProduct = true;
    }

    me.resetFilter("foreignProduct");
  }

  // Set all configured filter to do multiple products check
  if (fieldStateFilter == "1"){
    me.setFilter("fieldStateValid", "1");
  }

  if (allowForeignProducts === "0"){
    me.setFilter("foreignProduct", "0");
  }

  // Check for multiple products
  var items = me.getItemObjects();

  if (items.length > 1){
    var products = [];
    var maxLength = 0;

    for (var index = 0; index < items.length; index++){
      var productId = items[index].getProductId();
      if (products.indexOf(productId) === -1){
        products.push(productId);

        me.setFilter("productId", productId, "EQ");
        maxLength = Math.max(maxLength, me.getItemObjects().length);
        me.resetFilter("productId");
      }
    }

    if (products.length === 1 && maxLength > 1){
      scannedProductResult = "ONEPRODUCTWITHMULTIPLEUOMS";
    }
    else if (products.length > 1 && maxLength === 1){
      scannedProductResult = "MULTIPLEPRODUCTS";
    }
    else if (products.length > 1 && maxLength > 1){
      scannedProductResult = "MULTIPLEPRODUCTSWITHMULTIPLEUOMS";
    }
  }
  else if (items.length == 1){
    scannedProductResult = "ONEPRODUCT";
  }
  else{
    if (bIsInvalidProduct){
      scannedProductResult = "INVALIDPRODUCT";
    }
    else if (bIsForeignProduct){
      scannedProductResult = "FOREIGNPRODUCT";
    }
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return scannedProductResult;
}