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
 * @function convertIvcMeasureToOrderUnit
 * @this LoUnitFactorsForProductList
 * @kind listobject
 * @namespace CORE
 * @param {DomPKey} productPKey
 * @param {DomIvcMeasure} ivcMeasure
 * @param {DomDecimal} balance
 * @param {DomDecimal} freeItemBalance
 * @param {DomIvcMetaType} metaId
 * @param {DomString} mode
 * @returns result
 */
function convertIvcMeasureToOrderUnit(productPKey, ivcMeasure, balance, freeItemBalance, metaId, mode){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var result = {};
var relevantItems = me.getItemsByParam({
  "productPKey" : productPKey
});

//find order unit informations
for (var i = 0; i < relevantItems.length; i++) {
  if (relevantItems[i].getIsOrderUnit() == "1") {
    result.orderUnitType = relevantItems[i].getUnitType();
    result.orderUnitPiecesPerSmallestUnit = relevantItems[i].getPiecesPerSmallestUnit();
  }

  //Determine unit information of ivcMeasure
  if (ivcMeasure == "QtyCUnit" && relevantItems[i].getIsConsumerUnit() == "1") {
    result.IvcUnitType = relevantItems[i].getUnitType();
    result.IvcUnitPiecesPerSmallestUnit = relevantItems[i].getPiecesPerSmallestUnit();
  } else if (ivcMeasure == "QtyOUnit" && relevantItems[i].getIsOrderUnit() == "1") {
    result.IvcUnitType = relevantItems[i].getUnitType();
    result.IvcUnitPiecesPerSmallestUnit = relevantItems[i].getPiecesPerSmallestUnit();
  } else if (ivcMeasure == "QtyIUnit" && relevantItems[i].getIsStocktakingUnit() == "1") {
    result.IvcUnitType = relevantItems[i].getUnitType();
    result.IvcUnitPiecesPerSmallestUnit = relevantItems[i].getPiecesPerSmallestUnit();
  }

  //Determine Smallest Unit
  if (relevantItems[i].getPiecesPerSmallestUnit() == 1) {
    result.smallestUnitType = relevantItems[i].getUnitType();
  }

} //end of for


//Convert value for truck inventory balance
var balanceInSmallestUnit = balance * result.IvcUnitPiecesPerSmallestUnit;
result.convertedValue = Math.floor(balanceInSmallestUnit / result.orderUnitPiecesPerSmallestUnit);


if(result.convertedValue * result.orderUnitPiecesPerSmallestUnit < balanceInSmallestUnit){

  result.convertedValueRest = (balanceInSmallestUnit - (result.convertedValue * result.orderUnitPiecesPerSmallestUnit)) / result.IvcUnitPiecesPerSmallestUnit;
}

if(mode === "ReviewStock"){
  // Convert value for free item balnce
  if (!Utils.isDefined(freeItemBalance)){
    //Initialize freeItemBalance
    freeItemBalance = 0;
  }

  //If truck has a damaged item ,set free item balance = 0
  if(metaId === "Unsalable"){
    freeItemBalance = 0 ;
  }
  else{
    freeItemBalance = balanceInSmallestUnit - freeItemBalance;
  }

  //If free item value is negative then set it to zero.
  if(freeItemBalance < 0){
    freeItemBalance = 0 ;
  }

  result.convertedValueForFreeItems = Math.floor(freeItemBalance / result.orderUnitPiecesPerSmallestUnit);

  if(result.convertedValueForFreeItems * result.orderUnitPiecesPerSmallestUnit < freeItemBalance){
    result.convertedValueRestForFreeItems = (freeItemBalance - (result.convertedValueForFreeItems * result.orderUnitPiecesPerSmallestUnit)) / result.IvcUnitPiecesPerSmallestUnit;
  }
}


/*Example:
Inventory is hold in consumerUnit
ConsumerUnit                         1      piece per smalles unit
SalesUnit		isConsumerUnit       12     pieces oer smalles unit		6 ordered
Layer			isOrderUnit          144    pieces per smalles unit
Converting 6 SalesUnit (72 pieces per smallest) into orderUnit is not possible because 6 salesUnits are less than 1 consumer unit
So we have to convert into the inventory unit which is the consumerUnit which is in our case the SalesUnit ;-)
*/

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return result;
}