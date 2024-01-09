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
 * @function addItemsBasedOnInventory
 * @this BoTruckLoad
 * @kind businessobject
 * @async
 * @namespace CORE
 * @returns promise
 */
function addItemsBasedOnInventory(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
// - Determines Inventories including balances
// - Creates truck load items for found inventories
// - Converts balance/ivc quantity to order unit qty
// - Sets Product information (id, description, etc.) to new truck load items

var promise;
var orderMeta = me.getBoOrderMeta();
var prdMainPKeys = [];
var itemTemplate = [];

if (orderMeta.getDisposalListProposal() === 'Proposal' && orderMeta.getConsiderInventory() === '1' && ApplicationContext.get('currentTourStatus') === 'Running') {

  //#########################
  //### Inventory Finding ###
  //#########################

  var jsonQueryForFinding = {};

  //Inventory Finding
  orderMeta = me.getBoOrderMeta();
  var ivcMetasByItemMeta = orderMeta.getLoInventoryMetaByItemMeta().getItemsByParam({ 'prdPolicy': 'One' });

  var ivcMetaPKeys = [];
  var bpaMainPKeys = [];
  var tmgTourPKeys = [];
  var vehiclePKeys = [];
  var usrMainPKeys = [];

  for (var mainIndex = 0; mainIndex < ivcMetasByItemMeta.length; mainIndex++) {
    ivcMetaPKeys.push(ivcMetasByItemMeta[mainIndex].getIvcMetaPKey());
    bpaMainPKeys.push(ivcMetasByItemMeta[mainIndex].getBpaMainPKey());

    if (ivcMetasByItemMeta[mainIndex].getUsrPolicy() === 'One') {
      usrMainPKeys.push(ApplicationContext.get('user').getPKey());
    }

    usrMainPKeys.push(' ');

    if (ivcMetasByItemMeta[mainIndex].getTmgPolicy() === 'One') {
      tmgTourPKeys.push(me.getTmgMainPKey());
    }

    tmgTourPKeys.push(' ');
    if (Utils.isDefined(ApplicationContext.get('currentTour')) && ivcMetasByItemMeta[mainIndex].getVehiclePolicy() === 'One') {
      vehiclePKeys.push(ApplicationContext.get('currentTour').getEtpVehicleTruckPKey());
    }
    vehiclePKeys.push(' ');
  }

  jsonQueryForFinding.params = [{
    'field': 'ivcMetaPKeys',
    'value': '\'' + ivcMetaPKeys.join('\',\'') + '\''
  },{
    'field': 'usrMainPKeys',
    'value': '\'' + usrMainPKeys.join('\',\'') + '\''
  },{
    'field': 'bpaMainPKeys',
    'value': '\'' + bpaMainPKeys.join('\',\'') + '\''
  },{
    'field': 'tmgTourPKeys',
    'value': '\'' + tmgTourPKeys.join('\',\'') + '\''
  },{
    'field': 'etpVehiclePKeys',
    'value': '\'' + vehiclePKeys.join('\',\'') + '\''
  }];

  promise = BoFactory.loadObjectByParamsAsync('LoInventoryFinding', jsonQueryForFinding).then(
    function (loInventoryFinding) {
      //################################
      //### Truck Load Item Creation ###
      //################################
      var inventoryItems = loInventoryFinding.getAllItems();
      var listInventoryMetaByItemMeta;
      var deferreds = [];

      for (var mainIndex = 0; mainIndex < inventoryItems.length; mainIndex++) {
        itemTemplate = [];
        //no item creation for this empty inventory
        if (inventoryItems[mainIndex].getBalance() !== 0) {
          var params = {};
          params.ivcMetaPKey = inventoryItems[mainIndex].getIvcMetaPKey();

          listInventoryMetaByItemMeta = orderMeta.getLoInventoryMetaByItemMeta().getItemsByParam(params);

          if (listInventoryMetaByItemMeta.length > 0) {
            for (var inventoryMetaIndex = 0; inventoryMetaIndex < listInventoryMetaByItemMeta.length; inventoryMetaIndex++) {
              if (itemTemplate.indexOf(listInventoryMetaByItemMeta[inventoryMetaIndex].getSdoItemMetaPKey()) === -1) {
                //No item creation for inventory with IvcMeasure = 'Value/Domestic Currency'
                if (listInventoryMetaByItemMeta[inventoryMetaIndex] !== 'ValueDC') {
                  //push product to array for getting product information
                  if (prdMainPKeys.indexOf(inventoryItems[mainIndex].getPrdMainPKey()) === -1) {
                    prdMainPKeys.push(inventoryItems[mainIndex].getPrdMainPKey());
                  }
                  //create new truck load item
                  var itemTemplateForAdd = orderMeta.getLoOrderItemMetas().getItemTemplateByPKey(listInventoryMetaByItemMeta[inventoryMetaIndex].getSdoItemMetaPKey());
                  deferreds.push(me.getLoItems().addCheckInItem(me.getPKey(), listInventoryMetaByItemMeta[inventoryMetaIndex], inventoryItems[mainIndex], itemTemplateForAdd, me.getMode()));
                  itemTemplate.push(listInventoryMetaByItemMeta[inventoryMetaIndex].getSdoItemMetaPKey());
                }
              }
            } //end of IvcMeta loop
          }
        }
      } // end of inventory loop

      return when.all(deferreds);
    }).then(
    function () {
      var jsonParamsForUnitInfo = [];
      var jsonQueryForUnitInfo = {};

      jsonParamsForUnitInfo.push({
          'field': 'prdPKeyList',
          'value': '\'' + prdMainPKeys.join('\',\'') + '\''
        });

      jsonQueryForUnitInfo.params = jsonParamsForUnitInfo;

      return BoFactory.loadObjectByParamsAsync('LoUnitFactorsForProductList', jsonQueryForUnitInfo);
    }).then(
    function (loUnitFactorsForProductList) {

      //#########################################################
      //### balance/ivc quantity to order unit qty Conversion ###
      //#########################################################

      //Convert ivcMeasure of created items to order unit
      var truckLoadItems = me.getLoItems().getAllItems();
      var currentItem;
      var itemForRestAvailable = false;
      var unitInformation;
      me.getLoItems().beginEdit();
      for (var mainIndex = 0; mainIndex < truckLoadItems.length; mainIndex++) {

        currentItem = truckLoadItems[mainIndex];
        if (Utils.isDefined(currentItem.getIvcInformationObject())) {
          unitInformation = loUnitFactorsForProductList.convertIvcMeasureToOrderUnit(currentItem.getPrdMainPKey(), currentItem.getIvcInformationObject().ivcMeasure, currentItem.getIvcInformationObject().balance, currentItem.freeItemBalance, currentItem.metaId, me.getMode());
        }
        currentItem.setTargetQuantity(0);
        currentItem.setSuggestedQuantity(0);
        currentItem.setQuantity(0);
        currentItem.setDifferenceInfo(Localization.resolve('DifferenceId') + ' ' + 0);

        if (me.getMode() === 'ReviewStock') {
          currentItem.setOqtyInfo(Localization.resolve('oQtyId'));
          currentItem.setDetailOqtyInfoForTruck(Localization.resolve('aQtyId') + ' ' + 0);
        } else {
          currentItem.setOqtyInfo(Localization.resolve('oQtyId') + ' ' + 0);
        }

        //Set values for free items.
        currentItem.setTargetQuantityForFreeItems(0);
        currentItem.setQuantityForFreeItems(0);
        currentItem.setOqtyInfoForFreeItems(Localization.resolve('FreeQtyId'));
        currentItem.setDetailOqtyForFreeItems(Localization.resolve('FreeQtyId') + ' ' + 0);


        if (Utils.isDefined(unitInformation) && !Utils.isEmptyString(unitInformation)) {
          currentItem.beginEdit();
          var diff;
          //set unitType and qty of the already created truckLoad item
          if (Utils.isDefined(unitInformation.convertedValue) && Utils.isDefined(unitInformation.orderUnitType) && unitInformation.convertedValue > 0) {

            if (currentItem.getQuantityLogisticUnit() == unitInformation.orderUnitType) {
              currentItem.setTargetQuantity(unitInformation.convertedValue);
              currentItem.setSuggestedQuantity(unitInformation.convertedValue);
              currentItem.setQuantity(unitInformation.convertedValue);
              diff = currentItem.getQuantity() - currentItem.getTargetQuantity();
              currentItem.setDifferenceInfo(Localization.resolve('DifferenceId') + ' ' + diff);

              if (me.getMode() === 'ReviewStock') {
                currentItem.setOqtyInfo(Localization.resolve('aQtyId'));
                currentItem.setDetailOqtyInfoForTruck(Localization.resolve('aQtyId') + ' ' + currentItem.getTargetQuantity());
              } else {
                currentItem.setOqtyInfo(Localization.resolve('oQtyId') + ' ' + currentItem.getTargetQuantity());
              }


              //Assign values for Stock display
              if (me.getDocumentType() == 'TruckIvcTransferInward') {
                me.setInventoryBalanceOfItem(currentItem.getPKey());
              } else {
                currentItem.setIvcBalance(unitInformation.convertedValue);
              }
              currentItem.setIvcBalanceUnitType(unitInformation.orderUnitType);

              //Set values for free items.
              currentItem.setTargetQuantityForFreeItems(unitInformation.convertedValueForFreeItems);
              currentItem.setQuantityForFreeItems(unitInformation.convertedValueForFreeItems);
              currentItem.setOqtyInfoForFreeItems(Localization.resolve('FreeQtyId'));
              currentItem.setDetailOqtyForFreeItems(Localization.resolve('FreeQtyId') + ' ' + currentItem.getTargetQuantityForFreeItems());

            }
          } else if (me.getMode() === 'ReviewStock' && Utils.isDefined(unitInformation.convertedValue) && Utils.isDefined(unitInformation.orderUnitType) && unitInformation.convertedValue < 0) {

            if (currentItem.getQuantityLogisticUnit() == unitInformation.orderUnitType) {
              currentItem.setTargetQuantity(unitInformation.convertedValue);
              currentItem.setSuggestedQuantity(unitInformation.convertedValue);
              currentItem.setQuantity(unitInformation.convertedValue);
              diff = currentItem.getQuantity() - currentItem.getTargetQuantity();
              currentItem.setDifferenceInfo(Localization.resolve('DifferenceId') + ' ' + diff);
              currentItem.setOqtyInfo(Localization.resolve('aQtyId'));
              currentItem.setDetailOqtyInfoForTruck(Localization.resolve('aQtyId') + ' ' + currentItem.getTargetQuantity());

              //Assign values for Stock display
              if (me.getDocumentType() == 'TruckIvcTransferInward') {
                me.setInventoryBalanceOfItem(currentItem.getPKey());
              } else {
                currentItem.setIvcBalance(unitInformation.convertedValue);
              }
              currentItem.setIvcBalanceUnitType(unitInformation.orderUnitType);

              //Set values for free items.
              currentItem.setTargetQuantityForFreeItems(0);
              currentItem.setQuantityForFreeItems(0);
              currentItem.setOqtyInfoForFreeItems(Localization.resolve('FreeQtyId'));
              currentItem.setDetailOqtyForFreeItems(Localization.resolve('FreeQtyId') + ' ' + currentItem.getTargetQuantityForFreeItems());

            }
          }
          //check if there exists a rest
          if (Utils.isDefined(unitInformation.convertedValueRest) && unitInformation.convertedValueRest !== 0) {
            var difference;
            if (currentItem.getQuantityLogisticUnit() == unitInformation.IvcUnitType) {
              currentItem.setTargetQuantity(unitInformation.convertedValueRest);
              currentItem.setSuggestedQuantity(unitInformation.convertedValueRest);
              currentItem.setQuantity(unitInformation.convertedValueRest);
              difference = currentItem.getQuantity() - currentItem.getTargetQuantity();
              currentItem.setDifferenceInfo(Localization.resolve('DifferenceId') + ' ' + difference);

              if (me.getMode() === 'ReviewStock') {
                currentItem.setOqtyInfo(Localization.resolve('aQtyId'));
                currentItem.setDetailOqtyInfoForTruck(Localization.resolve('aQtyId') + ' ' + currentItem.getTargetQuantity());
              } else {
                currentItem.setOqtyInfo(Localization.resolve('oQtyId') + ' ' + currentItem.getTargetQuantity());
              }

            }

            //check if there exists a rest for free items
            if (Utils.isDefined(unitInformation.convertedValueRestForFreeItems) && unitInformation.convertedValueRestForFreeItems !== 0 && currentItem.getQuantityLogisticUnit() == unitInformation.IvcUnitType) {
              //Set values for free items.
              currentItem.setTargetQuantityForFreeItems(unitInformation.convertedValueRestForFreeItems);
              currentItem.setQuantityForFreeItems(unitInformation.convertedValueRestForFreeItems);
              currentItem.setOqtyInfoForFreeItems(Localization.resolve('FreeQtyId'));
              currentItem.setDetailOqtyForFreeItems(Localization.resolve('FreeQtyId') + ' ' + currentItem.getTargetQuantityForFreeItems());
            }
            //auf nested stock keeping unit setzen
          }
          if (Utils.isDefined(currentItem.getIvcInformationObject()) && Utils.isDefined(currentItem.getIvcInformationObject().unitInformation)) {
            currentItem.getIvcInformationObject().unitInformation = unitInformation;
          }
          currentItem.endEdit(true);
        }
      }
      me.getLoItems().endEdit();

      var jsonParamsForProductInfo = [];
      var jsonQueryForProductInfo = {};

      jsonParamsForProductInfo.push({ 'field': 'prdPKeyList', 'value': '\'' + prdMainPKeys.join('\',\'') + '\'' });

      jsonQueryForProductInfo.params = jsonParamsForProductInfo;

      return BoFactory.loadObjectByParamsAsync('LoProductInfoByPKeyList', jsonQueryForProductInfo);
    }).then(
    function (loProductInfoByPKeyList) {

      //####################################################
      //### Product Information for new truck load items ###
      //####################################################

      var truckLoadItems = me.getLoItems().getItemObjects();

      for (var j = 0; j < truckLoadItems.length; j++) {
        var currentPrdPKey = truckLoadItems[j].getPrdMainPKey();
        var currentProduct = loProductInfoByPKeyList.getItemByPKey(currentPrdPKey);

        if (Utils.isDefined(currentProduct)) {
          truckLoadItems[j].beginEdit();
          truckLoadItems[j].setText1(currentProduct.getText1());
          truckLoadItems[j].setPrdId(currentProduct.getPrdId());
          truckLoadItems[j].setEAN(currentProduct.getEAN());
          truckLoadItems[j].setObjectStatus(STATE.NEW | STATE.DIRTY);
          truckLoadItems[j].endEdit(true);
        }
      }

      me.getLoItems().orderBy({ 'prdId': 'ASC' });
    }
  );
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