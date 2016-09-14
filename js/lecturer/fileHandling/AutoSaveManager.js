/**
 * Created by Pascal on 16.05.2016.
 */

define(['jquery'], function ($) {

    function AutoSaveManager() {
        this.hasUnsavedQuestions = false;
        this.hasUnsavedComments = false;

        this.registerBeforeUnloadEvent();

    } // EOF class

    AutoSaveManager.prototype = {
        constructor: AutoSaveManager,

        registerBeforeUnloadEvent: function () {
            var that = this;
            $(window).on("beforeunload", function (e) {

                if (that.__hasUnsavedData()) {
                    var confirmationMessage = "There are unsaved questions or comments.";

                    // https://developer.mozilla.org/de/docs/Web/Events/beforeunload
                    e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
                    return confirmationMessage;              // Gecko, WebKit, Chrome <34
                }
            });
        },

        setUnsavedQuestionsState: function () {
            this.hasUnsavedQuestions = true;
        },

        setUnsavedCommentsState: function () {
            this.hasUnsavedComments = true;
        },

        /**
         * @param wants {{questions: boolean,
                    questionsWithStats: boolean
                    notificationSettings: boolean,
                    comments: boolean }}
         */
        dataHasBeenSaved: function (wants) {
            if (wants.questions || wants.questionsWithStats) {
                this.__questionsHaveBeenSaved();
            }
            if (wants.comments) {
                this.__commentsHaveBeenSaved();
            }
        },

        __questionsHaveBeenSaved: function () {
            this.hasUnsavedQuestions = false;
        },

        __commentsHaveBeenSaved: function () {
            this.hasUnsavedComments = false;
        },

        __hasUnsavedData: function () {
            return this.hasUnsavedQuestions || this.hasUnsavedComments;
        }

    }; // prototype

    return new AutoSaveManager();
}); // requireJS define