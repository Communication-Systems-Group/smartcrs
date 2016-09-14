/**
 * Created by Pascal on 11.01.2016.
 */

define(['jquery', 'modalBox', 'qTableRow'], function ($, modalBox, qTableRow) {

    function DeleteButton() {
        this.tableID = "controlTable";
    } // EOF class

    DeleteButton.prototype = {
        constructor: DeleteButton,

        deleteRow: function ($this) {
            var $row = qTableRow.getClosestRow($this);
            var qText = qTableRow.getQTextFromRow($row);

            modalBox("Delete Question", "Do you really want to delete:'" + qText + "'?", function (result) {
                if (result === "0") {
                    qTableRow.removeRow($row);
                }
            });
        }
    }; // prototype

    return new DeleteButton();
}); // requireJS define