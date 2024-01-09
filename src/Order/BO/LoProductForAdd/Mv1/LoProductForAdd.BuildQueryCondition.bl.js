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
 * @function buildQueryCondition
 * @this LoProductForAdd
 * @kind listobject
 * @namespace CORE
 * @param {Object} jsonParams
 * @returns queryCondition
 */
function buildQueryCondition(jsonParams){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
//Unwrap JsonParams
var params = jsonParams.params;

var useBpaAssortment;
var filterByBpaAssortment;
var useSalesDocAssortment;
var filterBySdoAssortment;
var addCond_ProductPKeys;

var index = 0;
for (index in params) {

	switch (params[index].field) {
	case "useBpaAssortment":
		useBpaAssortment = params[index].value;
		break;
	case "filterByBpaAssortment":
		filterByBpaAssortment = params[index].value;
		break;
	case "useSalesDocAssortment":
		useSalesDocAssortment = params[index].value;
		break;
	case "filterBySdoAssortment":
		filterBySdoAssortment = params[index].value;
		break;
	case "addCond_ProductPKeys":
		addCond_ProductPKeys = params[index].value;
		break;
	}
}

//Customer selling assortment
var cndBpa = "";
var cndFilterByBpaAssortment = "";

if (useBpaAssortment == 1) {
	cndBpa = "CustomerAssortment = '1'";

	if (filterByBpaAssortment == 1) {
		//Fiter by Customer selling assortment
		cndFilterByBpaAssortment = "CustomerAssortment = '1'";
	}
}

//Sales document assortment
var cndSdo = "";
var cndFilterBySdoAssortment = "";

if (useSalesDocAssortment == 1) {
	cndSdo = "SdoAssortment = '1'";

	if (filterBySdoAssortment == 1) {
		cndFilterBySdoAssortment = "SdoAssortment = '1'";
	}
}

//Build query condition
var queryCondition = " 1=1 ";

// Handle FilterBySalesDocumentAssortment
if (!Utils.isEmptyString(cndFilterByBpaAssortment)) {
	queryCondition += " AND (" + cndFilterByBpaAssortment + ")";
}

// Handle FilterByCustomerAssortment
if (!Utils.isEmptyString(cndFilterBySdoAssortment)) {
	queryCondition += " AND (" + cndFilterBySdoAssortment + ")";
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return queryCondition;
}