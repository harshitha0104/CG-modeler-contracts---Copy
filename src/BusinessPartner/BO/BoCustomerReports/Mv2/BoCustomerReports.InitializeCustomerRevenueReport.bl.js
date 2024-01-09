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
 * @function initializeCustomerRevenueReport
 * @this BoCustomerReports
 * @kind businessobject
 * @namespace CORE
 * @param {Object} loCustomerSalesRevenue
 * @param {String} containerName
 */
function initializeCustomerRevenueReport(loCustomerSalesRevenue, containerName){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
if(!Utils.isDefined(me.getChartHelper()))
{
  return;
}

var chartHelper = me.getChartHelper();
var createToolTip = false;

// Get container and add title and chart container divs
var d3Container = chartHelper.getUIContainer(containerName, true);
var chartString = "chart_" + containerName;
var chartSelector = "#"+chartString;
chartHelper.addChartContainers(d3Container, containerName, "0", "1");

// Set title
var currentYear = parseInt(Utils.createDateToday().getUTCFullYear(), 10);
var prevYear = currentYear-1;
var title = Localization.resolve("Report_CustomerRevenue_Title") + " - " + prevYear + " " + Localization.resolve("Report_CustomerRevenue_Title_VS") + " " + currentYear;
chartHelper.setChartTitle(d3Container, title, containerName);

// Define attributes for chart
var currencySign = Localization.resolve("Report_CustomerRevenue_Currency");
var sizeJson = chartHelper.computeContainerSize(containerName, 0.70, 0.96);
var barColors = ['#f8bd19', '#008ee6'];
var colors = function (color, d) {
  return barColors[(d.id && d.id == currentYear) || d == currentYear ? 1 : 0];};

var monthArray = ["Report_CustomerRevenue_January_Tooltip", "Report_CustomerRevenue_February_Tooltip", "Report_CustomerRevenue_March_Tooltip", "Report_CustomerRevenue_April_Tooltip", "Report_CustomerRevenue_May_Tooltip",
                  "Report_CustomerRevenue_June_Tooltip", "Report_CustomerRevenue_July_Tooltip", "Report_CustomerRevenue_August_Tooltip", "Report_CustomerRevenue_September_Tooltip", "Report_CustomerRevenue_October_Tooltip",
                  "Report_CustomerRevenue_November_Tooltip", "Report_CustomerRevenue_December_Tooltip"];

// Create Chart
var chartReference = c3.generate({
  bindto : chartSelector,
  data : {
    columns : [
      [prevYear, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [currentYear, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    color : colors,
    type : 'bar',
    labels : false
  },
  bar : {
    width : {
      ratio : 0.8
    }
  },
  size: sizeJson,
  transition: {
    duration: 1000
  },
  axis : {
    rotated : false,
    x : {
      type : 'category',
      categories : [Localization.resolve("Report_CustomerRevenue_January"), Localization.resolve("Report_CustomerRevenue_February"),
                    Localization.resolve("Report_CustomerRevenue_March"), Localization.resolve("Report_CustomerRevenue_April"),
                    Localization.resolve("Report_CustomerRevenue_May"), Localization.resolve("Report_CustomerRevenue_June"),
                    Localization.resolve("Report_CustomerRevenue_July"), Localization.resolve("Report_CustomerRevenue_August"),
                    Localization.resolve("Report_CustomerRevenue_September"), Localization.resolve("Report_CustomerRevenue_October"),
                    Localization.resolve("Report_CustomerRevenue_November"), Localization.resolve("Report_CustomerRevenue_December")]
    },
    y : {
      padding : {
        top : 50,
        bottom : 0
      },
      show : true,
      tick : {
        format: function (d) {
          var number;
          var localizedValue;
          if(Utils.isDefined(d) && d>9999)
          {
            number = Math.floor(d/1000);
            localizedValue = Localization.localize(number, "number") + " " + Localization.resolve("ThousendSign_Chart");
          }
          else
          {
            number = d;
            localizedValue = Localization.localize(number, "number");
          }

          return currencySign + localizedValue;
        }
      },
      max: 1000
    }
  },
  grid : {
    y : {
      show : true
    }
  },
  legend: {
    show: false/*,
    item: {
      onclick: function (id) {        
        chartReference.toggle(id);

        var svg = d3.select(chartSelector);
        var text = svg.selectAll("text");
        text.style("font-size", "1.2em");         
		text.style("font-family", "Helvetica Neue, Roboto, Segoe UI, sans-serif");
      }
    }*/
  },
  tooltip : {        format: {
    title: function (d) { return Localization.resolve(monthArray[d]); },
    value: function (value, ratio, id) {				
      var localizedValue = Localization.localize(value.toFixed(2), "number");
      createToolTip = true;
      return currencySign + localizedValue;
    }
  },
             contents : this.getChartHelper().getStyledTooltipFunction()
            }
});


// custom legend

var legend = d3Container.select('#colorContainer').insert('div', '.chart').attr("id", "legendDiv").attr('align', 'center').append("svg").attr('class', 'legend').attr('width', '360').attr('height', '100').append('g').attr('align', 'center');

var rects = legend.selectAll('rect')
.data([{id: prevYear.toString()},  {id: currentYear.toString()}])
.enter()
.append("rect")
.attr("x",function(d, i){ return i == 1 ? 180 + 52 : 152;})
.attr("y", function(d, i){ return 10;})
.attr("width", "1em")
.attr("height", "1em")
.style("fill", function(id) {return chartReference.color(id.id);})
.on('mouseover', function (id) {  chartReference.focus(id.id);})
.on('mouseout', function (id) {  chartReference.revert();

                              })
.on('click', function (id) {  chartReference.toggle(id.id);
                            var svg = d3.select(chartSelector);
                            var text = svg.selectAll("text");
                            text.style("font-size", "1.2em");
                            text.style("font-family", "Helvetica Neue, Roboto, Segoe UI, sans-serif");

                            if(!Utils.isDefined(chartHelper))
                            {
                              return;
                            }
                            var d3Container = chartHelper.getUIContainer(containerName);
                            var chartDiv = d3Container.select(chartSelector);
                            var eventRect = chartDiv.selectAll(".c3-event-rect");

                            eventRect.on('mouseout', function(elem)
                                         { 
                            });
                           });

var texts = legend.selectAll('text')
.data([{id: prevYear.toString()},  {id: currentYear.toString()}])
.enter()
.append("text")
.attr("x",function(d, i){ return i == 1 ? 180 + 10 : 110;})
.attr("y", function(d, i){ return 27;})
.text(function(id) {  return id.id;})
.on('mouseover', function (id) {  chartReference.focus(id.id);})
.on('mouseout', function (id) {  chartReference.revert();})
.on('click', function (id) {  chartReference.toggle(id.id);
                            var svg = d3.select(chartSelector);
                            var text = svg.selectAll("text");
                            text.style("font-size", "1.2em");
                            text.style("font-family", "Helvetica Neue, Roboto, Segoe UI, sans-serif");

                            if(!Utils.isDefined(chartHelper))
                            {
                              return;
                            }

                            var d3Container = chartHelper.getUIContainer(containerName);
                            var chartDiv = d3Container.select(chartSelector);
                            var eventRect = chartDiv.selectAll(".c3-event-rect");

                            eventRect.on('mouseout', function(elem)
                                         { 
                            });
                           });



chartHelper.setAxisDefaultColor();
chartHelper.addChartToStorage(containerName, chartReference);

var d3Cont = chartHelper.getUIContainer(containerName);

var colorContainer = d3Cont.select("#colorContainer");
colorContainer.on('click', function(){
  if(Utils.isApple())
  {
    chartReference.internal.hideTooltip();
  }
  else
  {
    if(!createToolTip)
    {
      chartReference.internal.hideTooltip();
    }
    createToolTip=false;
  }
});

// update text sizes
var svg = d3.select(chartSelector);
var text = svg.selectAll("text");
text.style("font-size", "1.2em");
text.style("font-family", "Helvetica Neue, Roboto, Segoe UI, sans-serif");

// Set background to white
chartHelper.setChartBackgroundDefaultColor(chartSelector, "100%");


setTimeout(function () {
  // center vertically
  me.centerVerticallyCustomerRevenueReport(containerName);

}, 100);


// Fade in animation
setTimeout(function () {
  me.inputChangedForCustomerRevenueReport(loCustomerSalesRevenue,containerName);
}, 500);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}