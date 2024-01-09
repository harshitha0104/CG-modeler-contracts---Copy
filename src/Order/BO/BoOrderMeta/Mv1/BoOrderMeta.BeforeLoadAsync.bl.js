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
 * @function beforeLoadAsync
 * @this BoOrderMeta
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} context
 * @returns promise
 */
function beforeLoadAsync(context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = Facade.getObjectAsync(BO_ORDERMETA, context.jsonQuery).then(
  function (selfJson) {
    context.selfJson = selfJson;

    if (me.beforeInitialize) {
      me.beforeInitialize.apply(me, [context]);
    }
    me.setProperties(selfJson);
    if (me.afterInitialize) {
      me.afterInitialize.apply(me, [context]);
    }

    if(Utils.isSfBackend()){
      if( context.jsonQuery.considerModule == "1"){
        me.setListing("None");
        me.setListingWithModules("Hit");
      }
      else{
        me.setListing("Hit");
        me.setListingWithModules("None");
      }
    }
    return BoFactory.loadListAsync(LO_ORDERITEMMETAS, me.getQueryBy("sdoMetaPKey", me.getPKey()));
  }).then(
  function (loOrderItemMetasJson) {
    if (Utils.isDefined(loOrderItemMetasJson.getMainItemTemplate()) ||
        [BLConstants.Order.PHASE_READY , BLConstants.Order.PHASE_RELEASED , BLConstants.Order.PHASE_CANCELED].includes(context.jsonQuery.phase) || context.jsonQuery.createOrOpenOrder != "1" || context.jsonQuery.syncStatus === BLConstants.Order.NOT_SYNCABLE) {
      me.setLoOrderItemMetas(loOrderItemMetasJson);

      return BoFactory.loadListAsync(LU_ORDERMETAFORFREEITEMS, me.getQueryBy("sdoMetaPKey", me.getPKey())).then(
        function (luOrderMetaForFreeItems) {
          me.setLuOrderMetaForFreeItems(luOrderMetaForFreeItems);

          return BoFactory.loadListAsync(LO_INVENTORYMETABYITEMMETA, me.getQueryBy("sdoMetaPKey", me.getPKey()));
        }).then(
        function (loInventoryMetaByItemMetaJson) {
          me.setLoInventoryMetaByItemMeta(loInventoryMetaByItemMetaJson);

          var cashFloatInventory = {recordType: "Cash_Float"};
          return Facade.selectSQL("DsLuRecordType", "Inventory", cashFloatInventory);
        }).then(
        function (recordType) {
          if (Utils.isDefined(recordType) && recordType.length > 0) {
            me.setCashFloatRecordTypeId(recordType[0].pKey);
          }

          var productInventory = {recordType: "Inventory"};
          return Facade.selectSQL("DsLuRecordType", "Inventory", productInventory);
        }).then(
        function (recordType) {
          if (Utils.isDefined(recordType) && recordType.length > 0) {
            me.setProductInventoryRecordTypeId(recordType[0].pKey);
          }

          return BoFactory.loadListAsync("LoInventoryMetaByPaymentMeta", me.getQueryBy("sdoMetaPKey", me.getPKey()));
        }).then(
        function (loInventoryMetaByPaymentMetaJson) {
          me.setLoInventoryMetaByPaymentMeta(loInventoryMetaByPaymentMetaJson);

          return BoFactory.loadListAsync(LO_PRDGROUPLEVELCRITERIONMAPPING, context.jsonQuery);
        }).then(
        function (loPrdGroupLevelCriterionMappingJson) {
          me.setLoPrdGroupLevelCriterionMapping(loPrdGroupLevelCriterionMappingJson);

          if ((me.getItemListOption() == "Hierarchy") && (me.getMobilityRelevant() == "1")) {
            return BoFactory.loadListAsync(LO_ORDERMETAPRDSELECTOR, me.getQueryBy("sdoMetaPKey", me.getPKey()));
          } else {
            return undefined;
          }
        }).then(
        function (loOrderMetaPrdSelectorJson) {
          me.setLoProductSelector(loOrderMetaPrdSelectorJson);
          return me;
        });
    }
    else {
      var buttonValues = {};
      buttonValues[Localization.resolve("OK")] = "ok";

      return MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Notification"), "Sorry, no valid main item template found!", buttonValues).then(function() {
        return undefined;
      });
    }
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}