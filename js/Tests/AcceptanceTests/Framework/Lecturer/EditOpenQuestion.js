module.exports = {
    create: function (openPage, modalPage, seleniumHelper) {
        return new EditOpenQuestion(openPage, modalPage, seleniumHelper);
    }
};

function EditOpenQuestion(openPage, modalPage, seleniumHelper) {
    this.openPage = openPage;
    this.modalPage = modalPage;
    this.sh = seleniumHelper;
    this.consts = require('../../Utilities/Constants').create();

    this.oldQuestion = "";
    this.newQuestion = "";
    this.newAnswer = "";
}

EditOpenQuestion.prototype = {
    constructor: EditOpenQuestion,

    startAsync: function () {
        var that = this;

        return that.modalPage.openEditQuestionEditorForAsync(that.oldQuestion).then(function () {
            if (that.newQuestion) {
                that.openPage.setQuestion(that.newQuestion);
            }

            if (that.newAnswer) {
                that.openPage.setAnswer(that.newAnswer);
            }

            that.modalPage.closeEditModalWithSave();
        });
    },

    changeQuestion: function (oldQ, newQ) {
        this.oldQuestion = oldQ;
        this.newQuestion = newQ;
        return this;
    },

    changeAnswer: function (newAnswer) {
        this.newAnswer = newAnswer;
        return this;
    }

}; // prototype