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
 * @function addChartContainers
 * @this BoChartHelper
 * @kind businessobject
 * @namespace CORE
 * @param {Object} d3Container
 * @param {String} parentName
 * @param {String} addHeader
 * @param {String} addTitle
 * @param {String} color
 */
function addChartContainers(d3Container, parentName, addHeader, addTitle, color){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var mainContainer = d3Container;
var mainDiv;

if(Utils.isDefined(color)) {
    mainContainer = d3Container.append("div").attr("id", "colorContainer").style("height", "100%").style("width", "100%");
	mainDiv = mainContainer[0][0];
	mainDiv.style.backgroundColor = color;
}
else {
    mainContainer = d3Container.append("div").attr("id", "colorContainer").style("height", "100%").style("width", "100%");
	mainDiv = mainContainer[0][0];
	mainDiv.style.backgroundColor = "#e5e5e5";
}

mainContainer.on("click", function() {
me.hideChartToolTip(parentName);
});

if(addTitle == "1") {
  var titleElem = "chartTitle_" + parentName;
  var titleSelector = "#"+titleElem;
  mainContainer.append("div").attr("id", "titleDiv").append("svg").attr("id",titleElem);
  d3.select(titleSelector).append("text");
}

if(addHeader == "1") {
  var header = mainContainer.append("div").attr("id", "header");
}

var chartElem = "chart_" + parentName;
var chartDiv = mainContainer.append("div").attr("id",chartElem).style("height", "100%").style("width", "100%");

chartDiv.on("click", function() {
me.hideChartToolTip(parentName);
});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}