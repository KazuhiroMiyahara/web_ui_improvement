main();

function showData(showDiv, data) {
  showDiv.append("div").text(JSON.stringify(data));
}

function dateToString(date) {
  format = 'MM/DD hh:mm:ss';
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));

  return format;
}

function showExecutorTimeline(showDiv, taskInfoArray) {
  var barGraphWidth = 24;
  var spacePerData = 32;
  var barStrokeWidth = 1;
  var IDSpace = 100;
  var graphRightPadding = 100;
  var IDFontSize = 16;
  var graphBarFontSize = 16;
  var taskInfoExplanationFontSize = 20;

showDiv
.append("h2")
.text("Executor Timeline")
;

  var executorTimelineTaskInfoArrayGroupedByExecutorID = d3
    .nest()
    .key(function(taskInfo) { return Number(taskInfo.executorID) })
    .entries(taskInfoArray)
    ;

  var executorTimelineSvgHeight = executorTimelineTaskInfoArrayGroupedByExecutorID.length * spacePerData;
  var executorTimelineSvgWidth = 1600;
  var executorTimelineDivHeight = Math.min(500, executorTimelineSvgHeight);
  var executorTimelineDivWidth = executorTimelineSvgWidth;
  var executorTimelineDivTop = 120;
  var executorTimelineDivLeft = 0;

  var executorTimelineDiv = showDiv
    .append("div")
    .style("height", executorTimelineDivHeight + "px")
    .style("width", executorTimelineDivWidth + "px")
    .style("overflow-x", "hidden")
    .style("overflow-y", "scroll")
    /*
    .style("position", "absolute")
    .style("top", executorTimelineDivTop + "px")
    .style("left", executorTimelineDivLeft + "px")
    */
    ;

  var executorTimelineBarGraphSvg = executorTimelineDiv
    .append("svg")
    .attr("id", "executorTimelineBarGraphSvg")
    .attr("width", executorTimelineSvgWidth)
    .attr("height", executorTimelineSvgHeight)
    ;

  var executorTimelineMinLength = d3.min(executorTimelineTaskInfoArrayGroupedByExecutorID, function(taskInfoGroupedByExecutorID) {
    return d3.min(taskInfoGroupedByExecutorID.values, function(taskInfo) {
      return Number(taskInfo.taskStartTime);
    });
  });

  var executorTimelineMaxLength = d3.max(executorTimelineTaskInfoArrayGroupedByExecutorID, function(taskInfoGroupedByExecutorID) {
    return d3.max(taskInfoGroupedByExecutorID.values, function(taskInfo) {
      return Number(taskInfo.taskFinishTime);
    });
  });

  var executorTimelineGraphBarXScale = d3.scale.linear().domain([executorTimelineMinLength, executorTimelineMaxLength]).range([0, executorTimelineSvgWidth - graphRightPadding - IDSpace]);
  var executorTimelineGraphBarXAxis = d3.svg.axis().scale(executorTimelineGraphBarXScale).orient("bottom");

  var executorTimelineTaskInfoGroupedByExecutorIDGTag = executorTimelineBarGraphSvg
    .selectAll('#hoge')
    .data(executorTimelineTaskInfoArrayGroupedByExecutorID)
    .enter()
    .append("g")
    .attr("id", "MAIN_BAR")
    .attr("transform", function(taskInfoGroupedByExecutorID,i) { return "translate(0," + i * spacePerData + ")"; })
    ;

  executorTimelineTaskInfoGroupedByExecutorIDGTag
    .append("rect")
    .style("fill", function(taskInfoGroupedByExecutorID,i) {
      return i % 2 == 0 ? "rgb(200,200,200)" : "rgb(225,225,225)";
    })
  .attr("x", 0)
    .attr("y", 0)
    .attr("width", function() {
      return IDSpace + executorTimelineGraphBarXScale(executorTimelineMaxLength) + graphRightPadding;
    })
  .attr("height", spacePerData)
  ;

  var executorTimelineGraphBarXAxisTick = d3.svg.axis().scale(executorTimelineGraphBarXScale).orient("bottom").tickSize(executorTimelineSvgHeight).tickSubdivide(true);

  executorTimelineBarGraphSvg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + IDSpace + ",0)")
    .call(executorTimelineGraphBarXAxisTick)
    ;

  executorTimelineTaskInfoGroupedByExecutorIDGTag
    .append("text")
    .text(function(taskInfoGroupedByExecutorID) {
      return "ExecutorID: " + taskInfoGroupedByExecutorID.key;
    })
  .attr("font-size", IDFontSize + "px")
    .attr("fill", "black")
    .attr("x", 0)
    .attr("y", function() {
      return spacePerData / 2 + IDFontSize / 2;
    })
    ;

  var executorTimelineTaskInfoGTag = executorTimelineTaskInfoGroupedByExecutorIDGTag
    .selectAll("g")
    .data(function(taskInfoGroupedByExecutorID) {
      return taskInfoGroupedByExecutorID.values;
    })
  .enter()
    .append("g")
    .attr("width", function(taskInfo) {
      return executorTimelineGraphBarXScale(Number(taskInfo.taskFinishTime)) - executorTimelineGraphBarXScale(Number(taskInfo.taskStartTime));
    })
  .attr("height", barGraphWidth)
    .attr("transform", function(taskInfo) {
      return "translate(" + (IDSpace + executorTimelineGraphBarXScale(Number(taskInfo.taskStartTime))) + ", " + (spacePerData - barGraphWidth) / 2 + ")";
    })
  .on("mouseover", function(taskInfo){
    d3
      .select(this)
      .select("rect")
      .style("fill", "cyan")
      ;

    showDiv
      .select("#executorTimelineBarGraphSvg")
      .select("#EXECUTOR_ID_" + taskInfo.executorID)
      .select("#TASK_ID_" + taskInfo.taskID)
      .style("visibility", "visible")
      ;

  })
  .on("mouseout", function(taskInfo){
    d3
      .select(this)
      .select("rect")
      .style("fill", "blue")
      ;

    d3
      .select("#executorTimelineBarGraphSvg")
      .select("#EXECUTOR_ID_" + taskInfo.executorID)
      .select("#TASK_ID_" + taskInfo.taskID)
      .style("visibility", "hidden")
      ;

  })
  ;

  executorTimelineTaskInfoGTag
    .append("rect")
    .attr("id", "bar")
    .style("fill", "blue")
    .style("stroke", "white")
    .style("stroke-width", barStrokeWidth)
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", function(taskInfo) {
      return executorTimelineGraphBarXScale(Number(taskInfo.taskFinishTime)) - executorTimelineGraphBarXScale(Number(taskInfo.taskStartTime));
    })
  .attr("height", barGraphWidth)
  ;

  var executorTimelineTaskInfoGroupedByExecutorIDGTagExplanation= executorTimelineBarGraphSvg
    .selectAll(".hoge")
    .data(executorTimelineTaskInfoArrayGroupedByExecutorID)
    .enter()
    .append("g")
    .attr("id", function(taskInfoGroupedByExecutorID) {
      return "EXECUTOR_ID_" + taskInfoGroupedByExecutorID.key;
    })
  .attr("transform", function(taskInfoGroupedByExecutorID,i) { return "translate(" + IDSpace + "," + i * spacePerData + ")"; })
  ;

  var executorTimelineTaskInfoGTagExplanation= executorTimelineTaskInfoGroupedByExecutorIDGTagExplanation
    .selectAll("g")
    .data(function(taskInfoGroupedByExecutorID) {
      return taskInfoGroupedByExecutorID.values;
    })
  .enter()
    .append("g")
    .attr("id", function(taskInfo) { return "TASK_ID_" + taskInfo.taskID; })
    .style("visibility", "hidden")
    .attr("transform", function(taskInfo,i) { return "translate(" + (executorTimelineGraphBarXScale(Number(taskInfo.taskFinishTime)) + 10) +  "," + ((spacePerData - barGraphWidth) / 2 + 0) + ")"; })
    ;

  executorTimelineTaskInfoGTagExplanation
    .append("rect")
    .style("fill", "white")
    .style("stroke", "black")
    .style("stroke-width", 2)
    .attr("width", 500)
    .attr("height", 200)
    .attr("x", 0)
    .attr("y", 0)
    ;

  executorTimelineTaskInfoGTagExplanation
    .selectAll("text")
    .data(function(taskInfo) {
      return ["taskID: " + taskInfo.taskID,
      "executorID: " + taskInfo.executorID,
      "taskStartTime: " + new Date(Number(taskInfo.taskStartTime)),
      "taskFinishTime: " + new Date(Number(taskInfo.taskFinishTime)),
      "serializeMilliSec: " + taskInfo.serializeMilliSec,
      "deserializeMilliSec: " + taskInfo.deserializeMilliSec
      ]
    })
  .enter()
    .append("text")
    .text(function(text) { return text; })
    .attr("font-size", taskInfoExplanationFontSize + "px")
    .attr("fill", "black")
    .attr("x", 5)
    .attr("y", function(text, i) {
      return i * taskInfoExplanationFontSize + 20;
    })
    ;

  var executorTimelineAxisHeight = 20;
  var executorTimelineAxisWidth = executorTimelineSvgWidth;
  var executorTimelineAxisTop = executorTimelineDivTop + executorTimelineDivHeight;
  var executorTimelineAxisLeft = executorTimelineDivLeft;

  var executorTimelineAxisSvg = showDiv
    .append("svg")
    .attr("id", "executorTimelineAxisSvg")
    .attr("width", executorTimelineAxisWidth)
    .attr("height", executorTimelineAxisHeight)
    /*
    .style("position", "absolute")
    .style("top", executorTimelineAxisTop  + "px")
    .style("left",  executorTimelineAxisLeft + "px")
    */
    ;

  executorTimelineAxisSvg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + IDSpace + ",0)")
    .call(executorTimelineGraphBarXAxis)
    .selectAll("text")
    .text(function(text) {
      return dateToString(new Date(Number(text)));
    })
  .attr("transform", "rotate(0)")
  ;

}

