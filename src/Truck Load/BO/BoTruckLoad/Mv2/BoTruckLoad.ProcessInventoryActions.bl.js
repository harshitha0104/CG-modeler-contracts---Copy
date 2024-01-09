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
 * @function processInventoryActions
 * @this BoTruckLoad
 * @kind businessobject
 * @async
 * @namespace CORE
 * @returns promise
 */
function processInventoryActions(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var validationErrors = [];
var loTruckLoadItems = this.getLoItems();
var truckLoadItems = loTruckLoadItems.getAllItems();
var itemMetas = this.getBoOrderMeta().getItemMetaJsonDictionary();

// Create loInventories and loInventoryTransactions
me.setLoInventories(BoFactory.instantiateLightweightList("LoInventory"));
me.setLoInventoryTransactions(BoFactory.instantiateLightweightList("LoInventoryTransaction"));

var loInventories = me.getLoInventories();
var loInventoryTransactions = me.getLoInventoryTransactions();
var orderMeta = me.getBoOrderMeta();

var invActions = function (itemDetailObject) {
  return loInventories.createInventoryForTruckLoadItem(itemDetailObject).then(
    function (returnObj) {
      return loInventoryTransactions.createTransactionForTruckLoadItem(returnObj).then(
        function (validationError) {
          if (Utils.isDefined(validationError)) {
            validationErrors.push(validationError);
          }
        });
    });
};

var deferreds = [];
for (var i = 0; i < truckLoadItems.length; i++) {
  var item = truckLoadItems[i];
  var itemMeta = itemMetas.get(item.getSdoItemMetaPKey());
  if (item.getQuantity() > 0 || this.getBoOrderMeta().getSdoSubType() === "TruckAudit" ||
      this.getBoOrderMeta().getSdoSubType() === "TruckIvcTransferOutward" || this.getBoOrderMeta().getSdoSubType() === "TruckIvcTransferInward") {

    //create Inventory
    var ivcMetasByItemMeta = orderMeta.getIvcMetasByItemMeta(item.getSdoItemMetaPKey());
    var itemDetailObject = {
      "item": item, "ivcMetasByItemMeta": ivcMetasByItemMeta, "itemMeta": itemMeta,
      "tmgMainPKey": me.getTmgMainPKey(), "usrMainPKey": ApplicationContext.get('user').getPKey(),
      "prdMainPKey": item.getPrdMainPKey(), "documentType": me.getDocumentType()
    };

    deferreds.push(invActions(itemDetailObject));
  }
}

var promise = when.all(deferreds).then(
  function () {
    return validationErrors;
  }
);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}