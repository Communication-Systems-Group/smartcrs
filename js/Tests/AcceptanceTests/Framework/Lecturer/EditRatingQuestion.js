module.exports = {
    create: function (ratingPage, modalPage, seleniumHelper) {
        return new EditRatingQuestion(ratingPage, modalPage, seleniumHelper);
    }
};

function EditRatingQuestion(ratingPage, modalPage, seleniumHelper) {
    this.ratingPage = ratingPage;
    this.modalPage = modalPage;
    this.sh = seleniumHelper;
    this.consts = require('../../Utilities/Constants').create();

    this.oldQuestion = "";
    this.newQuestion = "";
    this.newScalePoints = "";
}

EditRatingQuestion.prototype = {
    constructor: EditRatingQuestion,

    startAsync: function () {
        var that = this;

        return that.modalPage.openEditQuestionEditorForAsync(that.oldQuestion).then(function(){
            if (that.newQuestion) { that.ratingPage.setQuestion(that.newQuestion); }

            if (that.newScalePoints) {
                that.ratingPage.setScalePoints(that.newScalePoints.start, that.newScalePoints.end, that.newScalePoints.step);
            }

            that.modalPage.closeEditModalWithSave();
        });
    },

    changeQuestion: function (oldQ, newQ) {
        this.oldQuestion = oldQ;
        this.newQuestion = newQ;
        return this;
    },

    changeScalePoints: function (start, end, step) {
        this.newScalePoints = {start: start, end: end, step: step};
        return this;
    }

    }; // prototype