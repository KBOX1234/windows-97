var myID = idINC;
idINC++;
appilcationIDs[myID] = { name: "kernel", api: "NULL", data1: "null", data2: null, status: "ready", icon: "C/system/icons/msie1-2.png", windowType: "default"};
console.log(myID);

appilcationIDs[myID].name = "File Manager"

delay(500);

appilcationIDs[myID].api = "window";