define(['jquery', 'questionManager', 'mcTable'], function($, qMgr, mcTable){
	
function testsLecturerHelper() {

	if ( typeof this.createMcOptions != "function") {

		testsLecturerHelper.prototype.createMcOptions = function(num) {

			var mcQuestionOptions = [];
            var correctAnswer = Math.floor((Math.random() * num));

            for (var i = 0; i < num; ++i) {

				var answer = "Answer" + (i + 1 );
				var correct = (i === correctAnswer);
				mcQuestionOptions.push(new qMgr.__createAnswerOption(answer, correct));
			}

			return mcQuestionOptions;

		};
		
		testsLecturerHelper.prototype.createMcQuestions = function(num, options) {
			
			var mcQuestions = [];
			
			for (var i = 0; i < num; ++i) {
				
				mcQuestions.push(new qMgr.mcQuestion("question", options) );
			}
			
			return mcQuestions;

		};
		

		testsLecturerHelper.prototype.createScaleQuestion = function(num) {

			var scaleQuestions = [];
			for (var i = 0; i < num; ++i) {

				var question = "scaleQuestion#" + (i + 1), answer = "scaleAnswer#" + (i + 1), scaleStart = (i + 1), scaleEnd = ((i + 1) * 10 ), scaleStep = (i + 1);
				scaleQuestions.push(new qMgr.scaleQuestion(question, answer, scaleStart, scaleEnd, scaleStep));

			}

			return scaleQuestions;

		};

		testsLecturerHelper.prototype.createMCQuestion = function(num) {

			var openQuestions = [];
			for (var i = 0; i < num; ++i) {

				var question = "openQuestion#" + (i + 1), answer = "openAnswer#" + (i + 1);
				openQuestions.push(new qMgr.openQuestion(question, answer));

			}

			return openQuestions;

		};

        testsLecturerHelper.prototype.addOptionsToMcTable = function(num) {

            for (var i = 0; i < num; ++i) {

                var optionText = "AnswerOption#" + i;
                $("#inputMcQuestion").val(optionText);
                mcTable.addOption();
            } // for

        }
	}

}

	return new testsLecturerHelper();
}); // requireJs define