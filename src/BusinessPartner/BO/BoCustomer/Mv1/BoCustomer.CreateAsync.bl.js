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
 * @function createAsync
 * @this BoCustomer
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} jsonQuery
 * @returns promise
 */
function createAsync(jsonQuery){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var jParams;
var jQuery;
var user = ApplicationContext.get('user');
var userSales = user.getBoUserSales();

if (!jsonQuery){jsonQuery={'params': []};}
var pKey = PKey.next();

//###########################
//### Customer Attributes ###
//###########################
me.setPKey(pKey);
me.setAccountExtensionId(PKey.next());
me.setCustomerId(pKey);
me.updateProperties(jsonQuery);
me.setDateClosure(Utils.convertAnsiDateTime2AnsiDate(Utils.getMaxDate()));

// allow editing of email
me.setEmailEditable('1');

var jsonParams = me.prepareLookupsLoadParamsFromObject(me);

var promise = Facade.loadLookupsAsync(jsonParams).then(
  function (lookups) {
    me.assignLookups(lookups);

    //###################
    //### BO_BPAMETA  ###
    //###################
    return BoFactory.loadObjectByParamsAsync(BO_BPAMETA, me.getQueryBy('pKey', me.getBpaMetaPKey()));
  }).then(
  function (object) {
    me.setBoBpaMeta(object);

    //####################
    //### BO_BPASALES  ###
    //####################

    jParams = [];
    jQuery = {};

    // Prepare creation of BoBpaSales
    jParams.push({ "field" : "businessPartnerPKey", "value" : me.getPKey()});
    jParams.push({ "field" : "salesOrg", "value" : userSales.getSalesOrg()});
    jQuery.params = jParams;

    return BoFactory.createObjectAsync(BO_BPASALES, jQuery);
  }).then(
  function (object) {
    me.setBoBpaSales(object);

    //#####################
    //### BO_ORDERROLE  ###
    //##################### 

    //Set object status of BoBpaSales to dirty since it will be not modified via GUI
    me.getBoBpaSales().setObjectStatus(STATE.NEW | STATE.DIRTY);
    
    jParams = [];
    jQuery = {};

    if (me.getBoBpaMeta().getLoBpaMetaRoleMetaRel().hasRoleMetaOfId("order") == "1") {
      // Prepare creation of BoOrderRole
      jParams.push({ "field" : "customerPKey", "value" : me.getPKey()});
      jParams.push({ "field" : "salesOrg", "value" : userSales.getSalesOrg()});
    }
    jQuery.params = jParams;
    
    return BoFactory.createObjectAsync(BO_ORDERROLE, jQuery);
  }).then(
  function (object) {
    me.setBoOrderRole(object);

    //########################
    //### BO_CUSTOMERROLE  ###
    //########################

    //Set object status of BoOrderRole to dirty since it will be not modified via GUI
    me.getBoOrderRole().setObjectStatus(STATE.NEW | STATE.DIRTY);
    
    jParams = [];
    jQuery = {};

    if (me.getBoBpaMeta().getLoBpaMetaRoleMetaRel().hasRoleMetaOfId("customer") == "1") {
      // Prepare creation of BoCustomerRole
      jParams.push({ "field" : "customerPKey", "value" : me.getPKey()});
      jParams.push({ "field" : "customerNumber", "value" : 0});
      jParams.push({ "field" : "salesOrg", "value" : userSales.getSalesOrg()});
    }
    jQuery.params = jParams;

    return BoFactory.createObjectAsync(BO_CUSTOMERROLE, jQuery);
  }).then(
  function (object) {
    me.setBoCustomerRole(object);

    //#####################
    //### BO_PAYERROLE  ###
    //#####################

    //Set object status of BoCustomerRole to dirty since it will be not modified via GUI
    me.getBoCustomerRole().setObjectStatus(STATE.NEW | STATE.DIRTY);

    jParams = [];
    jQuery = {};

    if (me.getBoBpaMeta().getLoBpaMetaRoleMetaRel().hasRoleMetaOfId("payer") == "1") {
      // Prepare creation of BoPayerRole
      jParams.push({ "field" : "customerPKey", "value" : me.getPKey()});
      jParams.push({ "field" : "salesOrg", "value" : userSales.getSalesOrg()});
    }
    jQuery.params = jParams;

    return BoFactory.createObjectAsync(BO_PAYERROLE, jQuery);
  }).then(
  function (object) {
    me.setBoPayerRole(object);

    //########################
    //### BO_DELIVERYROLE  ###
    //########################

    //Set object status of BoPayerRole to dirty since it will be not modified via GUI
    me.getBoPayerRole().setObjectStatus(STATE.NEW | STATE.DIRTY);

    jParams = [];
    jQuery = {};

    if (me.getBoBpaMeta().getLoBpaMetaRoleMetaRel().hasRoleMetaOfId("deliveryrecipient") == "1") {
      // Prepare creation of BoDeliveryRole
      jParams.push({ "field" : "customerPKey", "value" : me.getPKey()});
      jParams.push({ "field" : "salesOrg", "value" : userSales.getSalesOrg()});
    }
    jQuery.params = jParams;

    return BoFactory.createObjectAsync(BO_DELIVERYROLE, jQuery);
  }).then(
  function (object) {
    me.setBoDeliveryRole(object);

    //#####################
    //### BO_STOREROLE  ###
    //#####################

    //Set object status of BoDeliveryRole to dirty since it will be not modified via GUI
    me.getBoDeliveryRole().setObjectStatus(STATE.NEW | STATE.DIRTY);

    jParams = [];
    jQuery = {};

    if (me.getBoBpaMeta().getLoBpaMetaRoleMetaRel().hasRoleMetaOfId("store") == "1") {
      // Prepare creation of BoStoreRole
      jParams.push({ "field" : "customerPKey", "value" : me.getPKey()});
      jParams.push({ "field" : "salesOrg", "value" : userSales.getSalesOrg()});
    }
    jQuery.params = jParams;

    return BoFactory.createObjectAsync(BO_STOREROLE, jQuery);
  }).then(
  function (object) {
    me.setBoStoreRole(object);

    //######################
    //### LO_BPAADDRESS  ###
    //######################

    //Set object status of BoStoreRole to dirty since it will be not modified via GUI
    me.getBoStoreRole().setObjectStatus(STATE.NEW | STATE.DIRTY);

    return BoFactory.createListAsync(LO_BPAADDRESS, {'params': []});
  })
.then(function (object) {
  me.setLoCustomerAddress(object);

  //#########################
  //### LO_BpaManagement  ###
  //#########################

  //Add Main Address
  me.getLoCustomerAddress().addItem(me.getPKey(),"1");

  return BoFactory.createListAsync(LO_BPAMANAGEMENT, {'params': []});
}).then(
  function (object) {
    me.setLoBpaManagement(object);

    //##########################
    //### LO_CONTACTPARTNER  ###
    //##########################

    //Add Main record
    me.getLoBpaManagement().addItem(me.getPKey(),"1");

    return BoFactory.createListAsync(LO_CONTACTPARTNER, {'params': []});
  }).then(
  function (object) {
    me.setLoContactPartner(object);

    //###############################
    //### LO_CUSTOMERPOSRELATION  ###
    //###############################

    return BoFactory.createListAsync(LO_CUSTOMERPOSRELATION, {'params': []});
  }).then(
  function (object) {
    me.setLoCustomerPOSRelation(object);
    me.get('loCustomerPOSRelation').addItemChangedEventListener(me.onPOSChanged, me, 'loCustomerPOSRelation');

/** Account Harmonization: obsolete:
    ###############################
    ### LO_CUSTOMEROPENINGTIME  ###
    ###############################

    return BoFactory.createListAsync(LO_CUSTOMEROPENINGTIME, {'params': []});
  }).then(
  function (object) {
    me.setLoCustomerOpeningTime(object);
    
Account Harmonization: obsolete */
    
    //###################
    //### LO_BPAROLE  ###
    //###################

    return BoFactory.createListAsync(LO_BPAROLE, {'params': []});
  }).then(
  function (object) {
    me.setLoBpaRole(object);
          
    var liBpaRole;
    var loBpaRole;
    var liBpaMetaRoleMetaRel;
    var loBpaMetaRoleMetaRel = me.getBoBpaMeta().getLoBpaMetaRoleMetaRel().getAllItems();

    for (var i=0; i < loBpaMetaRoleMetaRel.length; i++) {
      liBpaMetaRoleMetaRel = loBpaMetaRoleMetaRel[i];
      liBpaRole = me.getLoBpaRole().addItem(me.getPKey(), liBpaMetaRoleMetaRel.getBpaRoleMetaPKey(), liBpaMetaRoleMetaRel.getBpaRoleMetaId());

      switch(liBpaMetaRoleMetaRel.getBpaRoleMetaId()) {
        case "order":
          me.getBoOrderRole().setBpaRolePKey(liBpaRole.getPKey());
          break;
        case "customer":
          me.getBoCustomerRole().setBpaRolePKey(liBpaRole.getPKey());
          break;
        case "deliveryrecipient":
          me.getBoDeliveryRole().setBpaRolePKey(liBpaRole.getPKey());
          break;
        case "payer":
          me.getBoPayerRole().setBpaRolePKey(liBpaRole.getPKey());
          break;
        case "store":
          me.getBoStoreRole().setBpaRolePKey(liBpaRole.getPKey());
          break;
      }
    }

    //Set object status of all items of LoBpaRole to dirty since it will be not modified via GUI
    loBpaRole = me.getLoBpaRole().getAllItems();

    for (var j=0; j < loBpaRole.length; j++) {
      loBpaRole[j].setObjectStatus(STATE.NEW | STATE.DIRTY);
    }

    //###################################
    //### BpaUsrCallSetting Handling  ###
    //###################################

    var dateToday = Utils.createDateNow();
    var currentDay = dateToday.getDay() - 1;
    //check if sunday and set to 7
    if (currentDay===-1){currentDay=7;}
    //set day to Monday
    dateToday.setDate(dateToday.getDate()-currentDay);

    var initialYear = dateToday.getFullYear().toString();
    var loBpaUsrCallSettings = BoFactory.instantiate("LoBpaUsrCallSettings");
    /* <!-- CW-REQUIRED: LI instantiation --> */
    var liBpaUsrCallSetting = {
      "pKey": PKey.next(), 
      "customerPKey": me.getPKey(),
      "validFrom":  Utils.convertFullDate2Ansi(dateToday),
      "clbMetaPKey": ApplicationContext.get('user').getBoUserSales().getClbMetaPKey(),
      "managementType": " ",
      "initialYear": initialYear,
      "objectStatus" : STATE.NEW | STATE.DIRTY
    };

    loBpaUsrCallSettings.addListItems([liBpaUsrCallSetting]);
    me.setLoBpaUsrCallSettings(loBpaUsrCallSettings);
    me.setObjectStatus(STATE.NEW | STATE.DIRTY);
    me.setEARights();
    return me;
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}