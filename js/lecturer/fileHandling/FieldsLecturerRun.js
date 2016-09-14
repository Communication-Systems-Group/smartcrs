define(['jquery', 'questionsStorage', 'questionsControlTable', 'connectedPeers', 'stats', 'commentsCommon'], function ($, qStorage, qTable, connectedPeers, stats, commentsCommon) {

    function FieldsLecturerRun() {
    }

    FieldsLecturerRun.prototype = {
        constructor: FieldsLecturerRun,

        /* 
         @param wants {{questions: boolean,
         questionsWithStats: boolean
         notificationSettings: boolean,
         comments: boolean }}
         */
        getFieldsAsync: function (wants) {
            var defer = $.Deferred();

            var fields = {};

            if (wants.notificationSettings) {
                this.getNotificationFields(fields);
            }
            if (wants.questions) {
                this.getLecturerQuestions(fields);
            }
            if (wants.questionsWithStats) {
                this.getStats(fields);
            }
            if (wants.comments) {
                this.getCommentsAndFilesAsync(fields).then(function(newFields){
                    defer.resolve(newFields);
                });
            } else {
                defer.resolve(fields);
            }

            return defer.promise();
        },

        getNotificationFields: function (fields) {
            fields.threshold = $("#fieldThreshold").val();
            fields.thresholdType = $("#selAbsPercent").val();
            fields.notification = $("#buttonNotification").val();
        },

        getLecturerQuestions: function (fields) {
            var storageSer = qStorage.serialize();
            var tableSer = qTable.serialize();
            if (storageSer.length !== tableSer.length) {
                console.error("Table & Storage don't contain same ");
            }

            fields.questions = tableSer;
        },

        getStats: function (fields) {
            fields.lecturerQuestionStats = stats.data;
        },

        getCommentsAndFilesAsync: function (fields) {
            return commentsCommon.saveCommentsAsync().then(function(comments){
                fields.comments = comments;
                return fields;
            });
        }
    }; // prototype

    return new FieldsLecturerRun();
}); // requireJS define