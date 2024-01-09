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
 * @function createPayments
 * @this BoCash
 * @kind businessobject
 * @async
 * @namespace CORE
 * @returns promise
 */
function createPayments(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise;

// Check whether payments need to be created
if (me.getAbsolutePaidAmount() > 0){

  var jsonQuery = {};
  var jsonParams = [];

  jsonParams.push({
    "field" : "sdoMetaPKey",
    "operator" : "EQ",
    "value" : me.getSdoMetaPKey()
  });
  jsonParams.push({
    "field" : "paymentMethod",
    "operator" : "EQ",
    "value" : "Cash"
  });
  jsonParams.push({
    "field" : "debitCredit",
    "operator" : "EQ",
    "value" : me.getDebitCredit()
  });

  jsonQuery.params = jsonParams;

  var luPaymentMetaByPaymentMethod;

  promise = BoFactory.loadObjectByParamsAsync("LuPaymentMetaByPaymentMethod", jsonQuery).then(
    function (lookup) {

      luPaymentMetaByPaymentMethod = lookup;

      return me.loadPayments();
    }).then(
    function () {

      if (!Utils.isEmptyString(luPaymentMetaByPaymentMethod.getPKey())) {

        var liPayment;

        // Check if there is already a payment record - If yes, use it, if no create one
        if (me.getLoPayments().getAllItems().length === 0) {
          liPayment = 
            {
            "pKey" : PKey.next(),
            "objectStatus" : STATE.NEW | STATE.DIRTY
          };

          me.getLoPayments().addListItems([liPayment]);
        } else {
          liPayment = me.getLoPayments().getAllItems()[0];
          liPayment.setObjectStatus(STATE.PERSISTED | STATE.DIRTY);
        }

        liPayment.setSdoMainPKey(me.getPKey());
        liPayment.setSdoPaymentMetaPKey(luPaymentMetaByPaymentMethod.getPKey());
        liPayment.setInitiationDate(Utils.convertFullDate2Ansi(Utils.createDateToday()));
        liPayment.setAmount(me.getPaidAmount());
        liPayment.setAmountReceipt(me.getPaidAmount());
        liPayment.setAbsoluteAmount(me.getAbsolutePaidAmount());
        liPayment.setCurrency(me.getCurrency());
        liPayment.setIvcInformationObject(" ");
        liPayment.setPaymentMethod(luPaymentMetaByPaymentMethod.getPaymentMethod());

        if(me.getDocumentType() == "Expenses"){
          liPayment.setExpenseType(me.getExpenseType());
        }
        else{
          liPayment.setExpenseType(" ");
        }
      }
    }
  );
} else {
  promise = when.resolve();
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}