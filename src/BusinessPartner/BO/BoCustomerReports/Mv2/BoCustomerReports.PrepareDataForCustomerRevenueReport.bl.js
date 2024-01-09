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
 * @function prepareDataForCustomerRevenueReport
 * @this BoCustomerReports
 * @kind businessobject
 * @namespace CORE
 * @param {Object} loCustomerSalesRevenue
 * @returns jsonData
 */
function prepareDataForCustomerRevenueReport(loCustomerSalesRevenue){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var resultPrevYear = [0,0,0,0,0,0,0,0,0,0,0,0];
var resultCurrYear = [0,0,0,0,0,0,0,0,0,0,0,0];
var maxValue1 = 0;
var maxValue2 = 0;
var currentYear = parseInt(Utils.createDateToday().getUTCFullYear(), 10);
var prevYear = currentYear - 1;

if(Utils.isDefined(loCustomerSalesRevenue)) {
  var items = loCustomerSalesRevenue.getAllItems();
  var index = 0;
  var length = items.length;
  var itemIndex = 0;

  for(;index<length;index++) {
    var currentItem = items[index]; 
    itemIndex = currentItem.getMonth() - 1;

    if(currentItem.getYear() == currentYear) {
      resultCurrYear[itemIndex] = currentItem.getNetSales();
    }
    else {
      resultPrevYear[itemIndex] = currentItem.getNetSales();
    }
  }

  //DEMO HACK BEGIN
  //HIDE REST OF CURRENT YEAR
  var monthIndex = Utils.createDateToday().getUTCMonth() + 1;
  for( ;monthIndex<12;monthIndex++) {
    resultCurrYear[monthIndex] = 0;
  }
  //DEMO HACK END

  maxValue1 = resultPrevYear.reduce(function (p, v) {
    return (p > v ? p : v);
  });
  maxValue2 = resultCurrYear.reduce(function (p, v) {
    return (p > v ? p : v);
  });
}
maxValue1 = Math.max(maxValue1, maxValue2);

var axisMax = Math.max(Math.ceil(maxValue1 * 1.1), 1000);

resultPrevYear = [prevYear].concat(resultPrevYear);
resultCurrYear = [currentYear].concat(resultCurrYear);

var jsonData = {
  "data" : {
    columns : [resultPrevYear, resultCurrYear]
  },
  "axisRange" : {
    "max" : {
      "y" : axisMax
    }
  }
};

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return jsonData;
}