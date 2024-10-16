var appilcationIDs = [
    { name: "kernel", api: "NULL", data1: "null", data2: null, status: "ready"},

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
    eval(decoded);
    
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
                //contentDiv.innerHTML = '<iframe src="'+'data:text/html;base64,'+source+'" frameborder="0" width="100%" height="100%" style="position: absolute; top: 40px; left: 0;"></iframe>';
                const iframe = document.createElement("iframe");
                iframe.frameBorder = "0";  // Set iframe attributes
                iframe.width = "100%";
                iframe.height = "90%";
                iframe.style.position = "absolute";
                iframe.style.top = "10%";
                iframe.style.left = "0";

                // Set the src attribute with the data URI

                const cssStyle = await loadFile("C/system/themes/main.css")

                let endString = '<!DOCTYPE html><html><head><link rel="stylesheet" href="'+'data:text/css;base64,'+cssStyle+'"><title>'+appilcationIDs[inc].name+'</title></head><body>'+decodedSource+'</body></html>'
                let recodedString = btoa(endString);
                iframe.src = 'data:text/html;base64,' + recodedString;

                // Append the iframe to contentDiv
                contentDiv.appendChild(iframe);
            
                // Append title bar and content div to the main window
                newWindow.appendChild(titleBar);
                newWindow.appendChild(contentDiv);
            
                // Append the new window to the main container
                document.getElementById("main").appendChild(newWindow);
            
                windowArray[windowINC++] = inc; // Increment window counter
            
                const div = document.getElementById(inc);
                div.style.position = "absolute";
                div.style.width = "600px"; // Set width
                div.style.height = "400px"; // Set height
                makeDraggable(div); // Make the window draggable
            }
            

            /*if(appilcationIDs[inc].api == "windowSource"){
                const windowS = await loadFile(appilcationIDs.data1);
                let grabIdString = "content_"+String(content_);
                document.getElementById(grabIdString).innerHTML = windowS;
            }*/
        }
        appilcationIDs[inc].api = "NULL";
        inc++;
    }
    /*inc = 0;
    while(inc < windowINC){
        let incString2 = String(inc);

        const div2 = document.getElementById(incString2);
        makeDraggable(div2);
        appilcationIDs[inc].api = "NULL";
        inc++;
    }*/
}
var start = false;
async function openStartMenu() {
    if(start == false){
        let menu = document.createElement("div");
        menu.id = "startmenu";
        menu.innerHTML = '<button class="startentry" onclick="launch(\'C/program files/internet exploiter/ie.js\')">Internet Exploiter</button><br>';
        document.getElementById("main").appendChild(menu);
        start = true;
    }
    else{
        const element = document.getElementById("startmenu");
        element.remove();
        start = false;
    }
}