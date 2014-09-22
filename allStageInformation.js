





var STAGE_TIMELINE_MIN_LENGTH = null;
var STAGE_TIMELINE_MAX_LENGTH = null;


function mouseOverStageGraphBar(stageInfo){
    d3.selectAll(".graphBarG_stageID" + stageInfo.key).selectAll(".linkBar").attr("class", "linkBarHover");
}

function mouseOutStageGraphBar(stageInfo){
    d3.selectAll(".graphBarG_stageID" + stageInfo.key).selectAll(".linkBarHover").attr("class", "linkBar");
}

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
  .style("background", "sandybrown")
  .style("valign", "bottom")
  ;

  var timelineWidth = 1500;
  var timelineGraphBarHeight = 20;
  var barStrokeWidth = 1;

  var timelineAxisHeight = timelineGraphBarHeight;
  var timelineAxisWidth = timelineWidth;

  var stageTimelineMinLength = STAGE_TIMELINE_MIN_LENGTH != null ? STAGE_TIMELINE_MIN_LENGTH : d3.min(stageInfoArray, function(stageInfo) {
      return Number(stageInfo.submissionTime);
  });

  var stageTimelineMaxLength = STAGE_TIMELINE_MAX_LENGTH != null ? STAGE_TIMELINE_MAX_LENGTH : d3.max(stageInfoArray, function(stageInfo) {
      return Number(stageInfo.completionTime);
  });

  var stageTimelineXScale = d3.scale.linear().domain([stageTimelineMinLength, stageTimelineMaxLength]).range([0, timelineWidth]);
  var stageTimelineXAxis = d3.svg.axis().scale(stageTimelineXScale).orient("top");

  var timelineTableAxisCellSvg = timelineTableAxisCell
  .append("svg")
  .attr("height", timelineAxisHeight + 1)
  .attr("width", timelineAxisWidth + 2 * timeLineCellPaddingWidth)
  ;

  var timelineTableAxisCellSvgG = timelineTableAxisCellSvg
  .append("g")
  .attr("transform", "translate(" + timeLineCellPaddingWidth + "," + timelineGraphBarHeight + ")")
  .attr("class", "axis")
  ;

  timelineTableAxisCellSvgG
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
  .on("click", function(stageInfo, index){
    d3.select(this).style("background", stageInfo.failureReason != null ? failureColor : (index % 2 == 0 ? "wheat" : "tan"));
    linkStageInfo(stageInfo);
  })
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
  .attr("overflow", "hidden")
  ;

    var timelineGraphBarForEachTaskG = timelineGraphBarSvg
    .append("g")
    .attr("class", function(stageInfo){
        return "graphBarG_stageID" + stageInfo.key;
    })
    .attr("transform", function(stageInfo) {
        return "translate(" + (stageTimelineXScale(Number(stageInfo.submissionTime))) + ", " + 0 + ")";
    })
    .on("click", function(stageInfo){
        mouseOutStageGraphBar(stageInfo);
        linkStageInfo(stageInfo);
    })
    .on("mouseover", function(stageInfo){
        mouseOverStageGraphBar(stageInfo);
    })
    .on("mouseout", function(stageInfo){
        mouseOutStageGraphBar(stageInfo);
    })
    ;

  var timelineGraphBarForEachTaskGRect = timelineGraphBarForEachTaskG
  .append("rect")
  .attr("class", "linkBar")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", function(stageInfo) {
    return stageTimelineXScale(Number(stageInfo.completionTime)) - stageTimelineXScale(Number(stageInfo.submissionTime));
  })
  .attr("height", timelineGraphBarHeight)
  ;

//--------------------------------- repaint ---------------------------------------------
function repaint(){
        timelineTableAxisCellSvgG
        .call(stageTimelineXAxis)
        .selectAll("text")
        .text(function(text) {
            return dateToString(new Date(Number(text)));
        })
        ;

        timelineGraphBarForEachTaskG
        .attr("transform", function(stageInfo) {
        return "translate(" + (stageTimelineXScale(Number(stageInfo.submissionTime))) + ", " + 0 + ")";
        })
        ;

        timelineGraphBarForEachTaskGRect
        .attr("width", function(stageInfo) {
        return stageTimelineXScale(Number(stageInfo.completionTime)) - stageTimelineXScale(Number(stageInfo.submissionTime));
        })
        .attr("height", timelineGraphBarHeight)
        ;
}

