function linkTaskInfo(taskInfo){
        var tabs = d3
        .select("#mainTabs")
        ;

        removeContentOfTab(tabs, "Variable");
        setTaskInfoTab("Variable", taskInfo);
        switchTab(tabs, MAIN_TAB_PROPERTIES, "Variable");
}

function formatTaskTimes(taskInfo){
var data = [];

data
.push({
"type": "deserialize",
"time": Number(taskInfo.deserializeMilliSec)
})
;

data
.push({
"type": "serialize",
"time": Number(taskInfo.serializeMilliSec)
})
;

data
.push({
"type": "JVMGC",
"time": Number(taskInfo.JVMGCTime)
})
;

data
.push({
"type": "shuffle read",
"data": [{
"type": "fetch wait",
"time": Number(taskInfo.fetchWaitTime)
},{
"type": "others",
"time": Number(taskInfo.shuffleReadTime) - Number(taskInfo.fetchWaitTime)
}]
})
;

data
.push({
"type": "shuffle write",
"time": Number(taskInfo.shuffleWriteTime)
})
;

data
.push({
"type": "execute",
"time": Number(taskOtherTime(taskInfo))
})
;


return {"type ": "times", "data": data};
}

//--------------------------------------------------------------------------------------------------------------------
function showTaskInformation(showDiv, taskInfo){

var timeFormat = formatTaskTimes(taskInfo);

var radius = 300;
var svgHeight = 2 * radius;
var svgWidth = 2 * radius + 100;

var mainTr = showDiv
.append("table")
.append("tr")
.attr("valign", "top")
;

var mainTrLeft = mainTr.append("td");
var mainTrCenter = mainTr.append("td");
var mainTrRight = mainTr.append("td");

var circleGraphSvg = mainTrLeft
.append("svg")
.attr("id", "circleGraphSvg")
.attr("width", svgWidth)
.attr("height", svgHeight)
.append("g")
.attr("transform", "translate(" + radius + "," + radius + ")")
;

var partition = d3
.layout
.partition()
.sort(null)
.children(function(d, depth) {
  return d.data !== void(0) ? d.data : null;
})
.value(function(d) {
  return d.time;
})
.size([2 * Math.PI, radius]);

var arc = d3
.svg
.arc()
.startAngle(function(d) {
   return d.x;
})
.endAngle(function(d) {
   return d.x + d.dx;
})
.innerRadius(function(d) {
   return d.y;
})
.outerRadius(function(d) {
   return d.y + d.dy;
})
;

var dataPart = partition.nodes(timeFormat).slice(1);
var color = [];
var tmpCategory = d3.scale.category20();
dataPart
.forEach(function(d,i) {
    color[d.type] = tmpCategory(i);
})
;

var arcs = circleGraphSvg
.selectAll(".arc")
.data(dataPart)
.enter()
.append("g")
.attr("class", "arc")
;

arcs
.append("path")
.attr("d", function(d) {
   return arc(d);
})
.style("fill", function(d) {
  return color[d.type];
})
.attr("stroke", "white")
.attr("stroke-width", "2")
;

var maxDepth = d3.max(dataPart, function(d) {return d.depth;});

dataPart
.forEach(function(d) {
  var tmpAngle = ((d.x + d.dx / 2) * 180 / Math.PI - 90);
  var tmpX = (radius / (maxDepth + 1)) * (d.depth + 0.5);

  circleGraphSvg
  .append("text")
  .attr("x", tmpAngle < 90 ? tmpX : -tmpX)
  .attr("y", 5)
  .attr("transform", "rotate(" + (tmpAngle < 90 ? tmpAngle : tmpAngle - 180) + ")")
  .attr("text-anchor", "middle")
  .attr("fill", "black")
  .attr("font-size", "20")
  .style("font-weight", "bold")
  .text(function() {
     return d.dx > Math.PI / 24 ? d.type : "";
  })
  ;
})
;

  circleGraphSvg
  .append("text")
  .attr("x", 0)
  .attr("y", 0)
  .attr("text-anchor", "middle")
  .attr("fill", "black")
  .attr("font-size", "20")
  .style("font-weight", "bold")
  .text("TaskID:" + taskInfo.taskID)
  ;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var informationTable = mainTrCenter
.append("div")
.style("height", radius * 2 + "px")
.style("overflow-y", "scroll")
.append("table")
.style("font-size", 20 + "px")
.style("border-collapse", "separate")
.style("border-spacing", "1px 1px")
.attr("cellpadding", 3)
.selectAll(".tr")
.data(function() {
  return [["taskID",taskInfo.taskID],
  ["executorID",taskInfo.executorID],
  ["stageID",taskInfo.stageID],
  ["host name", taskInfo.hostName],
  ["taskLocality",taskInfo.taskLocality],
  ["taskStartTime",new Date(Number(taskInfo.taskStartTime))],
  ["taskFinishTime",new Date(Number(taskInfo.taskFinishTime))],
  ["taskTime",(Number(taskInfo.taskFinishTime) - Number(taskInfo.taskStartTime)) + " [ms]"],
  ["gettingResultTime",new Date(Number(taskInfo.gettingResultTime))],
  ["execute",taskOtherTime(taskInfo) + " [ms]"],
  ["JVMGC",taskInfo.JVMGCTime + " [ms]"],
  ["shuffle read",taskInfo.shuffleReadTime + " [ms]"],
  ["fetch wait",taskInfo.fetchWaitTime + " [ms]"],
  ["shuffle write",taskInfo.shuffleWriteTime + " [ms]"],
  ["serialize",taskInfo.serializeMilliSec + " [ms]"],
  ["deserialize",taskInfo.deserializeMilliSec + " [ms]"],
  ["bytesRead",taskInfo.bytesRead + " [byte]"],
  ["memoryBytesSpilled",taskInfo.memoryBytesSpilled + " [byte]"],
  ["diskBytesSpilled",taskInfo.diskBytesSpilled + " [byte]"],
  ["totalBlocksFetched",taskInfo.totalBlocksFetched + " [byte]"],
  ["remoteBlocksFetched",taskInfo.remoteBlocksFetched + " [byte]"],
  ["localBlocksFetched",taskInfo.localBlocksFetched + " [byte]"],
  ["shuffleBytesWritten",taskInfo.shuffleBytesWritten + " [byte]"],
  ["remoteBytesRead",taskInfo.remoteBytesRead + " [byte]"],
  ]
})
.enter()
.append("tr")
.attr("align", "right")
;

var explanatoryNoteWidth = 20;

informationTable
.append("td")
.attr("width", explanatoryNoteWidth)
.style("background", function(d) {
    return color[d[0]];
})
;

informationTable
.append("th")
.style("padding", "12px")
.style("background", function(d,i){
  return i % 2 == 0 ? "tan" : "wheat";
})
.text(function(d){
  return d[0];
})
;

informationTable
.append("td")
.style("padding", "12px")
.style("background", function(d,i){
  return i % 2 == 0 ? "tan" : "wheat";
})
.text(function(d){
  return d[1];
})
;

/////////////////////////////////////////////////////////////////////////////////////////////////////

var buttonTable = mainTrRight
.append("div")
.append("table")
;

var executorButton = buttonTable
.append("tr")
.attr("align", "center")
.attr("valign", "top")
.append("td")
.attr("width", "200px")
.style("padding", "12px")
.style("background", "crimson")
.style("font-size", "20px")
.style("font-weight", "bold")
.style("color", "white")
.text("go to executor")
.on("mouseover", function(){
  d3.select(this).style("background", "deeppink");
})
.on("mouseout", function(executorInfo, index){
  d3.select(this).style("background", "crimson");
})
;

executorButton
.on("click", function(){
    var executorInfo = EXECUTOR_INFO_ARRAY
    .filter(function(executorInfo) { return executorInfo.key == taskInfo.executorID; })[0]
    ;

    linkExecutorInfo(executorInfo);
})
;

var stageButton = buttonTable
.append("tr")
.attr("align", "center")
.attr("valign", "top")
.append("td")
.attr("width", "200px")
.style("padding", "12px")
.style("background", "crimson")
.style("font-size", "20px")
.style("font-weight", "bold")
.style("color", "white")
.text("go to stage")
.on("mouseover", function(){
  d3.select(this).style("background", "deeppink");
})
.on("mouseout", function(executorInfo, index){
  d3.select(this).style("background", "crimson");
})
;

stageButton
.on("click", function(){
    var stageInfo = STAGE_INFO_ARRAY
    .filter(function(stageInfo) { return stageInfo.key == taskInfo.stageID; })[0]
    ;

    linkStageInfo(stageInfo);
})
;

/*
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
*/




}

//--------------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------------------

