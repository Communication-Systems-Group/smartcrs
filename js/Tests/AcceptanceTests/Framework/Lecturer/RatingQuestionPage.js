/**
 * Created by Pascal on 16.08.2015.
 */

module.exports = {
    createQuestion: function (seleniumHelper, modal) {
        return new RatingQuestionPage(seleniumHelper, modal);

    }
};

function RatingQuestionPage(seleniumHelper, modal) {
    this.sh = seleniumHelper;
    this.modal = modal;
    this.consts = require('../../Utilities/Constants').create();
    this.targetValue = 0.00;
}

RatingQuestionPage.prototype = {
    constructor: RatingQuestionPage,

    createQuestion: function (questionText) {
        this.modal.openNewQuestionEditorFor(this.consts.divRadioQScale);
        this.setQuestion(questionText);
        this.setSliderToAsync(5.00);
        this.modal.saveQuestion();
        this.modal.closeAndResetModal();
    },

    setQuestion: function (questionText) {
        var inputQuestion = this.sh.findElementById("textareaScaleQuestion");
        this.sh.sendKeysJavascriptWithClear(inputQuestion, questionText);
    },

    setScalePoints: function (start, end, step) {
        this.sh.sendKeysJavascriptWithClear(this.sh.findElementById("inputSliderStart"), start);
        this.sh.sendKeysJavascriptWithClear(this.sh.findElementById("inputSliderEnd"), end);
        this.sh.sendKeysJavascriptWithClear(this.sh.findElementById("inputSliderStep"), step);
    },

    setSliderToAsync: function (number) {
        var that = this;
        var defer = this.sh.getDefer();
        this.targetValue = +number; // make sure it's not a string

        that.sh.findElementById("sliderStatusLabel").then(function (sliderStatusLabel) {
            that.__moveSlider(sliderStatusLabel, defer);
        });

        return defer.promise;
    },

    __moveSlider: function (sliderStatusLabel, defer) {
        var that = this;
        that.sh.getTextAsync(sliderStatusLabel).then(function (textValue) {
            if (+textValue !== that.targetValue) {
                that.sh.sendKeys(sliderStatusLabel, that.sh.getKey("ARROW_UP"));
                return that.__moveSlider(sliderStatusLabel, defer);
            } else {
                return defer.fulfill();
            }
        });
    }
};


