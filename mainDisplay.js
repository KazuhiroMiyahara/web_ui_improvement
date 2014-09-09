function removeContentOfTab(tabs, tabProperty){
  var tabBody = d3
  .select("#tab" + tabProperty)
  ;

  tabBody
  .remove()
  ;

  appendTabBody(tabs, tabProperty);
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

function switchTab(tabs, tabProperties, tabProperty){
    tabProperties
    .forEach(function (tabP){
        switchOffTab(tabs, tabP);
    })
    ;

    switchOnTab(tabs, tabProperty);

    return false;
}

function switchTabJSON(tabsID, tabPropertiesJSON, tabProperty){
    var tabs = d3
    .select("#" + tabsID)
    ;
    var tabProperties = JSON.parse(tabPropertiesJSON);

    switchTab(tabs, tabProperties, tabProperty);
}

function appendTabName(tabsID, tabProperties, tabProperty, tabText) {
    var tabs = d3
    .select("#" + tabsID)
    ;
    var tabPropertiesJSON = JSON.stringify(tabProperties);

    var tmpStr1 = "#tab" + tabProperty;
    var tmpStr2 = "tabName" + tabProperty;
    var tmpStr3 = "switchTabJSON('" + tabsID + "','" + tabPropertiesJSON + "','" + tabProperty + "'); return false;";

  tabs
  .append("a")
  .attr("href", tmpStr1)
  .attr("id", tmpStr2)
  .attr("class", "tabNameOff")
  .attr("onClick", tmpStr3)
  .text(tabText)
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

function setTaskInfoTab(tabProperty, taskInfo){
  d3
  .select("#tabName" + tabProperty)
  .text("taskID:" + taskInfo.taskID)
  ;

  var tabBody = d3
  .select("#tab" + tabProperty)
  ;

  showTaskInformation(tabBody, taskInfo);

}

function setExecutorInfoTab(tabProperty, executorInfo){
  d3
  .select("#tabName" + tabProperty)
  .text("executorID:" + executorInfo.key)
  ;

  var tabBody = d3
  .select("#tab" + tabProperty)
  ;

  showExecutorInformation(tabBody, executorInfo);
}

function setStageInfoTab(tabProperty, stageInfo){
  d3
  .select("#tabName" + tabProperty)
  .text("stageID:" + stageInfo.key)
  ;

  var tabBody = d3
  .select("#tab" + tabProperty)
  ;

  showStageInformation(tabBody, stageInfo);
}

function setAllExecutorsInfoTab(executorInfoArray){
  var tabBody = d3
  .select("#tab" + "AllExecutors")
  ;

  showAllExecutorsInformation(tabBody, executorInfoArray);
}

