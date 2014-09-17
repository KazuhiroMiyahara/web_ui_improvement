function linkStageInfo(stageInfo){
        var tabs = d3
        .select("#mainTabs")
        ;

        removeContentOfTab(tabs, "Variable");
        setStageInfoTab("Variable", stageInfo);
        switchTab(tabs, MAIN_TAB_PROPERTIES, "Variable");
}

function addStageTimeline(stageInfoArray, timelineSpace, fontSize){
  var timelineTable = timelineSpace
  .append("table")
  .style("font-size", fontSize + "px")
  .style("border-collapse", "separate")
  .style("border-spacing", "1px 1px")
  .attr("cellpadding", 3)
  ;

  var timelineTableHeaderRow = timelineTable
  .append("tr")
  ;

  var timelineTableStageIDNameCell = timelineTableHeaderRow
  .append("th")
  .text("stageID")
  .style("font-size", fontSize + "px")
  .style("padding", "12px")
  .style("background", "sandybrown")
  ;

  var timelineTableAxisCell = timelineTableHeaderRow
  .append("td")
  //.style("padding", timeLineCellPaddingHeight + "px " + timeLineCellPaddingWidth + "px")
  .style("background", "sandybrown")
  .style("valign", "bottom")
  ;

  var timelineWidth = 1500;
  var timelineGraphBarHeight = 20;
  var barStrokeWidth = 1;

  var timelineAxisHeight = timelineGraphBarHeight;
  var timelineAxisWidth = timelineWidth;

  var stageTimelineMinLength = d3.min(stageInfoArray, function(stageInfo) {
      return Number(stageInfo.submissionTime);
  });

  var stageTimelineMaxLength = d3.max(stageInfoArray, function(stageInfo) {
      return Number(stageInfo.completionTime);
  });

  var stageTimelineXScale = d3.scale.linear().domain([stageTimelineMinLength, stageTimelineMaxLength]).range([0, timelineWidth]);
  var stageTimelineXAxis = d3.svg.axis().scale(stageTimelineXScale).orient("top");

  timelineTableAxisCell
  .append("svg")
  .attr("height", timelineAxisHeight + 1)
  .attr("width", timelineAxisWidth + 2 * timeLineCellPaddingWidth)
  .append("g")
  .attr("transform", "translate(" + timeLineCellPaddingWidth + "," + timelineGraphBarHeight + ")")
  .attr("class", "axis")
  .call(stageTimelineXAxis)
  .selectAll("text")
  .text(function(text) {
    return dateToString(new Date(Number(text)));
  })
  ;

  var timelineRow = timelineTable
  .selectAll(".tr")
  .data(stageInfoArray)
  .enter()
  .append("tr")
  ;

  var failureColor = "salmon";

  var timelineStageIDCell = timelineRow
  .append("th")
  .text(function (stageInfo){
    return stageInfo.key;
  })
  .style("font-size", fontSize + "px")
  .style("padding", "12px")
  .style("background", function(stageInfo, index) {
    return stageInfo.failureReason != null ? failureColor : (index % 2 == 0 ? "wheat" : "tan");
  })
  .on("click", linkStageInfo)
  .on("mouseover", function(){
    d3.select(this).style("background", "orangered");
  })
  .on("mouseout", function(stageInfo, index){
    d3.select(this).style("background", stageInfo.failureReason != null ? failureColor : (index % 2 == 0 ? "wheat" : "tan"));
  })
  ;

  var timelineGraphBarCell = timelineRow
  .append("td")
  .style("padding", timeLineCellPaddingHeight + "px " + timeLineCellPaddingWidth + "px")
  .style("background", function(stageInfo, index) {
    return stageInfo.failureReason != null ? failureColor : (index % 2 == 0 ? "wheat" : "tan");
  })
  ;

  var timelineGraphBarSvg = timelineGraphBarCell
  .append("svg")
  .attr("height", timelineGraphBarHeight)
  .attr("width", timelineWidth)
  ;

  var timelineGraphBarForEachTaskG = timelineGraphBarSvg
  .append("g")
  .attr("transform", function(stageInfo) {
    return "translate(" + (stageTimelineXScale(Number(stageInfo.submissionTime))) + ", " + 0 + ")";
  })
  .on("click", linkStageInfo)
  ;

  timelineGraphBarForEachTaskG
  .append("rect")
  .attr("class", "linkBar")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", function(stageInfo) {
    return stageTimelineXScale(Number(stageInfo.completionTime)) - stageTimelineXScale(Number(stageInfo.submissionTime));
  })
  .attr("height", timelineGraphBarHeight)
  ;

}


//------------------------------------------------------------------------------------------------------------

function showAllStagesInformation(showDiv, stageInfoArray){
var fontSize = 20;

var mainTable = showDiv
.append("table")
;

var menuButtonRow = mainTable
.append("tr")
;

var menuButtonSpace = menuButtonRow
.append("td")
.style("padding", "12px")
;

var menuButtons = menuButtonSpace
.append("ul")
.attr("id", "menuButtons")
;

var sortMenu = menuButtons
.append("li")
.text("SORT BY ...")
.style("font-size", fontSize + "px")
.append("ul")
;

var IDSortButton = sortMenu
.append("li")
.attr("onClick", "sortStagesOfAllStageInformationByID();")
.text("ID")
;

var submissionTimeSortButton = sortMenu
.append("li")
.attr("onClick", "sortStagesOfAllStageInformationBySubmissionTime();")
.text("Submission Time")
;

var runTimeSortButton = sortMenu
.append("li")
.attr("onClick", "sortStagesOfAllStageInformationByRunTime();")
.text("Run Time")
;



var timelineRow = mainTable
.append("tr")
;

var timelineSpace = timelineRow
.append("td")
.style("padding", "12px")
;

addStageTimeline(stageInfoArray, timelineSpace, fontSize);
}

function sortStagesOfAllStageInformationByID(){
    var tabs = d3
    .select("#mainTabs")
    ;

    removeContentOfTab(tabs, "AllStages");

    STAGE_INFO_ARRAY = STAGE_INFO_ARRAY
    .sort(function (a, b) { return d3.ascending(Number(a.key), Number(b.key)); })
    ;

    setAllStagesInfoTab(STAGE_INFO_ARRAY);
}

function sortStagesOfAllStageInformationBySubmissionTime(){
    var tabs = d3
    .select("#mainTabs")
    ;

    removeContentOfTab(tabs, "AllStages");

    STAGE_INFO_ARRAY = STAGE_INFO_ARRAY
    .sort(function (a, b) { return d3.ascending(Number(a.submissionTime), Number(b.submissionTime)); })
    ;

    setAllStagesInfoTab(STAGE_INFO_ARRAY);
}

function sortStagesOfAllStageInformationByRunTime(){
    var tabs = d3
    .select("#mainTabs")
    ;

    removeContentOfTab(tabs, "AllStages");

    STAGE_INFO_ARRAY = STAGE_INFO_ARRAY
    .sort(function (a, b) { return d3.descending(Number(a.completionTime) - Number(a.submissionTime), Number(b.completionTime) - Number(b.submissionTime)); })
    ;

    setAllStagesInfoTab(STAGE_INFO_ARRAY);
}

