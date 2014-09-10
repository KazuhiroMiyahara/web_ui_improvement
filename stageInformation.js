
function linkStageInfo(stageInfo){
        var tabs = d3
        .select("#mainTabs")
        ;

        removeContentOfTab(tabs, "Variable");
        setStageInfoTab("Variable", stageInfo);
        switchTab(tabs, MAIN_TAB_PROPERTIES, "Variable");
}

function addTaskTimeline(taskInfoArray, timelineSpace, fontSize){
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

  var timelineTableTaskIDNameCell = timelineTableHeaderRow
  .append("th")
  .text("TaskID")
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

  var taskTimelineMinLength = d3.min(taskInfoArray, function(taskInfo) {
      return Number(taskInfo.taskStartTime);
  });

  var taskTimelineMaxLength = d3.max(taskInfoArray, function(taskInfo) {
      return Number(taskInfo.taskFinishTime);
  });

  var taskTimelineXScale = d3.scale.linear().domain([taskTimelineMinLength, taskTimelineMaxLength]).range([0, timelineWidth]);
  var taskTimelineXAxis = d3.svg.axis().scale(taskTimelineXScale).orient("top");

  timelineTableAxisCell
  .append("svg")
  .attr("height", timelineAxisHeight)
  .attr("width", timelineAxisWidth)
  .attr("transform", "translate(0," + timelineGraphBarHeight + ")")
  .attr("class", "axis")
  .call(taskTimelineXAxis)
  .selectAll("text")
  .text(function(text) {
    return dateToString(new Date(Number(text)));
  })
  ;

  var timelineRow = timelineTable
  .selectAll(".tr")
  .data(taskInfoArray)
  .enter()
  .append("tr")
  ;

  var timelineTaskIDCell = timelineRow
  .append("th")
  .text(function (taskInfo){
    return taskInfo.taskID;
  })
  .style("font-size", fontSize + "px")
  .style("padding", "12px")
  .style("background", function(taskInfo, index) {
    return index % 2 == 0 ? "wheat" : "tan";
  })
  .on("click", linkTaskInfo)
  .on("mouseover", function(){
    d3.select(this).style("background", "darkorange");
  })
  .on("mouseout", function(taskInfo, index){
    d3.select(this).style("background", index % 2 == 0 ? "wheat" : "tan");
  })
  ;

  var timelineGraphBarCell = timelineRow
  .append("td")
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
  .data(function (taskInfo) {return [taskInfo];})
  .enter()
  .append("g")
  .attr("transform", function(taskInfo) {
    return "translate(" + (taskTimelineXScale(Number(taskInfo.taskStartTime))) + ", " + 0 + ")";
  })
  .on("click", linkTaskInfo)
  ;

  timelineGraphBarForEachTaskG
  .append("rect")
  .attr("id", "bar")
  .attr("class", "linkBar")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", function(taskInfo) {
    return taskTimelineXScale(Number(taskInfo.taskFinishTime)) - taskTimelineXScale(Number(taskInfo.taskStartTime));
  })
  .attr("height", timelineGraphBarHeight)
  ;

}

