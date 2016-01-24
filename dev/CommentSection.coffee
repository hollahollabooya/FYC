window.mainScript = ->
  #METHOD DEFINITIONS
  pageSetup = ->
    $('<div class="branded-page-box yt-card" id="comments-selector"><div id="reddit-select" class="selected">Reddit</div><div id="youtube-select">Youtube</div></div>').insertBefore('#watch-discussion')
    $('#watch-discussion').hide()
    $('<div class="branded-page-box yt-card" id="reddit-comments-card"></div>').insertAfter('#watch-discussion')

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

  populateComments = (comments) ->
    for comment in comments
      commentHTML = $('<div class="reddit-comment"></div>')
      $('#reddit-comments-card').append(commentHTML)
      commentHTML.append('<div class="reddit-comment-updoot"></div>')
      commentHTML.find('.reddit-comment-updoot').append("<div class=\"up\" style=\"background-image: url(#{ chrome.extension.getURL('/Assets/Images/reddit_icons.png') });\"></div>")
      commentHTML.find('.reddit-comment-updoot').append("<span>#{ comment.upVotes }</span>")
      commentHTML.find('.reddit-comment-updoot').append("<div class=\"down\" style=\"background-image: url(#{ chrome.extension.getURL('/Assets/Images/reddit_icons.png') });\"></div>")
      commentHTML.append('<div class="comment-wrapper"></div>')
      commentHTML.find('.comment-wrapper').append('<div class="reddit-comment-user"></div>')
      commentHTML.find('.reddit-comment-user').append("<a href=\"http://www.reddit.com/u/#{ comment.user }\">#{ comment.user }</a>")
      commentHTML.find('.comment-wrapper').append("<div class=\"reddit-comment-content\">#{ comment.userContent }</div>")
      commentHTML.find('.comment-wrapper').append('<div class="reddit-comment-source"></div>')
      commentHTML.find('.reddit-comment-source').append("<a href=\"#{ comment.url }\">See Original</a>")
      commentHTML.find('.comment-wrapper').append('<div class="reddit-comment-more"></div>')
      commentHTML.find('.reddit-comment-more').append("<a href=\"#{ comment.thread }\">More From This Thread</a>")

  #Main Function
  drawToScreen = (comments) ->
    pageSetup()
    selectorSetup()
    populateComments(comments)

  reddit = new RedditSearch(drawToScreen)
  reddit.queryReddit(window.location.href)
