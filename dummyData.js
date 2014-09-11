function taskExecutionTime(taskInfo) {
return taskInfo.taskFinishTime - taskInfo.taskStartTime;
}

function taskOtherTime(taskInfo){
return taskExecutionTime(taskInfo) - taskInfo.deserializeMilliSec - taskInfo.serializeMilliSec - taskInfo.JVMGCTime - taskInfo.shuffleReadTime - taskInfo.shuffleWriteTime;
}

function addDummyData(taskInfoArray){
var stageIDCounter = 0;

taskInfoArray.forEach(function (taskInfo) {
taskInfo.stageID = Math.floor((stageIDCounter++) / 5);
taskInfo.gettingResultTime = taskExecutionTime(taskInfo) * 0.8 + Number(taskInfo.taskStartTime);
taskInfo.taskLocality = "nodelocal"

taskInfo.JVMGCTime = 0.0;
taskInfo.shuffleReadTime = 0.0;
taskInfo.fetchWaitTime = 0.0;
taskInfo.shuffleWriteTime = 0.0;

taskInfo.JVMGCTime = taskOtherTime(taskInfo) * 0.1;
taskInfo.shuffleReadTime = taskOtherTime(taskInfo) * 0.1;
taskInfo.fetchWaitTime = taskInfo.shuffleReadTime * 0.3;
taskInfo.shuffleWriteTime = taskOtherTime(taskInfo) * 0.1;

taskInfo.bytesRead = taskInfo.deserializeMilliSec;
taskInfo.memoryBytesSpilled = taskInfo.serializeMilliSec;
taskInfo.diskBytesSpilled = taskInfo.serializeMilliSec + taskOtherTime(taskInfo);
taskInfo.totalBlocksFetched = taskInfo.shuffleReadTime;
taskInfo.remoteBlocksFetched = taskInfo.totalBlocksFetched * 0.3;
taskInfo.localBlocksFetched = taskInfo.totalBlocksFetched - taskInfo.remoteBlocksFetched;
taskInfo.shuffleBytesWritten = taskInfo.totalBlocksFetched * 0.8;
taskInfo.remoteBytesRead = taskInfo.totalBlocksFetched;

});
}

