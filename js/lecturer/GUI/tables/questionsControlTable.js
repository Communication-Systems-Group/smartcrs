/**
 * Created by Pascal on 17.05.2016.
 */

/**
 * Created by Pascal on 17.05.2016.
 */

define(['jquery', 'numStudentVotes', 'autoSaveManager', 'questionsStorage', 'qTableRow'], function ($, numStudentVotes, autoSaver, qStorage, qTableRow) {

    function NewqControlTable() {
        var that = this;
        that.tableID = "#questionsControlTable ";
        that.rowClass = " .ui-sortable-handle";
        this.$rowHtml = $('<table> <tr class="ui-sortable-handle"> <td class="qIDColumn"></td> <td class="qTextColumn"></td> <td class="qTypeColumn"> </td> <td class="qShareColumn"> <button type="button" class="btn btn-default shareButtonFunc"><span class="glyphicon glyphicon-share-alt"></span><span class="text"> Share</span></button> </td> <td class="qStatsColumn"> <button type="button" class="btn btn-default statsButton"><span class="glyphicon glyphicon-stats"></span><span class="text"> Stats</span></button> </td> <td class="votesPerStudentColumn"></td> <td class="deleteQuestionColumn"><a type="button" class="close deleteQuestionBtn">×</a></td> </tr> </table>');

        numStudentVotes.startListenForStatsUpdates();
    } // EOF class

    NewqControlTable.prototype = {
        constructor: NewqControlTable,

        add: function (question, optFromFile) {
            if (!this.__alreadyInTable(question.question)) {
                question.numAnswersCollected = ""; // TODO: can be removed if added to question constructor

                this.__add(question);
                if (!optFromFile) {
                    autoSaver.setUnsavedQuestionsState();
                }
                return true;
            }
            return false;
        },

        addAtId: function (question, posID) {
            var $clone = this.getClone(question);
            qTableRow.setIdColumn($clone, posID);
            question.numAnswersCollected = "";  // TODO: can be removed if added to question constructor

            qTableRow.removeEmptyRow();
            var $qTextCell = qTableRow.findIdColumnThatContains($(this.rowClass), posID);
            if (!$qTextCell.length) {
                $("#qTableBody").append($clone);  // first (and only) question in table
            } else {
                var $row = $qTextCell.closest(this.rowClass);
                $row.before($clone);
                qTableRow.renumber_table();
            }

            autoSaver.setUnsavedQuestionsState();
        },

        __add: function (question) {
            var $clone = this.getClone(question);

            var numQuestions = $(this.tableID).find(".qTextColumn").length;
            qTableRow.setIdColumn($clone, numQuestions + 1);
            qStorage.addQuestion(question);

            qTableRow.removeEmptyRow();
            $("#qTableBody").append($clone);
        },



        updateLastEditedItem: function (newItem) {
            var oldQText = qTableRow.lastDblClickedQText;
            if (qStorage.editQuestionInStorage(oldQText, newItem)) {
                var $oldRow = qTableRow.getRowFromQText(oldQText);
                var oldIDNum = qTableRow.getIdColumnNumber($oldRow);
                qTableRow.removeRow($oldRow);
                this.addAtId(newItem, oldIDNum);
            }
        },

        refreshNumVotes: function (qText, numVotes) {
            var $row = qTableRow.getRowFromQText(qText);
            qTableRow.setVotesPerStudText($row, numVotes);
        },

        __alreadyInTable: function (questionText) {
            var $rows = qTableRow.getRows();
            var existingQuestions = $.grep($rows, function (row) {
                return qTableRow.getQTextFromRow($(row)) === questionText;
            });
            return existingQuestions.length;
        },

        loadFromArray: function (questions) {
            var that = this;
            questions.forEach(function (question) {
                that.add(question, "fromFile");
            });
        },

        getAllSharedQuestions: function () {
            var $rows = qTableRow.getRows();
            var sharedRows = $rows.filter(function () {
                return qTableRow.getVotesPerStudText($(this));
            });

            var sharedQuestions = sharedRows.map(function () {
                return qTableRow.getQuestionFromRow($(this));
            });

            return sharedQuestions;
        },

        serialize: function () {
            var serialized = [];
            qTableRow.getRows().each(function () {
                var question = qTableRow.getQuestionFromRow($(this));
                serialized.push(question);
            });
            return serialized;
        },
        
        getClone: function (question) {
            var $clone = this.$rowHtml.find(this.rowClass).clone();
            $clone.find(".qTextColumn").text(question.question);
            $clone.find(".qTypeColumn").text(question.type);
            $clone.find(".votesPerStudentColumn").text(question.numAnswersCollected || "");
            return $clone;
        },

        onDblClick: function($this) {
            require(['qEditor'], function (qEditor) {
                var $row = qTableRow.getClosestRow($this);
                var question = qTableRow.getQuestionFromRow($row);
                qTableRow.lastDblClickedQText = question.question;
                qEditor.startQuestionManager(qEditor.modes.edit, question);
            });
        }
        
    }; // prototype

    return new NewqControlTable();
}); // requireJS define