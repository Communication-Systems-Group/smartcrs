define(['jquery', 'RatingForms', 'questionTypes'], function ($, RatingForms, questionTypes) {

    function RatingQuestion() {
        this.type = questionTypes.rating;
        this.forms = RatingForms;
    }

    RatingQuestion.prototype = {
        constructor: RatingQuestion,

        createRatingQuestion: function (question, solution, scaleStart, scaleEnd, scaleStep) {
            return {
                type: this.type,
                question: question,
                solution: solution,
                scaleStart: scaleStart,
                scaleEnd: scaleEnd,
                scaleStep: scaleStep,
                constructor: RatingQuestion
            };
        },

        createFromForms: function () {
            var fields = this.forms.collectFields();
            return this.createRatingQuestion(fields.question, fields.solution, fields.sliderStart, fields.sliderEnd, fields.sliderStep);
        },

        createQuestionFromTableRow: function(obj) {
            return this.createRatingQuestion(obj.question, obj.solution, obj.scaleStart, obj.scaleEnd, obj.scaleStep);
        },

        computeScalePoints: function (scaleStart, scaleEnd, scaleStep) {
            var returnArray = [];
            for (var i = scaleStart; i <= scaleEnd; i += scaleStep) {
                returnArray.push(i);
            }

            // Makes sure that the limits are shown, e.g. scale 1-10, stepSize 2.
            if (jQuery.inArray(scaleEnd, returnArray) === -1) {
                returnArray.push(scaleEnd);
            }

            return returnArray;
        },

        displayTooltipInfo: function(ratingQ) {
            var resultString = "<h4><u>" + ratingQ.question + "</h4></u>";
            resultString += ratingQ.solution;
            return resultString;
        }
    }; // prototype

    return new RatingQuestion();
}); // requireJS define