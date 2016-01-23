// Generated by CoffeeScript 1.4.0
(function() {

  $(document).ready(function() {
    var pageSetup, selectorSetup;
    pageSetup = function() {
      $('<div class="branded-page-box yt-card" id="comments-selector"><div id="reddit-select" class="selected">Reddit</div><div id="youtube-select">Youtube</div></div>').insertBefore('#watch-discussion');
      $('#watch-discussion').hide();
      return $('<div class="branded-page-box yt-card" id="reddit-comments-card">CONTENT</div>').insertAfter('#watch-discussion');
    };
    selectorSetup = function() {
      $('#reddit-select').on("click", function() {
        $('#watch-discussion').hide();
        $('#reddit-comments-card').show();
        $('#reddit-select').addClass('selected');
        return $('#youtube-select').removeClass('selected');
      });
      return $('#youtube-select').on("click", function() {
        $('#watch-discussion').show();
        $('#reddit-comments-card').hide();
        $('#reddit-select').removeClass('selected');
        return $('#youtube-select').addClass('selected');
      });
    };
    pageSetup();
    return selectorSetup();
  });

}).call(this);
