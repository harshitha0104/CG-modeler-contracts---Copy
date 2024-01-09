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
 * @function addMissingUoMsForAllItems
 * @this BoOrder
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {LoOrderItems} loItems
 * @param {Object} items
 * @returns promise
 */
function addMissingUoMsForAllItems(loItems, items){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
// OBSOLETE!! - No longer called by core if useMergeEngine is set to false
var promise = when.resolve();
var deferreds = [];
var prdMainPKeyDict = Utils.createDictionary();
var itemDict = Utils.createDictionary();

// Build dictionary to store item metas information
var itemMetaDict = Utils.createDictionary();

// Build dictionary for uOMs to store the information based on referencePKey and sdoParentItemPKey which is handed over to the function LoOrderItems.addItemUoMsToList
var uOMsDict = Utils.createDictionary();
var logisticCategory;
var prdArr;
var itemArr;
var j;
var i;

if(me.getIsCancel() !== "1") {
  var itemMetas = me.getBoOrderMeta().getLoOrderItemMetas().getAllItems();
  for(j = 0; j < itemMetas.length; j++) {
    itemMetaDict.add(itemMetas[j].getPKey(), itemMetas[j]);
  }

  /*In this loop were are building two dictionaries - First one from logistic category to all items of that category
    Second one from logistic category to a dictionary, matching refPKeys to items*/

  for(i = 0; i < items.length; i++) {
    var itemMeta = itemMetaDict.get(items[i].getSdoItemMetaPKey());
    if (Utils.isDefined(itemMeta)) {
      logisticCategory = itemMeta.getLogisticCategory();
    }
    else {
      logisticCategory = " ";
    }

    if(!itemDict.containsKey(logisticCategory)) {
      prdMainPKeyDict.add(logisticCategory, []);
      itemDict.add(logisticCategory, Utils.createDictionary());
    }

    prdArr = prdMainPKeyDict.get(logisticCategory);
    itemArr = itemDict.get(logisticCategory);
    prdArr.push(items[i].getPrdMainPKey());

    if (!itemArr.containsKey(items[i].getRefPKey()) || items[i].getIsOrderUnit() == "1") {
      itemArr.add(items[i].getRefPKey(), items[i]);
    }

    var uomPKey = items[i].getRefPKey().trim() + items[i].getSdoParentItemPKey().trim();
    if (!uOMsDict.containsKey(uomPKey)) {
      uOMsDict.add(uomPKey, []);
    }

    var uomItem = uOMsDict.get(uomPKey);
    uomItem.push(items[i]);
  }

  //For each logistic category, load for all its items the complete uom information from the database
  var keys = prdMainPKeyDict.keys();
  for(i = 0; i < keys.length; i++) {
    deferreds.push(loItems.createCombinedUoMList(prdMainPKeyDict.get(keys[i]), keys[i]));
  }

  /*for each item (the two loops are running over distinct items -> linear runtime) we are adding all the missing UoMs
  this happens by calling loItems.addItemUoMsToList(mainItem, allLogistics, uoMs);*/

  promise = when.all(deferreds).then(
    function(results) {
      var uoMs = [];
      for(i=0; i < results.length; i++) {
        var mainItemsForCategory = itemDict.get(results[i].category);
        var itemKeys = mainItemsForCategory.keys();

        for(j=0; j < itemKeys.length; j++) {
          var mainItem = mainItemsForCategory.get(itemKeys[j]);
          //WORKAROUND: setting IsOrderUnit and sort without having to select the logistic units again. We should check if this can be done in a datasource.
          var allLogistics = results[i].units.get(mainItem.getPrdMainPKey());
          var currentLogisticUnit = allLogistics.filter(function(i) {return i.getUnitType() == mainItem.getQuantityLogisticUnit();});
          if (currentLogisticUnit.length > 0) {
            mainItem.setIsOrderUnit(currentLogisticUnit[0].isOrderUnit);
            mainItem.setSort(currentLogisticUnit[0].sort);
          }
          //WORKAROUND END
          if (Utils.isEmptyString(mainItem.getRewardPKey())) {
            var currentUomPKey = mainItem.getRefPKey().trim() + mainItem.getSdoParentItemPKey().trim();
            var unitOfMeasureItems = uOMsDict.get(currentUomPKey);
            loItems.addItemUoMsToList(mainItem, allLogistics, uoMs, unitOfMeasureItems);
          }
        }
      }
      loItems.addItems(uoMs);
    });
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}