function create_panel(url){
  var is_localhost  = (url.indexOf("://localhost:") > -1);
  var panel_url     = is_localhost ? "panel.html" : "blank.html";
  chrome.devtools.panels.create("Rails C", null, panel_url, function(extensionPanel){



    var _window; // Going to hold the reference to panel.html's `window`

    var port = chrome.extension.connect({name:"devtools"});
    port.onMessage.addListener(function(msg) {
        // Write information to the panel, if exists.
        // If we don't have a panel reference (yet), queue the data.
        if (_window && chrome.devtools.inspectedWindow.tabId == msg.tab_id) {
            _window.set_frame_src(msg.url);
        }
    });

    extensionPanel.onShown.addListener(function tmp(panelWindow) {
        extensionPanel.onShown.removeListener(tmp); // Run once only
        _window = panelWindow;
    });

  });
}


chrome.devtools.inspectedWindow.eval("document.location.href", function(url, isException){
  if(isException){
    console.log("could not get the location");
  }else{
    create_panel(url)
  }
});


