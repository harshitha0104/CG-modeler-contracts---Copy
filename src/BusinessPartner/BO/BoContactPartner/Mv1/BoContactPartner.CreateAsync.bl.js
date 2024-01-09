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
 * @this BoContactPartner
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

if (!jsonQuery){jsonQuery={'params': []};}
var pKey = PKey.next();
me.setPKey(pKey);
me.initSalutation();
me.setName(" ");
me.setFirstName(" ");
me.setLastName(" ");
me.setJobTitle(" ");
me.initMainFunction();
me.setPhone1(" ");
me.setPhone2(" ");
me.setEmail1(" ");
me.setFax1(" ");
me.setEmailEditable("1");

me.updateProperties(jsonQuery);

var promise = BoFactory.createListAsync(LO_CONTACTPARTNERADDRESS, {'params': []}).then(
  function (object) {
    me.setLoContactPartnerAddress(object);

    //Add Main Address
    me.getLoContactPartnerAddress().addItem(me.getPKey(),"1");	

    //Set object status of Main Address
    me.getLoContactPartnerAddress().setObjectStatus(STATE.NEW | STATE.DIRTY);

    jParams = [];
    jQuery = {};

    // Prepare creation of BoBpaSales			
    jParams.push({ "field" : "businessPartnerPKey", "value" : jsonQuery.customerPKey});
    jParams.push({ "field" : "salesOrg", "value" : user.getBoUserSales().getSalesOrg()});			
    jQuery.params = jParams;

    return BoFactory.createObjectAsync(BO_BPASALES, jQuery);	
  }).then(
  function (object) {
    me.setBoBpaSales(object);	

    //Set object status of BoBpaSales to dirty since it will be not modified via GUI
    me.getBoBpaSales().setObjectStatus(STATE.NEW | STATE.DIRTY);

    return BoFactory.loadObjectByParamsAsync("LuBpaMeta", me.getQueryBy("id", "ContactPartner"));			
  }).then(
  function (lookupBpaMeta) {
    if (Utils.isDefined(lookupBpaMeta))
    {
      me.setBpaMetaPKey(lookupBpaMeta.getPKey());				
    }
    me.setObjectStatus(STATE.NEW);
    return BoFactory.createListAsync(LO_CUSTOMERCONTACTPARTNERRELATION, {'params': []});
  }).then(
  function (object) {
    // Add Customer to ContactPartner relation
    if(Utils.isSfBackend())
    {
      me.setAccount(jsonQuery.params[0].value);
    }
    else
    {
      object.addItem(jsonQuery.params[0].value, me.getPKey()); 
    }
    me.setLoContactPartnerCustomerRelation(object);
    //Set object status of ContactPartner relation
    me.getLoContactPartnerCustomerRelation().setObjectStatus(STATE.NEW | STATE.DIRTY);
    me.setObjectStatus(STATE.NEW | STATE.DIRTY);
    me.setEARights();

    return me;
  }
);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}