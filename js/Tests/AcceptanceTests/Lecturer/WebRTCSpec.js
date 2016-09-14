describe("WebRTC functionality testing", function () {
    var consts = require('../Utilities/Constants').create();

    beforeEach(function () {
        var selenium = require('../Utilities/SeleniumFactory').create();
        this.sh = require("../Utilities/SeleniumHelper").create(selenium);
        this.lecturerPage = require("../Framework/Lecturer/LecturerRunPage").create(this.sh);
        this.student = require('./../Framework/Students/TestStudent').createStudent();
        this.testData = require('../Utilities/TestData').create(this.sh);
        this.helper = require('../Framework/Helper').create(this.sh);
    });

    it("This test shows the transfer time for a 1mb file to a single student", function (done) {
        var that = this;
        var filename = "10kb.txt";
        that.lecturerPage.launchWebsite();
        that.lecturerPage.connectToStudents();
        that.student.launchWebsiteAndLoginWithNickname("Chrome1");

        var fileCommentId = "c1";
        that.lecturerPage.sendFileFromTestdataDirToStudents(filename).then(function () {
            console.time('File transfer time');
            // var url = that.helper.getFileURLOfCommentId(fileCommentId); // not working yet
            that.student.hasFileWithURLAndAuthorAsync(fileCommentId, filename, "Lecturer", consts.Timeout30Secs).then(function (hasFile) {
                    console.timeEnd('File transfer time');
                    expect(hasFile).toBe(true);
                    done();
                });
            });

    }, 999999);

});