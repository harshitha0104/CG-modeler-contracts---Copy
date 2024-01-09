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
 * @this BoPos
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
    
var customerPKey;
var bpaPosGeometryPKey;
var promise;

if (!jsonQuery) {
  jsonQuery={'params': []};
}
var pKey = PKey.next();
me.setPKey(pKey);
me.setId(pKey);
me.updateProperties(jsonQuery);

for (var index in jsonQuery.params) {
  switch (jsonQuery.params[index].field) {
    case "customerPKey":
      customerPKey = jsonQuery.params[index].value;
      break;

    case "bpaPosGeometryPKey":
      bpaPosGeometryPKey = jsonQuery.params[index].value;
      break;
  }
}

me.setBpaPOSGeometryPKey(bpaPosGeometryPKey);
me.setCustomerPKey(customerPKey);

if (!Utils.isDefined(me.getBpaPosMetaPKey())) {
  promise = BoFactory.createObjectAsync(BO_POSMETA, {'params': []});
}
else {
  promise = BoFactory.loadObjectByParamsAsync(BO_POSMETA, me.getQueryBy('pKey', me.getBpaPosMetaPKey()));
}

promise = promise.then(
  function (object) {
    //###################
    //### BO_POSMETA  ###
    //###################
    me.setBoPosMeta(object);

    return BoFactory.createListAsync(LO_BPAADDRESS, {'params': []});
  }).then(
  function (loBpaAddress) {
    me.setLoCustomerAddress(loBpaAddress);
    //Add Main Address
    me.getLoCustomerAddress().addItem(me.getPKey(),"1");
    var user = ApplicationContext.get('user');
    var jParams = [];
    var jQuery = {};
    // Prepare creation of BoBpaSales
    jParams.push({ "field" : "businessPartnerPKey", "value" : me.getPKey()});
    jParams.push({ "field" : "salesOrg", "value" : user.getBoUserSales().getSalesOrg()});
    jQuery.params = jParams;

    return BoFactory.createObjectAsync(BO_BPASALES, jQuery);
  }).then(
  function (object) {
    //####################
    //### BO_BPASALES  ###
    //####################
    me.setBoBpaSales(object);
    //Set object status of BoBpaSales to dirty since it will be not modified via GUI
    me.getBoBpaSales().setObjectStatus(STATE.NEW | STATE.DIRTY);

    return BoFactory.createListAsync(LO_CUSTOMERPOSRELATION, {'params': []});
  }).then(
  function (object) {
    //###############################
    //### LO_CUSTOMERPOSRELATION  ###
    //###############################
    me.setLoPOSCustomerRelation(object);
    // Variables
    var posPKey;
    var bpaRelMetaPKey;
    var loBpaPosMetaRel;
    // Initialization
    posPKey = me.getPKey();
    // Add relations according to BpaPOSMetaRel
    var arrayBpaPosMetaRel = me.getBoPosMeta().getLoBpaPosMetaRel().getAllItems();
    var x;
    for (x in arrayBpaPosMetaRel) {
      // Get PKey for RelationMeta
      bpaRelMetaPKey = arrayBpaPosMetaRel[x].getBpaRelMetaPKey();
      // Add relation
      me.getLoPOSCustomerRelation().addItem(posPKey, customerPKey, bpaRelMetaPKey);
    }
    //Set object status of all items of LoPOSCustomerRelation to dirty since it will be not modified via GUI
    var loPOSCustomerRelation = me.getLoPOSCustomerRelation().getAllItems();
    for (x in loPOSCustomerRelation) {
      loPOSCustomerRelation[x].setObjectStatus(STATE.NEW | STATE.DIRTY);
    }

    return BoFactory.loadObjectByParamsAsync("LuBpaMeta", me.getQueryBy("id", "POS"));
  }).then(
  function (lookupBpaMeta) {
    //####################
    //### BpaMetaPKey  ###
    //####################
    if (Utils.isDefined(lookupBpaMeta)) {
      me.setBpaMetaPKey(lookupBpaMeta.getPKey());
    }
    //Make BpaPOS dirty since it is directly saved to DB after add process
    me.setObjectStatus(STATE.NEW | STATE.DIRTY);

    return me;
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}