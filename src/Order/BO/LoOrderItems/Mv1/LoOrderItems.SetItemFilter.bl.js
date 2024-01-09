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
 * @function setItemFilter
 * @this LoOrderItems
 * @kind listobject
 * @namespace CORE
 * @param {DomString} filterCode
 * @param {DomString} categoryId
 * @param {Object} promotionPKey
 * @returns filterCode
 */
function setItemFilter(filterCode, categoryId, promotionPKey){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var filterArray = [];
var paramsForPkeys = [];
var selectablePromotionUoMsOfItems = [];

// Reset filters of image selector    
me.resetAllFilters();

if(Utils.isDefined(promotionPKey) && !Utils.isEmptyString(promotionPKey)){
  paramsForPkeys = [{"promotionPKey":promotionPKey, "op":"EQ"}];
} else {
  paramsForPkeys = [{"promotionPKey":" ", "op":"EQ"},{"quantity":"0", "op":"GT"},{"showInBasket" : "1", "op" : "EQ"}]; 
}

var items = me.getItemsByParamArray(paramsForPkeys,undefined,'OR');

switch (filterCode) 
{
  case "All":                       
    // never use an empty filterArray because it will reset all filters,
    // reapply the always existing filter instead in order to filter out free items that have just been deleted
    // for all other cases the existing filter will be applied anyway because the filters are changed
    filterArray.push({"deletedFreeItem" : "0", "op" : "EQ"});
    break;
  case "Promotion":
    filterArray.push({"promoted" : "1", "op" : "EQ"});
    // do not show deleted free Items
    filterArray.push({"deletedFreeItem" : "0", "op" : "EQ"});
    break;
  case "New":
    filterArray.push({"newState" : "Available", "op" : "EQ"});
    break;
  case "History":
    filterArray.push({"history" : "1", "op" : "EQ"});
    break;
  case "OutOfStock":
    filterArray.push({"outOfStock" : "1", "op" : "EQ"});
    break;
  case "Basket":
    // Reset GroupId filter of breadcrumb control
    me.resetFilter("groupId");
    // do not show deleted free Items
    filterArray.push({"deletedFreeItem" : "0", "op" : "EQ"});
    //show Basket relevant items
    filterArray.push({"showInBasket" : "1", "op" : "EQ"});
    break;
}

var selectRefPKeys = {};
for(var i = 0; i < items.length; i++){
  selectRefPKeys[items[i].getRefPKey()] = items[i].getRefPKey();

}
filterArray.push({"refPKey" : selectRefPKeys, "op" : "IN"});

// Filter item list by category if basket is not selected
if (Utils.isDefined(categoryId) && !Utils.isEmptyString(categoryId) && filterCode != "Basket") {
  filterArray.push({"groupId" : categoryId, "op" : "EQ"});
}

//Filter item list by quick filters
var registerFilter = ApplicationContext.get("registerFilter");
var categoryFilter = ApplicationContext.get("categoryFilter");
var quickFilter;

if(Utils.isDefined(registerFilter)){
  quickFilter = {"groupName" : registerFilter, "op" : "EQ"};
  filterArray.push(quickFilter);
}
if(Utils.isDefined(categoryFilter)){
  quickFilter = {"category" : categoryFilter, "op" : "EQ"};
  filterArray.push(quickFilter);
}

me.setFilterArray(filterArray);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return filterCode;
}