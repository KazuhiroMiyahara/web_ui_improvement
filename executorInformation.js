
function linkExecutorInfo(executorInfo){
        var tabs = d3
        .select("#mainTabs")
        ;

        removeContentOfTab(tabs, "Variable");
        setExecutorInfoTab("Variable", executorInfo);
        switchTab(tabs, MAIN_TAB_PROPERTIES, "Variable");
}

function addExecutorTimeline(executorInfoArray, timelineSpace, fontSize){
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

  var timelineTableExecutorIDNameCell = timelineTableHeaderRow
  .append("th")
  .text("executorID")
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

  var executorTimelineMinLength = d3.min(executorInfoArray, function(executorInfo) {
    return d3.min(executorInfo.values, function(taskInfo) {
      return Number(taskInfo.taskStartTime);
    });
  });

  var executorTimelineMaxLength = d3.max(executorInfoArray, function(executorInfo) {
    return d3.max(executorInfo.values, function(taskInfo) {
      return Number(taskInfo.taskFinishTime);
    });
  });

  var executorTimelineXScale = d3.scale.linear().domain([executorTimelineMinLength, executorTimelineMaxLength]).range([0, timelineWidth]);
  var executorTimelineXAxis = d3.svg.axis().scale(executorTimelineXScale).orient("top");

  timelineTableAxisCell
  .append("svg")
  .attr("height", timelineAxisHeight + 1)
  .attr("width", timelineAxisWidth + 2 * timeLineCellPaddingWidth)
  .append("g")
  .attr("transform", "translate(" + timeLineCellPaddingWidth + "," + timelineGraphBarHeight + ")")
  .attr("class", "axis")
  .call(executorTimelineXAxis)
  .selectAll("text")
  .text(function(text) {
    return dateToString(new Date(Number(text)));
  })
  ;

  var timelineRow = timelineTable
  .selectAll(".tr")
  .data(executorInfoArray)
  .enter()
  .append("tr")
  ;

  var timelineExecutorIDCell = timelineRow
  .append("th")
  .text(function (executorInfo){
    return executorInfo.key;
  })
  .style("font-size", fontSize + "px")
  .style("padding", "12px")
  .style("background", function(executorInfo, index) {
    return index % 2 == 0 ? "wheat" : "tan";
  })
  .on("click", linkExecutorInfo)
  .on("mouseover", function(){
    d3.select(this).style("background", "darkorange");
  })
  .on("mouseout", function(executorInfo, index){
    d3.select(this).style("background", index % 2 == 0 ? "wheat" : "tan");
  })
  ;

  var timelineGraphBarCell = timelineRow
  .append("td")
  .style("padding", timeLineCellPaddingHeight + "px " + timeLineCellPaddingWidth + "px")
  .style("background", function(executorInfo, index) {
    return index % 2 == 0 ? "wheat" : "tan";
  })
  ;

  var timelineGraphBarSvg = timelineGraphBarCell
  .append("svg")
  .attr("height", timelineGraphBarHeight)
  .attr("width", timelineWidth)
  ;

  var timelineGraphBarForEachTaskG = timelineGraphBarSvg
  .selectAll(".g")
  .data(function (executorInfo) {
    return executorInfo.values;
  })
  .enter()
  .append("g")
  .attr("transform", function(taskInfo) {
    return "translate(" + (executorTimelineXScale(Number(taskInfo.taskStartTime))) + ", " + 0 + ")";
  })
  .on("click", linkTaskInfo)
  ;

  timelineGraphBarForEachTaskG
  .append("rect")
  .attr("class", function(taskInfo) {
    return "linkBar taskID" + taskInfo.taskID;
  })
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", function(taskInfo) {
    return executorTimelineXScale(Number(taskInfo.taskFinishTime)) - executorTimelineXScale(Number(taskInfo.taskStartTime));
  })
  .attr("height", timelineGraphBarHeight)
  .on("mouseover", function(taskInfo){
      d3.selectAll(".taskID" + taskInfo.taskID).attr("class", "linkBarHover taskID" + taskInfo.taskID);
  })
  .on("mouseout", function(taskInfo){
      d3.selectAll(".taskID" + taskInfo.taskID).attr("class", "linkBar taskID" + taskInfo.taskID);
  })
  ;

}

//-------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------
function addExecutorResources(executorInfoArray, resourcesSpace, fontSize) {
  var executorResourcesTabBox = resourcesSpace
  .append("div")
  .attr("class", "executorResourcesTabBox")
  .attr("id", "executorResourcesTabBox")
  ;

  var tabsID = "resourcesTabs"
  var tabs = executorResourcesTabBox
  .append("p")
  .attr("class", "tabs")
  .attr("id", tabsID)
  ;

  var tabProperties = ["ReadBytes", "MemoryWriteBytes", "DiskWriteBytes", "RemoteReadBytes", "ShuffleWriteBytes", "ExecTimes"];
  var accessorFunctions = [
  function(taskInfo) { return Number(taskInfo.bytesRead);},
  function(taskInfo) { return Number(taskInfo.memoryBytesSpilled);},
  function(taskInfo) { return Number(taskInfo.diskBytesSpilled);},
  function(taskInfo) { return Number(taskInfo.remoteBytesRead);},
  function(taskInfo) { return Number(taskInfo.shuffleBytesWritten);},
  function(taskInfo) { return (Number(taskInfo.taskFinishTime) - Number(taskInfo.taskStartTime));},
  ];
  var xAxisExplanationArray = ["Task ID", "Task ID", "Task ID", "Task ID", "Task ID", "Task ID"];
  var yAxisExplanationArray = ["[bytes]", "[bytes]", "[bytes]", "[bytes]", "[bytes]", "[ms]"];

  tabProperties
  .forEach(function (tabProperty){
    appendTabName(tabsID, tabProperties, tabProperty, tabProperty);
  })
  ;

  tabProperties
  .forEach(function (tabProperty){
    appendTabBody(tabs, tabProperty);
  })
  ;

  switchTab(tabs, tabProperties, tabProperties[0]);

    var executorInfo = executorInfoArray[0];
    tabProperties
    .forEach(function(tabProperty, i){
        addBarGraphWithProperty(executorInfo.values, tabProperties[i], accessorFunctions[i], function(taskInfo) {
            return taskInfo.taskID;
        }, true, xAxisExplanationArray[i], yAxisExplanationArray[i]);
    })
    ;


}



//-------------------------------------------------------------------------------------------------------------------

function showExecutorInformation(showDiv, executorInfo){

var fontSize = 20;

var mainTable = showDiv
.append("table")
;

var timelineRow = mainTable
.append("tr")
;

var timelineSpace = timelineRow
.append("td")
.style("padding", "12px")
;

var resourcesRow = mainTable
.append("tr")
;

var resourcesSpace = resourcesRow
.append("td")
.style("padding", "12px")
;

var executorInfoArray = [executorInfo];

addExecutorTimeline(executorInfoArray, timelineSpace, fontSize);

addExecutorResources(executorInfoArray, resourcesSpace, fontSize);





}