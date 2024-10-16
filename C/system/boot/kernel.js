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

async function launch(file){
    const fileD = await loadFile(file);
    var decoded = atob(fileD);
    console.log(fileD+"\n"+decoded);
    idINCstr = String(idINC);
    var myID = idINC;
    idINC++;
    appilcationIDs[myID] = { name: "kernel", api: "NULL", data1: "null", data2: null, status: "ready", icon: "C/system/icons/msie1-2.png", windowType: "default"};
    console.log(myID);

    appilcationIDs[myID].name = "Internet Exploiter"

    delay(500);

    appilcationIDs[myID].api = "window";
    appilcationIDs[myID].data1 = file;

    //delay(1000);

    let idString = "iframe_" + String(myID);

    const iframe = document.getElementById(idString);

    const data = { api: 'id', value: myID, iframeId: myID};

    iframe.contentWindow.postMessage(data, '*');
    
    
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
                // Create the main window div
                let newWindow = document.createElement("div");
                newWindow.id = inc; // Set the ID to the index
                newWindow.className = "window"; // Set the class
            
                // Create the title bar
                let titleBar = document.createElement("div");
                titleBar.className = "titleBar"; // Set the class for title bar
                titleBar.id = "title_" + inc; // Set the ID for title bar
                const icon = await loadFile(appilcationIDs[inc].icon);
                titleBar.innerHTML = '<img src="data:image/png;base64,'+icon+'" class="tittleBarIcon">'+appilcationIDs[inc].name+'<button class="close" onclick="destroyWindow('+inc+')">X</button>'; // Set the title text
            
                // Create the content div
                let contentDiv = document.createElement("div");
                contentDiv.id = "content_" + inc; // Set the ID for content div
                const source = await loadFile(appilcationIDs[inc].data1);
                let decodedSource = atob(source);

                //default html app
                    //contentDiv.innerHTML = '<iframe src="'+'data:text/html;base64,'+source+'" frameborder="0" width="100%" height="100%" style="position: absolute; top: 40px; left: 0;"></iframe>';
                    const iframe = document.createElement("iframe");
                    iframe.frameBorder = "0";  // Set iframe attributes
                    iframe.width = "90%";
                    iframe.height = "80%";
                    iframe.style.position = "absolute";
                    iframe.style.top = "10%";
                    iframe.style.left = "0%";
                    iframe.id = "iframe_"+String(inc);

                    // Set the src attribute with the data URI

                    const cssStyle = await loadFile("C/system/themes/main.css")
                    const apijs = await loadFile("C/system/lib/api.js")
                    let endString = '<!DOCTYPE html><html><head><link rel="stylesheet" href="'+'data:text/css;base64,'+cssStyle+'"><title>'+appilcationIDs[inc].name+'</title></head><body><script src="data:application/x-javascript;base64,'+apijs+'"></script><script>var id = '+inc+'</script>'+decodedSource+'</body></html>'
                    let recodedString = btoa(endString);
                    iframe.src = 'data:text/html;base64,' + recodedString;

                    // Append the iframe to contentDiv
                    contentDiv.appendChild(iframe);

            
                // Append title bar and content div to the main window
                newWindow.appendChild(titleBar);
                newWindow.appendChild(contentDiv);
                //newWindow.className="resizable";
                newWindow.style.position = "absolute";
                newWindow.style.width = "600px"; // Set width
                newWindow.style.height = "400px"; // Set height
            
                // Append the new window to the main container
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
        menu.innerHTML = '<button class="startentry" onclick="launch(\'C/program files/internet exploiter/index.html\')">Internet Exploiter</button><br>';
        menu.innerHTML = menu.innerHTML + '<button class="startentry" onclick="launch(\'C/program files/filemanager/fm.html\')">File Manager</button><br>';
        document.getElementById("main").appendChild(menu);
        start = true;
    }
    else{
        const element = document.getElementById("startmenu");
        element.remove();
        start = false;
    }
}