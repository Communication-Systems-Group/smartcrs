/**
 * Created by Pascal on 08.01.2016.
 */

define(['jquery', 'popupWindow', 'McQuestion', 'OpenQuestion', 'RatingQuestion', 'questionTypes'], function ($, popupWindow, mcQuestion, openQuestion, ratingQuestion, questionTypes) {

    function TableHelper() {

    } // EOF class

    TableHelper.prototype = {
        constructor: TableHelper,

        /**
         *  Calling require() takes too long --> tooltip displays "undefined"
         *  Hence the module that contains this method must be required within define() at top of every file that uses it
         */
        tooltipDisplayQuestions: function (row) {
            if (row.type === questionTypes.mc) {
                return mcQuestion.displayTooltipInfo(row);
            } else if (row.type === questionTypes.open) {
                return openQuestion.displayTooltipInfo(row);
            } else {
                return ratingQuestion.displayTooltipInfo(row);
            }
        },

        /**
         *  ID column is dynamically updated when order of items changes
         */
        incrementIndexByOne: function (data) {
            data.each(function (obj, i) {
                obj.index = i + 1;
            });
        },

        getAllRows: function (tableObj) {
            var rows = [];
            for (var id = tableObj.getFirstId(); id; id = tableObj.getNextId(id)) {
                var row = tableObj.getItem(id);
                rows.push(row);
            }
            return rows;
        }

    }; // prototype

    return new TableHelper();
}); // requireJS define