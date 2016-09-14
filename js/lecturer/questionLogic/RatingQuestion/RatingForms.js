/**
 * Created by Pascal on 09.05.2016.
 */

define(['jquery', 'RatingFormsValidator', 'RatingScaleInputs'], function ($, RatingFormsValidator, ratingInputs) {

    function RatingForms() {
        this.validator = RatingFormsValidator;
        this.formTag = "#qScaleForm";
        this.parentModalTag = ".modal-dialog";
    } // EOF class

    RatingForms.prototype = {
        constructor: RatingForms,

        resetForms: function() {
            $(this.formTag).get(0).reset();
        },

        validate: function() {
            return this.validator.validateForms();
        },

        collectFields: function() {
          return ratingInputs.collectFields();
        },

        setFields: function(newFields) {
            this.resetForms();
            ratingInputs.setFields(newFields);
        },

        showForm: function() {
            var forms = $(this.parentModalTag).find("form");
            forms.hide();
            $(this.formTag).show();
            var questionField = $(this.formTag + " .sharedQuestionTextarea");
            questionField.append($("#sharedQuestionTextareaTemplate").show());
        }
    }; // prototype
    
    return new RatingForms();
}); // requireJS define