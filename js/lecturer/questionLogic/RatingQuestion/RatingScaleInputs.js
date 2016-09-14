/**
 * Created by Pascal on 17.05.2016.
 */

define(['jquery'], function ($) {

    function RatingScaleInputs() {

    } // EOF class

    RatingScaleInputs.prototype = {
        constructor: RatingScaleInputs,

        __getFieldTags: function () {
            return {
                sliderStart: "#inputSliderStart",
                sliderEnd: "#inputSliderEnd",
                sliderStep: "#inputSliderStep",
                question: $("#sharedQuestionTextareaTemplate").find("textarea"),
                solution: "#inputScaleSolution"
            };
        },

        collectFields: function () {
            var fields = this.__getFieldTags();

            var sliderStart = parseFloat($(fields.sliderStart).val()) || 1;
            var sliderEnd = parseFloat($(fields.sliderEnd).val()) || 1;
            var sliderStep = parseFloat($(fields.sliderStep).val()) || 1;

            var question = $(fields.question).val();
            var solution = parseFloat($(fields.solution).val()) || "";

            return {
                sliderStart: sliderStart,
                sliderEnd: sliderEnd,
                sliderStep: sliderStep,
                question: question,
                solution: solution
            };
        },
        
        setFields: function(newFields) {
            var fields = this.__getFieldTags();

            $(fields.question).val(newFields.question);
            $(fields.sliderStart).val(parseFloat(newFields.scaleStart));
            $(fields.sliderEnd).val(parseFloat(newFields.scaleEnd));
            $(fields.sliderStep).val(parseFloat(newFields.scaleStep));

            if (newFields.solution === "") {
                $(fields.solution).val("");
            } else {
                $(fields.solution).val(parseFloat(newFields.solution));
            }
        }
    }; // prototype

    return new RatingScaleInputs();
}); // requireJS define