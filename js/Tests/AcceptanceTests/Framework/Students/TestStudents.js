/**
 * Created by Pascal on 03.01.2015.
 */

module.exports = {
    create: function (optTimeout) {
        return new TestStudents(optTimeout);
    }
};

function TestStudents(optTimeout) {
    this.studentClass = require('./TestStudent');
    this.students = [];
    this.timeout = optTimeout || 5000;
}

TestStudents.prototype = {
    constructor: TestStudents,

    spawnNStudents: function (numStuds, nicknameBase) {
        var that = this;

        for (var i = 0; i < numStuds; ++i) {
            this.students.push(that.studentClass.createStudent(this.timeout));
            this.students[i].launchWebsiteAndLoginWithNickname(nicknameBase + i);
        }
    },

    studentAtIndexAsksAsync: function (studIndex, msgObj) {
        return this.students[studIndex].ask(msgObj.questionText)
    },

    // author student needs to be excluded because he receives a modified version of his comment from lecturer.
    // selenium crashes if the comment changes during its operation
    allStudentsUpVoteQuestionExpectStudIndex: function (commentId, index) {
        console.log("allStudentsUpVoteQuestion()", commentId);
        for (var i = 0; i < this.students.length; i++) {
            if (i === index) {
                continue;
            }
            this.students[i].upVote(commentId);
        }
    },

    closeDrivers: function(){
        this.students.forEach(function (student){
            student.closeDriver();
        });
    }
};



