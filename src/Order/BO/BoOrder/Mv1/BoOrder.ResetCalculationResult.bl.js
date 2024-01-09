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
 * @function resetCalculationResult
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @returns promise
 */
function resetCalculationResult(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var itemsMain = me.getLoItems();
var promise = when.resolve();

if(Utils.isDefined(itemsMain)) {
  var items = itemsMain.getAllItems();
  var index;

  me.getLoItems().suspendListRefresh();

  for (index = 0; index < items.length; index++) {
    var currentItem = items[index];

    if (me.getBoOrderMeta().getComputePrice() == BLConstants.Order.BUTTON_MODE || me.getBoOrderMeta().getComputePrice() == BLConstants.Order.EDIT_MODE) {
      currentItem.setValue(0);
      currentItem.setBasePrice(0);
      currentItem.setGrossValue(0);
      currentItem.setPriceReceipt(0);
      currentItem.setValueReceipt(0);
      currentItem.setGrossValueReceipt(0);
      currentItem.setPrice(0);
      currentItem.setBasePriceReceipt(0);
      currentItem.setPricingInformation("");
    }
  }
  me.getLoItems().resumeListRefresh(true);

  me.setGrossTotalValue(0);
  me.setGrossTotalValueReceipt(0);
  me.setMerchandiseValue(0);
  me.setMerchandiseValueReceipt(0);
  me.setTotalValue(0);
  me.setTotalValueReceipt(0);
  me.setPaidAmount(0); 
  me.setAbsolutePaidAmount(0);
  me.setDebitCredit('Debit');
  me.setPaidAmountReceipt(0);
  me.setPricingInformation("");
  
  me.getLoItems().resumeListRefresh(true);

  if(Utils.isDefined(me.getLoItemFilter())) {
    me.updateItemFilterTotalValue();
  }

  var splittingGroups = me.getLoSplittingGroups();
  if (Utils.isDefined(splittingGroups)) {
    splittingGroups.removeAllItems();
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}