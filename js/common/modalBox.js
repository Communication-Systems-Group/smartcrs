/**
 * Created by Pascal on 15.05.2016.
 */

define(['webix'], function (webix) {

    function ModalBox(titleText, bodyText, cbFunc, optButtonsTextArray) {
        var buttons = optButtonsTextArray || ["Yes", "No"];

        webix.modalbox({
            title: titleText,
            buttons: buttons,
            text: bodyText,
            width:500,
            callback: cbFunc
        });
    }

    return ModalBox;
}); // requireJS define