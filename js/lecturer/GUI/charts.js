/**
 * Created by Pascal on 04.07.2014.
 * This class creates a window with a chart.
 * Takes care of displaying the stats graphs
 */
define(['jquery', 'stats', 'ChartWindow', 'questionTypes'], function ($, stats, Window, questionTypes) {
    function Charts() {
        this.data = []; // set in updateData()
        this.questionID = ""; // set in show()
        this.winDow = "";
    } // EOF Class

    Charts.prototype = {
        constructor: Charts,

        show: function (question) {
            this.questionID = question.questionID;
            this.isOpenQuestion = question.type === questionTypes.open;

            this.__closeOtherWindows();
            this.winDow = this.__setupWindow();
            this.__addListenerOnDataUpdate();
            this.winDow.showWindow();
            this.updateData(); // update after show --> otherwise scrollview for open question list won't work
        },

        getQuestion: function () {
            return this.data;
        },

        getQuestionID: function () {
            return this.questionID;
        },

        __closeOtherWindows: function () {
            var existingWindow = $$("chartsWindow");
            if (existingWindow) {
                existingWindow.close();
            }
        },

        __setupWindow: function () {
            return new Window(this);
        },

        updateData: function () {
            var that = this;

            var newData = stats.getQuestionBy(that.questionID);
            that.__resetData();

            for (var i = 0; i < newData.studentAnswers.length; ++i) {
                var color = that.__colorAnswers(newData.type, newData.studentAnswers[i].answerID, newData.solution);

                that.data.push({
                    answer: newData.studentAnswers[i].answerID,
                    votes: newData.studentAnswers[i].numVotes,
                    color: color
                });
            }

            this.__sortData();
            this.winDow.refreshWindow();

        },

        __addListenerOnDataUpdate: function () {
            var that = this;
            stats.addListenerOnUpdate(function() {
                that.updateData();
            });
        },

        removeListenerOnDataUpdate: function () {
            stats.removeListener();
        },

        __sortData: function () {
            this.data.sort(function (objA, objB) {
                if (typeof objA.answer === "string") {
                    return objA.answer.localeCompare(objB.answer);
                } else {
                    return objA.answer > objB.answer
                }
            });
        },

        // empty the array while keeping the reference
        __resetData: function () {
            this.data = [];
        },

        __colorAnswers: function (type, studAnswer, lecSolution) {
            var color = "green";

            if (type === questionTypes.mc) {
                if ((jQuery.inArray(studAnswer, lecSolution)) === -1) {
                    color = "red";
                }
                return color;
            }
            else {
                if (studAnswer != lecSolution) {    // TODO: used != instead of !== because lecSolution is a string if scaleQ
                    color = "red";
                }
                return color;
            }
        }
    };

    return new Charts();
}); // requireJS define