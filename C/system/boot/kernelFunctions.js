function saveFile(id, content) {
    const request = indexedDB.open("MyFilesDB", 1);

    request.onupgradeneeded = (event) => {
        const db = event.target.result;


        if (!db.objectStoreNames.contains('files')) {
            db.createObjectStore('files', { keyPath: 'id' });
        }
    };

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("files", "readwrite");
        const objectStore = transaction.objectStore("files");

        const fileData = {
            id: id,
            content: content
        };

        const addRequest = objectStore.put(fileData);

        addRequest.onsuccess = () => {
            console.log("File saved successfully:", fileData);
        };

        addRequest.onerror = (event) => {
            console.error("Error saving file:", event.target.error);
        };
    };

    request.onerror = (event) => {
        console.error("Database error:", event.target.errorCode);
    };
}







function loadFile(id) {
    return new Promise((resolve, reject) => {  // Return a promise
        const request = indexedDB.open("MyFilesDB", 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            // Create the object store if it doesn't exist
            if (!db.objectStoreNames.contains('files')) {
                db.createObjectStore('files', { keyPath: 'id' });
            }
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction("files", "readonly");
            const objectStore = transaction.objectStore("files");

            const getRequest = objectStore.get(id);

            getRequest.onsuccess = (event) => {
                const fileData = event.target.result;
                if (fileData) {
                    console.log("File loaded successfully:", fileData);
                    resolve(fileData.content);
                } else {
                    console.log("File not found with ID:", id);
                    resolve(null);
                }
            };

            getRequest.onerror = (event) => {
                console.error("Error loading file:", event.target.error);
                reject(event.target.error);
            };
        };

        request.onerror = (event) => {
            console.error("Database error:", event.target.errorCode);
            reject(event.target.error);
        };
    });
}

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("MyFilesDB", 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            // Create the object store if it doesn't exist
            if (!db.objectStoreNames.contains('files')) {
                db.createObjectStore('files', { keyPath: 'id' });
                console.log("Object store 'files' created.");
            }
        };

        request.onsuccess = (event) => {
            console.log("Database opened successfully.");
            db = event.target.result;
            resolve(db);
        };

        request.onerror = (event) => {
            console.error("Database error:", event.target.errorCode);
            reject(event.target.error);
        };
    });
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let isDragging = false;

function makeDraggable(element) {
    let offsetX = 0, offsetY = 0, mouseX = 0, mouseY = 0;

    element.addEventListener("mousedown", (e) => {
        if (isResizing) return;

        isDragging = true;
        mouseX = e.clientX;
        mouseY = e.clientY;
        offsetX = element.offsetLeft;
        offsetY = element.offsetTop;

        function doDrag(e) {
            if (!isDragging) return;


            const dx = e.clientX - mouseX;
            const dy = e.clientY - mouseY;
            element.style.left = offsetX + dx + "px";
            element.style.top = offsetY + dy + "px";
        }

        function stopDrag() {
            isDragging = false;
            window.removeEventListener("mousemove", doDrag);
            window.removeEventListener("mouseup", stopDrag);
        }


        window.addEventListener("mousemove", doDrag);
        window.addEventListener("mouseup", stopDrag);
    });
}


let isResizing = false;

function makeResizable(elementId) {
    const element = document.getElementById(elementId);
    
    if (!element) {
        return;
    }

    const resizer = document.createElement("div");
    resizer.style.width = "10px";
    resizer.style.height = "10px";
    resizer.style.background = "red";
    resizer.style.position = "absolute";
    resizer.style.right = "0";
    resizer.style.bottom = "0";
    resizer.style.cursor = "se-resize";




    element.appendChild(resizer);

    resizer.addEventListener("mousedown", (e) => {
        e.preventDefault();
        isResizing = true;

        const startWidth = element.offsetWidth;
        const startHeight = element.offsetHeight;
        const startX = e.clientX;
        const startY = e.clientY;

        function doDrag(e) {

            element.style.width = startWidth + (e.clientX - startX) + "px";
            element.style.height = startHeight + (e.clientY - startY) + "px";
        }

        function stopDrag() {
            window.removeEventListener("mousemove", doDrag);
            window.removeEventListener("mouseup", stopDrag);
            isResizing = false;

        }




        window.addEventListener("mousemove", doDrag);
        window.addEventListener("mouseup", stopDrag);
    });
}


function listFoldersInDirectory(directory) {
    console.log("Listing folders in directory:", directory);




    const readJsonFile = () => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "C/files.json", true); // Adjust the path as necessary
            xhr.onload = () => {
                if (xhr.status === 200) {
                    try {
                        const jsonData = JSON.parse(xhr.responseText);
                        resolve(jsonData); // Resolve with the parsed JSON data
                    } catch (error) {
                        reject("Error parsing JSON: " + error);
                    }
                } else {
                    reject("Failed to load JSON file: " + xhr.status);
                }
            };
            xhr.onerror = () => {
                reject("Error loading JSON file.");
            };
            xhr.send();
        });
    };




    const scanIndexedDB = () => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['files'], 'readonly');
            const objectStore = transaction.objectStore('files');
            const folders = new Set();

            const request = objectStore.openCursor();

            request.onsuccess = (event) => {
                const cursor = event.target.result;

                if (cursor) {
                    const filePath = cursor.value.id;




                    console.log("Processing file ID:", filePath);




                    if (filePath.startsWith(directory)) {
                        const relativePath = filePath.slice(directory.length);
                        const folderName = relativePath.split('/')[0];

                        if (folderName) {
                            folders.add(folderName);
                            console.log("Added folder:", folderName);
                        }
                    }

                    cursor.continue();
                } else {
                    console.log("Finished processing. Unique folders found:", Array.from(folders));
                    resolve(Array.from(folders));
                }
            };

            request.onerror = (event) => {
                const errorMsg = "Error accessing object store: " + event.target.error;
                console.error(errorMsg);
                reject(errorMsg);
            };
        });
    };

    // Main logic
    return readJsonFile()
        .then(jsonData => {



            const folders = new Set();
            for (const file of jsonData.files) {
                const filePath = file.id;


                if (filePath.startsWith(directory)) {
                    const relativePath = filePath.slice(directory.length);
                    const folderName = relativePath.split('/')[0];
                    if (folderName) {
                        folders.add(folderName);
                        console.log("Added folder from JSON:", folderName);
                    }
                }
            }
            console.log("Unique folders found from JSON:", Array.from(folders));
            return Array.from(folders);
        })
        .catch(error => {
            console.warn("JSON file not found or error occurred, scanning IndexedDB:", error);



            return scanIndexedDB();
        });
}


async function sendToIframe(id, data){
    const iframe = document.getElementById(id);
    iframe.contentWindow.postMessage(data, '*');
}