/**
 * Created by Pascal on 16.08.2015.
 */
module.exports = {
    createQuestion: function(seleniumHelper, modal) {
        return new OpenQuestionPage(seleniumHelper, modal);
}
};

function OpenQuestionPage(seleniumHelper, modal) {
    this.sh = seleniumHelper;
    this.modal = modal;
    this.consts = require('../../Utilities/Constants').create();
}

OpenQuestionPage.prototype = {
    constructor: OpenQuestionPage,

    createQuestion: function (questionText) {
        this.modal.openNewQuestionEditorFor(this.consts.divRadioQOpen);
        this.setQuestion(questionText);
        this.setAnswer("Answer: " + questionText);
        this.modal.saveQuestion();
        this.modal.closeAndResetModal();
    },

    setQuestion: function (questionText){
        var inputAnswer = this.sh.findElementById("textareaOpenQuestion");
        this.sh.sendKeysJavascript(inputAnswer, questionText);
    },

    setAnswer: function (answer) {
        var inputSolution = this.sh.findElementById("textareaOpenSolution");
        this.sh.sendKeysJavascript(inputSolution, answer);
    }
};