function afterNavigate() {
    if ('/watch' === location.pathname) {
        var url = window.location.href;
        alert(url);
    }
}
(document.body || document.documentElement).addEventListener('transitionend',
  function(/*TransitionEvent*/ event) {
    if (event.propertyName === 'width' && event.target.id === 'progress') {
        afterNavigate();
    }
}, true);
// After page load
afterNavigate();