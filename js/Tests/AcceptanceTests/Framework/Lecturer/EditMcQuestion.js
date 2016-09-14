module.exports = {
    create: function (mcPage, modalPage, seleniumHelper) {
        return new EditMcQuestion(mcPage, modalPage, seleniumHelper);
    }
};

function EditMcQuestion(mcPage, modalPage, seleniumHelper) {
    this.mcPage = mcPage;
    this.modalPage = modalPage;
    this.sh = seleniumHelper;
    this.consts = require('../../Utilities/Constants').create();

    this.oldQuestion = "";
    this.newQuestion = "";
    this.optionsName = "";
    this.trueOptionsArray = "";
}

EditMcQuestion.prototype = {
    constructor: EditMcQuestion,

    startAsync: function () {
        var that = this;

        return that.modalPage.openEditQuestionEditorForAsync(that.oldQuestion).then(function () {
            if (that.newQuestion) {
                that.mcPage.setQuestion(that.newQuestion);
            }

            if (that.optionsName) {
                that.mcPage.removeAllAnswerOptionsAsync().then(function () {
                    that.mcPage.setAnswerOptions(that.optionsName, that.numOptions);
                });
            }

            if (that.trueOptionsArray.length > 0) {
                for (var i = 0; i < that.trueOptionsArray.length; i++) {
                    that.mcPage.setNthOptionTrue(that.trueOptionsArray[i]);
                }
            }

            that.modalPage.closeEditModalWithSave();
        });
    },

    changeQuestion: function (oldQ, newQ) {
        this.oldQuestion = oldQ;
        this.newQuestion = newQ;
        return this;
    },

    changeOptionsNameAndNumber: function (name, number) {
        this.optionsName = name;
        this.numOptions = number;
        return this;
    },

    changeToTrue: function (varQuestionNumbers) {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i) {
            args[i] = arguments[i];
        }
        this.trueOptionsArray = args;
        return this;
    }

}; // prototype