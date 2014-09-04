
function showExecutorInformation(showDiv, executorInfo){

  //showData(showDiv, executorInfo);

  var fontSize = 20;

var mainTable = showDiv
.append("table")
.attr("border", "1")
;

var timelineRow = mainTable
.append("tr")
;

var timelineSpace = timelineRow
.append("td")
.style("padding", "12px")
;

var histogramRow = mainTable
.append("tr")
;

var histogramSpace = histogramRow
.append("td")
.style("padding", "12px")
;

var timelineTable = timelineSpace
.append("table")
.style("font-size", 20 + "px")
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

var histogramTable = histogramSpace
.append("table")
.attr("border", "1")
;

var histogramFirstRow = histogramTable
.append("tr")
;

var histogramFirstRowFirstCell = histogramFirstRow
.append("td")
;

var histogramFirstRowSecondCell = histogramFirstRow
.append("td")
;

var histogramFirstRowThirdCell = histogramFirstRow
.append("td")
;

var histogramSecondRow = histogramTable
.append("tr")
;

var histogramSecondRowFirstCell = histogramSecondRow
.append("td")
;

var histogramSecondRowSecondCell = histogramSecondRow
.append("td")
;

var histogramSecondRowThirdCell = histogramSecondRow
.append("td")
;

  var executorInfoArray = [executorInfo];
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
  .style("padding", "12px")
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
  ;

  timelineGraphBarForEachTaskG
  .append("rect")
  .attr("id", "bar")
  .attr("class", "linkBar")
  /*
  .style("fill", "sienna")
  .style("stroke", "white")
  .style("stroke-width", barStrokeWidth)
  */
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", function(taskInfo) {
    return executorTimelineXScale(Number(taskInfo.taskFinishTime)) - executorTimelineXScale(Number(taskInfo.taskStartTime));
  })
  .attr("height", timelineGraphBarHeight)
  ;













histogramFirstRowFirstCell
.text("1,1")
;

histogramFirstRowSecondCell
.text("1,2")
;

histogramFirstRowThirdCell
.text("1,3")
;

histogramSecondRowFirstCell
.text("2,1")
;

histogramSecondRowSecondCell
.text("2,2")
;

histogramSecondRowThirdCell
.text("2,3")
;








}