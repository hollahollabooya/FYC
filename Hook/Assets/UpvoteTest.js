var RedditSearch = function(callback){
    this.callback = callback;
    this.MAX_THREADS = 5;
    this.MAX_COMMENT_DEPTH = 2;
    this.MAXCOMMENTS = 50;
};

RedditSearch.prototype.postVote = function() {

};

$.ajax({
    type: "POST",
    url: "https://www.reddit.com/api/vote",
    data: { dir: 1, id: "t3_42e0vo"}
});

$.ajax({
    type: "GET",
    url: "https://www.reddit.com/api/v1/me.json"
});

https://www.reddit.com/api/v1/authorize?client_id=j9lHiTiVtaEBiagT7hteGqfgZeE&response_type=code&state=abcd1&redirect_uri=http://127.0.0.1:65010/authorize_callback&duration=temporary&scope=vote