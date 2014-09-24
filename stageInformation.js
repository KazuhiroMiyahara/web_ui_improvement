
var TASK_TIMELINE_MIN_LENGTH = null;
var TASK_TIMELINE_MAX_LENGTH = null;

function mouseOverTaskGraphBar(taskInfo){
    d3.selectAll(".graphBarG_taskID" + taskInfo.taskID).selectAll(".linkBar").attr("class", "linkBarHover");
    d3.selectAll(".graphBarG_taskID" + taskInfo.taskID).selectAll(".partialBar")
    .style("fill", function(stackInfo){
        return d3.rgb(stackInfo.color).brighter();
    })
    .style("stroke", "dimgray")
    ;
}

function mouseOutTaskGraphBar(taskInfo){
    d3.selectAll(".graphBarG_taskID" + taskInfo.taskID).selectAll(".linkBarHover").attr("class", "linkBar");
    d3.selectAll(".graphBarG_taskID" + taskInfo.taskID).selectAll(".partialBar")
    .style("fill", function(stackInfo){
        return d3.rgb(stackInfo.color);
    })
    .style("stroke", "white")
    ;
}


function linkStageInfo(stageInfo){
        var tabs = d3
        .select("#mainTabs")
        ;

        removeContentOfTab(tabs, "Variable");
        setStageInfoTab("Variable", stageInfo);
        switchTab(tabs, MAIN_TAB_PROPERTIES, "Variable");
}

//----------------------------------------------------------------------------------------------------------------

