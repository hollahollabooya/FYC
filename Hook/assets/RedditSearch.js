/*
Defines the RedditComment Object
*/
var RedditComment = function (userContent, user, threadUrl, url, score) {
    this.userContent = userContent;
    this.user = user;
    this.threadUrl = threadUrl;
    this.url = url;
    this.score = score;
    this.children = [];
};

// Getter for userContent
RedditComment.prototype.getUserContent = function() {
    return this.userContent;
};

// Getter for user
RedditComment.prototype.getUser = function() {
    return this.user;
};

// Getter for thread
RedditComment.prototype.getThread = function() {
    return this.thread;
};

// Getter for content
RedditComment.prototype.getUpVotes = function() {
    return this.upVotes;
};

// Getter for children
RedditComment.prototype.getChildren = function() {
    return this.children;
};

// Add child to list of children
RedditComment.prototype.addChild = function(child) {
    this.children.push(child);
}

// CODE ABOVE TEMPORARY

var RedditSearch = function(callback){
    this.callback = callback;
    this.MAX_THREADS = 5;
    this.MAX_COMMENT_DEPTH = 2;
    this.MAXCOMMENTS = 50;
};

RedditSearch.prototype.queryReddit = function(url) {
    $.ajax({
        url:"http://www.reddit.com/search.json",
        data: {limit: this.MAX_THREADS, q:("url:" + url), sort: "top"},
        success: this.getCommentTrees.bind(this)
    });
};

RedditSearch.prototype.queryCommentTree = function(subreddit, id) {
    return $.ajax({
        url:"http://www.reddit.com/r/" + subreddit + "/" + id + ".json",
        data: {depth: this.MAX_COMMENT_DEPTH, sort: "top"}
    });
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
        // console.log(args);
        this.buildComments(args);
    }.bind(this));
};

RedditSearch.prototype.buildComments = function(commentTrees) {

    var trees = commentTrees;
    var bestComments = []; // the collection of comments to display
    var current = [0, 0, 0, 0, 0]; // current comment in each thread
    var MAX = 0; // current max across threads
    var bestSoFar = 0; // index of thread with best comment so far
    var numComments = 0; // amount of comments added so far
    var permalinks = [];

    // declare variables for constructing comment
    var comment, userContent, user, threadUrl, url, children, score;

    /* unfortunately, indexing is one level deeper when 2 or more
       threads are returned from search results. Thus have to do a pretty hacky
       check here to check number of threads returned */

    if (trees[1] == "success") {
        permalinks.push("http://www.reddit.com" +
            trees[0][0].data.children[0].data.permalink);

        while (numComments < 50) {
                if(trees[0][1].data.children.length > current[i] ||
                    trees[0][1].data.children.length == 0) {
                    console.log("no more comments in this thread")
                    break;
                }
                if(trees[0][1].data.children[current[i]].data.score > MAX) {
                    MAX = trees[i][0][1].data.children[current[i]].data.score;
                    bestSoFar = i;
                }

            comment =
                trees[bestSoFar][0][1].data.children[current[bestSoFar]].data;
            userContent = comment.body;
            user = comment.author;
            threadUrl = permalinks[bestSoFar];
            url = permalinks[bestSoFar].concat(comment.id);
            score = MAX;
            children = []; // children are empty for now

            // add comment to list
            bestComments.push(new RedditComment(userContent, user, threadUrl,
                url, score));
            // to implement - select replies if any

            // do tidy-up
            MAX = 0;
            numComments++;
            current[bestSoFar]++;
            bestSoFar = 0;
        }
        // console.log(bestComments);

    } else {
        for (var i = 0; i < trees.length; i++) {
        permalinks.push("http://www.reddit.com" +
            trees[i][0][0].data.children[0].data.permalink);
        console.log("got Here");
        }

        // need some way to break out if comments are exhausted
        var update = false
        while (numComments < 50) {
            for (var i = 0; i < trees.length; i++) {
                if(trees[i][0][1].data.children.length > current[i] ||
                    trees[0][1].data.children.length == 0) {
                    console.log("no more comments in this thread")
                    continue;
                }
                if(trees[i][0][1].data.children[current[i]].data.score > MAX) {
                    MAX = trees[i][0][1].data.children[current[i]].data.score;
                    bestSoFar = i;
                    update = true;
                }
            }

            if (!update) {
                console.log("no more comments");
                break;
            }

            comment =
                trees[bestSoFar][0][1].data.children[current[bestSoFar]].data;
            userContent = comment.body;
            user = comment.author;
            threadUrl = permalinks[bestSoFar];
            url = permalinks[bestSoFar].concat(comment.id);
            score = MAX;
            children = []; // children are empty for now

            // add comment to list
            bestComments.push(new RedditComment(userContent, user, threadUrl,
                url, score));

            // to implement - select replies if any

            // do tidy-up
            MAX = 0;
            numComments++;
            current[bestSoFar]++;
            bestSoFar = 0;
            update = false;
        }
        // console.log(bestComments);
    }
};

var reddit = new RedditSearch();
var test = reddit.queryReddit("https://www.youtube.com/watch?v=LUVfetZTQhE");
