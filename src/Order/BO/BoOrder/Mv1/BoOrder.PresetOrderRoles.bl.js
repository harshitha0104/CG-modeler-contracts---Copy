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
 * @function presetOrderRoles
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {DomPKey} pKey
 * @returns promise
 */
function presetOrderRoles(pKey){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var mainDelivRecPKey = "";
var mainPayerPKey = "";
var mainBillRecPKey = "";
var mainBrokerPKey = "";
var customerDetailPresent;

var jsonParams = JSON.parse('[{"objectClass": "LuCustomerIsMainDeliveryRecipient", "pKey": "' + pKey + '", "reference": "luCustomerIsMainDeliveryRecipient"},{"objectClass": "LuCustomerIsMainPayer", "pKey": "' + pKey + '", "reference": "luCustomerIsMainPayer"},{"objectClass": "LuCustomerIsMainBillRecipient", "pKey": "' + pKey + '", "reference": "luCustomerIsMainBillRecipient"},{"objectClass": "LuCustomerIsMainBroker", "pKey": "' + pKey + '", "reference": "luCustomerIsMainBroker"}]');

var promise = Facade.loadLookupsAsync(jsonParams)
.then(function (lookups) {

  mainDelivRecPKey = lookups.luCustomerIsMainDeliveryRecipient.getFromPKey();
  if(!Utils.isEmptyString(mainDelivRecPKey)){
    me.setDeliveryRecipientPKey(mainDelivRecPKey);
  }
  
  mainPayerPKey = lookups.luCustomerIsMainPayer.getFromPKey();
  if(!Utils.isEmptyString(mainPayerPKey)){
    me.setPayerCustomerPKey(mainPayerPKey);
  }
  
  mainBillRecPKey = lookups.luCustomerIsMainBillRecipient.getFromPKey();
  if(!Utils.isEmptyString(mainBillRecPKey)){
    me.setBillToCustomerPKey(mainBillRecPKey);
  }

  mainBrokerPKey = lookups.luCustomerIsMainBroker.getFromPKey();

  if (me.getBoOrderMeta().getBrokerRequired() == "0"){
    //First Found Main Wholesaler or Empty.
    var isMainBroker = lookups.luCustomerIsMainBroker.getMain();
    if (Utils.isDefined(mainBrokerPKey) && Utils.isDefined(isMainBroker) && isMainBroker == "1"){
      me.setBrokerCustomerPKey(mainBrokerPKey);
    }
    else{
      me.setBrokerCustomerPKey(" ");
    }
  }
  else{
    if (Utils.isDefined(mainBrokerPKey)){
      //First Found Main Wholesaler or fall back to alphabetically first found wholesaler.
      me.setBrokerCustomerPKey(mainBrokerPKey);
    }
    else{
      me.setBrokerCustomerPKey(" ");
    }
  }

  customerDetailPresent = !Utils.isEmptyString(mainDelivRecPKey) && !Utils.isEmptyString(mainPayerPKey) && !Utils.isEmptyString(mainBillRecPKey);

  return customerDetailPresent;
})
.then(function (customerDetailPresent) {
  if (customerDetailPresent){
    me.setDeliveryRecipientPKey(mainDelivRecPKey);
    me.setPayerCustomerPKey(mainPayerPKey);
    me.setBillToCustomerPKey(mainBillRecPKey);

    return undefined;
  }
  else{
    return BoFactory.loadObjectByParamsAsync("LoBpaRole",me.getQueryBy("customerPKey", me.getOrdererPKey()));
  }

})
.then(function (loBpaRole) {
  if (Utils.isDefined(loBpaRole)){
    if (Utils.isEmptyString(mainDelivRecPKey)){
      if (loBpaRole.getHasDeliveryRole() == "1"){
        me.setDeliveryRecipientPKey(pKey);
      }
      else{
        me.setDeliveryRecipientPKey(" ");
      }
    }


    if (Utils.isEmptyString(mainPayerPKey)){  
      if (loBpaRole.getHasPayerRole() == "1"){
        me.setPayerCustomerPKey(pKey);
      }
      else{
        me.setPayerCustomerPKey(" ");
      }
    }  

    if (Utils.isEmptyString(mainBillRecPKey)){  
      if (loBpaRole.getHasBillToRole() == "1"){
        me.setBillToCustomerPKey(pKey);
      }
      else{
        me.setBillToCustomerPKey(" ");
      }
    } 
  }

  var jsonParams = JSON.parse('[{"objectClass": "LuDeliveryRecipient", "pKey": "' + me.getDeliveryRecipientPKey() + '", "reference": "luDeliveryRecipient"}, {"objectClass": "LuCustomer", "pKey": "' + me.getBrokerCustomerPKey() + '", "reference": "luBrokerCustomer"}]');

  return Facade.loadLookupsAsync(jsonParams);
})
.then(function (lookups) {
  me.setLuDeliveryRecipient(lookups.luDeliveryRecipient);
  me.setLuBrokerCustomer(lookups.luBrokerCustomer);
});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}