/**
 * Created by Pascal on 16.08.2015.
 */
module.exports = {
    createMCQuestion: function(seleniumHelper, modal) {
    return new McQuestionPage(seleniumHelper, modal);
}
};

function McQuestionPage(seleniumHelper, modal) {
    this.sh = seleniumHelper;
    this.modal = modal;
    this.numAnswerOptions = 2;
    this.consts = require('../../Utilities/Constants').create();
}

McQuestionPage.prototype = {
    constructor: McQuestionPage,

    createQuestion: function (questionText) {
        this.modal.openNewQuestionEditorFor(this.consts.divRadioQMC);
        this.setQuestion(questionText);
        this.setAnswerOptions("Answer Option", this.numAnswerOptions);
        this.setNthOptionTrue(1);
        this.modal.saveQuestion();
        this.modal.closeAndResetModal();
    },

    setQuestion: function (questionText){
        var inputField = this.sh.findElementById("inputMcQuestion");
        this.sh.sendKeysJavascriptWithClear(inputField, questionText);
    },

    setAnswerOptions: function(answerText, numOptions) {
        var addOptionButton = this.sh.findElementById("buttonaddMcOption");
        for (var i = 0; i < numOptions; ++i) {
            this.sh.click(addOptionButton);

            this.sh.findElementByCss("div[column='0'] > div:last-child > b").click();
            var inputField = this.sh.findElementByCss(".webix_dt_editor > input");
            var currAnswerText = answerText + " #" + (i + 1);
            this.sh.sendKeysJavascript(inputField,  currAnswerText);
            this.sh.sendKeys(inputField, "\n");
        }
    },

    removeAllAnswerOptionsAsync: function() {
        var that = this;
        var delButtonCss = "#mcQuestionsEditor .delete_button";

        return that.sh.findElementsByCss(delButtonCss).then(function(delButtons){
            var buttonCounter = delButtons.length;
            // after every DOM change, the element must be searched for again
            for (var i = 0; i < buttonCounter; i++) {
                that.sh.clickByCss(delButtonCss);
            }
        });
    },

    setNthOptionTrue: function(answerNum) {
        this.sh.assert(answerNum > 0, "CSS indices start at 1");
        this.sh.findElementByCss("#mcQuestionsEditor div[column='1'] > div:nth-child(" + answerNum + ")").click();
        this.sh.findElementByCss("#mcQuestionsEditor select > option[value='true']").click();
    }
};