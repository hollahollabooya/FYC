var isLoaded = false;

function afterNavigate() {
    if ('/watch' === location.pathname) {
        var url = window.location.href;
        mainScript();
    }
}
(document.body || document.documentElement).addEventListener('transitionend',
  function(/*TransitionEvent*/ event) {
    if (event.propertyName === 'width' && event.target.id === 'progress' && $('#comments-selector').length === 0) {
        afterNavigate();
    }
}, true);
// After page load
afterNavigate();
