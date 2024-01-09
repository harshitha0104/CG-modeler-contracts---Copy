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
 * @function prepareFastOrderProducts
 * @this BoOrder
 * @kind businessobject
 * @namespace CORE
 * @returns dictionaries
 */
function prepareFastOrderProducts(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
/* This method is used to prepare the list of items needed for Fast Order DataSearchField.
   It is triggered from Item list tab and takes no input parameters.
   Returns 2 dictionaries:
   1.orderItemDictionary have Pkey as key and complete order item as the value.
   This dictionary would used later for applying fast order quantites to order items.
   2.productNumberDictionary have Product number as key and fastOrderItem as the value
   This dictionary would be used to add items from pasteFromClipboard to FastOrder screen
*/

var items = me.getLoItems().getAllItems();
var orderItemDictionary = Utils.createDictionary();
var productNumberDictionary = Utils.createDictionary();
var dictionaries = {};
var fastOrderItems = [];
var fastOrderItem;

for(var i=0; i < items.length; i++) {
  var currentProduct = items[i];
  var isValidProductForAdd = currentProduct.isEditable();

  if(isValidProductForAdd){
    var isValidFastOrderItem = false;
    isValidFastOrderItem = (currentProduct.sdoItemMetaPKey !== me.boOrderMeta.luOrderMetaForFreeItems.sdoItemMetaPKey ||
                            Utils.isEmptyString(currentProduct.getRewardPKey())) && 
      currentProduct.getPromotionPKey() == me.getSelectedPromotionPKey() && currentProduct.getIsOrderUnit() == "1" &&
      me.boOrderMeta.loOrderItemMetas.getItemByPKey(currentProduct.sdoItemMetaPKey).main == "1";

    if(isValidFastOrderItem) {
      orderItemDictionary.add(currentProduct.getPKey(), currentProduct);
      fastOrderItem = {
        "pKey" : currentProduct.getPKey(),
        "productNumber": currentProduct.getPrdId(),
        "productDescription": currentProduct.getText1()
      };
      productNumberDictionary.add(currentProduct.getPrdId(), fastOrderItem);
      fastOrderItems.push(fastOrderItem);
    }
  }
}

var loFastOrderProducts = BoFactory.instantiate("LoFastOrderProducts");
loFastOrderProducts.addListItems(fastOrderItems);
me.setLoFastOrderProducts(loFastOrderProducts);

dictionaries.orderItemDictionary = orderItemDictionary;
dictionaries.productNumberDictionary = productNumberDictionary;

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return dictionaries;
}