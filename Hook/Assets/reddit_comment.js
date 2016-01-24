/*
Defines the RedditComment Object
*/

var RedditComment = function (userContent, user, thread, url, upVotes) {
    this.userContent = userContent;
    this.user = user;
    this.thread = thread;
    this.url = url;
    this.upVotes = upVotes;
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