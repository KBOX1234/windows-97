var appilcationIDs = [
    { name: "kernel", api: "NULL", data1: "null", data2: null, status: "NULL", icon: "C/system/icons/accesibility_window_abc.png", windowType: "default"},

];
var test = "IT FRIGGEN WORKS";
var idINC = 1;

var AskForID = 0;
var AskForIDToggle = false;
var AskForIDStat = "ready";

var windowArray = [];
var windowINC = 0;

async function launch(file, argue1, argue2){
    if(file.endsWith(".html")){
        const fileD = await loadFile(file);
        var decoded = atob(fileD);
        console.log(fileD+"\n"+decoded);
        idINCstr = String(idINC);
        var myID = idINC;
        idINC++;
        appilcationIDs[myID] = { name: "kernel", api: "NULL", data1: argue1, data2: argue2, status: "ready", icon: "C/system/icons/msie1-2.png", windowType: "default"};
        console.log(myID);
    
        appilcationIDs[myID].name = "HTML viewer"
    
        delay(500);
    
        appilcationIDs[myID].api = "window";
        appilcationIDs[myID].data1 = file;
    
        //delay(1000);
    
        let idString = "iframe_" + String(myID);
    
        const iframe = document.getElementById(idString);
    
        const data = { api: 'id', value: myID, iframeId: myID};
    
        iframe.contentWindow.postMessage(data, '*');
    }
    if(file.endsWith(".link")){
        const linkfile = await loadFile(file);
        const jsonString = atob(linkfile);
        const parsedData = JSON.parse(jsonString);
        idINCstr = String(idINC);
        var myID = idINC;
        idINC++;
        appilcationIDs[myID] = { name: parsedData.name, api: "NULL", data1: null, data2: argue1, data3: argue2, status: "ready", icon: parsedData.icon, windowType: "default"};
    
        delay(500);
    
        appilcationIDs[myID].api = "window";
        appilcationIDs[myID].data1 = parsedData.prg;
    }
}

function destroyWindow(id){
    const element = document.getElementById(id);
    if (element) {
        element.remove(); // Removes the element from the DOM
        appilcationIDs[id].status = "closed";
    }
}

async function kernel() {
    let inc = 0;
    while(inc < appilcationIDs.length){
        if(appilcationIDs[inc].api != "NULL"){
            if(appilcationIDs[inc].api == "printf"){
                console.log(appilcationIDs[inc].data1);
            }

            //window API
            if (appilcationIDs[inc].api == "window") {


                let newWindow = document.createElement("div");
                newWindow.id = inc;
                newWindow.className = "window";


                let titleBar = document.createElement("div");
                titleBar.className = "titleBar";
                titleBar.id = "title_" + inc;
                const icon = await loadFile(appilcationIDs[inc].icon);
                titleBar.innerHTML = '<img src="data:image/png;base64,'+icon+'" class="tittleBarIcon">'+appilcationIDs[inc].name+'<button class="close" onclick="destroyWindow('+inc+')">X</button>'; // Set the title text
            
                // Create the content div
                let contentDiv = document.createElement("div");
                contentDiv.id = "content_" + inc;
                const source = await loadFile(appilcationIDs[inc].data1);
                let decodedSource = atob(source);


                //contentDiv.innerHTML = '<iframe src="'+'data:text/html;base64,'+source+'" frameborder="0" width="100%" height="100%" style="position: absolute; top: 40px; left: 0;"></iframe>';
                    const iframe = document.createElement("iframe");
                    iframe.frameBorder = "0";  // Set iframe attributes
                    iframe.width = "95%";
                    iframe.height = "95%";
                    iframe.style.position = "absolute";
                    iframe.style.top = "10%";
                    iframe.style.left = "0%";
                    iframe.id = "iframe_"+String(inc);


                const cssStyle = await loadFile("C/system/themes/main.css")
                    const apijs = await loadFile("C/system/lib/api.js")
                    let fsf = "fail";
                    //fsf = await loadFile(data3);
                    if(appilcationIDs[inc].data2 == "file"){
                        console.log("file mode triggered");
                        fsf = "";
                        
                        if(appilcationIDs[inc].data3.endsWith(".png")){
                            fsf = "data:image/png;base64,"
                        }
                        if(appilcationIDs[inc].data3.endsWith(".jpg") || appilcationIDs[inc].data3.endsWith(".jpeg")){
                            fsf = "data:image/jpeg;base64,"
                        }
                        fsf = fsf + await loadFile(appilcationIDs[inc].data3);
                    }
                    console.log("aregument mode is: "+appilcationIDs[inc].data2);
                    let endString = '<!DOCTYPE html><html><head><link rel="stylesheet" href="'+'data:text/css;base64,'+cssStyle+'"><title>'+appilcationIDs[inc].name+'</title></head><body><script src="data:application/x-javascript;base64,'+apijs+'"></script><script>var id = '+inc+';\nvar arg1 = "'+appilcationIDs[inc].data2+'";\nvar arg2 = "'+fsf+'";</script>'+decodedSource+'</body></html>'
                    let recodedString = btoa(endString);
                    iframe.src = 'data:text/html;base64,' + recodedString;


                contentDiv.appendChild(iframe);


                newWindow.appendChild(titleBar);
                newWindow.appendChild(contentDiv);
                //newWindow.className="resizable";
                newWindow.style.position = "absolute";
                newWindow.style.width = "600px"; // Set width
                newWindow.style.height = "400px"; // Set height


                document.getElementById("main").appendChild(newWindow);
            
                windowArray[windowINC++] = inc;
            
                makeResizable(inc);
                makeDraggable(newWindow); 


                

            }
            
        }
        appilcationIDs[inc].api = "NULL";
        inc++;
    }

}
var start = false;
async function openStartMenu() {
    if(start == false){
        let menu = document.createElement("div");
        menu.id = "startmenu";
        let sidebar = document.createElement("div");
        sidebar.id = "sidebar";
        menu.appendChild(sidebar)
        //menu.innerHTML = '<button class="startentry" onclick="launch(\'C/program files/internet exploiter/index.html\', \'Internet Exploiter\')">Internet Exploiter</button><br>';
        //menu.innerHTML = menu.innerHTML + '<button class="startentry" onclick="launch(\'C/program files/filemanager/fm.html\', \'File Manager\')">File Manager</button><br>';

        const indexjsonb64 = await loadFile("C/program data/index.json");
        const decodedjsonf = atob(indexjsonb64);
        const index = JSON.parse(decodedjsonf);
        
        inc = Object.keys(index).length;

        menu.innerHTML='<div id="sidebar"></div>'

        while(inc > 0){

            const indexjsonb642 = await loadFile(index[inc]);
            const decodedjsonf2 = atob(indexjsonb642);
            const index2 = JSON.parse(decodedjsonf2);

            const icon = await loadFile(index2.icon);
            
            menu.innerHTML = menu.innerHTML + '<button class="startentry" onclick="launch(\''+index[inc]+'\', \' \', 1)">'+index2.name+'<img class="starticon" src="data:image/png;base64,'+icon+'"></button><br>';
            inc--;
        }
        
        document.getElementById("main").appendChild(menu);
        start = true;
    }
    else{
        const element = document.getElementById("startmenu");
        element.remove();
        start = false;
    }
}