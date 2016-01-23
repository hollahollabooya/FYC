chrome.extension.onMessage.addListener(function (message, sender, callback) {
  // Look for Exact message
  if (message == "Rerun script") {
    //Inject script again to the current active tab
    alert('fuck this');
    chrome.tabs.executeScript({
      file: "./CommentSection.js"
    }, function () {
      console.log("Injection is Completed");
    });
  }
});
