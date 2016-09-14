/**
 * Created by Pascal on 23.08.2015.
 */


var consts = require('../Utilities/Constants').create();

describe("LecturerRun: Basic ask & answer tests", function () {
    beforeEach(function () {
        var selenium = require('../Utilities/SeleniumFactory').create();
        this.sh = require("../Utilities/SeleniumHelper").create(selenium);
        this.testData = require('../Utilities/TestData').create(this.sh);
        this.lecturerPage = require('../Framework/Lecturer/LecturerRunPage').create(this.sh);
        this.student = require('./../Framework/Students/TestStudent').createStudent();
        this.helper = require('../Framework/Helper').create(this.sh);
    });

    it("Load existing lecture file, send 3 question types & 1 file then assert student answer", function (done) {
        var that = this;

        that.lecturerPage.launchWebsite();
        that.lecturerPage.connectToStudents();
        that.student.launchWebsiteAndLoginWithNickname("Chrome1");
        that.testData.loadLecture("ThreeQTypes_1File_Thresh25_Sound_Percent.json");
        // that.lecturerRun.waitTillNStudentsConnected(1);  // commented out until async launching is implemented

        var mcAnswerNo = 2;
        var ratingAnswer = 5.00;
        var openAnswer = "This is a test";
        var chatMessage = "Chat message";

        that.lecturerPage.sendNthQuestionToStudent(1); // send MC question
        that.student.answerMcQuestion(mcAnswerNo);

        that.lecturerPage.sendNthQuestionToStudent(2); // send Rating question
        that.student.answerRatingQuestion(ratingAnswer);

        that.lecturerPage.sendNthQuestionToStudent(3); // send Open question
        that.student.answerOpenQuestion(openAnswer);

        var filename = "EditAllQuestions.json";
        that.lecturerPage.sendFileFromTestdataDirToStudents(filename);
        var fileCommentId = "c1";
        var chatCommentId = "c2";
        that.lecturerPage.sendComment(chatMessage);
        // var fileUrl = that.helper.getFileURLOfCommentId(fileCommentId); // not working yet
        that.student.hasFileWithURLAndAuthorAsync(fileCommentId, filename, "Lecturer").then(function (hasFile) {
            expect(hasFile).toBe(true);
            that.student.hasChatMessageAsync(chatCommentId, chatMessage).then(function (hasMessage) {
                expect(hasMessage).toBe(true);
                that.student.closeDriver();
                assertStudAnswers();
            });
        });

        function assertStudAnswers() {
            that.sh.executeScript(function () {
                return require('stats').data;
            }).then(function (statsData) {
                that.sh.quit();

                const openQuestionId = "1. What did you like about this car?\n2. Can it get any better?";
                const mcQuestionId = "WebRTC...";
                const ratingQuestionId = "Please rate this performance:\n1 = Very poor, 10 = Excellent";

                expect(statsData[mcQuestionId].studentAnswers[mcAnswerNo].numVotes).toBe(1);
                expect(statsData[ratingQuestionId].studentAnswers["0"].numVotes).toBe(1);
                expect(statsData[ratingQuestionId].studentAnswers["0"].answerID).toBe(ratingAnswer);
                expect(statsData[openQuestionId].studentAnswers["0"].answerID).toBe(openAnswer);
                expect(statsData[openQuestionId].studentAnswers["0"].numVotes).toBe(1);
                done();
            });
        }

    }, consts.Timeout2Min);

});