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
 * @function prepareDataForPromotionStoreCalendarReport
 * @this BoCallReports
 * @kind businessobject
 * @namespace CORE
 * @param {Object} promotionList
 * @param {String} callDate
 * @returns jsonData
 */
function prepareDataForPromotionStoreCalendarReport(promotionList, callDate){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var index = 1;
var xsRaw = {};
var columnsRaw1 = [];
var columnsRaw2 = [];
var columnsRaw3 = [];
var dataStrings = [];
var namesFromData = {};
var namesFromId = {};
var yTicks=[];
var dictPrmGroupToSeries = Utils.createDictionary();
var gapsByGrouping = 0;
var i;
var col3;

var promotions = promotionList.serialize({
  "serializeToggles": true,
  "serializeNested": true
});

var sort = function(a, b){return a.dateFrom < b.dateFrom ? 1 : -1;};
promotions.sort(sort);

var tooltips = {};
var barColors = {};

Date.prototype.getWeek = function () {
  var dowOffset = 1;
  var newYear = Utils.createSpecificDate(me.getFullYear(),0,1);
  var day = newYear.getDay() - dowOffset;
  day = (day >= 0 ? day : day + 7);
  var daynum = Math.floor((me.getTime() - newYear.getTime() -
                           (me.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
  var weeknum;
  //if the year starts before the middle of a week
  if(day < 4) {
    weeknum = Math.floor((daynum+day-1)/7) + 1;
    if(weeknum > 52) {
      var nYear = Utils.createSpecificDate(me.getFullYear() + 1,0,1);
      var nday = nYear.getDay() - dowOffset;
      nday = nday >= 0 ? nday : nday + 7;
      /*if the next year starts before the middle of the week, it is week #1 of that year*/
      weeknum = nday < 4 ? 1 : 53;
    }
  }
  else {
    weeknum = Math.floor((daynum+day-1)/7);
  }
  return weeknum;
};


// building the timeline
var timeLine = [];

var date = Utils.createDateToday();
if(Utils.isDefined(callDate)){
  date = Utils.convertAnsiDate2Date(callDate);
}

var curYear = date.getFullYear();
var curMonth = date.getMonth()+1;
var months = [
  Localization.resolve("Report_PromotionStoreCalendar_ShortJanuary"),
  Localization.resolve("Report_PromotionStoreCalendar_ShortFebruary"),
  Localization.resolve("Report_PromotionStoreCalendar_ShortMarch"),
  Localization.resolve("Report_PromotionStoreCalendar_ShortApril"),
  Localization.resolve("Report_PromotionStoreCalendar_ShortMay"),
  Localization.resolve("Report_PromotionStoreCalendar_ShortJune"),
  Localization.resolve("Report_PromotionStoreCalendar_ShortJuly"),
  Localization.resolve("Report_PromotionStoreCalendar_ShortAugust"),
  Localization.resolve("Report_PromotionStoreCalendar_ShortSeptember"),
  Localization.resolve("Report_PromotionStoreCalendar_ShortOctober"),
  Localization.resolve("Report_PromotionStoreCalendar_ShortNovember"),
  Localization.resolve("Report_PromotionStoreCalendar_ShortDecember")
];

var monthNames = [];

for(i = 0; i < 7; i++){
  timeLine.push(curYear.toString() + "-" + ("00" + curMonth.toString()).slice(-2) + "-01");
  var curYearString = Utils.isPhone ? curYear.toString().substr(2,2) : curYear.toString();
  monthNames.push(months[curMonth-1] + " " + curYearString);

  curMonth++;
  if(curMonth === 13){
    curYear++;
    curMonth = 1;
  }
}
var startDate = Utils.convertAnsiDate2Date(timeLine[0]);
var endDate = Utils.convertAnsiDate2Date(timeLine[6]);
endDate.setDate(endDate.getDate()+4);

//Shorten promotions array - 25 on tablet, 20 on phone
var maxPromotions = 25;

if (Utils.isPhone()) {
  maxPromotions = 20;
}

var promotionLengthCut = false;
var totalNumberOfPromotions = promotions.length;
var promotionInfoText = "";
var numberOfDifferentPromotions = 0;
var numberOfShownPromotions = 0;

if (promotions.length > maxPromotions) {
  promotions = promotions.slice(0, maxPromotions);
  promotionLengthCut = true;
}

var count = promotions.length;
var showTooltip = true;
if(count === 0){
  count = 1;
  showTooltip = false;
}


// process the promotions
var processPromotion = function(promotion){
  // Check for grouping promotion
  var grouping_active = !Utils.isEmptyString(promotion.prmGroup);
  var grouping_firstInGroup = !dictPrmGroupToSeries.containsKey(promotion.promotionType + promotion.prmGroup);
  var group;

  //cut after a certain amount of promotions
  if((!grouping_active || grouping_firstInGroup)){
    if(numberOfDifferentPromotions >= maxPromotions){
      promotionLengthCut = true;
      return;
    }
    numberOfDifferentPromotions++;
  }
  numberOfShownPromotions++;

  var dataString = 'data' + index;
  dataStrings.push(dataString);
  var xString = 'x' + index;

  xsRaw[dataString] = xString;

  // Grouping of promotions
  if (grouping_active) {
    if (grouping_firstInGroup) {

      namesFromData[dataString] = promotion.prmGroup;
      namesFromId[index - gapsByGrouping] = promotion.prmGroup;

      col3 = [dataString, index - gapsByGrouping, index - gapsByGrouping];
      columnsRaw3.push(col3);

      group = {"prmGroup" : promotion.prmGroup, "yValue" : index - gapsByGrouping};
      dictPrmGroupToSeries.add(promotion.promotionType + promotion.prmGroup, group);
    }
    else {
      group = dictPrmGroupToSeries.get(promotion.promotionType + promotion.prmGroup);

      col3 = [dataString, group.yValue, group.yValue];
      columnsRaw3.push(col3);

      gapsByGrouping = gapsByGrouping + 1;
    }
  } else {
    namesFromData[dataString] = promotion.slogan;
    namesFromId[index - gapsByGrouping] = promotion.slogan;

    col3 = [dataString, index - gapsByGrouping, index - gapsByGrouping];
    columnsRaw3.push(col3);
  }

  var promStartDateD = Utils.convertAnsiDate2Date(promotion.dateFrom);
  var promStartDate = Utils.convertDate2Ansi(promStartDateD);
  promStartDateD.setDate(promStartDateD.getDate()+1);
  var promStartDate2 = Utils.convertDate2Ansi(promStartDateD);
  var promEndDateD = Utils.convertAnsiDate2Date(promotion.dateThru);
  var promEndDate = Utils.convertDate2Ansi(endDate < promEndDateD ? endDate : promEndDateD );

  var col1 = [xString, promStartDate, promStartDate2];
  columnsRaw1.push(col1);

  // If a promotion is only valid for one day, display it as two day to be visible
  if (promStartDate === promEndDate) {
    promEndDate = Utils.addDays2AnsiDate(promEndDate,1);
  }

  // Truncate promotion if it is outside the chart
  if (promStartDate < startDate) {
    promStartDate = startDate;
  }

  if (promEndDate > endDate) {
    promEndDate = endDate;
  }

  var col2 = [xString, promStartDate, promEndDate];
  columnsRaw2.push(col2);

  // Generate tooltip
  var tooltip = {};

  // Shorten slogan if too long
  var sloganLength = promotion.slogan.length;
  var shortSlogan = promotion.slogan.substring(0, 37);
  var shortSloganLength = shortSlogan.length;

  tooltip.slogan = sloganLength > shortSloganLength ? shortSlogan + "... " : promotion.slogan;
  tooltip.type = promotion.type;
  tooltip.validTimeframe = Localization.localize(promotion.dateFrom, "date") + " - " + Localization.localize(promotion.dateThru, "date") + ", " + Localization.resolve("Report_PromotionStoreCalendar_CalendarWeek") + " " + Utils.convertAnsiDate2Date(promotion.dateFrom).getWeek() + " - " + Utils.convertAnsiDate2Date(promotion.dateThru).getWeek();

  if ((promotion.orderDateFrom === Utils.getMinDate()) && (promotion.orderDateThru === Utils.getMinDate())) {
    tooltip.orderTimeframe = "-";
  } else {
    tooltip.orderTimeframe = Localization.localize(promotion.orderDateFrom, "date") + " - " + Localization.localize(promotion.orderDateThru, "date") + ", " + Localization.resolve("Report_PromotionStoreCalendar_CalendarWeek") + " " + Utils.convertAnsiDate2Date(promotion.orderDateFrom).getWeek() + " - " + Utils.convertAnsiDate2Date(promotion.orderDateThru).getWeek();
  }

  if ((promotion.placementDateFrom === Utils.getMinDate()) && (promotion.placementDateThru === Utils.getMinDate())) {
    tooltip.inStoreTimeframe = "-";
  } else {
    tooltip.inStoreTimeframe = Localization.localize(promotion.placementDateFrom, "date") + " - " + Localization.localize(promotion.placementDateThru, "date") + ", " + Localization.resolve("Report_PromotionStoreCalendar_CalendarWeek") + " " + Utils.convertAnsiDate2Date(promotion.placementDateFrom).getWeek() + " - " + Utils.convertAnsiDate2Date(promotion.placementDateThru).getWeek();
  }

  tooltip.anchor = promotion.anchor;
  tooltip.group = Utils.isEmptyString(promotion.prmGroup) ? "-" : promotion.prmGroup;
  tooltips[dataString] = tooltip;

  barColors[dataString] = "#" + promotion.color_id;

  index++;
};

promotions.forEach(processPromotion);

if(promotionLengthCut){
  promotionInfoText = numberOfShownPromotions + " " + Localization.resolve("Report_PromotionStoreCalendar_Info1") + " " + totalNumberOfPromotions + " " + Localization.resolve("Report_PromotionStoreCalendar_Info2");
}


if(promotions.length === 0){
  var dataString = 'data1';
  dataStrings.push(dataString);
  var xString = 'x' + index;

  xsRaw[dataString] = xString;

  namesFromData[dataString] = " ";
  namesFromId[index] = " ";

  col3 = [dataString, index, index];
  columnsRaw3.push(col3);

  var promStartDateD = Utils.createDateToday();
  var promStartDate = Utils.convertDate2Ansi(promStartDateD);
  promStartDateD.setDate(promStartDateD.getDate()+1);
  var promStartDate2 = Utils.convertDate2Ansi(promStartDateD);
  var promEndDateD = Utils.createDateToday();
  var promEndDate = Utils.convertDate2Ansi(endDate < promEndDateD ? endDate : promEndDateD );

  var col1 = [xString, promStartDate, promStartDate2];
  columnsRaw1.push(col1);

  var col2 = [xString, promStartDate, promEndDate];
  columnsRaw2.push(col2);

  // Generate tooltip
  var tooltip = {};
}


// compute the y ticks
var length = index - 1 - gapsByGrouping;

var gridLinesY = [];
for(i = 1; i <= length; i++){
  if (i != 1 && i%2===1){
    gridLinesY.push({value:i});
  }
  yTicks.push(i);
}



// format functions
var yFormatFunction = function(y){
  // Limit tick names to 32 characters and add triple dots if text is longer than 18 characters
  var tick = namesFromId[y];
  if (Utils.isDefined(tick)) {
    var tickLength = tick.length;
    var shortTick = tick.substring(0, 32);
    var shortTickLength = shortTick.length;

    return tickLength > shortTickLength ? shortTick + "... " : shortTick;
  } else {
    return undefined;
  }
};

var labelFormatFunction = function(v, id, i, j){
  return namesFromData[id];
};

// cw gridlines
var gridLines = [];
var cws = [];
var startCW = startDate.getWeek();
cws.push(startCW);
var nextCW;
var dummyDate = Utils.createDateByMilliSec(startDate.getTime());
var numberOfDaysFirstWeek = 0;
var numberOfDaysLastWeek = 0;

for(i = 1; i < 8; i++){
  dummyDate.setDate(startDate.getDate() + i);
  nextCW = dummyDate.getWeek();
  if(dummyDate.getWeek() != startCW){
    numberOfDaysFirstWeek = i;
    startCW = nextCW;
    cws.push(startCW);
    gridLines.push({value:Utils.convertDate2Ansi(dummyDate), opacity:10});
    break;
  }
}

while(true){
  dummyDate.setDate(dummyDate.getDate() + 7);

  if(dummyDate > endDate){
    var timeDiff = Math.abs(endDate.getTime() - dummyDate.getTime());
    numberOfDaysLastWeek = 7-(Math.ceil(timeDiff / (1000 * 3600 * 24))-1);
    break;
  }
  nextCW = dummyDate.getWeek();
  cws.push(nextCW);
  gridLines.push({value:Utils.convertDate2Ansi(dummyDate)});
}


var minXAxis = timeLine[0];
var maxXAxis = Utils.convertDate2Ansi(endDate);

var jsonData = {
  "data" : {
    labels:{format: labelFormatFunction},

    xs: xsRaw,
    columns: columnsRaw2.concat(columnsRaw3),
    columnsStart : columnsRaw1.concat(columnsRaw3),
    names: namesFromData
  },
  "axis" : {
    x : {
      tick : {values: timeLine},
      min : minXAxis,
      max : maxXAxis
    },
    y : {
      show : !Utils.isPhone(),
      tick : {format : yFormatFunction}
    }
  },
  "cws" : cws,
  "gridLines": Utils.isPhone() ? undefined : gridLines,
  "yTicks" : yTicks,
  "numberOfDaysFirstWeek" : numberOfDaysFirstWeek,
  "numberOfDaysLastWeek" : numberOfDaysLastWeek,
  "namesFromIds" : namesFromId,
  "tooltips" : tooltips,
  "monthNames" : monthNames,
  "isPhone" : Utils.isPhone(),
  "barColors" : barColors,
  "count" : count,
  "dataStrings" : dataStrings,
  "showTooltip" : showTooltip,
  "promotionLengthCut" : promotionLengthCut,
  "promotionInfoText" : promotionInfoText
};

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return jsonData;
}