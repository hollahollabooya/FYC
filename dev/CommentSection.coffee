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

  decodeHTML = (encodedString) ->
    decoded = $('<div/>').html(encodedString).text()
    SnuOwnd.getParser().render(decoded)

  populateComments = (comments, index) ->
    for comment in comments
      continue if not comment.user?
      continue if comment.user == '[deleted]'
      commentHTML = $("<div class=\"reddit-comment #{ 'lesser' if index > 0 }\"></div>")
      $('#reddit-comments-card').append(commentHTML)
      commentHTML.append('<div class="reddit-comment-updoot"></div>')
      commentHTML.find('.reddit-comment-updoot').append("<div class=\"up\" style=\"background-image: url(#{ chrome.extension.getURL('/Assets/Images/reddit_icons.png') });\"></div>")
      commentHTML.find('.reddit-comment-updoot').append("<span>#{ comment.score }</span>")
      commentHTML.find('.reddit-comment-updoot').append("<div class=\"down\" style=\"background-image: url(#{ chrome.extension.getURL('/Assets/Images/reddit_icons.png') });\"></div>")
      commentHTML.append('<div class="comment-wrapper"></div>')
      commentHTML.find('.comment-wrapper').append('<div class="reddit-comment-user"></div>')
      commentHTML.find('.reddit-comment-user').append("<a href=\"http://www.reddit.com/u/#{ comment.user }\">#{ comment.user }</a>")
      commentHTML.find('.comment-wrapper').append("<div class=\"reddit-comment-sub\">r/#{ comment.subreddit }</div>")
      commentHTML.find('.comment-wrapper').append("<div class=\"reddit-comment-content\">#{ decodeHTML(comment.userContent) }</div>")
      commentHTML.find('.comment-wrapper').append('<div class="reddit-comment-source"></div>')
      commentHTML.find('.reddit-comment-source').append("<a href=\"#{ comment.url }\">See Original</a>")
      commentHTML.find('.comment-wrapper').append('<div class="reddit-comment-more"></div>')
      commentHTML.find('.reddit-comment-more').append("<a href=\"#{ comment.threadUrl }\">More From This Thread</a>")
      if index == 0
        populateComments(comment.children, 1)

  suggestPost = ->
    $('#reddit-comments-card').append("<div class=\"empty-message\">We couldn\'t find anything! Maybe you should <a href=\"https://www.reddit.com/r/videos/submit?url=#{ encodeURI(window.location.href) }\">submit to r/videos</a></div>")

  #Main Function
  drawToScreen = (comments) ->
    pageSetup()
    selectorSetup()
    populateComments(comments, 0) if comments.length > 0
    suggestPost() if comments.length == 0

  reddit = new RedditSearch(drawToScreen)
  reddit.queryReddit(window.location.href)

  #TEST ONLY
 ### testComment = new RedditComment(
    '&lt;div class="md"&gt;&lt;p&gt;Dunkey&amp;#39;s been hitting a Reddit gold mine lately.&lt;/p&gt;↵&lt;/div&gt;',
    "TestUser",
    "http://www.reddit.com/",
    "http://www.reddit.com/",
    666,
    []
  )

  testComments = [testComment, testComment, testComment, testComment, testComment]
  drawToScreen(testComments)###