function addTaskTimeline(taskInfoArray, timelineSpace, fontSize, checkBoxAttributes){

  var timelineTable = timelineSpace
  .append("table")
  .style("font-size", fontSize + "px")
  .style("border-collapse", "separate")
  .style("border-spacing", "1px 1px")
  .attr("cellpadding", 3)
  ;

  var timelineTableHeaderRow = timelineTable
  .append("tr")
  ;

  var timelineTableTaskIDNameCell = timelineTableHeaderRow
  .append("th")
  .text("TaskID")
  .style("font-size", fontSize + "px")
  .style("padding", "12px")
  .style("background", "sandybrown")
  ;

  var timelineTableExecutorIDNameCell = timelineTableHeaderRow
  .append("th")
  .text("ExecutorID")
  .style("font-size", fontSize + "px")
  .style("padding", "12px")
  .style("background", "sandybrown")
  ;

  var timelineTableHostNameNameCell = timelineTableHeaderRow
  .append("th")
  .text("HostName")
  .style("font-size", fontSize + "px")
  .style("padding", "12px")
  .style("background", "sandybrown")
  ;

  var timelineTableAxisCell = timelineTableHeaderRow
  .append("td")
  .style("background", "sandybrown")
  .style("valign", "bottom")
  ;

  var timelineWidth = 1200;
  var timelineGraphBarHeight = 20;
  var barStrokeWidth = 1;

  var timelineAxisHeight = timelineGraphBarHeight;
  var timelineAxisWidth = timelineWidth;

  var taskTimelineMinLength = TASK_TIMELINE_MIN_LENGTH != null ? TASK_TIMELINE_MIN_LENGTH : d3.min(taskInfoArray, function(taskInfo) {
      return Number(taskInfo.taskStartTime);
  });

  var taskTimelineMaxLength = TASK_TIMELINE_MAX_LENGTH != null ? TASK_TIMELINE_MAX_LENGTH : d3.max(taskInfoArray, function(taskInfo) {
      return Number(taskInfo.taskFinishTime);
  });

  var taskTimelineXScale = d3.scale.linear().domain([taskTimelineMinLength, taskTimelineMaxLength]).range([0, timelineWidth]);
  var taskTimelineXAxis = d3.svg.axis().scale(taskTimelineXScale).orient("top");

    var timelineTableAxisCellSvgWidth = timelineAxisWidth + 2 * timeLineCellPaddingWidth;
    var timelineTableAxisCellSvgHeight = timelineAxisHeight + 1;

  var timelineTableAxisCellSvg = timelineTableAxisCell
  .append("svg")
  .attr("height", timelineTableAxisCellSvgHeight)
  .attr("width", timelineTableAxisCellSvgWidth)
  ;

  var timelineTableAxisCellSvgG = timelineTableAxisCellSvg
  .append("g")
  .attr("transform", "translate(" + timeLineCellPaddingWidth + "," + timelineGraphBarHeight + ")")
  .attr("class", "axis")
  ;

  timelineTableAxisCellSvgG
  .call(taskTimelineXAxis)
  .selectAll("text")
  .text(function(text) {
    return dateToString(new Date(Number(text)));
  })
  ;

  var timelineRow = timelineTable
  .selectAll(".tr")
  .data(taskInfoArray)
  .enter()
  .append("tr")
  ;

  var timelineTaskIDCell = timelineRow
  .append("th")
  .text(function (taskInfo){
    return taskInfo.taskID;
  })
  .style("font-size", fontSize + "px")
  .style("padding", "12px")
  .style("background", function(taskInfo, index) {
    return index % 2 == 0 ? "wheat" : "tan";
  })
  .on("click", function(taskInfo, index){
    d3.select(this).style("background", index % 2 == 0 ? "wheat" : "tan");
    linkTaskInfo(taskInfo);
  })
  .on("mouseover", function(){
    d3.select(this).style("background", "orangered");
  })
  .on("mouseout", function(taskInfo, index){
    d3.select(this).style("background", index % 2 == 0 ? "wheat" : "tan");
  })
  ;

  var timelineExecutorIDCell = timelineRow
  .append("th")
  .text(function (taskInfo){
    return taskInfo.executorID;
  })
  .style("font-size", fontSize + "px")
  .style("padding", "12px")
  .style("background", function(taskInfo, index) {
    return index % 2 == 0 ? "wheat" : "tan";
  })
  ;

  var timelineHostNameCell = timelineRow
  .append("th")
  .text(function (taskInfo){
    return taskInfo.hostName;
  })
  .style("font-size", fontSize + "px")
  .style("padding", "12px")
  .style("background", function(taskInfo, index) {
    return index % 2 == 0 ? "wheat" : "tan";
  })
  ;

  var timelineGraphBarCell = timelineRow
  .append("td")
  .style("padding", timeLineCellPaddingHeight + "px " + timeLineCellPaddingWidth + "px")
  .style("background", function(executorInfo, index) {
    return index % 2 == 0 ? "wheat" : "tan";
  })
  ;

  var timelineGraphBarSvg = timelineGraphBarCell
  .append("svg")
  .attr("height", timelineGraphBarHeight)
  .attr("width", timelineWidth)
  .attr("overflow", "hidden")
  ;

    var timelineGraphBarForEachTaskG = timelineGraphBarSvg
    .selectAll(".g")
    .data(function (taskInfo) {return [taskInfo];})
    .enter()
    .append("g")
    .attr("class", function(taskInfo){
        return "graphBarG_taskID" + taskInfo.taskID;
    })
    .attr("transform", function(taskInfo) {
    return "translate(" + (taskTimelineXScale(Number(taskInfo.taskStartTime))) + ", " + 0 + ")";
    })
    .on("click", function(taskInfo){
        mouseOutTaskGraphBar(taskInfo);
        linkTaskInfo(taskInfo);
    })
    .on("mouseover", function(taskInfo){
        mouseOverTaskGraphBar(taskInfo);
    })
    .on("mouseout", function(taskInfo){
        mouseOutTaskGraphBar(taskInfo);
    })
    ;


//add whole time bar
  var timelineGraphBarForEachTaskGWholeRect = timelineGraphBarForEachTaskG
  .append("rect")
  .attr("class", "linkBar")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", function(taskInfo) {
    return taskTimelineXScale(Number(taskInfo.taskFinishTime)) - taskTimelineXScale(Number(taskInfo.taskStartTime));
  })
  .attr("height", timelineGraphBarHeight)
  ;

//add partial time bar
    var timelineGraphBarForEachTaskGPartialRect = timelineGraphBarForEachTaskG
    .selectAll(".foo")
    .data(function(taskInfo) {
        return formatTaskInfoForCheckBoxStack(taskInfo, checkBoxAttributes).stackInfoArray;
    })
    .enter()
    .append("rect")
    .attr("class", "partialBar")
    .style("fill", function(stackInfo){
        return stackInfo.color;
    })
    .style("stroke", "white")
    .style("stroke-width", "1")
    .attr("x", function(stackInfo) {
        return taskTimelineXScale(stackInfo.start) - taskTimelineXScale(stackInfo.taskStartTime);
    })
    .attr("y", 0)
    .attr("width", function(stackInfo) {
        return taskTimelineXScale(stackInfo.end) - taskTimelineXScale(stackInfo.start);
    })
    .attr("height", timelineGraphBarHeight)
    ;

