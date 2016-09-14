/**
 * Created by Pascal on 05.07.2014.
 * This class defines the format of the stats data.
 */

define(['jquery', 'webix'], function ($) {
    function StatsDataFormat() {

    } // EOF Class

    StatsDataFormat.prototype = {
        constructor: StatsDataFormat,

        /**
         *
         * @param questionID The actual question as string
         * @param studentAnswerOptions Array[string] with all answer options (mc) or the solution (open/scale).
         * This makes the options visible in the stats, even if they were not chosen by the students.
         * @param lecturerSolution Array[String]
         * @param type
         * @returns {{questionID: string, peerIDsVoted: Array[int], studentAnswers: Array[{answerID, numVotes}], lecturerSolution: Array[String], type: string}}
         */
        createDbEntry: function (questionID, studentAnswerOptions, lecturerSolution, type) {

            // studentAnswerOptions get converted to {answerID, numVotes}
            var studentResponse = [];
            for (var i = 0; i < studentAnswerOptions.length; ++i) {
                studentResponse.push(this.createSolutionFormat(studentAnswerOptions[i]));
            }

            return {questionID: questionID,
                peerIDsVoted: [],
                studentAnswers: studentResponse,  // {answerID, numVotes}
                solution: lecturerSolution,   // Array[String]
            type: type};
        },

        /**
         *
         * @returns {{answerID: string, numVotes: number}}
         */
        createSolutionFormat: function(solution) {

            return {answerID: solution, numVotes: 0};
    }
    };

    return new StatsDataFormat();
}); // requireJS define