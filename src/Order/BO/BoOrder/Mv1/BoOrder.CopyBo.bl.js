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
 * @function copyBo
 * @this BoOrder
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {Object} oldBo
 * @returns promise
 */
function copyBo(oldBo){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    var jsonParams_Lookup_listedPromoted = [];
var jsonQuery_listedPromoted = {};
var oldPKEY = oldBo.getPKey();
var additionalCondition = " AND 1=1";
var newLoOrderItems;

jsonParams_Lookup_listedPromoted.push({ "field": "orderPkey", "value": oldPKEY });
jsonParams_Lookup_listedPromoted.push({ "field": "additionalCondition", "value": additionalCondition });
jsonQuery_listedPromoted.params = jsonParams_Lookup_listedPromoted;

var promise = Facade.getListAsync("LoOrderItems", jsonQuery_listedPromoted)
.then(function (lookupData){
  newLoOrderItems = lookupData.filter(function (item){
    return Utils.isEmptyString(item.freeItemCreationStep);
  });
  var newLoItems = BoFactory.instantiate("LoOrderItems");
  me.setLoItems(newLoItems);

  var promotionsLoaded = when.resolve();
  if (me.getBoOrderMeta().getConsiderSelectablePromotion() == '1')
  {
    promotionsLoaded = Facade.getListAsync("LoSelectablePromotionProducts", { currentDate: Utils.createDateToday(), customer: me.getLuOrderer().getPKey() });
  }
  return promotionsLoaded;
})
.then(function (promotionProducts){
  var isValidItem = function (item, promotionProducts)
  {
    var valid = true;
    if (Utils.isDefined(promotionProducts) && !Utils.isEmptyString(item.promotionPKey))
    {
      valid = promotionProducts.findIndex(function (promotionProduct) { return promotionProduct.promotionPKey == item.promotionPKey && promotionProduct.prdMainPKey == item.prdMainPKey; }) > -1;
    }	
    return valid;
  };

  var priceffect;
  for(var x = 0; x < newLoOrderItems.length; x++)
  {
    if (!isValidItem(newLoOrderItems[x], promotionProducts)){
      newLoOrderItems.splice(x, 1);
      x--;
    }
    else{
      priceffect = me.getBoOrderMeta().getLoOrderItemMetas().getItemByPKey(newLoOrderItems[x].sdoItemMetaPKey).getPriceEffect();
      newLoOrderItems[x].sdoMainPKey = me.pKey;
      newLoOrderItems[x].objectStatus = STATE.NEW | STATE.DIRTY;
      newLoOrderItems[x].erpId = " ";
      newLoOrderItems[x].pKey  = PKey.next();
      newLoOrderItems[x].priceEffect = priceffect;
    }
  }  

  me.getLoItems().addItems(newLoOrderItems);
  return CP.PricingHandler.getInstance().initOrder(me.getPKey(), me.getSdoMetaPKey(), me.getOrdererPKey(), Utils.createDateToday(),
                                                   me.getCurrency(), me.getCndCpCalculationSchemaPKey(), me.cpGetRelevantOrderAttributes(),
                                                   me.getDistribChannel(), me.getDivision(), me.cpGetVariantOrderVariables(), me.getBoOrderMeta().getGeneratePricingLog());
})
.then(function (){
  //changing the header discount automatically trigger resetcalculationresult
  return me.setHeaderDiscount(oldBo.getHeaderDiscount());
})
.then(function (){
  if (Utils.isDefined(CP) && (me.getBoOrderMeta().getComputePrice() === "4" || me.getBoOrderMeta().getComputePrice() === "5")) 
  {
    if (me.getBoOrderMeta().getComputePrice() === "5" && me.getDocTaType() !== "NonValuatedDeliveryNote")
    {
      return me.cpCalculate();
    }
    else
    {
      me.setCalculationStatus("3");
    }
  }
  else
  {
    return BoFactory.createObjectAsync("BoHelperSimplePricingCalculator", {}).then(function (calculator) { 
      me.setSimplePricingCalculator(calculator);
      return me.calculateOrderValue().then(function () { 
        me.setCalculationStatus("1");
      });
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