define(['jquery', 'popupWindow', 'commentsCommon'], function ($, popup, commentsCommon) {

    function LoadLecture() {
    }

    LoadLecture.prototype = {
        constructor: LoadLecture,


        loadLecture: function (filesID) {
            var that = this;
            var files = $(filesID).get(0).files;
            setFields();

            function setFields() {
                var reader = new window.FileReader();
                reader.onload = function () {
                    that.__setLecturerFieldValues(this.result);
                };
                for (var i = 0; i < files.length; i++) {
                    reader.readAsText(files[i]);
                }
            }
        },

        __setLecturerFieldValues: function (dataObject) {
            require(['questionsControlTable'], function (questionsControlTable) {
                var settings = JSON.parse(dataObject);

                $("#fieldLecturename").val(settings.lectureName);
                $("#fieldThreshold").val(settings.threshold);
                $("#selAbsPercent").val(settings.thresholdType);
                $("#buttonNotification").val(settings.notification);

                if (!settings.questions) {
                    popup(2000, "No questions loaded", "This file does not contain any questions");
                } else {
                    questionsControlTable.loadFromArray(settings.questions);
                }

                if (settings.comments) {
                    settings.comments.forEach(function (comment) {
                        commentsCommon.loadCommentFromArray(comment);
                    });
                }

                if (settings.lecturerQuestionStats) {
                    require(['stats'], function(stats) {
                       stats.data = settings.lecturerQuestionStats;
                    });
                }
            });
        }
    };

    return new LoadLecture();

}); // requireJS define