//--------------------------------- repaint ---------------------------------------------

var repaint = function (){

        timelineTableAxisCellSvgG
        .call(taskTimelineXAxis)
        .selectAll("text")
        .text(function(text) {
            return dateToString(new Date(Number(text)));
        })
        ;

        timelineGraphBarForEachTaskG
        .attr("transform", function(taskInfo) {
            return "translate(" + (taskTimelineXScale(Number(taskInfo.taskStartTime))) + ", " + 0 + ")";
        })
        ;

        timelineGraphBarForEachTaskGWholeRect
        .attr("width", function(taskInfo) {
            return taskTimelineXScale(Number(taskInfo.taskFinishTime)) - taskTimelineXScale(Number(taskInfo.taskStartTime));
        })
        .attr("height", timelineGraphBarHeight)
        ;

        timelineGraphBarForEachTaskGPartialRect
        .attr("x", function(stackInfo) {
            return taskTimelineXScale(stackInfo.start) - taskTimelineXScale(stackInfo.taskStartTime);
        })
        .attr("y", 0)
        .attr("width", function(stackInfo) {
            return taskTimelineXScale(stackInfo.end) - taskTimelineXScale(stackInfo.start);
        })
        .attr("height", timelineGraphBarHeight)
        ;
}

//--------------------------------- zoom ---------------------------------------------
    var prevScale = 1.0;

    var zoom = d3
    .behavior
    .zoom()
    .on("zoom", function() {
        var mousePoint = d3.mouse(this)[0] - timeLineCellPaddingWidth;

        var timeOfMousePoint = taskTimelineXScale.invert(mousePoint);
        var scaleRate = d3.event.scale / prevScale;
        prevScale = d3.event.scale;

        taskTimelineMinLength = timeOfMousePoint - (timeOfMousePoint - taskTimelineMinLength) * scaleRate;
        taskTimelineMaxLength = timeOfMousePoint + (taskTimelineMaxLength - timeOfMousePoint) * scaleRate;

        TASK_TIMELINE_MIN_LENGTH = taskTimelineMinLength;
        TASK_TIMELINE_MAX_LENGTH = taskTimelineMaxLength;

        taskTimelineXScale.domain([taskTimelineMinLength, taskTimelineMaxLength]).range([0, timelineWidth]);
        taskTimelineXAxis.scale(taskTimelineXScale);

        repaint();

    })
    ;

    timelineTableAxisCell
    .call(zoom)
    ;

    timelineGraphBarCell
    .call(zoom)
    ;

//--------------------------------- drag ---------------------------------------------

    var drag = d3
    .behavior
    .drag()
    .on("drag", function(){
        var taskTimelineDiffLength = d3.event.dx * (taskTimelineXScale.invert(1) - taskTimelineXScale.invert(0));

        taskTimelineMinLength -= taskTimelineDiffLength;
        taskTimelineMaxLength -= taskTimelineDiffLength;

        TASK_TIMELINE_MIN_LENGTH = taskTimelineMinLength;
        TASK_TIMELINE_MAX_LENGTH = taskTimelineMaxLength;

        taskTimelineXScale.domain([taskTimelineMinLength, taskTimelineMaxLength]).range([0, timelineWidth]);
        taskTimelineXAxis.scale(taskTimelineXScale);

        repaint();

    })
    ;

    timelineTableAxisCell
    .call(drag)
    ;

    timelineGraphBarCell
    .call(drag)
    ;

//--------------------------------------------------------------------------------------



}



//-------------------------------------------------------------------------------------------------------------------

function formatTaskInfoForCheckBoxStack(taskInfo, checkBoxAttributes){
    var sumTime = Number(taskInfo.taskStartTime);
    var stackInfoArray = [];

    checkBoxAttributes
    .forEach(function(attribute){

        var isChecked = document
        .getElementById(attribute.property + "CheckBox")
        .checked
        ;

        if(isChecked){
            stackInfoArray
            .push({
                "taskStartTime" : Number(taskInfo.taskStartTime),
                "color" : makeColorsOfTaskElementsWithoutPartition()[attribute.typeName],
               "start" : sumTime,
               "end" : sumTime + attribute.accessor(taskInfo),
            })
            ;

            sumTime += attribute.accessor(taskInfo);
        }
    })
    ;

    var ret = {
        "stackInfoArray" : stackInfoArray,
        "sumTime" : sumTime - Number(taskInfo.taskStartTime),
    }
    ;


     return ret;
}

