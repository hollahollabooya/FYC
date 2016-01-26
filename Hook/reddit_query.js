function afterNavigate() {
    if ('/watch' === location.pathname) {
        var url = window.location.href;
        mainScript();
    }
}
var observer = new WebKitMutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    for (var i = 0; i < mutation.addedNodes.length; i++) {
      var node = mutation.addedNodes[i];
      if (node.tagName === "DIV" && node.id === "watch7-container") {
        afterNavigate();
      }
    }
   })
});
observer.observe(document, { childList: true, attributes: true, subtree: true, characterData: true });
$(document).ready(function() {
  afterNavigate();
});
