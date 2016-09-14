define(['jquery', 'modalBox', 'McQuestion', 'RatingQuestion', 'OpenQuestion'], function ($, modalBox, McQuestion, RatingQuestion, OpenQuestion) {

    function QuestionManager() {
        this.qTypes = {
            "McQuestion": McQuestion,
            "RatingQuestion": RatingQuestion,
            "OpenQuestion": OpenQuestion
        }
    }

    QuestionManager.prototype = {
        constructor: QuestionManager,

        addQuestionToTable: function () {
            var that = this;
            require(['questionsControlTable'], function (tableMain) {
                var qInstance = that.getQuestionInstanceFromModal();
                var question = qInstance.createFromForms();

                var valid = qInstance.forms.validate();
                if (!valid) {
                    return;
                }

                if (tableMain.add(question) ) {
                    $("#questionAddedAlert").trigger("showInfo");
                    qInstance.forms.resetForms();
                }
            });
        },

        closeModalHandler: function () {
            var qInstance = this.getQuestionInstanceFromModal();
            var inEditMode = $(".modeEditQuestion:visible").length > 0;

            if (inEditMode) {   // close modal without asking to save changes
                this.__closeAndResetModal(qInstance);
            }
            else {
                this.__closeCreationMode(qInstance);
            }
        },

        __closeCreationMode: function(qInstance) {
            var that = this;

            if (!qInstance) {    // undefined if no form has been selected after opening modal
                this.__closeAndResetModal();
            } else {
                var question = qInstance.createFromForms();
                if (!question.question) {   // just close if question field is unchanged
                    this.__closeAndResetModal(qInstance);
                } else {
                    modalBox("Discard Question?", "Do you really want to quit and lose this question?<br> '" + question.question + "'", function (result) {
                        if (result === "0") {
                            that.__closeAndResetModal(qInstance);
                        }
                    });
                }
            }
        },

        __closeAndResetModal: function (questionClass) {
            if (questionClass) {
                questionClass.forms.resetForms();
            }
            $("#modalCreateQuestion").modal('hide');
        },

        /**
         * returns undefined if no form has been selected (e.g. opening add question modal without selecting a form).
         * @returns Object || undefined
         */
        getQuestionInstanceFromModal: function () {
            var questionClassString = $("form[name='questionForm']:visible").data("question-constructor");
            return this.__constructQuestionFromString(questionClassString);
        },

        __constructQuestionFromString: function(questionClassString) {
            if (questionClassString) {
                return new this.qTypes[questionClassString].constructor();
            } else {    // no form has been selected
                return "";
            }
        },

        getQuestionInstanceFromDataProperty: function(qConstructor) {
            return this.__constructQuestionFromString(qConstructor);
        },

        getQuestionInstanceFromQuestionType: function (type) {
            var questionClassString = type + "Question"; // e.g. "Mc" + "Question"
            return new this.qTypes[questionClassString].constructor();
        }
    }; // prototype

    return new QuestionManager();

}); // requirejs define