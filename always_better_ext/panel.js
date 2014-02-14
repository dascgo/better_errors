function test(msg){
  document.getElementById("msg").innerHTML = msg;
}

function set_frame_src(url){
  var raise_url;
  if(url.indexOf("?") > -1){
    raise_url = url + "&raise=1";
  }else{
    raise_url = url + "?raise=1";
  }
  test("Inspecting " + url)
  document.getElementById("frame").src = raise_url;
}

function raise_error_page(){
  chrome.devtools.inspectedWindow.eval("document.location.href", function(url, isException){
    set_frame_src(url);
  });
}

raise_error_page();