//-------------------------------------------------------------------------------------------------------------------
function addBarGraphWithProperty(array, tabProperty, accessorFunction, xAxisMapper, barsAreLinked, xAxisExplanation, yAxisExplanation, fontSize){
    var tabBody = d3.
    select("#tab" + tabProperty)
    ;

    tabBody
    .style("overflow-x", "scroll")
    ;


    addBarGraph(array, tabBody, accessorFunction, xAxisMapper, barsAreLinked, xAxisExplanation, yAxisExplanation, fontSize);
}
//-------------------------------------------------------------------------------------------------------------------
function addBarGraph(array, space, accessorFunction, xAxisMapper, barsAreLinked, xAxisExplanation, yAxisExplanation, fontSize){

    var sortedArray = array
    .sort(function (a, b) { return d3.descending(accessorFunction(a), accessorFunction(b)); })
    ;

    var yAxisUnderPadding = 5;
    var height = 300;
    var barWidth = 30;
    var spacePerBar = 60;


    var barGraphTable = space
    .append("table")
    .style("font-size", fontSize + "px")
    .style("border-collapse", "separate")
    .style("border-spacing", "1px 1px")
    .attr("cellpadding", 3)
    .style("margin", "20px")
    ;

    var firstRow = barGraphTable
    .append("tr")
    ;

    var secondRow = barGraphTable
    .append("tr")
    ;

    var thirdRow = barGraphTable
    .append("tr")
    ;

    var yAxisCell = firstRow
    .append("td")
    .attr("rowspan", 2)
    .style("background", "sandybrown")
    .attr("valign", "top")
    .attr("align", "right")
    ;

    var drawSpaceCell = firstRow
    .selectAll(".foo")
    .data(sortedArray)
    .enter()
    .append("td")
    .style("padding", "0px")
    .style("background", function(executorInfo, index) {
      return index % 2 == 0 ? "wheat" : "tan";
    })
    .attr("align", "center")
    .attr("width", spacePerBar)
    ;

    secondRow
    .selectAll(".foo")
    .data(sortedArray)
    .enter()
    .append("td")
    .style("background", function(executorInfo, index) {
      return index % 2 == 0 ? "wheat" : "tan";
    })
    .attr("height",yAxisUnderPadding)
    ;

    var xAxisExplanationCell = thirdRow
    .append("th")
    .attr("align", "center")
    .text(xAxisExplanation)
    .style("font-size", "20px")
    .style("background", "sandybrown")
    .style("padding", "12px")
    ;

    var xAxisCell = thirdRow
    .selectAll(".foo")
    .data(sortedArray)
    .enter()
    .append("th")
    .attr("align", "center")
    ;

    var maxValue = d3.max(array, accessorFunction);
    var yScale = d3
    .scale
    .linear()
    .range([height, 0])
    .domain([0, maxValue])
    ;

    var yAxis = d3.svg.axis().scale(yScale).orient("left");

    xAxisCell
    .text(function (data) {
        return xAxisMapper(data);
    })
    .style("font-size", fontSize + "px")
    .style("padding", "12px")
    .style("background", function(taskOrRDDInfo, index) {
      return index % 2 == 0 ? "wheat" : "tan";
    })
    .on("click", function(taskOrRDDInfo, index){
        if(barsAreLinked){
            d3.select(this).style("background", index % 2 == 0 ? "wheat" : "tan");
            linkTaskInfo(taskOrRDDInfo);
        }
    })
    .on("mouseover", function(){
        if(barsAreLinked){
            d3.select(this).style("background", "orangered");
        }
    })
    .on("mouseout", function(taskInfo, index){
        if(barsAreLinked){
            d3.select(this).style("background", index % 2 == 0 ? "wheat" : "tan");
        }
    })
    ;

    var yAxisWidth = 80;

    yAxisCell
    .append("svg")
    .attr("height", height + resourcesCellPaddingUpper + yAxisUnderPadding)
    .attr("width", yAxisWidth)
    .append("g")
    .attr("transform", "translate(" + (yAxisWidth - 1) + "," + (resourcesCellPaddingUpper - 4) + ")")
    .attr("class", "axis")
    .call(yAxis)
    .append("text")
    .text(yAxisExplanation)
    .attr("y", -10)
    .style("font-size", "15px")
    .style("text-anchor", "end")
    ;



    var bar = drawSpaceCell
    .append("svg")
    .attr("height", height + resourcesCellPaddingUpper)
    .attr("width", spacePerBar)
    .append("g")
    .attr("class", function(taskInfo){
        return "graphBarG_taskID" + taskInfo.taskID;
    })
    .attr("transform", "translate(" + (spacePerBar - barWidth) / 2 + "," + 0 + ")")
    .on("click", function(taskOrRDDInfo){
      if(barsAreLinked){
            mouseOutTaskGraphBar(taskOrRDDInfo);
            linkTaskInfo(taskOrRDDInfo);
      }
    })
    .on("mouseover", function(taskOrRDDInfo){
        if(barsAreLinked){
            mouseOverTaskGraphBar(taskOrRDDInfo);
        }
    })
    .on("mouseout", function(taskOrRDDInfo){
        if(barsAreLinked){
            mouseOutTaskGraphBar(taskOrRDDInfo);
        }
    })
    ;

    bar
    .append("rect")
    .attr("y", function(d) { return resourcesCellPaddingUpper + yScale(accessorFunction(d));})
    .attr("height", function(d) { return height - yScale(accessorFunction(d)); })
    .attr("width", barWidth)
    .attr("class", function(taskOrRDDInfo) {
      return barsAreLinked ? "linkBar" : "notLinkBar";
    })
    ;

    bar
    .append("text")
    .attr("x", 5)
    .attr("y", function(d) { return resourcesCellPaddingUpper + yScale(accessorFunction(d)) + 18;})
    .text(function(d) { return d3.round(accessorFunction(d),2); })
    .attr("transform", function(d) { return "rotate(-90, 0, " + (resourcesCellPaddingUpper + yScale(accessorFunction(d))) + ")";})
    ;

}

