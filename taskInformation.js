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
var color = d3.scale.category20();

var mainTr = showDiv
.append("table")
.append("tr")
;

var mainTrLeft = mainTr.append("td");
var mainTrRight = mainTr.append("td");

var circleGraphSvg = mainTrLeft
.append("svg")
.attr("id", "circleGraphSvg")
.attr("width", svgWidth)
.attr("height", svgHeight)
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
.style("fill", function(d, i) {
  return color(i);
})
.attr("stroke", "white")
.attr("stroke-width", "5")
;

var maxDepth = d3.max(dataPart, function(d) {return d.depth;});

dataPart
.forEach(function(d) {
  var tmpAngle = ((d.x + d.dx / 2) * 180 / Math.PI - 90);
  var tmpX = (radius / (maxDepth + 1)) * (d.depth + 0.5);

  circleGraphSvg
  .append("text")
  .attr("x", tmpAngle < 90 ? tmpX : -tmpX)
  .attr("y", 0)
  .attr("transform", "rotate(" + (tmpAngle < 90 ? tmpAngle : tmpAngle - 180) + ")")
  .attr("text-anchor", "middle")
  .attr("fill", "black")
  .attr("font-size", "20")
  .style("font-weight", "bold")
  .text(function() {
     return d.type;
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

var informationTable = mainTrRight
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
  ["taskLocality",taskInfo.taskLocality],
  ["taskStartTime",new Date(Number(taskInfo.taskStartTime))],
  ["taskFinishTime",new Date(Number(taskInfo.taskFinishTime))],
  ["taskTime",(Number(taskInfo.taskFinishTime) - Number(taskInfo.taskStartTime)) + " [ms]"],
  ["gettingResultTime",new Date(Number(taskInfo.gettingResultTime))],
  ["JVMGCTime",taskInfo.JVMGCTime + " [ms]"],
  ["shuffleReadTime",taskInfo.shuffleReadTime + " [ms]"],
  ["fetchWaitTime",taskInfo.fetchWaitTime + " [ms]"],
  ["shuffleWriteTime",taskInfo.shuffleWriteTime + " [ms]"],
  ["serializeMilliSec",taskInfo.serializeMilliSec + " [ms]"],
  ["deserializeMilliSec",taskInfo.deserializeMilliSec + " [ms]"],
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





}

//--------------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------------------

