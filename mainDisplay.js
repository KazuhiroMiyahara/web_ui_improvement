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