//-------------------------------------------------------------------------------------------------------------------

function addStageResources(stageInfo, resourcesSpace, fontSize) {
  var stageResourcesTabBox = resourcesSpace
  .append("div")
  .attr("class", "stageResourcesTabBox")
  .attr("id", "stageResourcesTabBox")
  ;

  var tabsID = "resourcesTabs"
  var tabs = stageResourcesTabBox
  .append("p")
  .attr("class", "tabs")
  .attr("id", tabsID)
  ;

  var tabProperties = ["ReadBytes", "RemoteReadBytes", "MemoryWriteBytes", "DiskWriteBytes", "ShuffleWriteBytes", "ExecTimes", "RDDMemSize", "RDDDiskSize", "RDDSumSize"];
  var accessorFunctions = [
  function(taskInfo) { return Number(taskInfo.bytesRead);},
  function(taskInfo) { return Number(taskInfo.remoteBytesRead);},
  function(taskInfo) { return Number(taskInfo.memoryBytesSpilled);},
  function(taskInfo) { return Number(taskInfo.diskBytesSpilled);},
  function(taskInfo) { return Number(taskInfo.shuffleBytesWritten);},
  function(taskInfo) { return (Number(taskInfo.taskFinishTime) - Number(taskInfo.taskStartTime));},
  function(RDD) { return Number(RDD.memSize);},
  function(RDD) { return Number(RDD.diskSize);},
  function(RDD) { return Number(RDD.memSize) + Number(RDD.diskSize);},
  ];
  var xAxisExplanationArray = ["Task ID", "Task ID", "Task ID", "Task ID", "Task ID", "Task ID", "RDD ID", "RDD ID", "RDD ID"];
  var yAxisExplanationArray = ["[bytes]", "[bytes]", "[bytes]", "[bytes]", "[bytes]", "[ms]", "[bytes]", "[bytes]", "[bytes]"];

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

  switchTab(tabs, tabProperties, tabProperties[0]);

    tabProperties
    .forEach(function(tabProperty, i){
        if(i < 6){
            addBarGraphWithProperty(stageInfo.values, tabProperties[i], accessorFunctions[i], function(taskInfo) {
                return taskInfo.taskID;
            }, true, xAxisExplanationArray[i], yAxisExplanationArray[i], fontSize);
        }else{
            addBarGraphWithProperty(stageInfo.RDDs, tabProperties[i], accessorFunctions[i], function(RDD) {
                return RDD.id;
            }, false, xAxisExplanationArray[i], yAxisExplanationArray[i], fontSize);
        }
    })
    ;


}

//-------------------------------------------------------------------------------------------------------------------

