/**
 * Created by Pascal on 11.01.2016.
 */

define(['popupWindow', 'qTableRow', "charts", "stats"], function (popupWindow, qTableRow, charts, stats) {

    function StatsButton() {} // EOF class

    StatsButton.prototype = {
        constructor: StatsButton,

        statsButtonHandler: function ($this) {
            var $row = qTableRow.getClosestRow($this);
            var qText = qTableRow.getQTextFromRow($row);

            var question = stats.getQuestionBy(qText);
            if (!question) {
                popupWindow(2000, "Error: Question not started", "You must start a question to see its stats.");
                return;
            }
            charts.show(question);
        }

    }; // prototype

    return new StatsButton();
}); // requireJS define