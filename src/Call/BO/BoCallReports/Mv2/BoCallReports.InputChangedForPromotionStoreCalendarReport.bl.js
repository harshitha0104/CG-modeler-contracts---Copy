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
 * @function inputChangedForPromotionStoreCalendarReport
 * @this BoCallReports
 * @kind businessobject
 * @namespace CORE
 * @param {Object} promotionList
 * @param {String} containerName
 * @param {String} callDate
 */
function inputChangedForPromotionStoreCalendarReport(promotionList, containerName, callDate){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
if (Utils.isDefined(me.getChartHelper())) {
  var chartString = "chart_" + containerName;
  var chartSelector = "#" + chartString;
  var toolTipVisible = false;
  var clickedOnTooltip = false;
  var d3Container = me.getChartHelper().getUIContainer(containerName);
  var chart =  me.getChartHelper().getChartFromStorage(containerName);
  var jsonData = me.prepareDataForPromotionStoreCalendarReport(promotionList, callDate);
  var chartOffsetLeft;

  chart.unload();
  chart.load({
    columns : jsonData.data.columns
  });

  //set bar width
  if (jsonData.count > 20) {
    d3Container.selectAll(".c3-line").style("stroke-width", "0.8em");
  }
  else if (jsonData.count > 10) {
    d3Container.selectAll(".c3-line").style("stroke-width", "1.7em");
  }
  else {
    d3Container.selectAll(".c3-line").style("stroke-width", "3.5em");
  }

  // update text sizes
  var svg = d3Container.select(chartSelector);
  var text = svg.selectAll("text");
  text.style("font-size", "1.2em");
  text.style("font-family", "Helvetica Neue, Roboto, Segoe UI, sans-serif");

  //header cw
  var cwLocations = [];
  var xgrid = d3Container.select(chartSelector).selectAll("g.c3-xgrid-line");

  if (jsonData.numberOfDaysFirstWeek === 7) {
    cwLocations.push(0);
  }
  var func = function (gridLine) {
    cwLocations.push(gridLine.childNodes[0].x1.baseVal.value);
  };
  if (Utils.isDefined(xgrid[0])) {
    xgrid[0].forEach(func);
  }
  //header months
  var ll = "translate(".length;
  var monthLocations = [];
  var xAxis = d3Container.select(chartSelector).selectAll("g.c3-axis.c3-axis-x");
  var ticks = [];
  if (Utils.isDefined(xAxis[0]) && Utils.isDefined(xAxis[0][0])) {
    ticks = xAxis[0][0].childNodes;
  }

  var ticksLength = ticks.length;
  for (var i = 0; i < ticksLength; i++) {
    var tick = ticks[i];
    if (tick.className.baseVal === "tick") {
      var monthTransform = tick.attributes.transform.value;
      if (monthTransform.indexOf(",") != -1) {
        monthLocations.push(monthTransform.substr(ll, monthTransform.indexOf(",") - ll));
      }
      else {
        monthLocations.push(monthTransform.substr(ll, monthTransform.indexOf(")") - ll));
      }
    }
  }

  if (!Utils.isDefined(d3Container.select(chartSelector)[0][0])) {
    return;
  }
  var chartTransform = d3Container.select(chartSelector).select("svg").select("g").attr("transform");
  if (chartTransform.indexOf(",")  != -1) {
    chartOffsetLeft = chartTransform.substr(ll, chartTransform.indexOf(",") - ll);
  }
  else {
    chartOffsetLeft = chartTransform.substr(ll, chartTransform.indexOf(" ") - ll);
  }
  var chartSvg = chart.element.firstChild;
  var chartWidth = chartSvg.width.baseVal.value;
  var gridWidth = cwLocations[cwLocations.length - 1] - cwLocations[0];
  var monthWidth = monthLocations[monthLocations.length - 1] - monthLocations[0];
  var cwHeaderData = [];
  var idx = 0;
  var maxWeekLoc = 0;

  if (!jsonData.isPhone) {
    //configure header cws
    var cwHeaderDataLabels = [];
    var cw;
    var cws = jsonData.cws;
    var cwWidth = cwLocations[1] - cwLocations[0];
    var label = "";

    if (jsonData.numberOfDaysFirstWeek != 7) {
      cwHeaderData.push({
        "label" : label,
        "location" : monthLocations[0],
        "width" : cwLocations[0] - monthLocations[0]
      });
      cwHeaderDataLabels.push(label);
      cwLocations = [0].concat(cwLocations);
      idx++;
    }

    for (; idx < cws.length && idx < cwLocations.length; idx++) {
      label = cws[idx];
      var width = cwWidth;
      if (idx == cwLocations.length - 1) {
        label = jsonData.numberOfDaysLastWeek > 6 ? cws[idx] : "";
        width = cwWidth / 7 * jsonData.numberOfDaysLastWeek;
        maxWeekLoc = cwLocations[idx] + width;
      }
      cwHeaderData.push({
        "label" : label,
        "location" : cwLocations[idx],
        "width" : width
      });
      cwHeaderDataLabels.push(label);
    }
  }

  //configure header months
  var monthHeaderData = [];
  var monthHeaderDataLabels = [];
  var maxMonthLoc = monthLocations[monthLocations.length - 1];
  var maximalMonthWidth = 0;

  for (idx = 0; idx < monthLocations.length - 1; idx++) {
    monthHeaderData.push({
      "label" : jsonData.monthNames[idx],
      "location" : monthLocations[idx],
      "width" : monthLocations[idx + 1] - monthLocations[idx]
    });
    monthHeaderDataLabels.push("testMonth" + idx);

    if (monthLocations[idx + 1] - monthLocations[idx] > maximalMonthWidth) {
      maximalMonthWidth = monthLocations[idx + 1] - monthLocations[idx];
    }
  }

  if(jsonData.isPhone) {
    maxWeekLoc = maxMonthLoc + maximalMonthWidth*4/31;
  }

  monthHeaderData.push({
    "label" : "",
    "location" : maxMonthLoc,
    "width" : maxWeekLoc - maxMonthLoc
  });

  var bufferTop = d3Container.select("#bufferTop");
  var monthSvgHeader = d3Container.select("#monthSvgHeader");
  var monthNode = monthSvgHeader.node();
  if (Utils.isDefined(monthNode)) {
    var monthChilds = monthNode.childNodes;
    if (monthChilds.length > 0 && Utils.isDefined(monthNode.childNodes[0])) {
      monthNode.removeChild(monthNode.childNodes[0]);
    }
  }
  var monthHeader = monthSvgHeader.append("g").attr("transform", "translate(" + chartOffsetLeft + ", 0)");
  var weekSvgHeader = d3Container.select("#weekSvgHeader");
  var weekHeader = weekSvgHeader.append("g").attr("transform", "translate(" + chartOffsetLeft + ", 0)");
  var weekData = weekHeader.selectAll("g").data(cwHeaderData);
  var weekGroups = weekData.enter().append("g");
  var weekRects = weekGroups.append("rect");
  var weekText = weekGroups.append("text");

  if (!jsonData.isPhone) {
    var weekNode = weekSvgHeader.node();
    if (Utils.isDefined(weekNode)) {
      var weekChilds = weekNode.childNodes;
      if (weekChilds.length > 0 && Utils.isDefined(weekNode.childNodes[0])) {
        weekNode.removeChild(weekNode.childNodes[0]);
      }
    }

    weekGroups.attr("transform", function (d) {
      return "translate(" + d.location + ", 0)";
    });
    weekRects.attr("width", function (d) {
      return d.width;
    }).attr("height", 30).attr("fill", "#9aa2a9").attr("stroke", "#a5aeb6");
    weekText.style("fill", "#eeeeed");
    weekText.text(function (d) {
      return d.label;
    });
    weekText.attr("transform", function (d) {
      return "translate(" + d.width / 2 + ", 0)";
    });
    weekText.style("text-anchor", "middle").style("font-size", "0.70em");
    weekText.style("text-anchor", "middle").style("font-family", "Helvetica Neue, Roboto, Segoe UI, sans-serif");
    weekText.attr("alignment-baseline", "central");
    weekText.attr("y", function (d) {
      return "50%";
    });
  }

  var monthData = monthHeader.selectAll("g").data(monthHeaderData);
  var monthGroups = monthData.enter().append("g");
  var monthRects = monthGroups.append("rect");
  var monthText = monthGroups.append("text");

  monthGroups.attr("transform", function (d) {
    return "translate(" + d.location + ", 0)";
  });
  monthRects.attr("width", function (d) {
    return d.width;
  }).attr("height", 30).attr("fill", "#888d94").attr("stroke", "#a5aeb6");
  monthText.style("fill", "#eeeeed");
  monthText.text(function (d) {
    return d.label;
  });
  monthText.attr("transform", function (d) {
    return "translate(" + d.width / 2 + ", 0)";
  });

  monthText.style("text-anchor", "middle").style("font-size", "0.70em");
  // no weekText on phone available (on real phone, but Chrome reports isPhone=true for tablet execution as well
  if (Utils.isDefined(weekText)) {
    weekText.style("text-anchor", "middle").style("font-family", "Helvetica Neue, Roboto, Segoe UI, sans-serif");
  }

  monthText.attr("alignment-baseline", "central");
  monthText.attr("y", function (d) {
    return "50%";
  });

  // Set background to white
  me.getChartHelper().setChartBackgroundDefaultColor(chartSelector, "92%");

  d3Container.select(chartSelector).select("svg").select("g").select("rect").attr("width", maxWeekLoc);

  var lessenGridLines = function (gridLine) {
    gridLine.childNodes[0].style.stroke = "#eeeeee";
  };
  if (Utils.isDefined(xgrid[0])) {
    xgrid[0].forEach(lessenGridLines);
  }

  //info message if not all promotions are displayed
  d3Container.selectAll(".infoTextContainer").remove();
  var cc;
  var itc;
  var backgroundRectLeft;
  var heightInfo = 10;
  var infoTextString = "";
  var infoText = "";

  if (jsonData.promotionLengthCut) {
    cc = d3.selectAll("#colorContainer");
    itc = cc.append("div").attr("class", "infoTextContainer").attr("width", "100%");
    if (!Utils.isDefined(d3.select(chartSelector + "_chartBackground")[0][0])) {
      return;
    }
    backgroundRectLeft = d3.select(chartSelector + "_chartBackground")[0][0].getBoundingClientRect().left;
    heightInfo = 10;
    infoTextString = jsonData.promotionInfoText;
    infoText = itc.append("svg").attr("width", "100%").append("g").append("text");
    infoText.attr("class", "infoText");
    infoText.style("fill","#3D424D");
    infoText.text(infoTextString);
    infoText.style("font-family", "Helvetica Neue, Roboto, Segoe UI, sans-serif");
    infoText.style("font-size", "0.5em");
    infoText.attr("x", backgroundRectLeft);
    infoText.attr("y", heightInfo);
    infoText.attr("alignment-baseline", "central");
  }
  else if (!Utils.isPhone() && Utils.isApple()) {
    cc = d3.selectAll("#colorContainer");
    itc = cc.append("div").attr("class", "infoTextContainer").attr("width", "100%");
    if (!Utils.isDefined(d3.select(chartSelector + "_chartBackground")[0][0])) {
      return;
    }
    backgroundRectLeft = d3.select(chartSelector + "_chartBackground")[0][0].getBoundingClientRect().left;
    heightInfo = 10;
    infoText = itc.append("svg").attr("width", "100%").append("g").append("text");
    infoText.attr("class", "infoText");
    infoText.style("fill","#3D424D");
    infoText.text(infoTextString);
    infoText.style("font-family", "Helvetica Neue, Roboto, Segoe UI, sans-serif");
    infoText.style("font-size", "0.5em");
    infoText.attr("x", backgroundRectLeft);
    infoText.attr("y", heightInfo);
    infoText.attr("alignment-baseline", "central");
  }

  //tooltip activation
  var chartDiv = d3Container.select(chartSelector);

  d3Container.selectAll(".ttEventRect").remove();

  var allLines = d3Container.select("#chart_" + containerName).select("svg").select("g").select("g.c3-chart").select("g.c3-chart-lines").selectAll("g.c3-chart-line").select("g");

  var results =[];

  var index = 0;
  var lineProcessing = function(group) {
    results.push({"bb" :group.getBBox(), "data": {"id" : jsonData.dataStrings[index], "index" : 1, "name" : jsonData.namesFromIds[index+1], "value": index+1}});
    index++;
  };

  allLines[0].forEach(lineProcessing);
  var height = "3.5em";
  var heightOffset = 18;

  //set bar width
  if (jsonData.count > 20) {
    height = "0.8em";
    heightOffset = 4;
  }
  else if (jsonData.count > 10) {
    height = "1.7em";
    heightOffset = 9;
  }

  var uninterpolate = function (a, b) {
    b = (b -= a = +a) || 1 / b;
    return function(x) {
      return (x - a) / b;
    };
  };

  var eventRect = chartDiv.selectAll(".c3-event-rect");
  if (Utils.isDefined(eventRect.node())) {
    var eventWidth = eventRect.node().getBBox().width;
    var mouseFractionX = uninterpolate(0, eventWidth);

    eventRect
      .on('mouseover', function (elem) {
    })
      .on('mousemove', function (elem) {
    })
      .on('mouseout', function (elem) {
    });

    chartDiv.on('click', function (elem) {
      if (toolTipVisible && !clickedOnTooltip) {
        chart.internal.hideTooltip();
        toolTipVisible = false;
      }
      clickedOnTooltip = false;
    });

    var eventRects = d3Container.select(chartSelector).select("svg").select("g").selectAll(".ttEventRect").data(results).enter().append("rect").attr("class", "ttEventRect");

    eventRects
      .on("mouseover", function (elem) {
      chart.internal.hideTooltip();
      var data = elem.data;
      var mousePos = d3.mouse(eventRect.node());
      var xFraction = mouseFractionX(mousePos[0]);
      var date = Math.round(d3.interpolate(Utils.convertAnsiDate2Date(jsonData.axis.x.min), Utils.convertAnsiDate2Date(jsonData.axis.x.max))(xFraction));
      data.x = date;
      chart.internal.showTooltip([data], mousePos);
      toolTipVisible = true;
    })
      .on("mouseout", function (elem) {
    })
      .on('click', function (elem) {
      clickedOnTooltip = true;
      return true;
    });

    eventRects
      .attr("width", function (elem) {
      return elem.bb.x < 0 ? elem.bb.width + elem.bb.x : elem.bb.width;
    })
      .attr("height", function (elem) {
      return height;
    })
      .attr("x", function (elem) {
      return elem.bb.x < 0 ? 0 : elem.bb.x;
    })
      .attr("y", function (elem) {
      return elem.bb.y - heightOffset;
    })
      .style("fill-opacity", 0);
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}