function resetTaskTimeline(taskInfoArray, timelineSpace, fontSize, checkBoxAttributes){
    TASK_TIMELINE_MIN_LENGTH = null;
    TASK_TIMELINE_MAX_LENGTH = null;

    timelineSpace.select("table").remove();
    addTaskTimeline(taskInfoArray, timelineSpace, fontSize, checkBoxAttributes);
}

//-------------------------------------------------------------------------------------------------------------------

function repaintTaskTimeline(taskInfoArray, timelineSpace, fontSize, checkBoxAttributes){
    timelineSpace.select("table").remove();
    addTaskTimeline(taskInfoArray, timelineSpace, fontSize, checkBoxAttributes);
}



//-------------------------------------------------------------------------------------------------------------------

function sortTasksOfStageInformation(stageInfo, timelineSpace, fontSize, checkBoxAttributes, accessor){

    var taskInfoArray = stageInfo.values;
    taskInfoArray = taskInfoArray
    .sort(function (a, b) { return d3.ascending(accessor(a), accessor(b));})
    ;
    stageInfo.values = taskInfoArray;

    repaintTaskTimeline(stageInfo.values, timelineSpace, fontSize, checkBoxAttributes);

}

//-------------------------------------------------------------------------------------------------------------------

function sortTasksOfStageInformationByID(stageInfo, timelineSpace, fontSize, checkBoxAttributes){

    sortTasksOfStageInformation(stageInfo, timelineSpace, fontSize, checkBoxAttributes, function(a) { return Number(a.taskID); })

}


//-------------------------------------------------------------------------------------------------------------------

function sortTasksOfStageInformationByStartTime(stageInfo, timelineSpace, fontSize, checkBoxAttributes){

    sortTasksOfStageInformation(stageInfo, timelineSpace, fontSize, checkBoxAttributes, function(a) { return Number(a.taskStartTime); })


}


//-------------------------------------------------------------------------------------------------------------------

function sortTasksOfStageInformationByRunTime(stageInfo, timelineSpace, fontSize, checkBoxAttributes){

    sortTasksOfStageInformation(stageInfo, timelineSpace, fontSize, checkBoxAttributes, function(a) { return -(Number(a.taskFinishTime) - Number(a.taskStartTime)); })

}


//-------------------------------------------------------------------------------------------------------------------

function sortTasksOfStageInformationByExecutorID(stageInfo, timelineSpace, fontSize, checkBoxAttributes){

    sortTasksOfStageInformation(stageInfo, timelineSpace, fontSize, checkBoxAttributes, function(a) { return Number(a.executorID); })

}


//-------------------------------------------------------------------------------------------------------------------

function sortTasksOfStageInformationByHostName(stageInfo, timelineSpace, fontSize, checkBoxAttributes){

    sortTasksOfStageInformation(stageInfo, timelineSpace, fontSize, checkBoxAttributes, function(a) { return a.hostName; })

}


//-------------------------------------------------------------------------------------------------------------------

function sortTasksOfStageInformationBySumOfCheckedParameters(stageInfo, timelineSpace, fontSize, checkBoxAttributes){

    sortTasksOfStageInformation(stageInfo, timelineSpace, fontSize, checkBoxAttributes, function(a) { return - formatTaskInfoForCheckBoxStack(a, checkBoxAttributes).sumTime; })

}


//-------------------------------------------------------------------------------------------------------------------

function addCheckBox(checkBoxRow, typeName, property, stageInfo, timelineSpace, fontSize, checkBoxAttributes){

var checkBoxSpace = checkBoxRow
.append("td")
.append("label")
.attr("for", property + "CheckBox")
.style("display", "block")
.style("width", "100%")
.style("height", "100%")
.style("padding", "12px")
.style("background", "sienna")
.style("color", "white")
.style("font-weight", "bold")
.style("border", "solid 1px white")
.attr("id", property + "CheckBoxSpace")
.append("tr")
;

var checkBox = checkBoxSpace
.append("td")
.append("input")
.attr("type", "checkbox")
.attr("id", property + "CheckBox")
.on("click", function(){
     if(this.checked){
         d3
         .select("#" + property + "CheckBoxSpace")
         .style("background", makeColorsOfTaskElementsWithoutPartition()[typeName])
         .style("color", "black")
         ;
     }else{
         d3
         .select("#" + property + "CheckBoxSpace")
         .style("background", "sienna")
         .style("color", "white")
         ;
     }

     repaintTaskTimeline(stageInfo.values, timelineSpace, fontSize, checkBoxAttributes);

    }
)
;

checkBoxSpace
.append("td")
.text(typeName)
;

}

