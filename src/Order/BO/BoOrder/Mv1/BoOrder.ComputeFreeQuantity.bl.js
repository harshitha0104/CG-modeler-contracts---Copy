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
 * @function computeFreeQuantity
 * @this BoOrder
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {DomPKey} itemPKey
 * @returns promise
 */
function computeFreeQuantity(itemPKey){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = when.resolve(me);
var blub;

var ivcMetaPKeys = [];
var usrMainPKeys = [];
var bpaMainPKeys = [];
var prdMainPKeys = [];
var tmgTourPKeys = [];
var etpVehiclePKeys = [];
var jsonParamsForFinding = [];
var jsonQueryForFinding = {};

if (Utils.isDefined(itemPKey)) 
{
  var liOrderItem = me.getLoItems().getItemByPKey(itemPKey);
  var itemMeta = me.getBoOrderMeta().getLoOrderItemMetas().getItemTemplateByPKey(liOrderItem.getSdoItemMetaPKey());
  if (Utils.isDefined(itemMeta)) 
  {

    // Determine inventory information only if the item template is used to UseUserInventory or UseQuota
    if ((itemMeta.getUseUserInventory() == "1") || (itemMeta.getUseQuota() == "1")) 
    {


      // Get inventory meta information with prepared search keys
      var ivcMetasByItemMeta = me.getBoOrderMeta().getIvcMetasByItemMeta(liOrderItem.getSdoItemMetaPKey());

      for (var i = 0; i < ivcMetasByItemMeta.length; i++) {
        ivcMetaPKeys.push(ivcMetasByItemMeta[i].getIvcMetaPKey());
        usrMainPKeys.push(ivcMetasByItemMeta[i].getUsrMainPKey());
        bpaMainPKeys.push(ivcMetasByItemMeta[i].getBpaMainPKey());
        tmgTourPKeys.push(ivcMetasByItemMeta[i].getTmgTourPKey());
        etpVehiclePKeys.push(ivcMetasByItemMeta[i].getEtpVehiclePKey());
      }

      prdMainPKeys.push(liOrderItem.getPrdMainPKey());

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
        "value" : "'" + prdMainPKeys.join("','") + "'"
      });
      jsonParamsForFinding.push({
        "field" : "tmgTourPKeys",
        "value" : "'" + tmgTourPKeys.join("','") + "'"
      });
      jsonParamsForFinding.push({
        "field" : "etpVehiclePKeys",
        "value" : "'" + etpVehiclePKeys.join("','") + "'"
      });

      jsonQueryForFinding.params = jsonParamsForFinding;

      promise = BoFactory.loadObjectByParamsAsync("LoInventoryFinding", jsonQueryForFinding)
        .then(function (loInventoryFinding) {

    var luPlannedQuantityQuery = {};
	luPlannedQuantityQuery.params = [{
			"field" : "tmgMainPKey",
			"value" : me.getTmgMainPKey()
		}, {
			"field" : "documentType",
			"value" : me.getDocumentType()
		}, {
			"field" : "prdMainPKey",
			"value" : liOrderItem.getPrdMainPKey()
		}, {
			"field" : "salesOrg",
			"value" : me.getSalesOrg()
		}, {
			"field" : "movementDirection",
			"value" : liOrderItem.getMovementDirection()
		}
	];

	return BoFactory.loadObjectByParamsAsync("LuPlannedQuantity", luPlannedQuantityQuery);

  });
    }
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}