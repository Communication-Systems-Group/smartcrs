/**
 * Created by Pascal on 15.04.2016.
 */

define(['stats', 'connectedPeers', 'qTableRow'], function (stats, connectedPeers, qTableRow) {

    function NumStudentVotes() {
        this.peakConnectedStudents = 0;
    } // EOF class

    NumStudentVotes.prototype = {
        constructor: NumStudentVotes,

        startListenForStatsUpdates: function () {
            var that = this;
            var func = function(questionId) {
                that.updateNumStudentVotes(questionId);
            };
            stats.addListenerOnUpdate(func);
        },

        initNumAnswersCollected: function (item) {
            var peakConnected = this.__calculatePeakNumConnectedStudents();
            item.numAnswersCollected = item.numAnswersCollected || this.__createVotesPerStudentString(0, peakConnected);
            return item.numAnswersCollected;
        },

        updateNumStudentVotes: function (questionID) {
            var that = this;
            require(['questionsControlTable'], function (questionsControlTable) {
                var item = qTableRow.getItemByQText(questionID);
                var currentText = item.numAnswersCollected || that.__createVotesPerStudentString(0, 0);

                var oldValues = currentText.split("/");
                var numVotes = +(oldValues[0]) + 1;
                var peakConnected = that.__calculatePeakNumConnectedStudents();

                item.numAnswersCollected = that.__createVotesPerStudentString(numVotes, peakConnected);
                questionsControlTable.refreshNumVotes(questionID, item.numAnswersCollected);
            });
        },

        __createVotesPerStudentString: function (numAnswers, numStudentsConnected) {
            return (numAnswers + "/" + numStudentsConnected);
        },

        __calculatePeakNumConnectedStudents: function () {
            var currConnected = connectedPeers.getNumPeers();
            this.peakConnectedStudents = Math.max(currConnected, this.peakConnectedStudents);
            return this.peakConnectedStudents;
        }

    }; // prototype

    return new NumStudentVotes();
}); // requireJS define