/**
 * Created by Pascal on 16.04.2016.
 */

define(['messageTypes', 'questionTypes'], function (msgTypes, questionTypes) {

    function ShareQuestion() {
        this.sharedQuestions = [];

    } // EOF class

    ShareQuestion.prototype = {
        constructor: ShareQuestion,

        markQuestionAsShared: function(question) {
            this.sharedQuestions.push(question);
        },
        
        removeSolutionAndBroadcastQuestion: function (question) {
            var trimmedQuestion = this.__removeSolution(question);
            require(['webRTCLecturer'], function (webRTCLecturer) {
                webRTCLecturer.sendMsgToAllStudents(trimmedQuestion, msgTypes.question);
            });
        },

        shareAllAskedQuestions: function (peer) {
            var that = this;
            this.sharedQuestions.forEach(function (q) {
                that.__removeSolutionAndSendQuestionToStudent(peer, q);
            });
        },

        /**
         * removes the 'solution' attribute before sending question to students
         */
        __removeSolution: function (origQuestion) {
            var question = webix.copy(origQuestion);
            question.solution = ""; // is done for all qTypes

            if (question.type === questionTypes.mc) {
                for (var i = 0; i < question.possibleAnswers.length; i++) {
                    question.possibleAnswers[i] = question.possibleAnswers[i].answer;
                }
            }
            return question;
        },

        __removeSolutionAndSendQuestionToStudent: function (peer, question) {
            var trimmedQuestion = this.__removeSolution(question);
            require(['webRTCLecturer'], function (webRTCLecturer) {
                webRTCLecturer.sendMsgToSpecificStudent(peer, trimmedQuestion, msgTypes.question);
            });
        }

    }; // prototype

    return new ShareQuestion();
}); // requireJS define