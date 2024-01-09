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
 * @function onItemTabEntered
 * @this BoItemTabManager
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @returns navigateToLastLevelActive
 */
function onItemTabEntered(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var values = this.getLastDisplayedHierarchyLevel().values;
var lastHierarchyLevelValid = true;

// Check whether the object is valid, i.e. has ids for all levels
for (var i = 0; i < values.length; i++) {
  if (Utils.isEmptyString(values[i])) {
    lastHierarchyLevelValid = false;
    break;
  }
}

// If the last hierarchy level is not valid, no SKU level is displayed 
// => Set filter to hide the detail area - PKey filter is used to avoid resetting by the automatic "select first" of the UI
// => Resetting of PKey filter is done at BoItemTabManager.updateLastDisplayedHierarchyLevel() and BoItemTabManager.showAllItems()
if ((this.getIsShowCategories() == "1") && (lastHierarchyLevelValid == false)) {
  this.getBoOrder().getLoItems().setFilter("pKey", " ");
  this.getBoOrder().getLoItemFilter().setFilter("displayOnHierarchyLevel", "0", "GT");
} else if ((this.getIsShowCategories() == "0") && (this.getIsShowCategoriesBasketMode() == "1")) {    
  this.getBoOrder().getLoItemFilter().setFilter("displayOnHierarchyLevel", "0", "GT");
} else if (this.getIsShowCategories() == "0") {
  this.getBoOrder().getLoItemFilter().setFilter("displayOnHierarchyLevel", "2", "LT");
}

// Reset add product hierarchy information in order to avoid jumping to the wrong level
this.setAddProduct_HierarchyInformation(undefined);

if(me.getCurrentItemFilterId() === "Basket"){
  me.updateShowInBasket();
}


// Return value for process context that enables/disables the navigate to last level after item selected event
var navigateToLastLevelActive = "1";

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return navigateToLastLevelActive;
}