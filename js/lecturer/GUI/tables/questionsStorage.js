/**
 * Created by Pascal on 17.05.2016.
 */

define(['jquery'], function ($) {

    function QuestionsStorage() {
        this.questions = {};

    } // EOF class

    QuestionsStorage.prototype = {
        constructor: QuestionsStorage,

        addQuestion: function (question) {
            var key = question.question;
            if (!this.__questionExists(key, 'calledFromAddFunc')) {
                this.questions[key] = question;
                return true;
            }
            return false;
        },

        deleteQuestion: function (key) {
            if (this.__questionExists(key)) {
                delete this.questions[key];
                return true;
            } else {
                return false;
            }
        },

        editQuestionInStorage: function (oldQKey, editedQuestion) {
            return (this.deleteQuestion(oldQKey) && this.addQuestion(editedQuestion));
        },

        getQuestionFromQText: function (qText) {
            if (this.__questionExists(qText)) {
                return this.questions[qText];
            }
            return false;
        },

        __questionExists: function (questionKey, calledFromAddFunc) {
            if (this.questions[questionKey]) {
                return true;
            } else if (calledFromAddFunc){
                return false;
            } else {
                console.error("Couldn't find question in storage: " + questionKey);
                return false;
            }
        },

        serialize: function() {
            var serialized = [];
            var that = this;
            Object.keys(this.questions).forEach(function(key) {
                serialized.push(that.questions[key]);
            });

            return serialized;
        }

    }; // prototype

    return new QuestionsStorage();
}); // requireJS define