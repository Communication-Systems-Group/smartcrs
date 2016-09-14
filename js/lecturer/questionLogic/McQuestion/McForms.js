/**
 * Created by Pascal on 08.05.2016.
 */

define(['jquery', 'McFormsValidator', 'webix'], function ($, McFormsValidator, webix) {

    function McForms() {
        this.validator = McFormsValidator;
        this.parentModalTag = ".modal-dialog";
        this.formTag = "#qMcInputsForm";
        this.questionTag = $("#sharedQuestionTextareaTemplate").find("textarea");
        this.mcOptionsFormGroupTag = "#mcOptionsFormGroup";
        this.activeOptionTag = ".active-mcOption";
        this.correctButtonTag = ".mcTrueFalseToggle .btn[name=trueOption]";
        this.delOptionButtonTag = ".removeMcOptionButton";
    } // EOF class

    McForms.prototype = {
        constructor: McForms,

        /**
         *
         * @returns {{questionText: (String), answerOptions: Array<String>}}
         */
        createFromForms: function () {
            var questionText = $(this.questionTag).val();
            var answerOptions = this.__getAnswerOptionsFromForm();
            return {questionText: questionText, answerOptions: answerOptions};
        },
        
        validate: function() {
            return this.validator.validateForms();
        },

        /**
         *
         * @param answer {String}
         * @param isCorrect {Boolean}
         * @returns {{answer: (String), correct: (Boolean)}}
         * @private
         */
        __createAnswerOption: function (answer, isCorrect) {
            return {
                answer: answer,    // the actual text of the answer option
                correct: isCorrect // false/true
            };
        },

        setFields: function(question) {
            this.resetForms();
            $(this.questionTag).val(question.question);
            this.__setAnswerOptionsFromArray(question.possibleAnswers);
        },

        focusOnInactiveMcOption: function(inactiveMcOption) {
            this.__activateAnswerOption(inactiveMcOption);
            this.__addAnswerOption();
        },
        
        resetForms: function() {
            $(this.formTag).get(0).reset();
            $(this.mcOptionsFormGroupTag).empty();
            this.__addAnswerOption();
        },

        showForm: function() {
            var forms = $(this.parentModalTag).find("form");
            forms.hide();
            $(this.formTag).show();
            var questionField = $(this.formTag + " .sharedQuestionTextarea");
            questionField.append($("#sharedQuestionTextareaTemplate").show());
            if ($(".inactive-mcOption").length === 0) {
                this.__addAnswerOption();
            }
        },
        
        removeMcOptionButtonHandler: function($this) {
            var $row = $this.closest('.form-group');
            var $option = $row.find('[name="option[]"]');
            
                var val = $option.val();
                if (val.trim() === "") {    // remove empty rows without prompt
                    $row.remove();
                } else {
                    webix.confirm({
                        title: "Delete question",
                        ok: "Yes",
                        cancel: "No",
                        type: "confirm-error",
                        text: "Do you really want to delete question:'" + val + "'?",
                        callback: function (result) { //setting callback
                            if (result) {
                                $row.remove();
                            }
                        }
                    });
                }
        },

        __activateAnswerOption: function (inactiveMcOption) {
            inactiveMcOption.removeClass("inactive-mcOption").addClass("active-mcOption");
            var textarea = inactiveMcOption.find("textarea");
            textarea.attr("placeholder", "");
            inactiveMcOption.find(".removeMcOptionButton").removeClass("disabled");
        },

        __addAnswerOption: function() {
            var $template = $('#optionTemplate');
            var $clone = $template
                .clone()
                .removeClass('hide')
                .removeAttr('id');

            $clone.find('.mcTrueFalseToggle-template')
                .removeClass('mcTrueFalseToggle-template')
                .addClass('mcTrueFalseToggle');
            $clone.find('.inactive-mcOption-template')
                .removeClass('inactive-mcOption-template')
                .addClass('inactive-mcOption');

            var $delOptionButton = $clone.find(this.delOptionButtonTag);
            $delOptionButton.prop('disabled', false);    // activate

            $(this.mcOptionsFormGroupTag).append($clone);
        },

        /**
         *
         * @param answerOptions Array<{answer: (String), correct: (Boolean)}>
         * @private
         */
        __setAnswerOptionsFromArray: function(answerOptions) {
            var that = this;
            answerOptions.forEach(function(option){
                var newOption = $(".inactive-mcOption").eq(0);
                that.focusOnInactiveMcOption(newOption);
                var textarea = newOption.find("textarea");
                textarea.val(option.answer);
                if (option.correct){
                    newOption.find(that.correctButtonTag).click();
                }
            });
        },

        /**
         *
         * @returns Array<String>
         * @private
         */
        __getAnswerOptionsFromForm: function () {
            var that = this;
            var answerOptions = [];
            $(this.activeOptionTag).each(function () {
                var $this = $(this);
                var text = $this.find("textarea").val();
                var isCorrect = $this.find(that.correctButtonTag).hasClass('active');
                answerOptions.push(that.__createAnswerOption(text, isCorrect));
            });

            return answerOptions;
        }

    }; // prototype

    return new McForms();
}); // requireJS define