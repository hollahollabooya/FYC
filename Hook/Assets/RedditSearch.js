/*
Defines the RedditComment Object
*/
var RedditComment = function(userContent, user, threadUrl, url, score, depth, subreddit) {
    this.userContent = userContent;
    this.user = user;
    this.threadUrl = threadUrl;
    this.url = url;
    this.score = score;
    this.depth = depth;
    this.subreddit = subreddit;
    this.children = [];
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
        url:"https://www.reddit.com/search.json",
        data: {limit: this.MAX_THREADS, q:("url:" + url), sort: "top"},
        success: this.getCommentTrees.bind(this)
    });
};

RedditSearch.prototype.queryCommentTree = function(subreddit, id) {
    return $.ajax({
        url:"https://www.reddit.com/r/" + subreddit + "/" + id + ".json",
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
        //console.log(args);
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
    var userContent, user, threadUrl, url, children, score, depth, subreddit;
    var com, comment, replies, reply;
    var numReplies = 0;

    /* unfortunately, indexing is one level deeper when 2 or more
       threads are returned from search results. Thus have to do a pretty hacky
       check here to check number of threads returned */

    if (trees[1] == "success") {
        permalinks.push("http://www.reddit.com" +
            trees[0][0].data.children[0].data.permalink);

        while (numComments < 50) {
            if(current[0] >= trees[0][1].data.children.length ||
                trees[0][1].data.children.length == 0) {
                console.log("no more comments in this thread")
                break;
            }

            com =
                trees[0][1].data.children[current[0]].data;
            userContent = com.body;
            user = com.author;
            threadUrl = permalinks[0];
            url = permalinks[0].concat(com.id);
            score = com.score;
            depth = 0;
            subreddit = com.subreddit;
            children = []; // children are empty for now

            // add comment to list
            comment = new RedditComment(userContent, user, threadUrl,
                url, score, depth, subreddit);
            bestComments.push(comment);
            console.log(comment);

            // Select replies if any
            numReplies = this.replyDistribution(numComments+1);
            if(com.replies != "") {
                replies = com.replies.data.children
                for(var i=0; i < numReplies; i++){
                    if(i >= replies.length || replies.length == 0) {
                        console.log("no more replies");
                        break;
                    }
                    userContent = replies[i].data.body;
                    user = replies[i].data.author;
                    url = permalinks[bestSoFar].concat(replies[i].data.id);
                    score = replies[i].data.score;
                    depth = 1;
                    subreddit = replies[i].data.subreddit;
                    children = [];

                    reply = new RedditComment(userContent, user, threadUrl,
                        url, score, depth, subreddit);
                    comment.addChild(reply);
                    numComments++;
                }
            }

            // do tidy-up
            numComments++;
            current[0]++;
        }
        console.log(bestComments);

    } else {
        for (var i = 0; i < trees.length; i++) {
            permalinks.push("http://www.reddit.com" +
                trees[i][0][0].data.children[0].data.permalink);
        }

        // need some way to break out if comments are exhausted
        var update = false
        while (numComments < 50) {
            for (var i = 0; i < trees.length; i++) {
                if(current[i] >= trees[i][0][1].data.children.length ||
                    trees[i][0][1].data.children.length == 0) {
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

            com =
                trees[bestSoFar][0][1].data.children[current[bestSoFar]].data;
            userContent = com.body;
            user = com.author;
            threadUrl = permalinks[bestSoFar];
            url = permalinks[bestSoFar].concat(com.id);
            subreddit = com.subreddit;
            score = MAX;
            depth = 0;
            children = []; // children are empty for now

            // add com to list
            comment = new RedditComment(userContent, user, threadUrl, url,
                score, depth, subreddit);
            bestComments.push(comment);
            console.log(comment);

            // Select replies if any
            numReplies = this.replyDistribution(numComments+1);
            if(com.replies != "") {
                replies = com.replies.data.children
                for(var i=0; i < numReplies; i++){
                    if(i >= replies.length || replies.length == 0) {
                        console.log("no more replies");
                        break;
                    }
                    userContent = replies[i].data.body;
                    user = replies[i].data.author;
                    url = permalinks[bestSoFar].concat(replies[i].data.id);
                    score = replies[i].data.score;
                    subreddit = replies[i].data.subreddit;
                    depth = 1;
                    children = [];

                    reply = new RedditComment(userContent, user, threadUrl,
                        url, score, depth, subreddit);
                    comment.addChild(reply);
                    numComments++;
                }
            }

            // do tidy-up
            MAX = 0;
            numComments++;
            current[bestSoFar]++;
            bestSoFar = 0;
            update = false;
        }
    }
    this.callback(bestComments);
};

RedditSearch.prototype.replyDistribution = function (numComments) {
    return Math.round(-0.1 * numComments + 5);
}
