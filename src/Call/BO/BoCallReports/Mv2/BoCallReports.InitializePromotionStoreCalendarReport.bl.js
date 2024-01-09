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
 * @function initializePromotionStoreCalendarReport
 * @this BoCallReports
 * @kind businessobject
 * @namespace CORE
 * @param {Object} promotionList
 * @param {String} containerName
 * @param {String} callDate
 */
function initializePromotionStoreCalendarReport(promotionList, containerName, callDate){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var chartHelper = me.getChartHelper();

if(Utils.isDefined(chartHelper)){
  // Get container and chart container divs
  var d3Container = chartHelper.getUIContainer(containerName, true);
  var chartString = "chart_" + containerName;
  var chartSelector = "#" + chartString;
  chartHelper.addChartContainers(d3Container, containerName, "1", "0");

  // Get the data
  var jsonData = me.prepareDataForPromotionStoreCalendarReport(promotionList, callDate);
  var sizeJson = chartHelper.computeContainerSize(containerName, 0.80, 0.96);

  // Define the colors
  var colors = jsonData.barColors;
  var colorFunction = function (color, d){
    return colors[d.id];
  };

  // Create the chart
  var chartReference = c3.generate({
    bindto : chartSelector,
    data : {
      columns : jsonData.data.columns,
      xs : jsonData.data.xs,
      names : jsonData.data.names,
      color : colorFunction
    },
    tooltip : {
      show : jsonData.showTooltip,
      contents : function (d, defaultTitleFormat, defaultValueFormat, color) {
        var result = "";

        if (d.length > 0) {
          var tooltipData = jsonData.tooltips[d[0].id];

          result = "<table class='c3-tooltip'>";
          result = result + "<tr><th colspan='2' style='background-color: #666e81'>" + tooltipData.slogan + "</th></tr>";
          result = result + "<tr class='c3-tooltip-name-data2'><td class='name' style='background-color: #eeeeee; color: #000000'>" + Localization.resolve("Report_PromotionStoreCalendar_Type") + "</td><td class='name' style='color: #000000'>" + tooltipData.type + "</td></tr>";
          result = result + "<tr class='c3-tooltip-name-data2'><td class='name' style='background-color: #eeeeee; color: #000000'>" + Localization.resolve("Report_PromotionStoreCalendar_ValidTimeFrame") + "</td><td class='name' style='color: #000000'>" + tooltipData.validTimeframe + "</td></tr>";
          result = result + "<tr class='c3-tooltip-name-data2'><td class='name' style='background-color: #eeeeee; color: #000000'>" + Localization.resolve("Report_PromotionStoreCalendar_OrderTimeFrame") + "</td><td class='name' style='color: #000000'>" + tooltipData.orderTimeframe + "</td></tr>";
          result = result + "<tr class='c3-tooltip-name-data2'><td class='name' style='background-color: #eeeeee; color: #000000'>" + Localization.resolve("Report_PromotionStoreCalendar_InStoreTimeFrame") + "</td><td class='name' style='color: #000000'>" + tooltipData.inStoreTimeframe + "</td></tr>";
          result = result + "<tr class='c3-tooltip-name-data2'><td class='name' style='background-color: #eeeeee; color: #000000'>" + Localization.resolve("Report_PromotionStoreCalendar_Anchor") + "</td><td class='name' style='color: #000000'>" + tooltipData.anchor + "</td></tr>";
          result = result + "<tr class='c3-tooltip-name-data2'><td class='name' style='background-color: #eeeeee; color: #000000'>" + Localization.resolve("Report_PromotionStoreCalendar_Group") + "</td><td class='name' style='color: #000000'>" + tooltipData.group + "</td></tr>";
          result = result + "</table>";

        }
        return result;
      },
      grouped : false
    },
    transition : {
      duration : 2000
    },
    size : sizeJson,
    axis : {
      x : {
        show : false,
        type : "timeseries",
        tick : {
          values : jsonData.axis.x.tick.values,
          format : function (v, id, i, j) {
            return ("00" + (v.getMonth() + 1)).slice(-2) + "/" + v.getFullYear();
          }
        },
        min : jsonData.axis.x.min,
        max : jsonData.axis.x.max,
        padding : {
          left : jsonData.isPhone ? 40 : 0
        }
      },
      y : {
        show : jsonData.axis.y.show,
        tick : {
          values : jsonData.yTicks,
          format : jsonData.axis.y.tick.format
        }
      }
    },
    legend : {
      show : false
    },
    point : {
      show : false,
      r : 1
    },
    grid : {
      x : {
        show : jsonData.isPhone,
        lines : jsonData.gridLines
      },
      lines : {
        front : false
      }
    }
  }
                                  );

  if(!Utils.isPhone() && jsonData.count === 1){
    var chartInternal = chartReference.internal;
    chartInternal.currentMaxTickWidths = {
      x: 0,
      y: 200,
      y2: 0
    };

    chartReference.unload();
    chartReference.load({
      data : {
        columns : jsonData.data.columns,
        xs : jsonData.data.xs,
        names : jsonData.data.names,
        color : colorFunction
      }
    });
  }

  me.getChartHelper().addChartToStorage(containerName, chartReference);

  // update text sizes
  var svg = d3Container.select(chartSelector);
  var text = svg.selectAll("text");
  text.style("font-size", "1.2em");
  text.style("font-family", "Helvetica Neue, Roboto, Segoe UI, sans-serif");

  //set bar width
  if(jsonData.count > 20) {
    d3Container.selectAll(".c3-line").style("stroke-width", "0.8em");
  }
  else if(jsonData.count > 10) {
    d3Container.selectAll(".c3-line").style("stroke-width", "1.7em");
  }
  else {
    d3Container.selectAll(".c3-line").style("stroke-width", "3.5em");
  }


  // Prepare the area for the header
  var chartSvg = chartReference.element.firstChild;
  var chartWidth = chartSvg.width.baseVal.value;
  var bufferTop = d3Container.select("#header").append("svg").attr("id", "bufferTop");
  bufferTop.attr("width", chartWidth).attr("height", 30);
  var monthSvgHeader = d3Container.select("#header").append("svg").attr("id", "monthSvgHeader");
  monthSvgHeader.attr("width", chartWidth).attr("height", 30);

  if(!jsonData.isPhone){
    var weekSvgHeader = d3Container.select("#header").append("svg").attr("id", "weekSvgHeader");
    weekSvgHeader.attr("width", chartWidth).attr("height", 30);
  }
  else{
    var div = d3Container.select(chartSelector);
    div.style("text-align","center");
    var div2 = d3Container.select("#header");
    div2.style("text-align","center");
  }

  // Set axis colors
  me.getChartHelper().setAxisDefaultColor();

  //remove the yAxis
  d3Container.select(chartSelector).select("svg").selectAll('path').style("stroke-width", 0);

  // Set background to white
  me.getChartHelper().setChartBackgroundDefaultColor(chartSelector, "92%");

  // Fade in animation
  setTimeout(function (){
    me.inputChangedForPromotionStoreCalendarReport(promotionList, containerName, callDate);
  }, 200);
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}