//-------------------------------------------------------------------------------------------------------------------

function addAllCheckBox(checkBoxRow, stageInfo, checkBoxAttributes){
var property = "all";

var checkBoxSpace = checkBoxRow
.append("td")
.append("label")
.attr("for", property + "CheckBox")
.style("display", "block")
.style("width", "100%")
.style("height", "100%")
.style("padding", "12px")
.style("background", "sienna")
.style("color", "white")
.style("font-weight", "bold")
.style("border", "solid 1px white")
.attr("id", property + "CheckBoxSpace")
.append("tr")
;

var checkBox = checkBoxSpace
.append("td")
.append("input")
.attr("type", "checkbox")
.attr("id", property + "CheckBox")
.on("click", function(){
    var allChecked = this.checked;

    if(allChecked){
        d3
        .select("#" + property + "CheckBoxSpace")
        .style("background", "white")
        .style("border", "solid 1px black")
        .style("color", "black")
        ;
    }else{
        d3
        .select("#" + property + "CheckBoxSpace")
        .style("background", "sienna")
        .style("border", "solid 1px white")
        .style("color", "white")
        ;
    }

    checkBoxAttributes
    .forEach(function(attribute){
        var checked = document
        .getElementById(attribute.property + "CheckBox")
        .checked
        ;

        if(checked != allChecked){
            document
            .getElementById(attribute.property + "CheckBox")
            .click()
            ;
        }
    })
    ;

})
;

var checkBoxTextSpace = checkBoxSpace
.append("td")
.text("all")
;

}

//-------------------------------------------------------------------------------------------------------------------

function makeColorsOfTaskElementsWithoutPartition(){

    var timeFormat = formatTaskTimes(TASK_INFO_ARRAY[0]);

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
    ;

    var dataPart = partition.nodes(timeFormat).slice(1);
    var color = makeColorsOfTaskElements(dataPart);

    return color;
}

//-------------------------------------------------------------------------------------------------------------------

