function showAllExecutorsInformation(showDiv, executorInfoArray){
var fontSize = 20;

var mainTable = showDiv
.append("table")
;

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

var resetScaleMenu = menuButtons
.append("li")
.text("Reset Time Line Scale")
.style("font-size", fontSize + "px")
.on("click", function(){
    resetExecutorTimeline(EXECUTOR_INFO_ARRAY, timelineSpace, fontSize);
})
.append("ul")
;

var timelineRow = mainTable
.append("tr")
;

var timelineSpace = timelineRow
.append("td")
.style("padding", "12px")
;

addExecutorTimeline(executorInfoArray, timelineSpace, fontSize);

}