function showTaskTimeline(showDiv, taskInfoArray) {

showDiv
.append("h2")
.text("Task Timeline")
;

  var barGraphWidth = 24;
  var spacePerData = 32;
  var barStrokeWidth = 1;
  var IDSpace = 100;
  var graphRightPadding = 100;
  var IDFontSize = 16;
  var graphBarFontSize = 16;
  var taskInfoExplanationFontSize = 20;

  var taskTimelineTaskInfoArray = taskInfoArray;

  var taskTimelineSvgHeight = taskTimelineTaskInfoArray.length * spacePerData;
  var taskTimelineSvgWidth = 1600;
  var taskTimelineDivHeight = Math.min(500, taskTimelineSvgHeight);
  var taskTimelineDivWidth = taskTimelineSvgWidth;
//  var taskTimelineDivTop = executorTimelineDivTop + executorTimelineDivHeight + 20;
  var taskTimelineDivLeft = 0;

  var taskTimelineDiv = showDiv
    .append("div")
    .style("height", taskTimelineDivHeight + "px")
    .style("width", taskTimelineDivWidth + "px")
    .style("overflow-x", "hidden")
    .style("overflow-y", "scroll")
    /*
    .style("position", "absolute")
    .style("top", taskTimelineDivTop + "px")
    .style("left", taskTimelineDivLeft + "px")
    */
    ;

  var taskTimelineBarGraphSvg = taskTimelineDiv
    .append("svg")
    .attr("id", "taskTimelineBarGraphSvg")
    .attr("width", taskTimelineSvgWidth)
    .attr("height", taskTimelineSvgHeight)
    ;

  var taskTimelineMinLength = d3.min(taskTimelineTaskInfoArray, function(taskInfo) {
    return Number(taskInfo.taskStartTime);
  });

  var taskTimelineMaxLength = d3.max(taskTimelineTaskInfoArray, function(taskInfo) {
    return Number(taskInfo.taskFinishTime);
  });

  var taskTimelineGraphBarXScale = d3.scale.linear().domain([taskTimelineMinLength, taskTimelineMaxLength]).range([0, taskTimelineSvgWidth - graphRightPadding - IDSpace]);
  var taskTimelineGraphBarXAxis = d3.svg.axis().scale(taskTimelineGraphBarXScale).orient("bottom");

  var taskTimelineTaskInfoGTag = taskTimelineBarGraphSvg
    .selectAll('#hoge')
    .data(taskTimelineTaskInfoArray)
    .enter()
    .append("g")
    .attr("id", "MAIN_BAR")
    .attr("transform", function(taskInfo,i) { return "translate(0," + i * spacePerData + ")"; })
    ;

  taskTimelineTaskInfoGTag
    .append("rect")
    .style("fill", function(taskInfo,i) {
      return i % 2 == 0 ? "rgb(200,200,200)" : "rgb(225,225,225)";
    })
  .attr("x", 0)
    .attr("y", 0)
    .attr("width", function() {
      return IDSpace + taskTimelineGraphBarXScale(taskTimelineMaxLength) + graphRightPadding;
    })
  .attr("height", spacePerData)
  ;

  var taskTimelineGraphBarXAxisTick = d3.svg.axis().scale(taskTimelineGraphBarXScale).orient("bottom").tickSize(taskTimelineSvgHeight).tickSubdivide(true);

  taskTimelineBarGraphSvg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + IDSpace + ",0)")
    .call(taskTimelineGraphBarXAxisTick)
    ;

  taskTimelineTaskInfoGTag
    .append("text")
    .text(function(taskInfo) {
      return "TaskID: " + taskInfo.taskID;
    })
  .attr("font-size", IDFontSize + "px")
    .attr("fill", "black")
    .attr("x", 0)
    .attr("y", function() {
      return spacePerData / 2 + IDFontSize / 2;
    })
    ;

  taskTimelineTaskInfoGTag
    .append("g")
    .attr("width", function(taskInfo) {
      return taskTimelineGraphBarXScale(Number(taskInfo.taskFinishTime)) - taskTimelineGraphBarXScale(Number(taskInfo.taskStartTime));
    })
  .attr("height", barGraphWidth)
    .attr("transform", function(taskInfo) {
      return "translate(" + (IDSpace + taskTimelineGraphBarXScale(Number(taskInfo.taskStartTime))) + ", " + (spacePerData - barGraphWidth) / 2 + ")";
    })
  .on("mouseover", function(taskInfo){
    d3
      .select(this)
      .select("#deserialize_bar")
      .style("fill", "cyan")
      ;

    d3
      .select(this)
      .select("#execute_bar")
      .style("fill", "cyan")
      ;

    d3
      .select(this)
      .select("#serialize_bar")
      .style("fill", "cyan")
      ;

    showDiv
      .select("#taskTimelineBarGraphSvg")
      .select("#TASK_ID_" + taskInfo.taskID)
      .style("visibility", "visible")
      ;

  })
  .on("mouseout", function(taskInfo){
    d3
      .select(this)
      .select("#deserialize_bar")
      .style("fill", "red")
      ;

    d3
      .select(this)
      .select("#execute_bar")
      .style("fill", "blue")
      ;

    d3
      .select(this)
      .select("#serialize_bar")
      .style("fill", "orange")
      ;

    d3
      .select("#taskTimelineBarGraphSvg")
      .select("#TASK_ID_" + taskInfo.taskID)
      .style("visibility", "hidden")
      ;

  });

  taskTimelineTaskInfoGTag
    .select("g")
    .append("rect")
    .attr("id", "deserialize_bar")
    .style("fill", "red")
    .style("stroke", "white")
    .style("stroke-width", barStrokeWidth)
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", function(taskInfo) {
      return taskTimelineGraphBarXScale(Number(taskInfo.taskStartTime) + Number(taskInfo.deserializeMilliSec)) - taskTimelineGraphBarXScale(Number(taskInfo.taskStartTime));
    })
  .attr("height", barGraphWidth)
  ;

  taskTimelineTaskInfoGTag
    .select("g")
    .append("rect")
    .attr("id", "execute_bar")
    .style("fill", "blue")
    .style("stroke", "white")
    .style("stroke-width", barStrokeWidth)
    .attr("x", function(taskInfo) {
      return taskTimelineGraphBarXScale(Number(taskInfo.taskStartTime) + Number(taskInfo.deserializeMilliSec)) - taskTimelineGraphBarXScale(Number(taskInfo.taskStartTime));
    })
  .attr("y", 0)
    .attr("width", function(taskInfo) {
      return taskTimelineGraphBarXScale(Number(taskInfo.taskFinishTime) - Number(taskInfo.serializeMilliSec)) - taskTimelineGraphBarXScale(Number(taskInfo.taskStartTime) + Number(taskInfo.deserializeMilliSec));
    })
  .attr("height", barGraphWidth)
  ;

  taskTimelineTaskInfoGTag
    .select("g")
    .append("rect")
    .attr("id", "serialize_bar")
    .style("fill", "orange")
    .style("stroke", "white")
    .style("stroke-width", barStrokeWidth)
    .attr("x", function(taskInfo) {
      return taskTimelineGraphBarXScale(Number(taskInfo.taskFinishTime) - Number(taskInfo.serializeMilliSec)) - taskTimelineGraphBarXScale(Number(taskInfo.taskStartTime));
    })
  .attr("y", 0)
    .attr("width", function(taskInfo) {
      return taskTimelineGraphBarXScale(Number(taskInfo.taskFinishTime)) - taskTimelineGraphBarXScale(Number(taskInfo.taskFinishTime) - Number(taskInfo.serializeMilliSec));
    })
  .attr("height", barGraphWidth)
  ;

  var taskTimelineTaskInfoGTagExplanation= taskTimelineBarGraphSvg
    .selectAll(".hoge")
    .data(taskTimelineTaskInfoArray)
    .enter()
    .append("g")
    .attr("id", function(taskInfo) {
      return "TASK_ID_" + taskInfo.taskID;
    })
  .style("visibility", "hidden")
    .attr("transform", function(taskInfo,i) { return "translate(" + (IDSpace + taskTimelineGraphBarXScale(Number(taskInfo.taskFinishTime)) + 10) +  "," + (i * spacePerData + (spacePerData - barGraphWidth) / 2 + 0) + ")"; })
    ;

  taskTimelineTaskInfoGTagExplanation
    .append("rect")
    .style("fill", "white")
    .style("stroke", "black")
    .style("stroke-width", 2)
    .attr("width", 500)
    .attr("height", 250)
    .attr("x", 0)
    .attr("y", 0)
    ;

  taskTimelineTaskInfoGTagExplanation
    .selectAll("text")
    .data(function(taskInfo) {
      return ["taskID: " + taskInfo.taskID,
      "executorID: " + taskInfo.executorID,
      "taskStartTime: " + new Date(Number(taskInfo.taskStartTime)),
      "taskFinishTime: " + new Date(Number(taskInfo.taskFinishTime)),
      "serializeMilliSec: " + taskInfo.serializeMilliSec,
      "deserializeMilliSec: " + taskInfo.deserializeMilliSec,
        ,
        "deserialize time is RED",
          "execute time is BLUE",
          "serialize time is ORANGE"
      ]
    })
  .enter()
    .append("text")
    .text(function(text) { return text; })
    .attr("font-size", taskInfoExplanationFontSize + "px")
    .attr("fill", "black")
    .attr("x", 5)
    .attr("y", function(text, i) {
      return i * taskInfoExplanationFontSize + 20;
    })
    ;


  var taskTimelineAxisHeight = 20;
  var taskTimelineAxisWidth = taskTimelineSvgWidth;
