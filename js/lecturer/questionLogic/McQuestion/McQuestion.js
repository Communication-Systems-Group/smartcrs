define(['jquery', 'McForms', 'questionTypes'], function ($, McForms, questionTypes) {

    function McQuestion() {
        this.type = questionTypes.mc;
        this.forms = McForms;
    } // EOF class


    McQuestion.prototype = {
        constructor: McQuestion,

        /**
         *
         * @returns {{type: String, question: String, solution: String, possibleAnswers: Array.<{answer, correct}>, constructor: McQuestion}}
         */
        createFromForms: function () {
            var form = this.forms.createFromForms();
            return this.createMcQuestion(form.questionText, form.answerOptions);
        },

        /**
         *
         * @param question {String}
         * @param possibleAnswers Array<>
         * @returns {{type: (String), question: (String), solution: (String), possibleAnswers: Array<{answer, correct}>, constructor: McQuestion}}
         * @private
         */
        createMcQuestion: function (question, possibleAnswers) {
            var solutionArray = this.__findSolutions(possibleAnswers);

            return {
                type: this.type,
                question: question,
                solution: solutionArray,
                possibleAnswers: possibleAnswers,
                constructor: McQuestion
            }
        },

        createQuestionFromTableRow: function(obj) {
            return this.createMcQuestion(obj.question, obj.possibleAnswers);
        },

        /**
         *
         * @param answerOptionsArray Array<{answer, correct}>
         * @returns Array<String>
         * @private
         */
        __findSolutions: function (answerOptionsArray) {
            var solutions = [];
            answerOptionsArray.forEach(function (option) {
                if (option.correct) {
                    solutions.push(option.answer);
                }
            });

            return solutions;
        },

        displayTooltipInfo: function (mc) {
            var resultString = "<h4><u>" + mc.question + "</h4></u>";
            resultString += "<ol>";
            for (var i = 0; i < mc.possibleAnswers.length; ++i) {
                resultString += "<li>" + mc.possibleAnswers[i].answer + "</li>";
            }
            resultString += "</ol>";
            return resultString;
        }

    }; // prototype

    return new McQuestion();
}); // requireJS define