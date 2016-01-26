var comments = [];
var dataReady = false;
var injectionReady = false;

function injectionRuntimeHandler() {
  console.log(dataReady);
  console.log(injectionReady);
  console.log('');
  if (dataReady && injectionReady) {
    injectionScript(comments);
    dataReady = false;
    injectionReady = false;
  }
}

function loadData() {
    if ('/watch' === location.pathname) {
      reddit = new RedditSearch(function (foundComments) {
        dataReady = true;
        comments = foundComments;
        injectionRuntimeHandler();
      });
      dataReady = false;
      injectionReady = false;
      reddit.queryReddit(window.location.href)
    }
}

function readyInjection() {
  injectionReady = true;
  console.log($('#watch-discussion'));
  injectionRuntimeHandler();
}

var observer = new WebKitMutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    for (var i = 0; i < mutation.addedNodes.length; i++) {
      var node = mutation.addedNodes[i];
      if (node.tagName === "DIV" && node.id === "watch7-container") {
        loadData();
      }
      if (node.tagName === "DIV" && node.id === "yt-comments-sb-container") {
        readyInjection();
      }
    }
   })
});

observer.observe(document, { childList: true, attributes: true, subtree: true, characterData: true });

$(document).ready(function() {
  loadData();
  readyInjection();
});
