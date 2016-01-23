$(document).ready ->
  pageSetup = ->
    $('<div class="branded-page-box yt-card" id="comments-selector"><div id="reddit-select" class="selected">Reddit</div><div id="youtube-select">Youtube</div></div>').insertBefore('#watch-discussion')
    $('#watch-discussion').hide()
    $('<div class="branded-page-box yt-card" id="reddit-comments-card">CONTENT</div>').insertAfter('#watch-discussion')

  selectorSetup = ->
    $('#reddit-select').on "click", ->
      $('#watch-discussion').hide()
      $('#reddit-comments-card').show()
      $('#reddit-select').addClass('selected')
      $('#youtube-select').removeClass('selected')

    $('#youtube-select').on "click", ->
      $('#watch-discussion').show()
      $('#reddit-comments-card').hide()
      $('#reddit-select').removeClass('selected')
      $('#youtube-select').addClass('selected')

  #Main Script
  pageSetup()
  selectorSetup()
