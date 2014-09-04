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
;

 return tabBody;
}

function main(){
d3.csv("eventlog.txt", function(error, taskInfoArray) {
  addDummyData(taskInfoArray);

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
