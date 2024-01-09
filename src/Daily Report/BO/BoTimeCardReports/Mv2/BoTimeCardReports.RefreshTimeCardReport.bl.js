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
 * @function refreshTimeCardReport
 * @this BoTimeCardReports
 * @kind businessobject
 * @namespace CORE
 * @param {String} containerName
 * @param {String} team
 */
function refreshTimeCardReport(containerName, team){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var chartHelper = me.getChartHelper();
var d3Container = chartHelper.getUIContainer(containerName, false);
var chart = me.getChartHelper().getChartFromStorage(containerName);
var chartString = "chart_" + containerName;
var chartSelector = "#" + chartString;
var title;

// Set title
if(team == "1"){
  title = Localization.resolve("Report_TimeCard_Title_Team");
}
else{
  title = Localization.resolve("Report_TimeCard_Title");
}

chartHelper.setChartTitle(d3Container, title, containerName);

// Compute ratio
var dimensions = chartHelper.computeContainerSize(containerName, 1, 1);
var isPortraitMode = dimensions.height > dimensions.width;
// custom legend
var legendDiv = d3Container.selectAll(".legendDiv");
var legendSvg = legendDiv.select("svg");
var legendGroup = legendSvg.select("g");

if(isPortraitMode){
  if(Utils.isPhone()){
    legendDiv.style("height", "40%").style("width", "100%").style("left", "0px").style("top", "60%");
  }
  else{
    legendDiv.style("height", "45%").style("width", "100%").style("left", "0px").style("top", "55%");
  }
}
else{
  legendDiv.style("height", "100%").style("width", "50%").style("left", "50%").style("top", "0px");
}
legendSvg.style("height", "100%").style("width", "100%");


var processNewSizes = function(){
  // Define attributes for chart
  var sizeJson;
  if(isPortraitMode){
    if(Utils.isPhone()){
      sizeJson = chartHelper.computeContainerSize(containerName, 0.40, 1);
    }
    else{
      sizeJson = chartHelper.computeContainerSize(containerName, 0.5, 1);
    }
  }
  else{
    sizeJson = chartHelper.computeContainerSize(containerName, 0.8, 0.5);
  }
  chart.resize(sizeJson);

  //positioning of legend
  if(Utils.isPhone()){
    legendGroup.attr("transform", "scale(0.68)");
  }

  var legendGroupWidth = legendGroup.node().getBoundingClientRect().width;
  var legendGroupHeight = legendGroup.node().getBoundingClientRect().height;
  var legendSvgWidth = legendSvg.node().getBoundingClientRect().width;
  var legendSvgHeight = legendSvg.node().getBoundingClientRect().height;

  if(Utils.isPhone()){
    legendGroup.attr("transform", "translate(" + (legendSvgWidth-legendGroupWidth)*0.5 +","+ (legendSvgHeight-legendGroupHeight)*0.5 +") scale(0.68)");
  }
  else{
    legendGroup.attr("transform", "translate(" + (legendSvgWidth-legendGroupWidth)*0.5 +","+ (legendSvgHeight-legendGroupHeight)*0.5 +")"); 
  }

  if(!Utils.isPhone()){
    var arcs = d3Container.selectAll(".c3-chart-arcs");
    var texts = arcs.selectAll("text");
    texts.style("font-size", "1.5em");
  }
};

var svg = d3Container.select(chartSelector);
var text = svg.selectAll("text");
text.style("font-size", "1.4em");
text.style("font-family", "Helvetica Neue, Roboto, Segoe UI, sans-serif");

setTimeout(function(){
  processNewSizes();
}, 100);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}