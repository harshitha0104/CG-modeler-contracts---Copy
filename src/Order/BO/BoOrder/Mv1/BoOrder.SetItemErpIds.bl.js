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
 * @function setItemErpIds
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 */
function setItemErpIds(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
function nonZeroQuantity(item){
  return item.getSaveZeroQuantity() !== '0' || item.getQuantity().toString() !== '0';
}
function isValidErpId(erpId){
  return Utils.isDefined(erpId) && !Utils.isEmptyString(erpId) && !erpId.startsWith("Local_");
}

var orderItems = me.getLoItems().getAllItems();
var filteredItems = orderItems.filter(nonZeroQuantity);

//dictionary for tracking the current ids
var dict = {};
dict[me.getPKey()] = 80000;
//determine new start erpid
// highest erpid of a parent item + 10
var currentParentErpId = 0;
var i;
var id;
var currentItem;
var parentPKey;

for(i = 0; i < filteredItems.length; i++){
  currentItem = filteredItems[i];
  parentPKey = currentItem.getSdoParentItemPKey();
  id = currentItem.getErpId();

  if (Utils.isSfBackend() && currentItem.parentType === "Order"){
    parentPKey = me.pKey;
  }
  if(parentPKey === ' ' && isValidErpId(id) && parseInt(id, 10) > currentParentErpId){
    currentParentErpId = parseInt(id, 10);
    dict[currentItem.getPKey()] = parseInt(id, 10);
  }
}

currentParentErpId = currentParentErpId + 10;

//set ids for parent Items
for(i = 0; i < filteredItems.length; i++){
  currentItem = filteredItems[i];
  parentPKey = currentItem.getSdoParentItemPKey();
  id = currentItem.getErpId();

  if (Utils.isSfBackend() && currentItem.parentType === "Order"){
    parentPKey = me.pKey;
  }
  if(parentPKey === ' ' && ( !isValidErpId(id) || id === '0')){
    currentItem.setErpId(currentParentErpId.toString());
    dict[currentItem.getPKey()] = currentParentErpId;
    currentParentErpId = currentParentErpId + 10;
  }
}

//determine max ids of all parents
for(i = 0; i < filteredItems.length; i++){
  currentItem = filteredItems[i];
  parentPKey = currentItem.getSdoParentItemPKey();
  id = currentItem.getErpId();

  if (Utils.isSfBackend() && currentItem.parentType === "Order"){
    parentPKey = me.pKey;
  }
  if(parentPKey !== ' ' && isValidErpId(id) && parseInt(id, 10) > 0){
    if(dict[parentPKey]){
      if(parseInt(id, 10) > dict[parentPKey]){
        dict[parentPKey] = parseInt(id, 10);
      }
    }
    else{
      dict[parentPKey] = parseInt(id, 10);
    }
  }
}

//set ids for childs
for(i = 0; i < filteredItems.length; i++){
  currentItem = filteredItems[i];
  parentPKey = currentItem.getSdoParentItemPKey();
  id = currentItem.getErpId();

  if (Utils.isSfBackend() && currentItem.parentType === "Order"){
    parentPKey = me.pKey;
  }
  if(parentPKey !== ' ' && ( !isValidErpId(id) || id === '0')){
    if(dict[parentPKey]){
      var newId = dict[parentPKey] + 1;
      currentItem.setErpId(newId.toString());
      dict[parentPKey] = newId;
    }
  }
}

//set ErpIDs for LoSdoCondition
if(Utils.isDefined(me.getLoSdoConditions())){
  var sdoConditions =  me.getLoSdoConditions().getItems();
  for(i = 0; i < sdoConditions.length; i++){
    var currentSdoCondition = sdoConditions[i];
    if(Utils.isDefined(me.getLoItems().getItemByPKey(currentSdoCondition.sdoItemPKey))){
      currentSdoCondition.sdoItemErpId = me.getLoItems().getItemByPKey(currentSdoCondition.sdoItemPKey).getErpId();
    }
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}