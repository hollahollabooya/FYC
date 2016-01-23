var RedditSearch = function(callback){
    this.callback = callback;
};

RedditSearch.prototype.queryReddit = function(url) {
    $.ajax({
        url:"http://www.reddit.com/search.json",
        data: {limit: 5, q:("url:" + url), sort: "top"},
        success: this.getCommentTrees.bind(this)});
};

RedditSearch.prototype.queryCommentTree = function(subreddit, id) {
    return $.ajax({
        url:"http://www.reddit.com/r/" + subreddit + "/" + id + ".json",
        data: {depth: 2, sort: "top"}});
};

RedditSearch.prototype.getCommentTrees = function(data) {
    var results = data;
    var commentTrees = [];
    var length = results.data.children.length;
    for (var i = 0; i < length; i++) {
        commentTrees[i] = this.queryCommentTree(
            results.data.children[i].data.subreddit,
            results.data.children[i].data.id);
    }
    $.when.apply($, commentTrees).then(function(){
        var args = arguments;
        console.log(args)
    })
};

var reddit = new RedditSearch();
var test = reddit.queryReddit("https://www.youtube.com/watch?v=yZClGkWUP8I");