/**
 * Created by Pascal on 08.05.2016.
 */

define(['jquery', 'FormsValidation'], function ($, FormsValidation) {

    function McFormsValidator() {
        this.minNumOptions = 1;
        this.minNumCorrectOptions = 1;
        this.mcOptionsFormGroup = "#mcOptionsFormGroup";
        this.errorSpan = "#helpBlockMcOptions";
        $.extend(McFormsValidator.prototype, FormsValidation.__proto__);
    } // EOF class


    McFormsValidator.prototype = {
        constructor: McFormsValidator,

        validateForms: function () {
            var validQuestion = this.validateQuestion();
            var validOptions = this.__validateOptions();

            return validQuestion && validOptions;
        },

        __validateOptions: function () {
            var hasMinNumOptions = this.__hasMinNumOptions();
            this.showErrorIfFalse(hasMinNumOptions, this.mcOptionsFormGroup, this.errorSpan, "A minimum of " + this.minNumOptions + " options is required");
            var allOptionsValid = this.__allOptionsAreValid();
            var minNumCorrect = this.__minNumCorrectOptions();
            this.showErrorIfFalse(allOptionsValid && minNumCorrect, this.mcOptionsFormGroup, this.errorSpan, "Please create at least " + this.minNumOptions + " option(s). " + this.minNumCorrectOptions + " of them need(s) to be marked as correct");

            return hasMinNumOptions && allOptionsValid && minNumCorrect;
        },

        __hasMinNumOptions: function() {
            return this.minNumOptions <= $(".active-mcOption").length;
        },

        __allOptionsAreValid: function() {
            var that = this;
            var $textareas = $(".active-mcOption").find("textarea");
            var invalidOptions = $textareas.filter(function(index, textarea) {
                var val = $(textarea).val();
                return that.__isEmptyOrUndefined(val);
            });
            return invalidOptions.length === 0;
        },

        __minNumCorrectOptions: function () {
            var correctButtons = $(".mcTrueFalseToggle .btn[name=trueOption]").filter(function(){
                return $(this).hasClass('active');
            });

            return correctButtons.length >= this.minNumCorrectOptions;
        }
    }; // prototype
    
    return new McFormsValidator();
}); // requireJS define