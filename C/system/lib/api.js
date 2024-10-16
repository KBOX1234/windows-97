function dir(folder, id) {
    const data = { api: 'dir', value: folder, iframeId: id};
    console.log("Sending message to parent:", data); // Log the message being sent
    window.parent.postMessage(data, '*'); 
}
function askID(folder, id) {
    const data = { api: 'id', value: folder, iframeId: id};
    console.log("Sending message to parent:", data); // Log the message being sent
    window.parent.postMessage(data, '*'); 
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}