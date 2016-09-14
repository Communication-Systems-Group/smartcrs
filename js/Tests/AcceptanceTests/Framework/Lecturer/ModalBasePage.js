/**
 * Created by Pascal on 21.12.2015.
 */

module.exports = {
    create: function (seleniumHelper) {
        return new ModalBasePage(seleniumHelper);
    }
};

function ModalBasePage(seleniumHelper) {
    this.sh = seleniumHelper;
}

ModalBasePage.prototype = {
    constructor: ModalBasePage,

    openNewQuestionEditorFor: function (questionTypeRadioButton) {
        this.sh.clickById("buttonAddNewQuestion");
        this.__waitTillModalLoaded();
        this.sh.clickById(questionTypeRadioButton);
    },

    saveQuestion: function () {
        this.sh.clickById("buttonAddQuestionToMainTable");
    },

    closeAndResetModal: function () {
        this.__closeModal("buttonModalClose");
    },

    closeEditModalWithSave: function() {
        this.__closeModal("buttonModalApplyChanges");
    },

    openEditQuestionEditorForAsync: function (questionText) {
        var that = this;

        return that.__findRowNumberOfQuestionAsync(questionText).then(function(rowNumber){
            that.sh.doubleClickByCss("div[view_id='controlTable'] div[column='1'] div:nth-child(" + rowNumber + ")");
            that.__waitTillModalLoaded();
        });
    },

    __findRowNumberOfQuestionAsync: function (questionText) {
        var that = this;
        var defer = that.sh.getDefer();
        that.sh.findElementsByCss("div[view_id='controlTable'] div[column='1'] > .webix_cell").then(function (rows) {
            rows.forEach(function (element, index) {
                that.sh.getTextAsync(element).then(function (text) {
                    if (text === questionText) {
                        var row = index + 1; // CSS starts iterating at 1
                        defer.fulfill(row);
                    }
                });
            });
        });
        return defer.promise;
    },

    __closeModal: function(buttonId) {
        var modalWindow = this.sh.findElementById('modalCreateQuestion');
        this.sh.clickById(buttonId);
        this.sh.waitUntilNotVisible(modalWindow);
    },

    __waitTillModalLoaded: function () {
        var modalWindow = this.sh.findElementById('modalCreateQuestion');
        this.sh.wait(function () {
            return modalWindow.getCssValue("opacity").then(function (opacity) {
                return opacity === "1";
            });
        });
    }
};