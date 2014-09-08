function showAllExecutorsInformation(showDiv, executorInfoArray){
var fontSize = 20;

var mainTable = showDiv
.append("table")
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