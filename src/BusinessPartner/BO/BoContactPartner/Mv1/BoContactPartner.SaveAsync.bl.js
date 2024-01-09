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
 * @function saveAsync
 * @this BoContactPartner
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @returns promise
 */
function saveAsync(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
/**************************************************************************************
*  1 CGCloud tables / 2 onPrem tables                                                          *
*                                                                                              *
*  CGCloud: -Contact Partner and Contract Partner Address is saved in same Entity "Contract"   *
************************************************************************************************/

var promises = [];
var contactSavedPromise;

me.setName(me.getLastName() + ", " + me.getFirstName());

//Save BoContactPartner
// SF/CASDIF: General Dif
if (Utils.isSfBackend()) {
  contactSavedPromise = BoFactory.createObjectAsync("BoSfHelper", {})
    .then(function (helper) {
    return helper.saveTrackedObject(me, []);
  });
}
else {
  contactSavedPromise = Facade.saveObjectAsync(me);
}

var promise = contactSavedPromise.then(
  function() {
    // SF/CASDIF: General Dif
    if (Utils.isSfBackend()) {
      if (Utils.isDefined(me.getLoContactPartnerAddress())) {
        var items = me.getLoContactPartnerAddress().getAllItems();

        if (items.length > 0) {
          //since both BoContactPartner and LoContactPartnerAddress will write into "Contact", we set the same PKey; and via "saveTrackedObject" and "saveAsync" both set of changes will be put into one TA
          //FW will recognize this when trying to commit and merge the two changesets into one single upsert to the Contact record
          items[0].setPKey(me.getPKey());
        }
      }
    }

    //Save LoBpaAddress if defined
    if (Utils.isDefined(me.getLoContactPartnerAddress())) {
      promises.push(me.getLoContactPartnerAddress().saveAsync());
    }

    if (Utils.isCasBackend()) {
      if (Utils.isDefined(me.getBoBpaSales())) {
        promises.push(me.getBoBpaSales().saveAsync());
      }
      //Save ContactPartnerCustomer Relation
      promises.push(me.getLoContactPartnerCustomerRelation().saveAsync());
    }
    return when.all(promises);
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}