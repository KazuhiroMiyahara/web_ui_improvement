
var MAIN_TAB_PROPERTIES = ["ProtoType", "AllExecutors", "AllStages", "Variable"/*, "taskTest", "executorTest"*/];

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

  var tabsID = "mainTabs"
  var tabs = mainTabBox
  .append("p")
  .attr("class", "tabs")
  .attr("id", tabsID)
  ;

  var tabProperties = MAIN_TAB_PROPERTIES;

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

  switchTab(tabs, tabProperties, "Variable");

  var tabProtoType = d3
  .select("#tabProtoType")
  ;

  showExecutorTimeline(tabProtoType, taskInfoArray);
  showTaskTimeline(tabProtoType, taskInfoArray);

  var executorInfo = executorInfoArray[0];
  setExecutorInfoTab("Variable", executorInfo);

/*
  var taskInfo = taskInfoArray[2];
  setTaskInfoTab("taskTest", taskInfo);

  var executorInfo = executorInfoArray[0];
  setExecutorInfoTab("executorTest", executorInfo);
  */

})
;
}
