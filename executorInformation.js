
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
  .style("background", "tan")
  ;

  var timelineTableAxisCell = timelineTableHeaderRow
  .append("td")
  .style("background", "tan")
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
      return Number(taskInfo.taskStartTime);
    });
  });

  var executorTimelineXScale = d3.scale.linear().domain([executorTimelineMinLength, executorTimelineMaxLength]).range([0, timelineWidth]);
  var executorTimelineXAxis = d3.svg.axis().scale(executorTimelineXScale).orient("top");

  timelineTableAxisCell
  .append("svg")
  .attr("height", timelineAxisHeight)
  .attr("width", timelineAxisWidth)
  .attr("transform", "translate(0," + timelineGraphBarHeight + ")")
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
  .style("background", "wheat")
  ;

  var timelineGraphBarCell = timelineRow
  .append("td")
  .style("background", "wheat")
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
  .attr("id", "bar")
  .attr("class", "linkBar")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", function(taskInfo) {
    return executorTimelineXScale(Number(taskInfo.taskFinishTime)) - executorTimelineXScale(Number(taskInfo.taskStartTime));
  })
  .attr("height", timelineGraphBarHeight)
  ;

}

//-------------------------------------------------------------------------------------------------------------------
function addBarGraphWithProperty(array, tabProperty, accessorFunction, xAxisMapper){
    var tabBody = d3.
    select("#tab" + tabProperty)
    ;

    tabBody
    .style("overflow-x", "scroll")
    ;


    addBarGraph(array, tabBody, accessorFunction, xAxisMapper);
}
//-------------------------------------------------------------------------------------------------------------------
function addBarGraph(array, space, accessorFunction, xAxisMapper){
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
    ;

    bar
    .append("rect")
    .attr("x", function(d) { return xScale(xAxisMapper(d))})
    .attr("y", function(d) { return yScale(accessorFunction(d));})
    .attr("height", function(d) { return height - yScale(accessorFunction(d)); })
    .attr("width", barWidth)
    .attr("class", "linkBar")
    ;

}
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

  switchTab(tabs, tabProperties, tabProperties[4]);

    var executorInfo = executorInfoArray[0];
    tabProperties
    .forEach(function(tabProperty, i){
        addBarGraphWithProperty(executorInfo.values, tabProperties[i], accessorFunctions[i], function(taskInfo) {
            return taskInfo.taskID;
        });
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