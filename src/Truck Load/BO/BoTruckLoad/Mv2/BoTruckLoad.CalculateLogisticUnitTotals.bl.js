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
 * @function calculateLogisticUnitTotals
 * @this BoTruckLoad
 * @kind businessobject
 * @namespace CORE
 */
function calculateLogisticUnitTotals(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var dicHeaderSums = Utils.createDictionary();
var itemMetas = me.getBoOrderMeta().getItemMetaJsonDictionary();
var mainItems = me.getLoItems().getAllItems();
var currentKey;
var mainItem;
var i;
var li;

//calculate totals
for (i = 0; i < mainItems.length; i++){
  mainItem = mainItems[i];

  if((!Utils.isDefined(mainItem.getQuantity()) || mainItem.getQuantity() === 0) && mainItem.getTargetQuantity() === 0){
    continue;
  }

  currentKey = mainItem.getQuantityLogisticUnit() + mainItem.getSdoItemMetaPKey();
  if (dicHeaderSums.containsKey(currentKey)){
    //unit already available --> update
    li = dicHeaderSums.get(currentKey);
    li.quantity = li.quantity + mainItem.getQuantity();
    li.targetQuantity = li.targetQuantity + mainItem.getTargetQuantity();
    li.qtyDifference = li.quantity - li.targetQuantity;
  }
  else{
    //unit not available --> create
    li = {
      "pKey" : PKey.next(),
      "quantityLogisticUnit" : mainItem.getQuantityLogisticUnit(),
      "quantity" : mainItem.getQuantity(),
      "targetQuantity" : mainItem.getTargetQuantity(),
      "qtyDifference" : mainItem.getQuantity() - mainItem.getTargetQuantity(),
      "sort" : Utils.getToggleSortOrder("DomPrdLogisticUnit", mainItem.getQuantityLogisticUnit()),
      "itemMetaText" : itemMetas.get(mainItems[i].getSdoItemMetaPKey()).text
    };

    dicHeaderSums.add(currentKey, li);
  }
}

//set exclamation mark if needed and add to LoQuantitySums
me.setLoQuantitySums(BoFactory.instantiate("LoQuantitySums", {}	));

var loQtySums = me.getLoQuantitySums();
var dicKeys = dicHeaderSums.keys();
var currentDicEntry;
var qtySums = [];

for (i = 0; i < dicKeys.length; i++){
  currentDicEntry = dicHeaderSums.get(dicKeys[i]);
  if (Utils.isDefined(currentDicEntry)){
    if (currentDicEntry.qtyDifference === 0){
      currentDicEntry.differenceExist = 'EmptyImage';
    }
    else{
      currentDicEntry.differenceExist = 'PrioHigh24';
    }
    qtySums.push(currentDicEntry);
  }
}

loQtySums.addListItems(qtySums);
loQtySums.orderBy({
  "itemMetaText" : "ASC",
  "sort" : "DESC"
});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}