function showStageInformation(showDiv, stageInfo){

var fontSize = 20;

var mainTable = showDiv
.append("table")
;

var textTableRow = mainTable
.append("tr")
;

var textTableSpace = textTableRow
.append("td")
.style("padding", "12px")
;

var textTable = textTableSpace
.append("table")
.style("font-size", fontSize + "px")
.style("border-collapse", "separate")
.style("border-spacing", "1px 1px")
.attr("cellpadding", 3)
;

var textTableHeaderRow = textTable
.append("tr")
;

textTableHeaderRow
.append("th")
  .style("font-size", fontSize + "px")
  .style("padding", "12px")
  .style("background", "sandybrown")
.text("submissionTime")
;

textTableHeaderRow
.append("th")
  .style("font-size", fontSize + "px")
  .style("padding", "12px")
  .style("background", "sandybrown")
.text("completionTime")
;

textTableHeaderRow
.append("th")
  .style("font-size", fontSize + "px")
  .style("padding", "12px")
  .style("background", "sandybrown")
.text("failureReason")
;

textTableHeaderRow
.append("th")
  .style("font-size", fontSize + "px")
  .style("padding", "12px")
  .style("background", "sandybrown")
.text("count of tasks")
;

var textTableBodyRow = textTable
.append("tr")
;

textTableBodyRow
.append("td")
  .style("font-size", fontSize + "px")
  .style("padding", "12px")
  .style("background", "wheat")
.text(dateToString(new Date(Number(stageInfo.submissionTime))))
;

textTableBodyRow
.append("td")
  .style("font-size", fontSize + "px")
  .style("padding", "12px")
  .style("background", "wheat")
.text(dateToString(new Date(Number(stageInfo.completionTime))))
;

textTableBodyRow
.append("td")
  .style("font-size", fontSize + "px")
  .style("padding", "12px")
  .style("background", "wheat")
.text(stageInfo.failureReason)
;

textTableBodyRow
.append("td")
  .style("font-size", fontSize + "px")
  .style("padding", "12px")
  .style("background", "wheat")
.text(stageInfo.taskCount)
;

//-------------------------------------------------------------------------------

var menuButtonRow = mainTable
.append("tr")
;

var menuButtonSpace = menuButtonRow
.append("td")
.style("padding", "12px")
;

var menuButtons = menuButtonSpace
.append("ul")
.attr("id", "menuButtons")
;

var sortMenu = menuButtons
.append("li")
.text("SORT BY ...")
.style("font-size", fontSize + "px")
.append("ul")
;

var IDSortButton = sortMenu
.append("li")
.on("click", function(){
    sortTasksOfStageInformationByID(stageInfo, timelineSpace, fontSize, checkBoxAttributes);
})
.text("ID")
;

var startTimeSortButton = sortMenu
.append("li")
.on("click", function(){
    sortTasksOfStageInformationByStartTime(stageInfo, timelineSpace, fontSize, checkBoxAttributes);
})
.text("Start Time")
;

var runTimeSortButton = sortMenu
.append("li")
.on("click", function(){
    sortTasksOfStageInformationByRunTime(stageInfo, timelineSpace, fontSize, checkBoxAttributes);
})
.text("Run Time")
;

var executorIDSortButton = sortMenu
.append("li")
.on("click", function(){
    sortTasksOfStageInformationByExecutorID(stageInfo, timelineSpace, fontSize, checkBoxAttributes);
})
.text("Executor ID")
;

var hostNameSortButton = sortMenu
.append("li")
.on("click", function(){
    sortTasksOfStageInformationByHostName(stageInfo, timelineSpace, fontSize, checkBoxAttributes);
})
.text("Host Name")
;

var sumSortButton = sortMenu
.append("li")
.on("click", function(){
    sortTasksOfStageInformationBySumOfCheckedParameters(stageInfo, timelineSpace, fontSize, checkBoxAttributes);
})
.text("Sum of Checked Parameters")
;

var resetScaleMenu = menuButtons
.append("li")
.text("Reset Time Line Scale")
.style("font-size", fontSize + "px")
.on("click", function(){
    resetTaskTimeline(stageInfo.values, timelineSpace, fontSize, checkBoxAttributes);
})
.append("ul")
;

//-------------------------------------------------------------------------------


var checkBoxTableRow = mainTable
.append("tr")
;

var checkBoxTableSpace = checkBoxTableRow
.append("td")
.style("padding", "12px")
;

var checkBoxTable = checkBoxTableSpace
.append("table")
.style("font-size", fontSize + "px")
.style("border-collapse", "separate")
.style("border-spacing", "1px 1px")
.attr("cellpadding", 3)
;

var checkBoxRow = checkBoxTable
.append("tr")
;


var checkBoxAttributes = [
    {
        "typeName" : "execute",
        "property" : "execute",
        "accessor" : function(taskInfo) {return taskOtherTime(taskInfo);},
    },
    {
        "typeName" : "JVMGC",
        "property" : "JVMGC",
        "accessor" : function(taskInfo) {return Number(taskInfo.JVMGCTime);},
    },
    {
        "typeName" : "shuffle read",
        "property" : "shuffleRead",
        "accessor" : function(taskInfo) {return Number(taskInfo.shuffleReadTime);},
    },
    {
        "typeName" : "shuffle write",
        "property" : "shuffleWrite",
        "accessor" : function(taskInfo) {return Number(taskInfo.shuffleWriteTime);},
    },
    {
        "typeName" : "serialize",
        "property" : "serialize",
        "accessor" : function(taskInfo) {return Number(taskInfo.serializeMilliSec);},
    },
    {
        "typeName" : "deserialize",
        "property" : "deserialize",
        "accessor" : function(taskInfo) {return Number(taskInfo.deserializeMilliSec);},
    },
]
;

//-------------------------------------------------------------------------------

var timelineRow = mainTable
.append("tr")
;

var timelineSpace = timelineRow
.append("td")
.style("padding", "12px")
;

checkBoxAttributes
.forEach(function(attribute){
    addCheckBox(checkBoxRow, attribute.typeName, attribute.property, stageInfo, timelineSpace, fontSize, checkBoxAttributes);
})
addAllCheckBox(checkBoxRow, stageInfo, checkBoxAttributes);


//-------------------------------------------------------------------------------


//-------------------------------------------------------------------------------


var resourcesRow = mainTable
.append("tr")
;

var resourcesSpace = resourcesRow
.append("td")
.style("padding", "12px")
;

//-------------------------------------------------------------------------------

addStageResources(stageInfo, resourcesSpace, fontSize);

addTaskTimeline(stageInfo.values, timelineSpace, fontSize, checkBoxAttributes);

/*
            document
            .getElementById("allCheckBox")
            .click()
            ;
//*/



}