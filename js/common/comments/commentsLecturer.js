/**
 * Created by Pascal on 28.01.2016.
 */

define(['jquery', 'webRTCLecturer', 'messageTypes', 'SaveLecture', 'commentsCommon', 'lecturerNicknames', 'upVotesController', 'settingsLoader', 'autoSaveManager'], function ($, webRTCLecturer, msgTypes, save, commentsCommon, lecturerNicknames, upVotesController, settingsLoader, autoSaver) {

    function CommentsLecturer() {
        var that = this;
        that.lecturerName = settingsLoader.getLecturerName();
        that.fieldMappings = commentsCommon.getFieldMappings();

        $('#comments-container').comments({
            currentUserIsAdmin: true,
            defaultNavigationSortKey: 'popularity',
            enableEditing: false,
            enableDeleting: false,
            enableDeletingCommentWithReplies: false,
            enableAttachments: true,
            textareaMaxRows: 3, // stop resizing teaxtarea --> scrollbar appears
            textareaPlaceholderText: 'Share files/links/comments with your students',
            profilePictureURL: '',

            fieldMappings: that.fieldMappings,

            getComments: function (success, error) {
                that.__customRefresh = success;
                success([]);
            },

            postComment: function (commentJSON, success, error) {
                that.__postComment(commentJSON, success, error);
            },

            upvoteComment: function (commentJSON, success, error) {
                error(); // lecturer can't vote
            },

            // Filename added to URL as '/FILENAME' because that's the way JQuery-Comments expects it
            uploadAttachments: function (commentArray, success, error) {
                that.__uploadAttachmentsHandler(commentArray, success, error);
            },

            timeFormatter: function (time) {
                return commentsCommon.timeFormatter(time);
            }
        });

    } // EOF class

    CommentsLecturer.prototype = {
        constructor: CommentsLecturer,

        __postComment: function (comment, success, error) {
            comment = this.__prepareLecturerCommentForBroadcast(comment, this.lecturerName);
            webRTCLecturer.sendMsgToAllStudents(comment, msgTypes.commentFromLecturer);
            success(comment);
            autoSaver.setUnsavedCommentsState();
            /*  can't call __addLecturerComment cause success() adds empty comment
            *   and error() leaves text in comment field
            * */
        },

        /**
         *
         * @param comment
         * @param studentPeer {Peer}
         */
        handleCommentFromStudent: function (comment, studentPeer) {
            var finalComment = this.__prepareStudentCommentForBroadcast(comment, studentPeer.id);
            this.__addStudentComment(finalComment);
            webRTCLecturer.sendMsgToAllStudentsExcept([studentPeer], finalComment, msgTypes.commentFromLecturer);
            webRTCLecturer.sendMsgToSpecificStudent(studentPeer, {
                oldComment: comment,
                newComment: finalComment
            }, msgTypes.commentFromStudentCB);
        },

        handleUpVote: function (comment, studentID) {
            this.__upVote(comment);
            webRTCLecturer.sendMsgToAllStudentsExcept([studentID], comment, msgTypes.commentUpVote);
        },

        handleDownVote: function (comment, studentID) {
            this.__downVote(comment);
            webRTCLecturer.sendMsgToAllStudentsExcept([studentID], comment, msgTypes.commentDownVote);
        },

        handleInitialGetCommentsRequest: function (studentPeer) {
            var comments = this.__getAllComments();
            comments.forEach(function (comment) {
                if (comment.file) {
                    webRTCLecturer.sendMsgToSpecificStudent(studentPeer, comment, msgTypes.commentFile, comment.file);
                } else {
                    webRTCLecturer.sendMsgToSpecificStudent(studentPeer, comment, msgTypes.commentFromLecturer);
                }
            });
        },

        __addStudentComment: function (comment) {
            this.__addLecturerComment(comment);
            upVotesController.issueNotificationIfThresholdReached();
        },

        __addLecturerComment: function (comment) {
            commentsCommon.addNewComment(comment);
            autoSaver.setUnsavedCommentsState();
        },

        __getAllComments: function () {
            var commentObjs = $('.jquery-comments').data("comments").commentsById;
            var comments = [];
            for (var key in commentObjs) {
                if (commentObjs.hasOwnProperty(key)) {
                    comments.push(commentObjs[key]);
                }
            }
            return comments;
        },

        __setCreatedByFieldToFalse: function (comment) {
            var createdByCurrentUser = this.fieldMappings.createdByCurrentUser;

            if (comment.hasOwnProperty(createdByCurrentUser)) {
                comment[createdByCurrentUser] = false;
            } else {
                console.log("commentsLecturer __setCreatedByFieldToFalse() createdByCurrentUser is undefined");
            }
            return comment;

        }, /**
         *
         * @param comment
         * @returns {*}
         * @private
         */
        __prepareCommentForBroadcast: function (comment) {
            comment = this.__setCreatedByFieldToFalse(comment);
            comment = commentsCommon.setCustomDateField(comment);
            comment = this.__removeModifiedField(comment);
            comment.id = this.__calculateNewCommentId();
            return comment;
        },

        /**
         *
         * @param comment
         * @param studentPeerId {String}
         * @returns {*}
         * @private
         */
        __prepareStudentCommentForBroadcast: function (comment, studentPeerId) {
            comment = this.__prepareCommentForBroadcast(comment);
            console.log("Nickname is sent from Student: " + comment.nickname); // TODO REMOVE
            comment = this.__setName(comment, comment.nickname);
            return comment;
        },

        __prepareLecturerCommentForBroadcast: function (comment) {
            comment = this.__prepareCommentForBroadcast(comment);
            comment = this.__setName(comment, this.lecturerName);
            return comment;
        },

        /**
         * change name from "You" to name
         */
        __setName: function (comment, name) {
            if (!comment.hasOwnProperty("fullname")) {
                console.error("commentsLecturer.__setName(): fullname is undefined");
            }
            comment.fullname = name;
            return comment;
        },

        __upVote: function (comment) {
            var success = commentsCommon.upVote(comment);
            if (success) {
                this.__refresh(comment);
                upVotesController.issueNotificationIfThresholdReached();
            }
        },

        __downVote: function (comment) {
            var success = commentsCommon.downVote(comment);
            if (success) {
                this.__refresh(comment);
            }
        },

        // converts comment to array if it isn't already
        __refresh: function (comment) {
            if (!$.isArray(comment)) {
                this.__customRefresh([comment]);
            } else {
                this.__customRefresh(comment);
            }
        },

        // is set in getComments() above
        __customRefresh: function () {
        },

        /**
         * custom time formatter seems to add modified field
         * --> All Msgs from students are displayed as edited.
         */
        __removeModifiedField: function (comment) {
            if (comment.modified) {
                delete comment.modified;
            }
            return comment;
        },

        /**
         * The id calculation is overly complex: If multiple files are sent at once, they get length of msg array
         * + 01, 02 etc.
         * This is overriden to just: comment-array.length() + 1
         */
        __calculateNewCommentId: function () {
            return 'c' + ($('.jquery-comments').data("comments").getComments().length + 1);
        },

        getNewestCommentId: function () {
            var nextId = this.__calculateNewCommentId();
            var number = +nextId.substr(1) - 1; // get newest, not next id
            return nextId[0] + number;  // id consist of c + number
        },

        __uploadAttachmentsHandler: function (commentArray, success, error) {
            var that = this;
            commentArray.forEach(function (comment) {
                comment = that.__prepareLecturerCommentForBroadcast(comment, that.lecturerName);
                comment.content = comment.file.name;
                var successful = webRTCLecturer.sendMsgToAllStudents(comment, msgTypes.commentFile, comment.file);
                success([]);
                that.__addLecturerComment(comment)
            });
        }
    }; // prototype

    return new CommentsLecturer();
}); // requireJS define