/**
 * Created by Pascal on 23.08.2015.
 */

module.exports = {
    create: function () {
        return new Constants();
    }
};

function Constants() {
    var settings = require("../../../../settings");
    this.testDataFolder = require("path").resolve("../../TestData");
    this.Timeout30Secs = 30000;
    this.Timeout2Min = 120000;

    this.baseURL = settings.createHttpAddress();
    this.websiteLecturerRun = this.baseURL + "lecturerRun.html";
    this.websiteStudents = this.baseURL + "students.html";

    this.divRadioQScale = "qScale";
    this.divRadioQMC = "qMc";
    this.divRadioQOpen = "qOpen";

}