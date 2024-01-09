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
 * @function createDisplayInformationForUoMItem
 * @this LoOrderItems
 * @kind listobject
 * @namespace CORE
 * @param {Object} unitOfMeasureItem
 * @param {Object} orderMeta
 * @returns info
 */
function createDisplayInformationForUoMItem(unitOfMeasureItem, orderMeta){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var info =
    {
      oQtyString: " ",
      unitInformation: ""
    };

var unitDescription = Utils.getToggleText("DomPrdLogisticUnit", unitOfMeasureItem.getQuantityLogisticUnit());
var quantityLogisticUnit;

if((unitDescription == "SalesUnit") || (unitDescription == "Sales Unit"))
{
  unitDescription = "SUnit";
  info.logicUnitsforDisplay = "Sales Unit";
}
else if((unitDescription == "ConsumerUnit") || (unitDescription == "Consumer Unit"))
{
  unitDescription = "CUnit";
  info.logicUnitsforDisplay = "Consumer Unit";
}
else {
info.logicUnitsforDisplay = unitDescription;
}

// For Order only show the actual quantity and for deliveries show both ordered and actual
if (orderMeta.getSdoSubType() === "Delivery") {
  if (orderMeta.getConsiderQuantitySuggestion() === "PQty") {
    info.unitInformation = unitOfMeasureItem.getTargetQuantity() + "/" + unitOfMeasureItem.getQuantity() + " " + unitDescription;
    info.oQtyString = Localization.resolve("OQtyLabel") + ": " + unitOfMeasureItem.getTargetQuantity();
  }
  else {
    if ((orderMeta.getConsiderQuantitySuggestion() === "LQty" || orderMeta.getConsiderQuantitySuggestion() === "UserExit") && unitOfMeasureItem.getOQtyString() != " ") {
      info.unitInformation = unitOfMeasureItem.getQuantity() + " " + unitDescription;
      info.oQtyString = unitOfMeasureItem.getOQtyString();	
    }
    else {
      info.unitInformation = unitOfMeasureItem.getQuantity() + " " + unitDescription;	
    }
  }
}
else {
  var suggestedQuantity = unitOfMeasureItem.getTargetQuantity();
  if(unitOfMeasureItem.getOQtyString() === " ") {
    info.unitInformation = unitOfMeasureItem.getQuantity() + " " + unitDescription;
  }
  else {
    info.unitInformation = unitOfMeasureItem.getQuantity() + " " + unitDescription;
    info.oQtyString = unitOfMeasureItem.getOQtyString();
  }
}

if(unitOfMeasureItem.getSpecialPromoted() == "1"){
  if(unitOfMeasureItem.getIsOrderUnit() == "1"){
    info.oQtyString = "Suggested Qty: "+ unitOfMeasureItem.getSpecialQuantity();
    info.specialPromotionIcon = "SpecialQuantity";
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return info;
}