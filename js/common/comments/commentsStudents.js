/**
 * Created by Pascal on 28.01.2016.
 */

define(['jquery', 'messageTypes', 'commentsCommon', 'studentNickname'], function ($, msgTypes, commentsCommon, studentNickname) {

    function CommentsStudents(webRTCStudents) {
        this.webRTCStudents = webRTCStudents;
        var that = this;
        that.fieldMappings = commentsCommon.getFieldMappings();

        $('#comments-container').comments({
            defaultNavigationSortKey: 'popularity',
            enableEditing: false,
            enableDeleting: false,
            enableDeletingCommentWithReplies: false,
            enableAttachments: false,
            textareaMaxRows: 3, // stop resizing teaxtarea --> scrollbar appears
            textareaPlaceholderText: 'Ask a question',

            fieldMappings: that.fieldMappings,

            getComments: function (success, error) {
                that.__customRefresh = success;
                that.refresh([]);   // call success function
                // webRTCHandlersStudents is sending getComments when connection is established
            },

            postComment: function (commentJSON, success, error) {
                that.__sendPostCommentRequest(commentJSON, success, error);
            },

            upvoteComment: function (commentJSON, success, error) {
                var successful = false;
                // Explicitly testing for true or false due to the different possible naming conventions
                // Prevents 'undefined' to land in else branch
                switch (commentJSON.userHasUpvoted) { // TODO: write email to dev, in docs it says 'userHasUpvoted'
                    case true:
                        successful = that.__sendUpVote(commentJSON);
                        break;
                    case false:
                        successful = that.__sendDownVote(commentJSON);
                        break;
                    default:
                        console.log("commentsStudents.js upvoteComment() error. Landed in default.");
                }

                if (successful) {
                    success(commentJSON);
                    commentsCommon.sort();
                } else {
                    console.log("commentsStudents.js upvoteComment() webRTC.sendMsg() was unsuccesful");
                    error();
                }
            },

            timeFormatter: function(time) {
                return commentsCommon.timeFormatter(time);
            }
        });

    } // EOF class

    CommentsStudents.prototype = {
        constructor: CommentsStudents,

        /**
         * @param comment {Comment}
         */
        addNewComment: function(comment) {
            commentsCommon.addNewComment(comment);
        },

        __sendPostCommentRequest: function (comment, success, error) {
            comment.nickname = studentNickname.getNickname();
            var successful = this.webRTCStudents.sendMsg(comment, msgTypes.commentFromStudent);
            if (successful) {
                var commentCopy = {}; // sendMsg is async, hence we need a copy to prevent sending the altered data
                Object.keys(comment).forEach(function(key) {
                    commentCopy[key] = comment[key];
                });
                commentCopy.content = "...Your comment is being processed...";
                success(commentCopy);
            }
            else {
                error();
            }
        },

        handlePostCommentRequestCB: function(oldAndNewComment) {
            $('.jquery-comments').data("comments").removeComment(oldAndNewComment.oldComment.id);
            var newComment = oldAndNewComment.newComment;
            newComment[this.fieldMappings.createdByCurrentUser] = true;
            this.addNewComment(newComment);
        },

        __sendUpVote: function(comment){
            return this.webRTCStudents.sendMsg(comment, msgTypes.commentUpVote);
        },

        __sendDownVote: function(comment){
            return this.webRTCStudents.sendMsg(comment, msgTypes.commentDownVote);
        },

        upVote: function (comment) {
            var success = commentsCommon.upVote(comment);
            if (success) {
                this.refresh(comment);
            }
        },

        downVote: function (comment) {
            var success = commentsCommon.downVote(comment);
            if (success) {
                this.refresh(comment);
            }
        },

        refresh: function(comment) {
          if (!$.isArray(comment)) {
              this.__customRefresh([comment]);
          }  else {
              this.__customRefresh(comment);
          }
        },

        // is set in getComments() above
        __customRefresh: function() {}

}; // prototype

    return CommentsStudents;
}); // requireJS define