//  var taskTimelineAxisTop = taskTimelineDivTop + taskTimelineDivHeight;
  var taskTimelineAxisLeft = taskTimelineDivLeft;

  var taskTimelineAxisSvg = showDiv
    .append("svg")
    .attr("id", "taskTimelineAxisSvg")
    .attr("width", taskTimelineAxisWidth)
    .attr("height", taskTimelineAxisHeight)
    /*
    .style("position", "absolute")
    .style("top", taskTimelineAxisTop  + "px")
    .style("left",  taskTimelineAxisLeft + "px")
    */
    ;

  taskTimelineAxisSvg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + IDSpace + ",0)")
    .call(taskTimelineGraphBarXAxis)
    .selectAll("text")
    .text(function(text) {
      return dateToString(new Date(Number(text)));
    })
  .attr("transform", "rotate(0)")
  ;

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

function showTaskInformation(showDiv, taskInfo){

var timeFormat = formatTaskTimes(taskInfo);

var radius = 300;
var svgHeight = 2 * radius;
var svgWidth = 2 * radius;
var svgLeft = 1000;
var svgTop = 200;
var color = d3.scale.category20();

var circleGraphSvg = showDiv
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


}

function taskExecutionTime(taskInfo) {
return taskInfo.taskFinishTime - taskInfo.taskStartTime;
}

