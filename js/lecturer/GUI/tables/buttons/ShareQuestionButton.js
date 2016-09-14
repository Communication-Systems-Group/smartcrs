/**
 * Created by Pascal on 11.01.2016.
 */

define(['jquery', 'popupWindow', 'stats', 'shareQuestion', 'numStudentVotes', 'qTableRow'], function ($, popupWindow, stats, shareQuestion, numStudentVotes, qTableRow) {

    function ShareQuestionButton() {}

    ShareQuestionButton.prototype = {
        constructor: ShareQuestionButton,

        startSharing: function($this) {
            var $row = qTableRow.getClosestRow($this);
            var question = qTableRow.getQuestionFromRow($row);
            var numAnswered = numStudentVotes.initNumAnswersCollected(question);
            qTableRow.setVotesPerStudText($row, numAnswered);
            this.__shareButtonHandler($this, question);
        },
        
        __shareButtonHandler: function (button, item) {
            this.__disableButtonFor3Secs(button);
            var questions = this.__shareQuestions(item);

            if (questions) {
                stats.createEntry(questions);
            }
        },

        __disableButtonFor3Secs: function(button) {
            button.prop('disabled', true);
            setTimeout(function () {
                button.prop('disabled', false);
            }, 3000);
        },

        __shareQuestions: function (question) {
            if (!question) {
                popupWindow(2000, "Entry not found", "questionsControlTable shareQuestions() couldn't getItem");
                return;
            }

            shareQuestion.markQuestionAsShared(question);
            shareQuestion.removeSolutionAndBroadcastQuestion(question);
            return question;
        }
    }; // prototype

    return new ShareQuestionButton();
}); // requireJS define