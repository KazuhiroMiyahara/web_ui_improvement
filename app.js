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
  /*
  showTaskInformation(tabTest, taskInfoArray[2]);
  /*/
  showExecutorInformation(tabTest, executorInfoArray[0]);
  //*/

})
;
}
