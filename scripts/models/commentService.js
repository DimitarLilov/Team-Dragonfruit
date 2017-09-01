let commentService = (() => {
    function addComment(comment) {
        return requester.post('appdata', 'comments', 'kinvey',comment);
    }

    function removeComment(commentId) {
        return requester.remove('appdata',`comments/${commentId}`,'kinvey')
    }

    return {
        addComment,
        removeComment
    }
})();