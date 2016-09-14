/**
 * Created by Pascal on 22.01.2016.
 */

define(['jquery', 'notification', 'commentsCommon', 'connectedPeers'], function ($, notification, commentsCommon, connectedPeers) {

    function UpVotesController() {
    } // EOF class

    UpVotesController.prototype = {
        constructor: UpVotesController,

        issueNotificationIfThresholdReached: function () {
            var comments = $('.jquery-comments').data("comments").commentsById;
            for (var key in comments) {
                if (!comments.hasOwnProperty(key)) {
                    continue;
                }
                var comment = comments[key];
                if (this.__isThresholdReached(comment)) {
                    if (this.__isFirstNotificationForComment(comment)) {
                        comment.notified = true;
                        this.__notifyLecturer(comment);
                        return;
                    }
                }
            }
        },

        __isThresholdReached: function (comment) {
            var threshold = +$("#fieldThreshold").val();
            var thresholdType = $("#selAbsPercent").val();
            var upvoteCountField = commentsCommon.getFieldMappings().upvoteCount;

            var isThresholdReached;
            var numUpvotes = comment[upvoteCountField];

            if (thresholdType === "Percent") {
                var numPeers = connectedPeers.getNumPeers() || 1; // 0 peers would trigger threshold every time --> fix for tour guide
                isThresholdReached = numUpvotes >= (numPeers * threshold / 100);
            }

            // absolute
            else if (thresholdType === "Absolute") {
                isThresholdReached = numUpvotes >= threshold;
            }
            else {
                console.error("UpVotesController.js: thresholdType unknown: " + thresholdType);
                return false;
            }
            return isThresholdReached;

        },

        // lecturer will only be notified once per question
        __isFirstNotificationForComment: function (comment) {
            return !comment.hasOwnProperty('notified');
        },

        __notifyLecturer: function (comment) {
            var notificationType = $("#buttonNotification").val();
            notification.initNotification(notificationType, comment.content);
        }
    }; // prototype

    return new UpVotesController();
}); // requireJS define