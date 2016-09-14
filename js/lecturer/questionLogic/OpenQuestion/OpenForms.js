/**
 * Created by Pascal on 09.05.2016.
 */

define(['jquery', 'OpenFormsValidator'], function ($, OpenFormsValidator) {

    function OpenForms() {
        this.validator = OpenFormsValidator;
        this.formTag = "#qOpenForm";
        this.parentModalTag = ".modal-dialog";

    } // EOF class

    OpenForms.prototype = {
        constructor: OpenForms,

        resetForms: function() {
            $(this.formTag).get(0).reset();
        },

        validate: function() {
            return this.validator.validateForms();
        },
        
        setFields: function(newFields) {
            this.resetForms();
            var fields = this.__getFieldTags();
            $(fields.questionTag).val(newFields.question);
            $(fields.solutionTag).val(newFields.solution);
        },

        showForm: function() {
            var forms = $(this.parentModalTag).find("form");
            forms.hide();
            $(this.formTag).show();
            var questionField = $(this.formTag + " .sharedQuestionTextarea");
            questionField.append($("#sharedQuestionTextareaTemplate").show());
        },

        getFieldValues: function () {
            var fields = this.__getFieldTags();
            var question = $(fields.questionTag).val();
            var answer = $(fields.solutionTag).val();
            return {question: question, solution: answer};
        },

        __getFieldTags: function () {
            return {questionTag: $("#sharedQuestionTextareaTemplate").find("textarea"), solutionTag: "#textareaOpenSolution"};
        }
        
    }; // prototype

    return new OpenForms();
}); // requireJS define