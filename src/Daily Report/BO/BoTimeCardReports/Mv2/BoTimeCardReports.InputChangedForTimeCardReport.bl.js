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
 * @function inputChangedForTimeCardReport
 * @this BoTimeCardReports
 * @kind businessobject
 * @namespace CORE
 * @param {Object} timeEntryData
 * @param {String} containerName
 * @param {String} dataIndex
 * @param {String} userName
 * @param {String} team
 * @param {String} startDate
 * @param {String} endDate
 * @param {Object} loActivityItem
 */
function inputChangedForTimeCardReport(timeEntryData, containerName, dataIndex, userName, team, startDate, endDate, loActivityItem){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var chart = me.getChartHelper().getChartFromStorage(containerName);
var chartString = "chart_" + containerName;
var chartSelector = "#" + chartString;
var d3Container = me.getChartHelper().getUIContainer(containerName);

if (Utils.isDefined(chart)) {
  var jsonData = me.prepareDataForTimeCardReport(timeEntryData, userName, team, startDate, endDate, loActivityItem);

  if(jsonData.noDataAvailable == "1") {
    return;
  }
  
  chart.load({
    columns: [jsonData.data.columns[dataIndex]]
  });
  
  chart.revert();
}

if(!Utils.isPhone()) {
  var arcs = d3Container.selectAll(".c3-chart-arcs");
  var texts = arcs.selectAll("text");
  texts.style("font-size", "1.5em");
}

if(Utils.isPhone()) {
  var chartCont = d3Container.selectAll("#chart_Reporting_TimeCardReportContainer").select("svg");
  var pieCont = d3Container.selectAll(".c3-chart-arcs");
  var chartWidth = chartCont.node().getBoundingClientRect().width;
  var chartHeight = chartCont.node().getBoundingClientRect().height;
  pieCont.attr("transform", "translate(" + (chartWidth*0.5) +","+ (chartHeight*0.5) +")");
}

var svg = d3Container.select(chartSelector);
var text = svg.selectAll("text");
text.style("font-family", "Helvetica Neue, Roboto, Segoe UI, sans-serif");

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}