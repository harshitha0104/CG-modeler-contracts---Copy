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
 * @function setInventoryBalanceOfPayment
 * @this BoOrder
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {DomPKey} paymentPKey
 * @returns promise
 */
function setInventoryBalanceOfPayment(paymentPKey){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    var promise;

var ivcMetaPKeys = [];
var usrMainPKeys = [];
var bpaMainPKeys = [];
var tmgTourPKeys = [];
var etpVehiclePKeys = [];

var jsonParamsForFinding = [];
var jsonQueryForFinding = {};

if (Utils.isDefined(paymentPKey)) {
	var liOrderPayment = this.getLoPayments().getItemByPKey(paymentPKey);

	//Preserve object status in order to avoid saving items just because of the setting of inventory balance
	var objectStatus = liOrderPayment.getObjectStatus();

	// Determine balance only if not already done
	if (Utils.isEmptyString(liOrderPayment.getIvcInformationObject())) {

		// Get inventory meta information with prepared search keys
		var ivcMetasByPaymentMeta = this.getBoOrderMeta().getIvcMetasByPaymentMeta(liOrderPayment.getSdoPaymentMetaPKey());

		for (var i = 0; i < ivcMetasByPaymentMeta.length; i++) {
			ivcMetaPKeys.push(ivcMetasByPaymentMeta[i].getIvcMetaPKey());
			usrMainPKeys.push(ivcMetasByPaymentMeta[i].getUsrMainPKey());
			bpaMainPKeys.push(ivcMetasByPaymentMeta[i].getBpaMainPKey());
			tmgTourPKeys.push(ivcMetasByPaymentMeta[i].getTmgTourPKey());
			etpVehiclePKeys.push(ivcMetasByPaymentMeta[i].getEtpVehiclePKey());
		}

		jsonParamsForFinding.push({
			"field" : "ivcMetaPKeys",
			"value" : "'" + ivcMetaPKeys.join("','") + "'"
		});
		jsonParamsForFinding.push({
			"field" : "usrMainPKeys",
			"value" : "'" + usrMainPKeys.join("','") + "'"
		});
		jsonParamsForFinding.push({
			"field" : "bpaMainPKeys",
			"value" : "'" + bpaMainPKeys.join("','") + "'"
		});
    jsonParamsForFinding.push({
      "field" : "prdMainPKeys",
      "value" : "' '"
    });
    if (!Utils.isSfBackend()) {
      jsonParamsForFinding.push({
        "field" : "tmgTourPKeys",
        "value" : "'" + tmgTourPKeys.join("','") + "'"
      });
      jsonParamsForFinding.push({
        "field" : "etpVehiclePKeys",
        "value" : "'" + etpVehiclePKeys.join("','") + "'"
      });
      jsonParamsForFinding.push({
        "field" : "addCond_Currency",
        "value" : " AND IvcMain.Currency = '" + liOrderPayment.getCurrency() + "' "
      });
    }      
    else {
      jsonParamsForFinding.push({
        "field" : "addCond_Tour",
        "value" : " AND Inventory__c.Tour__c = ' ' "
      });
      jsonParamsForFinding.push({
        "field" : "addCond_Vehicle",
        "value" : " AND Inventory__c.Vehicle__c = ' ' "
      });
     jsonParamsForFinding.push({
        "field" : "addCond_OrderCurrency",
        "value" : " AND Inventory__c.Currency__c = '" + me.getCurrency() + "' "
      });
    }

    jsonQueryForFinding.params = jsonParamsForFinding;

    promise = BoFactory.loadObjectByParamsAsync("LoInventoryFinding", jsonQueryForFinding)
      .then(function (loInventoryFinding) {

			// Build inventory information object and store at payment
			var liInventory;
			var ivcInformation = {};
			var ivcInformationObject = [];
			var params = {};

			for (var i = 0; i < ivcMetasByPaymentMeta.length; i++) {
				params = {};
				params.ivcMetaPKey = ivcMetasByPaymentMeta[i].getIvcMetaPKey();
				params.usrMainPKey = ivcMetasByPaymentMeta[i].getUsrMainPKey();
				params.bpaMainPKey = ivcMetasByPaymentMeta[i].getBpaMainPKey();
				params.tmgTourPKey = ivcMetasByPaymentMeta[i].getTmgTourPKey();
				params.etpVehiclePKey = ivcMetasByPaymentMeta[i].getEtpVehiclePKey();

				ivcInformation = {};
				ivcInformation.ivcMainPKey = " ";
				ivcInformation.balance = 0;

				liInventory = loInventoryFinding.getItemsByParam(params);

				// If inventory found, add IvcMainPKey to IvcInformationObject
				if (liInventory.length > 0) {
					ivcInformation.ivcMainPKey = liInventory[0].getIvcMainPKey();
					ivcInformation.balance = liInventory[0].getBalance();
				}

				ivcInformation.ivcMetaByPaymentMeta = ivcMetasByPaymentMeta[i];

				ivcInformationObject.push(ivcInformation);
			}

			liOrderPayment.setIvcInformationObject(ivcInformationObject);
			liOrderPayment.setObjectStatus(objectStatus);
		});

	} else {
		promise = when.resolve();
	}
} else {
	promise = when.resolve();
}
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}