main();

function main(){
d3.csv("eventlog.txt", function(error, taskInfoArray) {
  addDummyData(taskInfoArray);
  var executorInfoArray = d3
    .nest()
    .key(function(taskInfo) { return Number(taskInfo.executorID) })
    .entries(taskInfoArray)
    ;


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

    appendTabName(tabs, "ProtoType", "ProtoType");
    appendTabName(tabs, "AllExecutors", "AllExecutors");
    appendTabName(tabs, "AllStages", "AllStages");
    appendTabName(tabs, "Variable", "");

  var tabProtoType = appendTabBody(tabs, "ProtoType");
  var tabAllExecutors = appendTabBody(tabs, "AllExecutors");
  var tabAllStages = appendTabBody(tabs, "AllStages");
  var tabVariable = appendTabBody(tabs, "Variable");

  switchTab("Variable");

  showExecutorTimeline(tabProtoType, taskInfoArray);
  showTaskTimeline(tabProtoType, taskInfoArray);
  /*
  var taskInfo = taskInfoArray[2];
  switchTaskInfoTab("Variable", taskInfo);
  /*/
  var executorInfo = executorInfoArray[0];
  switchExecutorInfoTab("Variable", executorInfo);
  //*/

})
;
}
