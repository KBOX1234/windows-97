function saveFile(id, content) {
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
        const transaction = db.transaction("files", "readwrite");
        const objectStore = transaction.objectStore("files");

        const fileData = {
            id: id,
            content: content
        };

        const addRequest = objectStore.put(fileData);  // Use put to add or update

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

            const getRequest = objectStore.get(id);  // Get the file by ID

            getRequest.onsuccess = (event) => {
                const fileData = event.target.result;
                if (fileData) {
                    console.log("File loaded successfully:", fileData);
                    resolve(fileData.content);  // Resolve the promise with content
                } else {
                    console.log("File not found with ID:", id);
                    resolve(null);  // Resolve with null if file is not found
                }
            };

            getRequest.onerror = (event) => {
                console.error("Error loading file:", event.target.error);
                reject(event.target.error);  // Reject the promise on error
            };
        };

        request.onerror = (event) => {
            console.error("Database error:", event.target.errorCode);
            reject(event.target.error);  // Reject the promise on error
        };
    });
}


async function clearIDAPI() {

    // Wait for 2 seconds (2000 milliseconds)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    //AskForIDStat = "ready"
    
}

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("MyFilesDB", 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('files')) {
                db.createObjectStore('files', { keyPath: 'id' });
                console.log("Object store 'files' created.");
            }
        };

        request.onsuccess = (event) => {
            console.log("Database opened successfully.");
            resolve(event.target.result); // Return the opened database
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

// Function to make a div draggable
let isDragging = false;

function makeDraggable(element) {
    let offsetX = 0, offsetY = 0, mouseX = 0, mouseY = 0;

    element.addEventListener("mousedown", (e) => {
        if (isResizing) return; // If resizing is happening, do not allow dragging

        isDragging = true;
        mouseX = e.clientX;
        mouseY = e.clientY;
        offsetX = element.offsetLeft;
        offsetY = element.offsetTop;

        function doDrag(e) {
            if (!isDragging) return;

            // Calculate new position
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

        // Attach event listeners for dragging
        window.addEventListener("mousemove", doDrag);
        window.addEventListener("mouseup", stopDrag);
    });
}


let isResizing = false; // Global flag to track resizing

function makeResizable(elementId) {
    const element = document.getElementById(elementId);
    
    if (!element) {
        return; // Exit if the element doesn't exist
    }

    const resizer = document.createElement("div");
    resizer.style.width = "10px";
    resizer.style.height = "10px";
    resizer.style.background = "red"; // Resizer handle style
    resizer.style.position = "absolute";
    resizer.style.right = "0"; // Position to the right
    resizer.style.bottom = "0"; // Position to the bottom
    resizer.style.cursor = "se-resize"; // Cursor style

    // Append the resizer to the element
    element.appendChild(resizer);

    resizer.addEventListener("mousedown", (e) => {
        e.preventDefault();
        isResizing = true; // Start resizing, disable dragging
        
        // Calculate the initial size of the element
        const startWidth = element.offsetWidth;
        const startHeight = element.offsetHeight;
        const startX = e.clientX;
        const startY = e.clientY;

        function doDrag(e) {
            // Calculate the new width and height based on mouse movement
            element.style.width = startWidth + (e.clientX - startX) + "px";
            element.style.height = startHeight + (e.clientY - startY) + "px";
        }

        function stopDrag() {
            window.removeEventListener("mousemove", doDrag);
            window.removeEventListener("mouseup", stopDrag);
            isResizing = false; // End resizing, enable dragging
        }

        // Attach the drag event listeners
        window.addEventListener("mousemove", doDrag);
        window.addEventListener("mouseup", stopDrag);
    });
}
