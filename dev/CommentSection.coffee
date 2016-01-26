window.injectionScript = (comments) ->
  verbose = true

  console.log('Main Script is being run') if verbose
  console.log('We found the youtube comments section') if $('#watch-discussion').length > 0 && verbose
  #METHOD DEFINITIONS
  pageSetup = ->
    console.log('pageSetup started...') if verbose
    $('<div class="branded-page-box yt-card" id="comments-selector"><div id="reddit-select" class="selected">Reddit</div><div id="youtube-select">Youtube</div></div>').insertBefore('#watch-discussion')
    $('#watch-discussion').hide()
    $('<div class="branded-page-box yt-card" id="reddit-comments-card"></div>').insertAfter('#watch-discussion')
    console.log('pageSetup completed') if verbose

  selectorSetup = ->
    $('#reddit-select').on "click", ->
      $('#watch-discussion').hide()
      $('#reddit-comments-card').show()
      $('#reddit-select').addClass('selected')
      $('#youtube-select').removeClass('selected')
    console.log('selectorSetup completed') if verbose

    $('#youtube-select').on "click", ->
      $('#watch-discussion').show()
      $('#reddit-comments-card').hide()
      $('#reddit-select').removeClass('selected')
      $('#youtube-select').addClass('selected')

  decodeHTML = (encodedString) ->
    decoded = $('<div/>').html(encodedString).text()
    SnuOwnd.getParser().render(decoded)

  populateComments = (comments, index) ->
    console.log('populateComments started...') if verbose
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
    console.log('populateComments completed') if verbose

  suggestPost = ->
    $('#reddit-comments-card').append("<div class=\"empty-message\">We couldn\'t find anything! Maybe you should <a href=\"https://www.reddit.com/r/videos/submit?url=#{ encodeURI(window.location.href) }\">submit to r/videos</a></div>")

  setupUpdoots = ->
    $('.reddit-comment-updoot .up').on "click", ->
      $(this).toggleClass('active')
      $(this).parent().find('.down').removeClass('active')

    $('.reddit-comment-updoot .down').on "click", ->
      $(this).toggleClass('active')
      $(this).parent().find('.up').removeClass('active')

  #Main Function
  drawToScreen = (comments) ->
    console.log('drawToScreen started...') if verbose
    pageSetup()
    selectorSetup()
    console.log("We've found #{ comments.length } comments") if verbose
    populateComments(comments, 0) if comments.length > 0
    suggestPost() if comments.length == 0
    setupUpdoots()

  drawToScreen(comments)