function taskOtherTime(taskInfo){
return taskExecutionTime(taskInfo) - taskInfo.deserializeMilliSec - taskInfo.serializeMilliSec - taskInfo.JVMGCTime - taskInfo.shuffleReadTime - taskInfo.shuffleWriteTime;
}

function addDummyData(taskInfoArray){
var stageIDCounter = 0;

taskInfoArray.forEach(function (taskInfo) {
taskInfo.gettingResultTime = taskExecutionTime(taskInfo) + taskInfo.taskStartTime;
taskInfo.taskLocality = "nodelocal"

taskInfo.JVMGCTime = 0.0;
taskInfo.shuffleReadTime = 0.0;
taskInfo.fetchWaitTime = 0.0;
taskInfo.shuffleWriteTime = 0.0;

taskInfo.JVMGCTime = taskOtherTime(taskInfo) * 0.1;
taskInfo.shuffleReadTime = taskOtherTime(taskInfo) * 0.1;
taskInfo.fetchWaitTime = taskInfo.shuffleReadTime * 0.3;
taskInfo.shuffleWriteTime = taskOtherTime(taskInfo) * 0.1;

taskInfo.bytesRead = taskInfo.deserializeMilliSec;
taskInfo.memoryBytesSpilled = taskInfo.serializeMilliSec;
taskInfo.diskBytesSpilled = taskInfo.serializeMilliSec + taskOtherTime(taskInfo);
taskInfo.totalBlocksFetched = taskInfo.shuffleReadTime;
taskInfo.remoteBlocksFetched = taskInfo.totalBlocksFetched * 0.3;
taskInfo.localBlocksFetched = taskInfo.totalBlocksFetched - taskInfo.remoteBlocksFetched;
taskInfo.shuffleBytesWritten = taskInfo.totalBlocksFetched * 0.8;

taskInfo.stageID = (stageIDCounter++) % 3;
});
}

