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
 * @function addProduct
 * @this BoPrmContract
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {String} productPKey
 * @param {String} productId
 * @returns promise
 */
function addProduct(productPKey, productId){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
// determine if product exists already
var promise;
var loProducts = me.getLoPrmCttProducts();
var existingProducts = loProducts.getItemsByParam({"referencePKey": productPKey});
var liProduct;
if (existingProducts.length > 0)
{
  for (var index in existingProducts) 
  {
    if ((existingProducts[index].getObjectStatus() & STATE.DELETED) === 0)
    {
      liProduct = existingProducts[index];
    }
  }
}

if(!Utils.isDefined(liProduct))
{
  promise = BoFactory.loadObjectByParamsAsync("LuProduct", me.getQueryBy('pKey', productPKey)).then(
    function(luProduct) {
      var pKey = PKey.next();
      var liProduct = {
        "pKey": pKey,
        "prmContractPKey": me.getPKey(),
        "prdProductGroupName": luProduct.getGroupShortText(),
        "text": luProduct.getText1(),
        "quantity": 0,
        "specialPrice": 0,
        "discount": 0,
        "dataType": "Decimal",
        "formatType": "0.1",
        "maxValue": "100.0",
        "minValue": "0.0",
        "stepSize": "0",
        "productId": productId,
        "prdgroupId": luProduct.getGroupId(),
        "groupFlag": " ",
        "referencePKey": luProduct.getPKey(),
        "prdMetaType": "Product",
        "manual": "1",
        "objectStatus": STATE.NEW | STATE.DIRTY
      };

      me.getLoPrmCttProducts().addListItems([liProduct]);
      me.getLoPrmCttProducts().sortList();
      me.getLoPrmCttProducts().setCurrentByPKey(pKey);
      me.getLuPrmCttTacticProductCount().setProductCount(me.getLuPrmCttTacticProductCount().getProductCount() + 1); // SF/CASDIFF: set and validate does not exist in CGCloud
    }
  );
}
else
{
  loProducts.setCurrent(liProduct);
  promise = when.resolve();
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}