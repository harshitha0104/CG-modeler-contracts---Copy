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
 * @function updateLastCallDate
 * @this LoBpaCallSetting
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {DomPKey} customerPKey
 * @param {DomPKey} clbMetaPKey
 * @param {Date} lastCallDate
 */
function updateLastCallDate(customerPKey, clbMetaPKey, lastCallDate){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    

	var lValidCallSettings = this.getItemsByParamArray([{"validFrom": lastCallDate, "op":"LE"}, {"validThru": lastCallDate, "op":"GE"}]);

	if (lValidCallSettings.length > 0)
	{
		lValidCallSettings[0].setLastCall(lastCallDate);
	}
	else
	{

		var liNewCallSetting = {
			"pKey": PKey.next(),
			"customerPKey": customerPKey,
			"clbMetaPKey": clbMetaPKey,
			"lastCall": lastCallDate,
			"salesOrg": ApplicationContext.get('user').getBoUserSales().getSalesOrg(),
			"validFrom": lastCallDate,
			"validThru": Utils.convertAnsiDateTime2AnsiDate(Utils.getMaxDate()),
            "objectStatus" : STATE.NEW | STATE.DIRTY
			
		};

		var lFutureCallSettings = this.getItemsByParamArray([{"validFrom": lastCallDate, "op":"GE"}]);
		if (lFutureCallSettings.length > 0)
		{
			var newValidThru = Utils.convertAnsiDate2Date(lFutureCallSettings[0].getValidFrom());
			newValidThru.setDate(newValidThru.getDate() - 1);
			liNewCallSetting.validThru = Utils.convertFullDate2Ansi(newValidThru);
		}
		

		this.addListItems([liNewCallSetting]);
	}

	this.saveAsync();

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}