//--------------------------------- zoom ---------------------------------------------
    var prevScale = 1.0;

    var zoom = d3
    .behavior
    .zoom()
    .on("zoom", function() {
        var mousePoint = d3.mouse(this)[0] - timeLineCellPaddingWidth;

        var timeOfMousePoint = stageTimelineXScale.invert(mousePoint);
        var scaleRate = d3.event.scale / prevScale;
        prevScale = d3.event.scale;

        stageTimelineMinLength = timeOfMousePoint - (timeOfMousePoint - stageTimelineMinLength) * scaleRate;
        stageTimelineMaxLength = timeOfMousePoint + (stageTimelineMaxLength - timeOfMousePoint) * scaleRate;

        STAGE_TIMELINE_MIN_LENGTH = stageTimelineMinLength;
        STAGE_TIMELINE_MAX_LENGTH = stageTimelineMaxLength;

        stageTimelineXScale.domain([stageTimelineMinLength, stageTimelineMaxLength]).range([0, timelineWidth]);
        stageTimelineXAxis.scale(stageTimelineXScale);

        repaint();

    })
    ;

    timelineTableAxisCell
    .call(zoom)
    ;

    timelineGraphBarCell
    .call(zoom)
    ;

//--------------------------------- drag ---------------------------------------------

    var drag = d3
    .behavior
    .drag()
    .on("drag", function(){
        var stageTimelineDiffLength = d3.event.dx * (stageTimelineXScale.invert(1) - stageTimelineXScale.invert(0));

        stageTimelineMinLength -= stageTimelineDiffLength;
        stageTimelineMaxLength -= stageTimelineDiffLength;

        stageTimelineXScale.domain([stageTimelineMinLength, stageTimelineMaxLength]).range([0, timelineWidth]);
        stageTimelineXAxis.scale(stageTimelineXScale);

        repaint();

    })
    ;

    timelineTableAxisCell
    .call(drag)
    ;

    timelineGraphBarCell
    .call(drag)
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
.on("click", function(){
    sortStagesOfAllStageInformationByID(timelineSpace, fontSize);
})
.text("ID")
;

var submissionTimeSortButton = sortMenu
.append("li")
.on("click", function(){
    sortStagesOfAllStageInformationBySubmissionTime(timelineSpace, fontSize);
})
.text("Submission Time")
;

var runTimeSortButton = sortMenu
.append("li")
.on("click", function(){
    sortStagesOfAllStageInformationByRunTime(timelineSpace, fontSize);
})
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

function sortStagesOfAllStageInformationByID(timelineSpace, fontSize){

    sortStagesOfAllStageInformation(timelineSpace, fontSize, function(a){ return Number(a.key)});

}

function sortStagesOfAllStageInformationBySubmissionTime(timelineSpace, fontSize){

    sortStagesOfAllStageInformation(timelineSpace, fontSize, function(a){ return Number(a.submissionTime)});

}

function sortStagesOfAllStageInformationByRunTime(timelineSpace, fontSize){

    sortStagesOfAllStageInformation(timelineSpace, fontSize, function(a){ return -(Number(a.completionTime) - Number(a.submissionTime))});

}

function sortStagesOfAllStageInformation(timelineSpace, fontSize, accessor){
    STAGE_INFO_ARRAY = STAGE_INFO_ARRAY
    .sort(function (a, b) { return d3.ascending(accessor(a), accessor(b)); })
    ;

    repaintStageTimeline(STAGE_INFO_ARRAY, timelineSpace, fontSize);
}

function repaintStageTimeline(stageInfoArray, timelineSpace, fontSize){
    timelineSpace.select("table").remove();
    addStageTimeline(stageInfoArray, timelineSpace, fontSize);
}



