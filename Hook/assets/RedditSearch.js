var RedditSearch = new Object();

RedditSearch.prototype.generateQuery = function(url) {
    return $.ajax({
        url: "http://www.reddit.com/search.json",
        method: "GET",
        data: {
            after:"",
            before:"",
            count: 5,
            include_facets: false,
            limit: 5,
            q:"url:https://www.youtube.com/watch?v=0NvI1BMCfe0",
            restrict_sr: false,
            sort: "top",
            syntax: "plain",
            t:"all"
        }
    });
};

RedditSearch.prototype.getComments = function(url) {
    // Fetch the results of a query for the URL
    var results = RedditSearch.generateQuery(url);
    return results;
};

RedditSearch.prototype.getCommentTree = function() {

};

var test = RedditSearch.getComments("https://www.youtube.com/watch?v=0NvI1BMCfe0");