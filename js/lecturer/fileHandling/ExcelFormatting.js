/**
 * Created by Pascal on 21.04.2016.
 */

define(['jquery', 'stats', 'excelExporter', 'questionTypes'], function ($, stats, excel, questionTypes) {

    function ExcelFormatting() {
        this.headerBgColor = "#C5D9F1";
        this.solutionBgColor = "#D8E4BC";
    } // EOF class

    ExcelFormatting.prototype = {
        constructor: ExcelFormatting,

        getLecturerSolution: function (question) {
            if (question.type === questionTypes.mc){
                return question.solution;
            } else if (question.solution) {
                if (question.type === questionTypes.rating){
                    try {
                        question.solution = Number(question.solution);
                    } catch(e) {
                        question.solution = "NOT_A_NUMBER: " + question.solution;
                    }
                }
                return [question.solution];
            } else {
                return [];
            }
        },
        exportToExcelAsync: function (filename) {
            var that = this;
            var defer = $.Deferred();
            var $table = $("<table></table>");
            var statsData = stats.data;

            Object.keys(statsData).forEach(function (q) {
                var question = statsData[q];
                var lecturerProvidedSolution = that.getLecturerSolution(question);
                $table.append("<tr style='background-color: " + that.headerBgColor + ";'> <th>Question</th> <th>Type</th> </tr>");
                $table.append("<tr> <td>" + question.questionID + "</td> <td>" + question.type + "</td> </tr>");
                $table.append("<tr><th></th> <th>Answers</th> <th># Votes</th></tr>");

                for (var i = 0; i < question.studentAnswers.length; i++) {
                    var studAnswer = question.studentAnswers[i].answerID;
                    var numVotes = question.studentAnswers[i].numVotes;
                    var solStyle = "";
                    if (lecturerProvidedSolution.length && lecturerProvidedSolution.indexOf(studAnswer) > -1) {
                        solStyle = "style='background-color:" + that.solutionBgColor + "'";
                    }
                    $table.append("<tr> <td></td> <td " + solStyle + ">" + studAnswer + " </td> <td>" + numVotes + "</td> </tr>")
                }
            });

            var a = $("<a/>")[0];
            excel.excel(a, $table[0], filename);
            defer.resolve(a.href);

            return defer.promise();
        }


    }; // prototype

    return new ExcelFormatting();
}); // requireJS define