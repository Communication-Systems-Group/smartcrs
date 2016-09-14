/**
 * Created by Pascal on 08.05.2016.
 */

define(['jquery', 'FormsValidation', 'RatingScaleInputs'], function ($, FormsValidation, ratingInputs) {

    function RatingFormsValidator() {
        this.solutionFromGroup = "#formGroupScaleSolution";
        this.solutionErrorSpan = "#helpBlockInputScaleSolution";
        this.scalesFormGroup = "#formGroupScales";
        this.scalesErrorSpan = "#helpBlockScales";

        $.extend(RatingFormsValidator.prototype, FormsValidation.__proto__);
    } // EOF class


    RatingFormsValidator.prototype = {
        constructor: RatingFormsValidator,

        validateForms: function () {
            var questionFieldNotEmpty = this.validateQuestion();
            var solutionFieldInBounds = this.__scaleSolution();
            var scaleStartSmallerThanEnd = this.__scaleEndpoints();
            return questionFieldNotEmpty && solutionFieldInBounds && scaleStartSmallerThanEnd;
        },

        __scaleSolution: function() {
            var fields = ratingInputs.collectFields();

            // optional field
            if (this.__isEmptyOrUndefined(fields.solution)){
                return true;
            }

            var boolExpr = fields.solution >= fields.sliderStart && fields.solution <= fields.sliderEnd;
            var errorMsg = fields.solution + " is not in the bounds of the slider settings: " + fields.sliderStart + "-" + fields.sliderEnd;
            this.showErrorIfFalse(boolExpr, this.solutionFromGroup, this.solutionErrorSpan, errorMsg);
            return boolExpr;
        },

        __scaleEndpoints: function () {
            var fields = ratingInputs.collectFields();
            var boolExpr = fields.sliderStart <= fields.sliderEnd;
            var errorMsg = "Not allowed: start > end";
            this.showErrorIfFalse(boolExpr, this.scalesFormGroup, this.scalesErrorSpan, errorMsg);
            return boolExpr;
        }
    }; // prototype
    
    return new RatingFormsValidator();
}); // requireJS define