/**
 * Created by Pascal on 13.08.2015.
 */


describe("lecturer edits all 3 question types", function () {
    var consts = require('../Utilities/Constants').create();

    beforeEach(function () {
        var selenium = require('../Utilities/SeleniumFactory').create();
        this.sh = require("../Utilities/SeleniumHelper").create(selenium);
        this.lecturerPage = require("../Framework/Lecturer/LecturerRunPage").create(this.sh);
        this.testData = require('../Utilities/TestData').create(this.sh);
        this.asserter = require('../Utilities/Asserter').create(this.lecturerPage, this.sh, this.testData);
    });

    it("should edit all question types", function (done) {
        var that = this;

        that.lecturerPage.launchWebsite();
        editAllQuestionTypes(that.sh);

        that.asserter.equalsWebsiteDataAsync("EditAllQuestions.json").then(function () {
            that.sh.quit();
            done();
        });

        function editAllQuestionTypes(seleniumHelper) {
            var modalPage = require('../Framework/Lecturer/ModalBasePage').create(seleniumHelper);
            var mcPage = require('../Framework/Lecturer/McQuestionPage').createMCQuestion(seleniumHelper, modalPage);
            var editMc = require('../Framework/Lecturer/EditMcQuestion').create(mcPage, modalPage, that.sh);
            var openPage = require('../Framework/Lecturer/OpenQuestionPage').createQuestion(seleniumHelper, modalPage);
            var editOpen = require('../Framework/Lecturer/EditOpenQuestion').create(openPage, modalPage, that.sh);
            var ratingPage = require('../Framework/Lecturer/RatingQuestionPage').createQuestion(seleniumHelper, modalPage);
            var editRating = require('../Framework/Lecturer/EditRatingQuestion').create(ratingPage, modalPage, that.sh);

            mcPage.createQuestion("MC Question #1");
            openPage.createQuestion("Open Question #1");
            ratingPage.createQuestion("Rating Question #1");

            editMc.changeQuestion("MC Question #1", "Edited MC Question #1")
                .changeOptionsNameAndNumber("newOption", 3)
                .changeToTrue(1, 3)
                .startAsync();

            editOpen.changeQuestion("Open Question #1", "Edited Open Question #1")
                .changeAnswer("Edited Open Answer #1")
                .startAsync();

            editRating.changeQuestion("Rating Question #1", "Edited Rating Question #1")
                .changeScalePoints(10, 100, 15)
                .startAsync();
        }
    }, consts.Timeout30Secs);

});