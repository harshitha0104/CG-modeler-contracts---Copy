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
 * @function getDSForCustomerAssortment
 * @this LoProductForAdd
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {DomString} mergeProperty
 * @param {DomPKey} customerPKey
 * @param {String} addCond_ProductPKeys
 * @returns datasourceDefiniton
 */
function getDSForCustomerAssortment(mergeProperty, customerPKey, addCond_ProductPKeys){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
// OBSOLETE!! - No longer called by core - Data is retrieved via datasource from temp table containing the merge result

// Datasource name (required by merge engine)
    var LO_MECUSTOMERASSORTMENT = "LoMeCustomerAssortment";

    var dsParams = "";
    var dsParams_array = [];

    dsParams_array.push({ "field": "customerPKey", "value": customerPKey });
    
    // Add additional conditions for restricting products, e.g. invalid product check (called from LoOrderItems.processInvalidItems());  
    if (!Utils.isEmptyString(addCond_ProductPKeys)) {
        dsParams_array.push({ "field": "addCond_productPKeys", "value": " AND PrdMainPKey IN (" + addCond_ProductPKeys + ") " });
    }
    
    dsParams = { "params": dsParams_array };

    var datasourceDefiniton = {
        "boName": LO_MECUSTOMERASSORTMENT,
        "dsParams": dsParams,
        "matchingColumn": "prdMainPKey",
        "dataSourceColumns": [
          { "name": "sdoItemMeta1", "alias": "sdoItemMeta1" },
          { "name": "sdoItemMeta2", "alias": "sdoItemMeta2" },
          { "name": "sdoItemMeta3", "alias": "sdoItemMeta3" },
          { "name": "sdoItemMeta4", "alias": "sdoItemMeta4" },
          { "name": "sdoItemMeta5", "alias": "sdoItemMeta5" },
          { "name": "sdoItemMeta6", "alias": "sdoItemMeta6" },
          { "name": "sdoItemMeta7", "alias": "sdoItemMeta7" },
          { "name": "sdoItemMeta8", "alias": "sdoItemMeta8" },
          { "name": "sdoItemMeta9", "alias": "sdoItemMeta9" },
          { "name": "sdoItemMeta10", "alias": "sdoItemMeta10" },
          { "name": "sdoItemMeta11", "alias": "sdoItemMeta11" },
          { "name": "sdoItemMeta12", "alias": "sdoItemMeta12" }
        ],
        "mergeProperty": mergeProperty,
        "lookupDataSource": "false"
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return datasourceDefiniton;
}