function switchOffTab(tabs, tabProperty){
    var tmpStr = "#tab" + tabProperty;

    tabs
    .select(tmpStr)
    .style("display", "none")
    ;

    var tmpStr = "#tabName" + tabProperty;

    tabs
    .select(tmpStr)
    .attr("class", "tabNameOff")
    ;
}

function switchOnTab(tabs, tabProperty){
    var tmpStr = "#tab" + tabProperty;

    tabs
    .select(tmpStr)
    .style("display", "block")
    ;

    var tmpStr = "#tabName" + tabProperty;

    tabs
    .select(tmpStr)
    .attr("class", "tabNameOn")
    ;
}

function switchTab(tabProperty){
    var tabs = d3
    .select("#mainTabBox")
    .select("#tabs")
    ;

    switchOffTab(tabs, "ProtoType");
    switchOffTab(tabs, "AllExecutors");
    switchOffTab(tabs, "AllStages");
    switchOffTab(tabs, "Test");

    switchOnTab(tabs, tabProperty);

    return false;
}

function appendTabName(tabs, tabProperty) {
    var tmpStr1 = "#tab" + tabProperty;
    var tmpStr2 = "tabName" + tabProperty;
    var tmpStr3 = "return switchTab('" + tabProperty + "');";

  tabs
  .append("a")
  .attr("href", tmpStr1)
  .attr("id", tmpStr2)
  .attr("class", "tabNameOff")
  .attr("onClick", tmpStr3)
  .text(tabProperty)
  ;
}

