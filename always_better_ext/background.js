var ports = {};
chrome.extension.onConnect.addListener(function(port) {
    if (port.name !== "devtools") return;
    ports[port.portId_] = port;
    // Remove port when destroyed (eg when devtools instance is closed)
    port.onDisconnect.addListener(function(port) {
        delete ports[port.portId_];
    });
    port.onMessage.addListener(function(msg) {
        // Whatever you wish
        console.log(msg);
    });
});


// Function to send a message to all devtool.html views:
function notifyDevtools(tab) {
  Object.keys(ports).forEach(function(portId_) {
    var msg = { tab_id: tab.id, url: tab.url };
    console.log("notifying devtools on port " + portId_ + " msg: " + JSON.stringify(msg));
    ports[portId_].postMessage(msg);
  });
}


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if(tab && tab.url){
    notifyDevtools(tab)
  }
});




