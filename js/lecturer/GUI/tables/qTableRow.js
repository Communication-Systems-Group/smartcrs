/**
 * Created by Pascal on 18.05.2016.
 */

define(['jquery', 'questionsStorage'], function ($, qStorage) {

    function QTableRow() {
        this.lastDblClickedQText = "";  // stores the qText that trigered the edit modal
        
        this.$rowHtml = $('<table> <tr class="ui-sortable-handle"> <td class="qIDColumn"></td> <td class="qTextColumn"></td> <td class="qTypeColumn"> </td> <td class="qShareColumn"> <button type="button" class="btn btn-default shareButtonFunc"><span class="glyphicon glyphicon-share-alt"></span><span class="text"> Share</span></button> </td> <td class="qStatsColumn"> <button type="button" class="btn btn-default statsButton"><span class="glyphicon glyphicon-stats"></span><span class="text"> Stats</span></button> </td> <td class="votesPerStudentColumn"></td> <td class="deleteQuestionColumn"><a type="button" class="close deleteQuestionBtn">×</a></td> </tr> </table>');
        this.tableID = "#questionsControlTable ";
        this.rowClass = " .ui-sortable-handle";
        this.$emptyTableRow = $("<tr id='emptyTableTR'> <td id='emptyTableTD' colspan='6'> Click on 'Add new question' to create a new question </td> </tr>");
    } // EOF class

    QTableRow.prototype = {
        constructor: QTableRow,

        renumber_table: function () {
            var that = this;
            this.getRows().each(function () {
                var $this = $(this);
                count = $this.parent().children().index($this) + 1;
                that.setIdColumn($this, count);
            });
        },

        //Helper function to keep table row from collapsing when being sorted
        fixHelperModified: function (e, tr) {
            var $originals = tr.children();
            var $helper = tr.clone();
            $helper.children().each(function (index) {
                $(this).width($originals.eq(index).width())
            });
            return $helper;
        },

        getRows: function() {
            return $($(this.tableID).find(this.rowClass));
        },

        removeRow: function ($row) {
            $row.remove();
            this.renumber_table();
            this.showInfoOverlayIfEmpty();
        },

        getClosestRow: function ($obj) {
            return $obj.closest(this.rowClass);
        },

        getQTextFromRow: function ($row) {
            return $row.find(".qTextColumn").text();
        },

        getQuestionFromRow: function ($row) {
            var qText = this.getQTextFromRow($row);
            return qStorage.getQuestionFromQText(qText);
        },

        getRowFromQText: function (qText) {
            var that = this;
            var foundQ = $(this.tableID + this.rowClass).filter(function () {
                var rowQText = that.getQTextFromRow($(this));
                if (rowQText === qText) {
                    return $(this);
                }
            });
            if (foundQ.length === 1) {
                return foundQ;
            } else {
                console.error("couldn't find correct number of rows from qText", foundQ, qText);
            }
        },

        getItemByQText: function (questionText) {
            var that = this;
            var questions = $(that.tableID + " .qTextColumn").filter(function () {
                return ($(this).text() === questionText);
            });
            if (questions.length === 1) {
                return this.getQuestionFromRow(questions.closest(that.rowClass));
            } else {
                console.error("Didn't find 1 question for:", questionText, questions);
            }
        },

        showInfoOverlayIfEmpty: function () {
            if (this.isEmpty()){
                $("#qTableBody").append(this.$emptyTableRow);
            }
        },

        removeEmptyRow: function () {
            $("#emptyTableTR").remove();
        },

        isEmpty: function () {
            return $(this.rowClass).length === 0;
        },

        /**
         * Setter & Getters for row cells
         */

        setIdColumn: function($obj, content) {
            $obj.find(".qIDColumn").text(content);
        },

        getIdColumnNumber: function($obj) {
            return +$obj.find(".qIDColumn").text();
        },

        findIdColumnThatContains: function($obj, searchString) {
            return $obj.find(".qIDColumn:contains(" + searchString + ")");
        },

        getVotesPerStudText: function($obj) {
            return $obj.find(".votesPerStudentColumn").text();
        },

        setVotesPerStudText: function($obj, content) {
            $obj.find(".votesPerStudentColumn").text(content);
        }

    }; // prototype

    return new QTableRow();
}); // requireJS define