/**
 * Created by Pascal on 10.05.2016.
 */

define(['jquery', 'questionQueue', 'responseWindowConstructor', 'localStorage'], function ($, questionQueue, ResponseWindowConstructor, localStorage) {

    function IncomingQuestionsManager() {
    } // EOF class

    IncomingQuestionsManager.prototype = {
        constructor: IncomingQuestionsManager,

        handleIncomingQuestion: function (question) {
            $("#saveDataButton").prop("disabled", false);

            if (this.__isAQuestionDisplayed()) {
                questionQueue.addToQueue(question);
            } else {
                this.__showQuestion(question)
            }
        },

        onQuestionWindowHasBeenClosed: function () {
            var nextQuestion = questionQueue.popFromQueue();
            if (nextQuestion) {
                this.__showQuestion(nextQuestion);
            }
        },

        __isAQuestionDisplayed: function () {
            return $(".webix_window[view_id='responseWindow']").length !== 0;
        },

        __showQuestion: function(question) {
            if (localStorage.hasQuestionAlreadyBeenAnswered(question.question)) {
                console.log("Question \"" + question.question + "\" dismissed. It has already been answered.");
            } else {
                localStorage.storeAnsweredQuestion(question);
                console.log("Question \"" + question.question + "\" is now in localStorage");
                new ResponseWindowConstructor(question, this);
            }
        }

    }; // prototype

    return new IncomingQuestionsManager();
}); // requireJS define