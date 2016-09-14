/**
 * Created by Pascal on 10.05.2016.
 */

define(['jquery'], function ($) {

    function FormsValidation() {

    } // EOF class


    FormsValidation.prototype = {
        constructor: FormsValidation,
        
        validateQuestion: function () {
            var questionFormGroup = "#sharedQuestionTextareaTemplate";
            var val = $(questionFormGroup).find("textarea").val();
            var errorTextField = "#validationBlockQuestion";
            var isNotEmpty = !this.__isEmptyOrUndefined(val);
            this.showErrorIfFalse(isNotEmpty, questionFormGroup, errorTextField, "Please enter a question.");
            return isNotEmpty;
        },

        // FIXME: misleading name: it also hides errorMsg if true
        showErrorIfFalse: function(boolExpr, formGroup, errorSpan, errorMsg) {
            if (boolExpr) {
                this.__hideFormerError($(formGroup), $(errorSpan));
            } else {
                this.__showError($(formGroup), $(errorSpan), errorMsg);
            }
        },

        __isEmptyOrUndefined: function(val) {
            return ($.trim(val) === '') || val === undefined;
        },

        __showError: function($formGroup, $errorHelpBlock, errorMsg) {
            $formGroup.closest(".form-group").addClass("has-error");
            $errorHelpBlock.text(errorMsg);
            $errorHelpBlock.show();
        },

        __hideFormerError: function($formGroup, $errorHelpBlock) {
            $formGroup.closest(".form-group").removeClass("has-error");
            $errorHelpBlock.hide();
        }
    }; // prototype

    return new FormsValidation();
}); // requireJS define