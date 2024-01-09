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
 * @function initializeTimeCardReport
 * @this BoTimeCardReports
 * @kind businessobject
 * @namespace CORE
 * @param {Object} timeEntryData
 * @param {String} containerName
 * @param {String} team
 * @param {String} userName
 * @param {String} startDate
 * @param {String} endDate
 * @param {Object} loActivityItem
 * @param {String} reloading
 */
function initializeTimeCardReport(timeEntryData, containerName, team, userName, startDate, endDate, loActivityItem, reloading){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var chartHelper = me.getChartHelper();
var isReload = (reloading === "reload");
var svg;
var text;
var legendGroupWidth;
var legendGroupHeight;
var legendSvgWidth;
var legendSvgHeight;
// Get container and add title and chart container divs
var d3Container;
if(isReload) {
  d3Container = chartHelper.getUIContainer(containerName, false);
}
else {
  d3Container = chartHelper.getUIContainer(containerName, true);
  chartHelper.addChartContainers(d3Container, containerName, "0", "1", "#e5e5e5");
}
var chartString = "chart_" + containerName;
var chartSelector = "#"+chartString;
var jsonData = me.prepareDataForTimeCardReport(timeEntryData, userName, team, startDate, endDate, loActivityItem);

// Set title
var title;
if(team == "1") {
  title = Localization.resolve("Report_TimeCard_Title_Team");
}
else {
  title = Localization.resolve("Report_TimeCard_Title");
}

if(!isReload) {
  chartHelper.setChartTitle(d3Container, title, containerName);
}
else {
  svg = d3Container.select("#chartTitle_" + containerName);
  text = svg.selectAll("text").text(title);
}

// Compute ratio
var dimensions = chartHelper.computeContainerSize(containerName, 1, 1);
var isPortraitMode = dimensions.height > dimensions.width;

var chartReference;
if(!isReload) {
  // Define attributes for chart
  var sizeJson;
  if(isPortraitMode) {
    if(Utils.isPhone()) {
      sizeJson = chartHelper.computeContainerSize(containerName, 0.40, 1);
    }
    else {
      sizeJson = chartHelper.computeContainerSize(containerName, 0.5, 1);
    }
  }
  else {
    sizeJson = chartHelper.computeContainerSize(containerName, 0.8, 0.5);
  }

  var legendHighlight = function(id) {
    d3Container.selectAll("#colorContainer").select(".legendDiv").select(".legendSvg").select(".legend").selectAll('.legendGroup3').style("opacity",function(id2) {
      return (id2.id != id.id || chartReference.internal.hiddenTargetIds.indexOf(id2.id)!=-1) ? 0.3 : 1;
    });
  };

  var legendUnhighlight = function(id) {
    d3Container.selectAll("#colorContainer").select(".legendDiv").select(".legendSvg").select(".legend").selectAll('.legendGroup3').style("opacity",1);
  };

  // Create Chart
  chartReference = c3.generate({
    bindto : chartSelector,
    data : {
      columns : [jsonData.data.columns[0]],
      type : 'pie',
      onclick: legendHighlight,
      onmouseover: legendHighlight,
      onmouseout: legendUnhighlight,
      onselected: legendHighlight,
      onunselected: legendUnhighlight
    },
    color: {
      pattern: jsonData.colors
    },
    size: sizeJson,
    transition: {
      duration: 1000
    },
    legend: {
      show: false,
      position: 'right'
    },
    tooltip : {
      show:true,
      contents : me.getChartHelper().getStyledTooltipFunction()
    }
  });
}
else {
  chartReference = me.getChartHelper().getChartFromStorage(containerName);
  chartReference.unload();

  chartReference.load({
    columns: [jsonData.data.columns[0]]
  });
}

// custom legend
var chartDiv = d3Container.select(chartSelector);
var chartSvg = d3Container.select(chartSelector).select('svg');
var legendDiv;
var legendSvg;
var legendGroup;

if(isReload) {
  legendDiv = d3Container.selectAll(".legendDiv");
  legendSvg = legendDiv.select("svg");
  legendGroup = legendSvg.select("g");

  var groups = legendGroup.selectAll("g");
  var rectangles = legendGroup.selectAll(".legendRect");
  rectangles.style("fill", function(id) {
    return (jsonData.legendData[id.index].legendEntry === "3" ? jsonData.legendData[id.index].color : "White");
  });

  var mainTexts = groups.selectAll(".mainText");
  mainTexts.text(function(id) {
    return jsonData.legendData[id.index].id;
  });

  var timeTexts = groups.selectAll(".timeText");
  timeTexts.text(function(id) {
    if(jsonData.legendData[id.index].legendEntry === "3" || jsonData.legendData[id.index].legendEntry === "4") {
      return Math.floor(jsonData.legendData[id.index].time/60) + ":" + ("00" + (jsonData.legendData[id.index].time%60).toString()).slice(-2) + " h";
    }
  });

  var eventRects = groups.selectAll(".legendEventRect");
  eventRects.on('mouseover', function (id) {
    if(chartReference.internal.hiddenTargetIds.indexOf(jsonData.legendData[id.index].id)!=-1) {
      return;
    }

    chartReference.focus(jsonData.legendData[id.index].id);
    legendGroup.selectAll('.legendGroup3').style("opacity",function(id2) {
      return (id2.id != jsonData.legendData[id.index].id || chartReference.internal.hiddenTargetIds.indexOf(id2.id)!=-1) ? 0.3 : 1;
    });
  })
    .on('mouseout', function (id) {
    chartReference.revert();
    legendGroup.selectAll('.legendGroup3').style("opacity",function(id2) {
      return chartReference.internal.hiddenTargetIds.indexOf(id2.id)!=-1 ? 0.3 : 1;
    });
  })
    .on('click', function (id) {
    chartReference.internal.api.toggle(jsonData.legendData[id.index].id);
    chartReference.internal.api.revert();

    legendGroup.selectAll('.legendGroup3').style("opacity",function(id2) {
      if(chartReference.internal.hiddenTargetIds.indexOf(jsonData.legendData[id.index].id)!=-1) {
        return chartReference.internal.hiddenTargetIds.indexOf(id2.id)!=-1 ? 0.3 : 1;
      }
      return (chartReference.internal.hiddenTargetIds.indexOf(id2.id)!=-1) ? 0.3 : 1;
    });

    if(!Utils.isPhone()) {
      var arcs = d3Container.selectAll(".c3-chart-arcs");
      var texts = arcs.selectAll("text");
      texts.style("font-size", "1.5em");
    }
  });
}
else {
  legendDiv = d3Container.selectAll("#colorContainer").append("div").style("position", "absolute").attr("class", "legendDiv");

  if(isPortraitMode) {
    if(Utils.isPhone()) {
      legendDiv.style("height", "40%").style("width", "100%").style("left", "0px").style("top", "60%");
    }
    else {
      legendDiv.style("height", "45%").style("width", "100%").style("left", "0px").style("top", "55%");
    }
  }
  else {
    legendDiv.style("height", "100%").style("width", "50%").style("left", "50%").style("top", "0px");
  }
  legendSvg = legendDiv.append('svg').style("height", "100%").style("width", "100%").attr("class", "legendSvg");
  legendGroup = legendSvg.append('g').attr("class", "legend");

  var entryGroups = legendGroup.selectAll('g').data(jsonData.legendData).enter().append('g');

  entryGroups.attr("transform", function(d, i) {
    var offset = i*35;
    if(i > 1) {
      offset += 15;
    }

    if(d.legendEntry==="4") {
      offset += 10;
    }
    return "translate(0,"+ offset +")";
  })
    .attr("class", function(id) {
    return "legendGroup" + id.legendEntry;
  });


  entryGroups.append("rect")
    .attr("x", function(d, i){ return 0;})
    .attr("width", "1em")
    .attr("height", "1em")
    .attr("class", function(id) {
    return "legendRect";
  });

  legendGroup.selectAll(".legendRect")
    .style("fill-opacity", function(id) {
    return (id.legendEntry === "3" ? 1 : 0);
  })
    .style("fill", function(id) {
    return (id.legendEntry === "3" ? id.color : "White");
  });

  entryGroups.append("text")
    .attr("class", "mainText")
    .attr("y",function(d, i) {
    return "0.45em";
  })
    .attr("x", function(d, i){ return "1.7em";})
    .text(function(id) {
    return id.id;
  })
    .style("font", "1.0em sans-serif")
    .attr("alignment-baseline", "central");

  entryGroups.append("text")
    .attr("class", "timeText")
    .attr("y",function(d, i) {
    return "0.45em";
  })
    .attr("x", function(d, i){ return "19em";})
    .text(function(id) {
    if(id.legendEntry === "3" || id.legendEntry === "4") {
      return Math.floor(id.time/60) + ":" + ("00" + (id.time%60).toString()).slice(-2) + " h";
    }
  })
    .style("font", "1.0em sans-serif")
    .attr("alignment-baseline", "central")
    .style("text-anchor","end")
    .attr("startOffset","100%");

  legendGroupWidth = legendGroup.node().getBoundingClientRect().width;
  legendGroupHeight = legendGroup.node().getBoundingClientRect().height;
  legendSvgWidth = legendSvg.node().getBoundingClientRect().width;
  legendSvgHeight = legendSvg.node().getBoundingClientRect().height;
  var g3 = legendGroup.selectAll('.legendGroup3');
  var legendEntryHeight = g3.node().getBoundingClientRect().height;

  g3.append("rect")
    .attr("x", function(d, i){ return 0;})
    .attr("y", function(d, i){ return -8;})
    .attr("width", legendGroupWidth)
    .attr("height", legendEntryHeight+16)
    .style("fill-opacity", 0)
    .attr("class", function(id) {
    return "legendEventRect";
  })
    .on('mouseover', function (id) {
    if(chartReference.internal.hiddenTargetIds.indexOf(id.id)!=-1) {
      return;
    }

    chartReference.focus(id.id);
    legendGroup.selectAll('.legendGroup3').style("opacity",function(id2) {
      return (id2.id != id.id || chartReference.internal.hiddenTargetIds.indexOf(id2.id)!=-1) ? 0.3 : 1;
    });
  })
    .on('mouseout', function (id) {
    chartReference.revert();
    legendGroup.selectAll('.legendGroup3').style("opacity",function(id2) {
      return chartReference.internal.hiddenTargetIds.indexOf(id2.id)!=-1 ? 0.3 : 1;
    });
  })
    .on('click', function (id) {
    chartReference.internal.api.toggle(id.id);
    chartReference.internal.api.revert();
    legendGroup.selectAll('.legendGroup3').style("opacity",function(id2) {
      if(chartReference.internal.hiddenTargetIds.indexOf(id.id)!=-1) {
        return chartReference.internal.hiddenTargetIds.indexOf(id2.id)!=-1 ? 0.3 : 1;
      }
      return (chartReference.internal.hiddenTargetIds.indexOf(id2.id)!=-1) ? 0.3 : 1;
    });

    if(!Utils.isPhone()) {
      var arcs = d3Container.selectAll(".c3-chart-arcs");
      var texts = arcs.selectAll("text");
      texts.style("font-size", "1.5em");
    }
  });

  legendGroup.select('.legendGroup0').selectAll('text').style("font-weight", "bold");
  var g4 = legendGroup.select('.legendGroup4');
  g4.append("svg:line")
    .attr("x1", 0)
    .attr("y1", -10)
    .attr("x2", g3[0][0].getBBox().width)
    .attr("y2", -10)
    .style("stroke", "#3D424D");
  legendGroup.selectAll('text').style("fill","#3D424D");


  //positioning of legend
  if(Utils.isPhone()) {
    legendGroup.attr("transform", "scale(0.68)");
  }

  legendGroupWidth = legendGroup.node().getBoundingClientRect().width;
  legendGroupHeight = legendGroup.node().getBoundingClientRect().height;
  legendSvgWidth = legendSvg.node().getBoundingClientRect().width;
  legendSvgHeight = legendSvg.node().getBoundingClientRect().height;

  if(Utils.isPhone()) {
    legendGroup.attr("transform", "translate(" + (legendSvgWidth-legendGroupWidth)*0.5 +","+ (legendSvgHeight-legendGroupHeight)*0.5 +") scale(0.68)");
  }
  else {
    legendGroup.attr("transform", "translate(" + (legendSvgWidth-legendGroupWidth)*0.5 +","+ (legendSvgHeight-legendGroupHeight)*0.5 +")");
  }

  //positioning of chart
  if(Utils.isPhone()) {
    var chartCont = d3Container.selectAll("#chart_Reporting_TimeCardReportContainer").select("svg");
    var pieCont = d3Container.selectAll(".c3-chart-arcs");
    var chartWidth = chartCont.node().getBoundingClientRect().width;
    var chartHeight = chartCont.node().getBoundingClientRect().height;
    pieCont.attr("transform", "translate(" + (chartWidth*0.5) +","+ (chartHeight*0.5) +")");
  }
}


if(!Utils.isPhone()) {
  var arcs = d3Container.selectAll(".c3-chart-arcs");
  var texts = arcs.selectAll("text");
  texts.style("font-size", "1.5em");
}

// update font styles
svg = d3Container.select(chartSelector);
text = svg.selectAll("text");
text.style("font-family", "Helvetica Neue, Roboto, Segoe UI, sans-serif");

me.getChartHelper().addChartToStorage(containerName, chartReference);

setTimeout(function() {
  //positioning of legend
  if(Utils.isPhone()) {
    legendGroup.attr("transform", "scale(0.68)");
  }

  legendGroupWidth = legendGroup.node().getBoundingClientRect().width;
  legendGroupHeight = legendGroup.node().getBoundingClientRect().height;
  legendSvgWidth = legendSvg.node().getBoundingClientRect().width;
  legendSvgHeight = legendSvg.node().getBoundingClientRect().height;

  if(Utils.isPhone()) {
    legendGroup.attr("transform", "translate(" + (legendSvgWidth-legendGroupWidth)*0.5 +","+ (legendSvgHeight-legendGroupHeight)*0.5 +") scale(0.68)");
  }
  else {
    legendGroup.attr("transform", "translate(" + (legendSvgWidth-legendGroupWidth)*0.5 +","+ (legendSvgHeight-legendGroupHeight)*0.5 +")");
  }

  //positioning of chart
  if(Utils.isPhone()) {
    var chartCont = d3Container.selectAll("#chart_Reporting_TimeCardReportContainer").select("svg");
    var pieCont = d3Container.selectAll(".c3-chart-arcs");
    var chartWidth = chartCont.node().getBoundingClientRect().width;
    var chartHeight = chartCont.node().getBoundingClientRect().height;
    pieCont.attr("transform", "translate(" + (chartWidth*0.5) +","+ (chartHeight*0.5) +")");
  }
}, 200);


setTimeout(function() {
  //positioning of legend
  if(Utils.isPhone()) {
    legendGroup.attr("transform", "scale(0.68)");
  }

  legendGroupWidth = legendGroup.node().getBoundingClientRect().width;
  legendGroupHeight = legendGroup.node().getBoundingClientRect().height;
  legendSvgWidth = legendSvg.node().getBoundingClientRect().width;
  legendSvgHeight = legendSvg.node().getBoundingClientRect().height;

  if(Utils.isPhone()) {
    legendGroup.attr("transform", "translate(" + (legendSvgWidth-legendGroupWidth)*0.5 +","+ (legendSvgHeight-legendGroupHeight)*0.5 +") scale(0.68)");
  }
  else {
    legendGroup.attr("transform", "translate(" + (legendSvgWidth-legendGroupWidth)*0.5 +","+ (legendSvgHeight-legendGroupHeight)*0.5 +")");
  }

  //positioning of chart
  if(Utils.isPhone()) {
    var chartCont = d3Container.selectAll("#chart_Reporting_TimeCardReportContainer").select("svg");
    var pieCont = d3Container.selectAll(".c3-chart-arcs");
    var chartWidth = chartCont.node().getBoundingClientRect().width;
    var chartHeight = chartCont.node().getBoundingClientRect().height;
    pieCont.attr("transform", "translate(" + (chartWidth*0.5) +","+ (chartHeight*0.5) +")");
  }
}, 500);


var index = 1;
for(var i = 1; i < jsonData.data.columns.length; i++) {
  setTimeout(function() {
    me.inputChangedForTimeCardReport(timeEntryData, containerName, index, userName, team, startDate, endDate, loActivityItem);
    index++;
  }, i*1000);
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}