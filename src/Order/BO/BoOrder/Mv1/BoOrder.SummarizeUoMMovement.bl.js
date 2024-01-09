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
 * @function summarizeUoMMovement
 * @this BoOrder
 * @kind businessobject
 * @namespace CORE
 * @param {Object} shipmentList
 * @param {Object} OrderItemMetaList
 * @param {Object} uomToggle
 */
function summarizeUoMMovement(shipmentList, OrderItemMetaList, uomToggle){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var items = me.getLoItems().getAllItems();
var length = items.length;
var dicIn = Utils.createDictionary();
var dicOut = Utils.createDictionary();
var index;

for(index = 0; index < length; index++) {
  var item = items[index];
  if(item.getQuantity() > 0) {
    var sdoItemMetaPkey = item.getSdoItemMetaPKey();
    var itemMeta = OrderItemMetaList.getItemByPKey(sdoItemMetaPkey);
    if(Utils.isDefined(itemMeta)) {
      var md = itemMeta.getMovementDirection();
      var quantity = item.getQuantity();
      var uom = Utils.getToggleText("DomPrdLogisticUnit", item.getQuantityLogisticUnit());
      if(md === "In") {
        if(!dicIn.containsKey(uom)) {
          dicIn.add(uom, 0);
        }
        dicIn.data[uom] = dicIn.data[uom] + quantity;
      }
      else if(md === "Out") {
        if(!dicOut.containsKey(uom)) {
          dicOut.add(uom, 0);
        }
        dicOut.data[uom] = dicOut.data[uom] + quantity;
      }
    }
  }
}

var quantityIn = 0;
var quantityOut = 0;
length = dicIn.keys().length;
var uoms = dicIn.keys();
var currentUom;
var parameters;
var toggleEntry;
var order;
var li;

for(index = 0; index < length; index++) {
  currentUom = uoms[index];
  quantityIn = dicIn.data[currentUom];
  quantityOut = 0;
  if(dicOut.containsKey(currentUom)) {
    quantityOut = dicOut.data[currentUom];
  }
  parameters = {"text":currentUom};
  toggleEntry = uomToggle.getItemsByParam(parameters);
  order = 0;
  if(toggleEntry.length > 0) {
    order = toggleEntry[0].getSortOrder();
  }

  li = {
    "unit": currentUom,
    "quantityIn": quantityIn,
    "quantityOut": quantityOut,
    "order" : order
  };
  shipmentList.addListItems([li]);
}

length = dicOut.keys().length;
var uoms = dicOut.keys();

for(index = 0; index < length; index++) {
  currentUom = uoms[index];
  if(dicIn.containsKey(currentUom)) {
    continue;
  }

  quantityOut = dicOut.data[currentUom];
  quantityIn = 0;
  parameters = {"text":currentUom};
  toggleEntry = uomToggle.getItemsByParam(parameters);
  order = 0;
  if(toggleEntry.length > 0) {
    order = toggleEntry[0].getSortOrder();
  }

  li = {
    "unit": currentUom,
    "quantityIn": quantityIn,
    "quantityOut": quantityOut,
    "order" : order
  };
  shipmentList.addListItems([li]);
}

shipmentList.orderBy({ "order" : "DESC" });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}