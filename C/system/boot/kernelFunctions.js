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
function makeDraggable(element) {
    let offsetX = 0;
    let offsetY = 0;

    element.addEventListener("mousedown", (e) => {
        // Calculate offset
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;

        // Attach mouse move and mouse up events
        document.addEventListener("mousemove", mouseMove);
        document.addEventListener("mouseup", mouseUp);
    });

    function mouseMove(e) {
        // Update the position of the div
        element.style.left = `${e.clientX - offsetX}px`;
        element.style.top = `${e.clientY - offsetY}px`;
    }

    function mouseUp() {
        // Remove mouse move and mouse up events
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);
    }
}