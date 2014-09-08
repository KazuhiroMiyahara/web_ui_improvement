
var MAIN_TAB_PROPERTIES = ["ProtoType", "AllExecutors", "AllStages", "Variable"/*, "taskTest", "executorTest"*/];
var TASK_INFO_ARRAY = null;
var EXECUTOR_INFO_ARRAY = null;
var STAGE_INFO_ARRAY = null;

main();

function main(){
d3.csv("eventlog.txt", function(error, taskInfoArray) {
  addDummyData(taskInfoArray);

  TASK_INFO_ARRAY = taskInfoArray;

  var executorInfoArray = d3
  .nest()
  .key(function(taskInfo) { return Number(taskInfo.executorID) })
  .entries(taskInfoArray)
  ;

  EXECUTOR_INFO_ARRAY = executorInfoArray;

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

  switchTab(tabs, tabProperties, "AllExecutors");

  var tabProtoType = d3
  .select("#tabProtoType")
  ;

  showExecutorTimeline(tabProtoType, taskInfoArray);
  showTaskTimeline(tabProtoType, taskInfoArray);

//*
  var taskInfo = taskInfoArray[2];
  setTaskInfoTab("Variable", taskInfo);
/*/
  var executorInfo = executorInfoArray[0];
  setExecutorInfoTab("Variable", executorInfo);
  //*/

  setAllExecutorsInfoTab(executorInfoArray);

})
;
}