//-------------------------------------------------------------------------------------------------------------------
function addBarGraphWithProperty(array, tabProperty, accessorFunction, xAxisMapper, barsAreLinked){
    var tabBody = d3.
    select("#tab" + tabProperty)
    ;

    tabBody
    .style("overflow-x", "scroll")
    ;


    addBarGraph(array, tabBody, accessorFunction, xAxisMapper, barsAreLinked);
}
//-------------------------------------------------------------------------------------------------------------------
function addBarGraph(array, space, accessorFunction, xAxisMapper, barsAreLinked){
    var barGraphTable = space
    .append("table")
    .style("margin", "20px")
    ;

    var firstRow = barGraphTable
    .append("tr")
    ;

    var secondRow = barGraphTable
    .append("tr")
    ;

    var yAxisCell = firstRow
    .append("td")
    .attr("rowspan", 2)
    .attr("valign", "top")
    ;

    var drawSpaceCell = firstRow
    .append("td")
    .style("background", "wheat")
    ;

    var xAxisCell = secondRow
    .append("td")
    ;

    var height = 300;
    var barWidth = 40;
    var width = barWidth * array.length;

    var sortedArray = array
    .sort(function (a, b) { return d3.descending(accessorFunction(a), accessorFunction(b)); })
    ;

    var maxValue = d3.max(array, accessorFunction);
    var yScale = d3
    .scale
    .linear()
    .range([height, 0])
    .domain([0, maxValue])
    ;

    var xScale = d3
    .scale
    .ordinal()
    .rangeRoundBands([0, width], .1)
    .domain(sortedArray.map(xAxisMapper))
    ;

    var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
    var yAxis = d3.svg.axis().scale(yScale).orient("left");

    xAxisCell
    .append("svg")
    .attr("height", 30)
    .attr("width", width)
    .attr("transform", "translate(" + 0 + "," + 0 + ")")
    .attr("class", "axis")
    .call(xAxis)
    ;

    yAxisCell
    .append("svg")
    .attr("height", height + 20)
    .attr("width", 100)
    .attr("transform", "translate(" + 100 + "," + 0 + ")")
    .attr("class", "axis")
    .call(yAxis)
    ;


    var bar = drawSpaceCell
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .selectAll("g")
    .data(sortedArray)
    .enter()
    .append("g")
    .on("click", function(taskInfo){
      if(barsAreLinked){
          linkTaskInfo(taskInfo);
      }
    })
    ;

    bar
    .append("rect")
    .attr("x", function(d) { return xScale(xAxisMapper(d))})
    .attr("y", function(d) { return yScale(accessorFunction(d));})
    .attr("height", function(d) { return height - yScale(accessorFunction(d)); })
    .attr("width", barWidth)
    .attr("class", function(){
        return barsAreLinked ? "linkBar" : "notLinkBar";
    })
    ;

}
//-------------------------------------------------------------------------------------------------------------------
function addStageResources(stageInfo, resourcesSpace, fontSize) {
  var stageResourcesTabBox = resourcesSpace
  .append("div")
  .attr("class", "stageResourcesTabBox")
  .attr("id", "stageResourcesTabBox")
  ;

  var tabsID = "resourcesTabs"
  var tabs = stageResourcesTabBox
  .append("p")
  .attr("class", "tabs")
  .attr("id", tabsID)
  ;

  var tabProperties = ["ReadBytes", "MemoryWriteBytes", "DiskWriteBytes", "RemoteReadBytes", "ShuffleWriteBytes", "ExecTimes", "RDDMemSize", "RDDDiskSize", "RDDSumSize"];
  var accessorFunctions = [
  function(taskInfo) { return Number(taskInfo.bytesRead);},
  function(taskInfo) { return Number(taskInfo.memoryBytesSpilled);},
  function(taskInfo) { return Number(taskInfo.diskBytesSpilled);},
  function(taskInfo) { return Number(taskInfo.remoteBytesRead);},
  function(taskInfo) { return Number(taskInfo.shuffleBytesWritten);},
  function(taskInfo) { return (Number(taskInfo.taskFinishTime) - Number(taskInfo.taskStartTime));},
  function(RDD) { return Number(RDD.memSize);},
  function(RDD) { return Number(RDD.diskSize);},
  function(RDD) { return Number(RDD.memSize) + Number(RDD.diskSize);},
  ];

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

    tabProperties
    .forEach(function(tabProperty, i){
        if(i < 6){
            addBarGraphWithProperty(stageInfo.values, tabProperties[i], accessorFunctions[i], function(taskInfo) {
                return taskInfo.taskID;
            }, true);
        }else{
            addBarGraphWithProperty(stageInfo.RDDs, tabProperties[i], accessorFunctions[i], function(RDD) {
                return RDD.id;
            }, false);
        }
    })
    ;


}



//-------------------------------------------------------------------------------------------------------------------

function showStageInformation(showDiv, stageInfo){

var fontSize = 20;

var mainTable = showDiv
.append("table")
;

var textTableRow = mainTable
.append("tr")
;

var textTableSpace = textTableRow
.append("td")
.style("padding", "12px")
;

var textTable = textTableSpace
.append("table")
.style("font-size", fontSize + "px")
.style("border-collapse", "separate")
.style("border-spacing", "1px 1px")
.attr("cellpadding", 3)
;

var textTableHeaderRow = textTable
.append("tr")
;

textTableHeaderRow
.append("th")
  .style("font-size", fontSize + "px")
  .style("padding", "12px")
  .style("background", "sandybrown")
.text("submissionTime")
;

textTableHeaderRow
.append("th")
  .style("font-size", fontSize + "px")
  .style("padding", "12px")
  .style("background", "sandybrown")
.text("completionTime")
;

textTableHeaderRow
.append("th")
  .style("font-size", fontSize + "px")
  .style("padding", "12px")
  .style("background", "sandybrown")
.text("failureReason")
;

textTableHeaderRow
.append("th")
  .style("font-size", fontSize + "px")
  .style("padding", "12px")
  .style("background", "sandybrown")
.text("count of tasks")
;

var textTableBodyRow = textTable
.append("tr")
;

textTableBodyRow
.append("td")
  .style("font-size", fontSize + "px")
  .style("padding", "12px")
  .style("background", "wheat")
.text(dateToString(new Date(Number(stageInfo.submissionTime))))
;

textTableBodyRow
.append("td")
  .style("font-size", fontSize + "px")
  .style("padding", "12px")
  .style("background", "wheat")
.text(dateToString(new Date(Number(stageInfo.completionTime))))
;

textTableBodyRow
.append("td")
  .style("font-size", fontSize + "px")
  .style("padding", "12px")
  .style("background", "wheat")
.text(stageInfo.failureReason)
;

textTableBodyRow
.append("td")
  .style("font-size", fontSize + "px")
  .style("padding", "12px")
  .style("background", "wheat")
.text(stageInfo.taskCount)
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

addTaskTimeline(stageInfo.values.sort(function (a, b) { return d3.ascending(a.taskFinishTime, b.taskFinishTime);}), timelineSpace, fontSize);

addStageResources(stageInfo, resourcesSpace, fontSize);





}