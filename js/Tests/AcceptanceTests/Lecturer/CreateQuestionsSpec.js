/**
 * Created by Pascal on 13.08.2015.
 */

describe("lecturer creates a new lecture with all questions types.", function () {
    var consts = require('../Utilities/Constants').create();

    beforeEach(function () {
        var selenium = require('../Utilities/SeleniumFactory').create();
        this.sh = require("../Utilities/SeleniumHelper").create(selenium);
        this.lecturerPage = require("../Framework/Lecturer/LecturerRunPage").create(this.sh);
        this.testData = require('../Utilities/TestData').create(this.sh);
        this.asserter = require('../Utilities/Asserter').create(this.lecturerPage, this.sh, this.testData);
    });

    it("should create all 3 question types", function (done) {
        var that = this;

        that.lecturerPage.launchWebsite();
        that.lecturerPage.createAllQuestionTypes("Open Question #1", "Rating Question #1", "MC Question #1");
        this.asserter.equalsWebsiteDataAsync("ThreeQ_NoFile_Thres0_Sound_Percent.json").then(function(){
            that.sh.quit();
            done();
        });

    }, consts.Timeout30Secs);

    it("should store changes to threshold & notification fields", function (done) {
        var that = this;

        that.lecturerPage.launchWebsite();
        this.lecturerPage.setStudentThresholdAbsolute(31);
        this.lecturerPage.setNotificationTypeToVisual();
        this.asserter.equalsWebsiteDataAsync("Threshold31AbsoluteVisualNotification.json").then(function(){
            that.sh.quit();
            done();
        });
    }, consts.Timeout30Secs);

    it("should load a lecture", function (done) {
        var that = this;
        var filename = "LoadLectureFile.json";

        that.lecturerPage.launchWebsite();
        this.testData.loadLecture(filename);
        this.asserter.equalsWebsiteDataAsync(filename).then(function(){
            that.sh.quit();
            done();
        });

    }, consts.Timeout30Secs);

});