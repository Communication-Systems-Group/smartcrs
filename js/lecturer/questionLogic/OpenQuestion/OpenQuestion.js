define(['jquery', 'OpenForms', 'questionTypes'], function ($, OpenForms, questionTypes) {

    function OpenQuestion() {
        this.type = questionTypes.open;
        this.forms = OpenForms;
    } // EOF class


    OpenQuestion.prototype = {
        constructor: OpenQuestion,

        createOpenQuestion: function (question, solution) {
            return {
                type: this.type,
                question: question,
                solution: solution,
                constructor: OpenQuestion
            }
        },

        createFromForms: function () {
            var fields = this.forms.getFieldValues();
            return this.createOpenQuestion(fields.question, fields.solution);
        },

        createQuestionFromTableRow: function(obj) {
            return this.createOpenQuestion(obj.question, obj.solution);
        },

        displayTooltipInfo: function(openQ) {
            var resultString = "<h4><u>" + openQ.question + "</h4></u>";
            resultString += openQ.solution;
            return resultString;
        }

    }; // prototype

    return new OpenQuestion();
}); // requireJS define