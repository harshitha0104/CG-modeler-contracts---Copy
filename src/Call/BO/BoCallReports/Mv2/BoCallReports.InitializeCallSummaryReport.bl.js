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
 * @function initializeCallSummaryReport
 * @this BoCallReports
 * @kind businessobject
 * @namespace CORE
 * @param {Object} storedSurveyData
 * @param {Object} updatedSurveyData
 * @param {String} containerName
 */
function initializeCallSummaryReport(storedSurveyData, updatedSurveyData, containerName){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var chartHelper = me.getChartHelper();
// Get container and add title and chart container divs
var d3Container = chartHelper.getUIContainer(containerName, true);
var chartString = "chart_" + containerName;
var chartSelector = "#" + chartString;
chartHelper.addChartContainers(d3Container, containerName, "0", "1");

// Set title
chartHelper.setChartTitle(d3Container, Localization.resolve("Report_CallSummary_Title"), containerName);

// Define attributes for chart
var barColors = ['#008ee4', '#9b59b6', '#6baa01', '#e44a00'];
var sizeJson = chartHelper.computeContainerSize(containerName, 0.80, 0.96);

var chartReference = c3.generate({
  bindto : chartSelector,
  data : {
    columns : [
      ['surveyExceptions', 0.03, 0.03, 0.03, 0.03]
    ],
    names : {
      surveyExceptions : Localization.resolve("Report_CallSummary_NoExceptions")
    },
    color : function (color, d) {
      return barColors[d.index];
    },
    type : 'bar',
    labels : {
      show : true,
      format : function (v, id, i, j) { return Math.floor(v);}
    }
  },
  bar : {
    width : {
      ratio : 0.7
    }
  },
  size : sizeJson,
  axis : {
    rotated : true,
    x : {
      type : 'category',
      categories : [Localization.resolve("Report_CallSummary_Distributed"), Localization.resolve("Report_CallSummary_OutOfStock"),
                    Localization.resolve("Report_CallSummary_Facings"), Localization.resolve("Report_CallSummary_Price")],

    },
    y : {
      padding : {
        top : 0,
        bottom : 0
      },
      show : false,
      max: 6
    }
  },
  grid : {
    y: {
      lines: [
        {value: 1},
        {value: 2},
        {value: 3},
        {value: 4},
        {value: 5}
      ]
    },
    x : {
      show : false
    },
    lines : {
      front : false
    }
  },
  legend : {
    show : false
  },
  tooltip : {
    format: {
      value: function (v, id, i, j) { return Math.floor(v);}
    },
    contents : me.getChartHelper().getStyledTooltipFunction()
  }
});

var svg = d3.select(chartSelector);
var text = svg.selectAll("text");
text.style("font-size", "1.2em");
text.style("font-family", "Helvetica Neue, Roboto, Segoe UI, sans-serif");

me.getChartHelper().setAxisDefaultColor();
me.getChartHelper().addChartToStorage(containerName, chartReference);

// Set background to white
me.getChartHelper().setChartBackgroundDefaultColor(chartSelector, "100%");

// Set grid lines color
d3.select(chartSelector).selectAll(".c3-ygrid-line").selectAll("line").style("stroke","#eeeeee");

setTimeout(function () {
  // center vertically
  me.centerVerticallyCallSummaryReport(containerName);
}, 100);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}