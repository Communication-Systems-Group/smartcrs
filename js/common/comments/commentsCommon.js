/**
 * Created by Pascal on 28.01.2016.
 */

define(['jquery', 'autoSaveManager'], function ($, autoSaver) {

    function CommentsCommon() {
        this.fieldMappings = this.getFieldMappings();
    } // EOF class


    CommentsCommon.prototype = {
        constructor: CommentsCommon,

        /**
         * Required because the data from the lecturer is directly accessed.
         * This makes sure that both sides use the same mappings
         **/
        getFieldMappings: function () {
            return {
                fileURL: 'fileURL',
                fileMimeType: 'fileMimeType',
                profileURL: 'profileURL',
                profilePictureURL: 'profilePictureURL',
                createdByAdmin: 'createdByAdmin',
                createdByCurrentUser: 'createdByCurrentUser',
                upvoteCount: 'upvoteCount',
                userHasUpvoted: 'userHasUpvoted'
            }
        },

        /**
         * @param comment {Comment}
         */
        addNewComment: function (comment) {
            if (this.isFileComment(comment)) {
                this.__addNewFileComment(comment);
            } else {
                this.__addNewTextComment(comment);
            }
        },

        __addNewFileComment: function (comment) {
            comment = this.createLinkToFile(comment);
            this.__addNewTextComment(comment);
        },

        __addNewTextComment: function (comment) {
            if (!this.__commentExists(comment.id)) {  // prevent duplicates
                $('.jquery-comments').data("comments").createComment(comment);
                this.sort();
            }
        },

        /**
         * Returns all comments. Converts fileURL of file comments to base64 for persistance.
         * @returns Array<Comment>
         */
        saveCommentsAsync: function () {
            var defer = $.Deferred();

            var comments = $('.jquery-comments').data("comments").getComments();
            this.convertFileCommentsForSavingAsync(0, comments, [], defer);
            return defer.promise();
        },

        /**
         * Converts file objects to base64 url
         */
        convertFileCommentsForSavingAsync: function (index, origArray, cloneArray, defer) {
            var that = this;

            if (index === origArray.length) {
                defer.resolve(cloneArray);
                return;
            }

            require(['fs'], function (fs) {
                var origEle = origArray[index++];
                var clone = JSON.parse(JSON.stringify(origEle));
                cloneArray.push(clone);

                if (!that.isFileComment(origEle)) {
                    that.convertFileCommentsForSavingAsync(index, origArray, cloneArray, defer); // go to next item
                } else {
                    fs.readFileAsBinaryStringAsync(origEle.file).then(function (binaryString) {
                        clone[that.fieldMappings.fileURL] = binaryString;
                        that.convertFileCommentsForSavingAsync(index, origArray, cloneArray, defer);
                    });
                }
            });
        },

        upVote: function (comment) {
            if (this.__commentExists(comment.id)) {
                $('.jquery-comments').data("comments").commentsById[comment.id].upvoteCount++;
                this.sort();
                return true;
            } else {
                console.log("commentsCommon.js upVote() couldn't find key");
                return false;
            }
        },

        downVote: function (comment) {
            if (this.__commentExists(comment.id)) {
                $('.jquery-comments').data("comments").commentsById[comment.id].upvoteCount--;
                this.sort();
                return true;
            } else {
                console.log("commentsCommon.js downVote() couldn't find key");
                return false;
            }
        },

        __commentExists: function (commentId) {
            return $('.jquery-comments').data("comments").commentsById[commentId];
        },

        timeFormatter: function (time) {
            return new Date(time).toLocaleTimeString();
        },

        setCustomDateField: function (comment) {
            comment.created = new Date().toString();
            return comment;
        },

        loadCommentFromArray: function (commentWithBinaryStringURL) {
            if (this.isFileComment(commentWithBinaryStringURL)) {
                commentWithBinaryStringURL.file = new Blob([commentWithBinaryStringURL[this.fieldMappings.fileURL]]);
            }
            this.addNewComment(commentWithBinaryStringURL);   // doesn't trigger AutoSaveManager
        },

        /**
         *
         * @param comment {Object}
         */
        createLinkToFile: function (comment) {
            var urlField = this.fieldMappings.fileURL;
            comment[urlField] = URL.createObjectURL(comment.file);
            return comment;
        },

        isFileComment: function (comment) {
            var urlField = this.fieldMappings.fileURL;
            return comment.hasOwnProperty(urlField);
        },

        sort: function () {
            $('.jquery-comments').data("comments").sortAndReArrangeComments("popularity");
        }
    }; // prototype

    return new CommentsCommon();
}); // requireJS define