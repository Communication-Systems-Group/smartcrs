/**
 * Created by Pascal on 03.01.2015.
 */

var consts = require('../Utilities/Constants').create();

describe("should test all student-side functionality", function () {
    beforeEach(function () {
        var selenium = require('../Utilities/SeleniumFactory').create();
        this.sh = require("../Utilities/SeleniumHelper").create(selenium);
        this.lecturerPage = require('../Framework/Lecturer/LecturerRunPage').create(this.sh);
        this.students = require('./../Framework/Students/TestStudents').create();
    });

    it("should show that the number of student votes is correctly captured", function (done) {
        var that = this;
        var studQuestion = {subjectText: "Student Question #1", nickname: "My Nick", questionText: "My Question"};
        var numStudents = 2;

        that.lecturerPage.launchWebsite();
        that.lecturerPage.connectToStudents();
        that.students.spawnNStudents(numStudents, "chromeNick");
        var commentId = "c1";
        that.students.studentAtIndexAsksAsync(0, studQuestion).then(function () {
            that.students.allStudentsUpVoteQuestionExpectStudIndex(commentId, 0);
            that.students.closeDrivers();
            var numVotes = numStudents - 1;

            that.lecturerPage.getNumUpvotesAsync(commentId, numVotes).then(function (num) {
                expect(num).toBe(numVotes);
                that.lecturerPage.closeDriver();
                done();
            });

        });
    }, consts.Timeout2Min);

    it("Lecturer audio notification should play sound and stop playing when focusing on browser window", function (done) {
        var that = this;
        var studQuestion = {subjectText: "Student Question #1", nickname: "My Nick", questionText: "My Question"};
        var numStudents = 2;

        that.sh.get(consts.websiteLecturerRun);
        that.lecturerPage.setNotificationTypeToVisual();
        that.lecturerPage.connectToStudents();
        that.students.spawnNStudents(numStudents, "chromeNick");
        that.students.studentAtIndexAsksAsync(0, studQuestion).then(function () {
            var commentId = "c1";
            that.students.allStudentsUpVoteQuestionExpectStudIndex(commentId, 0);
            that.lecturerPage.isNotificationAlertActiveAsync().then(function (isAlertActive) {
                expect(isAlertActive).toBe(true);
                that.students.closeDrivers();
                that.lecturerPage.closeDriver();
                done();

            });
        });
    }, consts.Timeout2Min);
});