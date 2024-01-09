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
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
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
    
var loOrderPayments = me.getLoPayments();
var orderPayments;

// Find inventory and set balance for items with quantity > 0 but without IvcInformationObject
var deferreds = [];

var itemMetas = me.getBoOrderMeta().getItemMetaJsonDictionary();
var itemMeta;
var item;

var itemsMain = me.getLoItems();
var items = itemsMain.getAllItems();
var index;

for (index = 0; index < items.length; index++) {
  var item = items[index];

  itemMeta = itemMetas.get(item.getSdoItemMetaPKey());

  if (Utils.isDefined(itemMeta) && (item.getQuantity() > 0) && (item.getIvcInformationObject() == " " || !Utils.isDefined(item.getIvcInformationObject())) && ((itemMeta.useUserInventory == "1") || (itemMeta.useQuota == "1"))) {
    deferreds.push(
      me.setInventoryBalanceOfItem(item.getPKey())
    );
  }
}

// Find inventories for cash transactions
if (Utils.isDefined(loOrderPayments)) {
  orderPayments = loOrderPayments.getAllItems();

  var payment;

  for (var i = 0; i < orderPayments.length; i++) {
    payment = orderPayments[i];

    if ((payment.getAmount() !== 0) && (Utils.isEmptyString(payment.getIvcInformationObject()))) {
      deferreds.push(
        me.setInventoryBalanceOfPayment(payment.getPKey())
      );
    }
  }
}


// Create transactions and missing inventories

var promise = when.all(deferreds).then(function () {

  //-------------------------------------------
  // Product inventories
  //-------------------------------------------

  // Create loInventories and loInventoryTransactions
  me.setLoInventories(BoFactory.instantiateLightweightList("LoInventory"));
  me.setLoInventoryTransactions(BoFactory.instantiateLightweightList("LoInventoryTransaction"));

  // Get all item template information
  var itemMetas = me.getBoOrderMeta().getItemMetaJsonDictionary();

  // Create missing inventories and write transactions
  var itemMeta;
  var ivcInformationObject;
  var ivcInformation;
  var validationError;
  var validationErrors = [];
  var loInventories = me.getLoInventories();
  var loInventoryTransactions = me.getLoInventoryTransactions();
  var commitDate = me.getCommitDate();
  var itemsMain = me.getLoItems();
  var items = itemsMain.getAllItems();
  var index;
  var mainItemIvcInfo;

  for (index = 0; index < items.length; index++) {
    var item = items[index];

    if (!Utils.isEmptyString( item.getIvcInformationObject())) {
      mainItemIvcInfo = item.getIvcInformationObject();
    }

    itemMeta = itemMetas.get(item.getSdoItemMetaPKey());

    if (Utils.isDefined(itemMeta) && item.getQuantity() > 0) {

      if ((itemMeta.useUserInventory == "1") || (itemMeta.useQuota == "1")) {
        ivcInformationObject = item.getIvcInformationObject();

        //Write transaction for each inventory control template (combination of IvcMeta and IvcTaMeta)
        if (Utils.isDefined(ivcInformationObject) && !Utils.isEmptyString( ivcInformationObject)) {
          for (var j = 0; j < ivcInformationObject.length; j++) {
            ivcInformation = ivcInformationObject[j];

            if (Utils.isEmptyString( ivcInformation) && Utils.isDefined(mainItemIvcInfo)) {
              ivcInformation=  mainItemIvcInfo[0];
            }
            //Create inventory if not already exists
            if (Utils.isEmptyString(ivcInformation.ivcMainPKey)) {
              if (itemMeta.useUserInventory == "1") {
                ivcInformation.ivcMainPKey = loInventories.createInventoryForOrderItem(item, ivcInformation, me.getBoOrderMeta().getProductInventoryRecordTypeId());
              }
            }

            //Write transaction (could be still empty in case of a not found quota - quotas are not created automatically)
            if (!Utils.isEmptyString(ivcInformation.ivcMainPKey)) {
              if ((itemMeta.useUserInventory == "1") || (itemMeta.useQuota == "1")) {
                validationError = loInventoryTransactions.createTransactionForOrderItem(item, ivcInformation, itemMeta.checkUserInventoryOver, itemMeta.checkQuotaOver, commitDate);
                if (Utils.isDefined(validationError)) {
                  validationErrors.push(validationError);
                }
              }
            }
          }
        }
      }
    }
  }

  //-------------------------------------------
  // Cash inventories
  //-------------------------------------------

  if (Utils.isDefined(loOrderPayments)) {
    orderPayments = loOrderPayments.getAllItems();

    // Create missing inventories and write transactions
    var orderPayment;

    for (var i = 0; i < orderPayments.length; i++) {
      orderPayment = orderPayments[i];

      if (orderPayment.getAmount() !== 0) {
        ivcInformationObject = orderPayment.getIvcInformationObject();

        //Write transaction for each inventory control template (combination of IvcMeta and IvcTaMeta)
        if (Utils.isDefined(ivcInformationObject)) {
          for (var k = 0; k < ivcInformationObject.length; k++) {
            ivcInformation = ivcInformationObject[k];

            //Create inventory if not already exists
            if (Utils.isEmptyString(ivcInformation.ivcMainPKey)) {
              ivcInformation.ivcMainPKey = loInventories.createInventoryForOrderPayment(orderPayment, ivcInformation,  me.getBoOrderMeta().getCashFloatRecordTypeId());
            }
            //Write transaction
            if(!Utils.isEmptyString(ivcInformation.ivcMainPKey)){
              loInventoryTransactions.createTransactionForOrderPayment(orderPayment, ivcInformation);
            }
          }
        }
      }
    }

  }

  return validationErrors;

});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}