
var MAIN_TAB_PROPERTIES = ["ProtoType", "AllExecutors", "AllStages", "Variable"/*, "taskTest", "executorTest"*/];
var TASK_INFO_ARRAY = null;
var EXECUTOR_INFO_ARRAY = null;
var STAGE_INFO_ARRAY = null;

main();

function main_inner(taskInfoArray){
  addDummyData(taskInfoArray);

  TASK_INFO_ARRAY = taskInfoArray;

  var executorInfoArray = d3
  .nest()
  .key(function(taskInfo) { return Number(taskInfo.executorID) })
  .entries(taskInfoArray)
  ;

  EXECUTOR_INFO_ARRAY = executorInfoArray;

  var stageInfoArray = d3
  .nest()
  .key(function(taskInfo) { return Number(taskInfo.stageID) })
  .entries(taskInfoArray)
  ;

  stageInfoArray.forEach(function(stageInfo, index){
    stageInfo.submissionTime = d3.min(stageInfo.values, function(taskInfo) {
        return Number(taskInfo.taskStartTime);
    });
    stageInfo.completionTime = d3.max(stageInfo.values, function(taskInfo) {
        return Number(taskInfo.taskFinishTime);
    });
    stageInfo.failureReason = index % 10 !== 0 ? null : "failure";
    stageInfo.taskCount = stageInfo.values.length;
    stageInfo.RDDs = [];
    for(var i=0;i < 10;i++){
        stageInfo.RDDs.push({
            "id": Number(stageInfo.key) * 10 + i,
            "memSize": 100 - (i - 5) * (i - 5),
            "diskSize": 100 + (i - 5) * (i - 5) * (i - 5) * (i - 5)
        });
    }
  });

  STAGE_INFO_ARRAY = stageInfoArray;

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

/*
  var taskInfo = taskInfoArray[2];
  setTaskInfoTab("Variable", taskInfo);
*/
/*
  var executorInfo = executorInfoArray[0];
  setExecutorInfoTab("Variable", executorInfo);
  */
  /*
    var stageInfo = stageInfoArray[0];
    setStageInfoTab("Variable", stageInfo);
    */


  setAllExecutorsInfoTab(executorInfoArray);
  setAllStagesInfoTab(stageInfoArray);

}

function main(){
if(navigator.userAgent.indexOf("Opera") != -1){ //Opera
}
else if(navigator.userAgent.indexOf("MSIE") != -1){ //Internet Explorer
}
else if(navigator.userAgent.indexOf("Firefox") != -1){ //Firefox
d3.csv('eventlog.txt', function(error, taskInfoArray) {
    main_inner(taskInfoArray);
})
;
}
else if(navigator.userAgent.indexOf("Netscape") != -1){ //Netscape
}
else if(navigator.userAgent.indexOf("Chrome") != -1){ //Chrome
d3.csv('eventlog.txt', function(error, taskInfoArray) {
    main_inner(taskInfoArray);
})
;
}
else if(navigator.userAgent.indexOf("Safari") != -1){ //Safari
}
else{
d3.csv('http://localhost:12345/~penguin/eventlog.txt', function(error, taskInfoArray) {
    main_inner(taskInfoArray);
})
;
}

}