function appendTabBody(tabs, tabProperty){
var tmpStr = "tab" + tabProperty;

var tabBody = tabs
.append("div")
.attr("id", tmpStr)
.attr("class", "tab")
.append("p")
 ;

 return tabBody;
}

function main(){
d3.csv("eventlog.txt", function(error, taskInfoArray) {
  addDummyData(taskInfoArray);

  //showData(showDiv, taskInfoArray);

  var mainTabBox = d3
  .select("body")
  .append("div")
  .attr("class", "mainTabBox")
  .attr("id", "mainTabBox")
  ;

  var tabs = mainTabBox
  .append("p")
  .attr("class", "tabs")
  .attr("id", "tabs")
  ;

    appendTabName(tabs, "ProtoType");
    appendTabName(tabs, "AllExecutors");
    appendTabName(tabs, "AllStages");
    appendTabName(tabs, "Test");

  var tabProtoType = appendTabBody(tabs, "ProtoType");
  var tabAllExecutors = appendTabBody(tabs, "AllExecutors");
  var tabAllStages = appendTabBody(tabs, "AllStages");
  var tabTest = appendTabBody(tabs, "Test");

  switchTab("Test");

  showExecutorTimeline(tabProtoType, taskInfoArray);
  showTaskTimeline(tabProtoType, taskInfoArray);
  showTaskInformation(tabTest, taskInfoArray[2]);

})
;
}
