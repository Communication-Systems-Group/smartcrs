/**
 * Created by Pascal on 05.07.2014.
 * This class stores and maintains stats entries
 * It's the DB for all stats
 */
define(['jquery', 'statsDataFormat', 'messageResponse', 'RatingQuestion', 'questionTypes'], function ($, statsFormat, messageResponse, RatingQuestion, questionTypes) {
    function Stats() {

        /**
         *
         * @type container for statsDataFormat structure
         */
        this.data = {};
        this.listenerFunctions = [];

    } // EOF Class

    Stats.prototype = {
        constructor: Stats,

        /**
         * Adds answers from students to lecturer questions
         * @param msgResponse format (messageResponse.js): {questionID: questionID, questionType: questionType, peerID: peerID, answerIDs: answerIDs};
         */
        addResponse: function (msgResponse) {
            var that = this;

            // 1. Does question already exist?
            if (msgResponse.questionID in this.data) {
                var question = this.data[msgResponse.questionID];
            } else {
                console.error("stats.js: Question not found in stack!");
                console.error(msgResponse);
                return;
            }

            // 2. Prevent peer from voting multiple times on the same question
            if (~question.peerIDsVoted.indexOf(msgResponse.peerID)) {
                console.log("stats.js: Peer " + msgResponse.peerID + " already voted for question!");
                return;
            } else {
                question.peerIDsVoted.push(msgResponse.peerID);
            }

            // 3. Does the answer option already exist?

            msgResponse.answerIDs.forEach(function(answerString, i) {
                var found = false;
                question.studentAnswers.forEach(function(existingAnswers, j) {
                    if (existingAnswers.answerID === answerString){
                        that.__incrementVote(question, j);
                        found = true;
                    }
                });
                if (!found) {
                    question.studentAnswers.push(statsFormat.createSolutionFormat(answerString));
                    that.__incrementVote(question, question.studentAnswers.length - 1);
                }
            });
        },

        /**
         * Is exectued when lecturer clicks on Start question
         */
        createEntry: function (question) {

            var that = this;

            var questionID = question.question;

            // question already in db? Prevents duplicates
            if (questionID in this.data) {
                console.error("stats.js createEntry(): Question already in stack!");
                return;
            }

            var type = question.type;

            // registering all possible answer options to make them show up on the graph
            var studentAnswerOptions = [];

                if (question.possibleAnswers instanceof Array) {
                    question.possibleAnswers.forEach(function(option){
                        studentAnswerOptions.push(option.answer);
                    });
                } else {
                    /**
                     * If solution is given for open/scale question, make it visible in the chart
                     */
                    if (question.solution) {
                        if (question.type === questionTypes.open) {
                            studentAnswerOptions.push(question.solution);
                        }
                        else if (question.type === questionTypes.rating) {

                            studentAnswerOptions = RatingQuestion.computeScalePoints(question.scaleStart, question.scaleEnd, question.scaleStep);

                        } else {
                            console.error("Question type: '" + question.type + "' unknown to stats.js createEntry().", question);
                        }
                    }
                }

            var newEntry = statsFormat.createDbEntry(questionID, studentAnswerOptions, question.solution, type);
            that.data[newEntry.questionID] = newEntry;
        },

        // returns question object or null if not found
        getQuestionBy: function (questionID) {
            if (questionID in this.data){
                return this.data[questionID];
            } else {
                return null;
            }
        },

        getAllQuestions: function() {
          return this.data;
        },

        __incrementVote: function (question, aOffset) {
            question.studentAnswers[aOffset].numVotes = question.studentAnswers[aOffset].numVotes + 1;
            this.__notifyListeners(question.questionID);
        },

        addListenerOnUpdate: function(func) {
            this.listenerFunctions.push(func);
        },

        removeListener: function(func) {
            var index = this.listenerFunctions.indexOf(func);
            if (index !== -1){
                this.listenerFunctions.splice(index, 1);
            }

        },

        __notifyListeners: function(questionID) {
            this.listenerFunctions.forEach(function(listenerFunc){
               listenerFunc(questionID);
            });
        }
    };

    return new Stats();
}); // requireJS define