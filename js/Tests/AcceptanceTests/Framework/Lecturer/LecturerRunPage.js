module.exports = {
    create: function (seleniumHelper, optTimeout) {
        return new LecturerRunPage(seleniumHelper, optTimeout);
    }
};

function LecturerRunPage(seleniumHelper, optTimeout) {
    this.sh = seleniumHelper;
    this.helper = require('../Helper').create(this.sh);
    this.consts = require('../../Utilities/Constants').create();
    this.timeout = optTimeout || 5000;
}

LecturerRunPage.prototype = {
    constructor: LecturerRunPage,

    launchWebsite: function () {
        console.log("Lecturer launches website.");
        return this.sh.get(this.consts.websiteLecturerRun).then(function(){
            console.log("Lecturer launched website.");
        });
    },

    connectToStudents: function () {
        console.log("Lecturer is about to click on connect button.");
        return this.sh.clickById("connectButton").then(function(){
            console.log("Lecturer clicked on connect button.");
        });
    },

    waitTillNStudentsConnected: function (numStudents) {
        return this.__waitForNumberToAppearAtCss(numStudents, "#numPeers")
    },

    setNotificationTypeToVisual: function () {
        this.sh.clickById("buttonNotification");
        return this.sh.clickById("dropdown-menu-visualNotification");
    },

    setStudentThresholdPercent: function (number) {
        this.sh.clickByCss("#selAbsPercent > option[value='Percent']");
        return this.__setStudentThresoldField(number);
    },

    setStudentThresholdAbsolute: function (number) {
        this.sh.clickByCss("#selAbsPercent > option[value='Absolute']");
        return this.__setStudentThresoldField(number);
    },

    __setStudentThresoldField: function (number) {
        var inputField = this.sh.findElementById("fieldThreshold");
        return this.sh.sendKeysJavascript(inputField, number);
    },

    getAllDataAsync: function () {
        this.helper.preRequireJsScript("FieldsLecturerRun");
        return this.sh.executeAsyncScript(getAllData);

        function getAllData() {
            var callback = arguments[arguments.length - 1];
            var fields = require("FieldsLecturerRun");
            try {
                var test = fields.getFieldsAsync();
                callback(test);
            }
                // if forgot to set lecture name
            catch (e) {
                alert(e.message);
            }
        }
    },

    createAllQuestionTypes: function (openQuestionName, ratingQuestionName, mcQuestionName) {
        var modalPage = require('./ModalBasePage').create(this.sh);
        require('./OpenQuestionPage').createQuestion(this.sh, modalPage).createQuestion(openQuestionName);
        require('./RatingQuestionPage').createQuestion(this.sh, modalPage).createQuestion(ratingQuestionName);
        require('./McQuestionPage').createMCQuestion(this.sh, modalPage).createQuestion(mcQuestionName);
    },

    sendNthQuestionToStudent: function (num) {
        return this.sh.clickByCss(".webix_dtable div[column='4'] > .webix_cell:nth-of-type(" + num + ") button");
    },

    sendComment: function (text) {
        return this.helper.sendComment(this.sh, text);
    },

    sendFileFromTestdataDirToStudents: function (jsonFilename) {
        var path = require("path");
        var absFilePath = path.join(this.consts.testDataFolder, jsonFilename);
        this.sh.clickByCss(".commenting-field.main .textarea");
        var uploadButton = this.sh.findElementByCss(".enabled.upload input");
        return this.sh.sendKeysToNotVisible(uploadButton, absFilePath);
    },

    getNumUpvotesAsync: function (commentId, num) {
        var upvoteCss = "li[data-id='" + commentId + "'] .upvote-count";
        this.__waitForNumberToAppearAtCss(num, upvoteCss);
        return this.sh.getTextByCssAsync(upvoteCss).then(function (text) {
            return +text;
        });
    },

    isNotificationAlertActiveAsync: function (timeout) {
        console.log("Lecturer checks if isNotificationAlertActiveAsync()");
        var that = this;
        timeout = timeout || this.timeout;
        this.helper.preRequireJsScript('notification');

        return this.sh.wait(function () {
            return that.sh.executeScript(function () {
                var wasActive = require('notification').activeNotificationId;
                console.log(wasActive);
                return wasActive !== null;
            })
        }, timeout * 10);
    },

    __waitForNumberToAppearAtCss: function (number, css) {
        var that = this;
        // call executeScript() directly on driver to prevent 'JavascriptError: too much recursion'
        return that.sh.wait(that.sh.sel.driver.executeScript(function () {
            var css = arguments[0];
            var num = arguments[1];
            console.log(css, num);
            var foundNumber = +$(css).text();
            console.log(css, num);
            return foundNumber === num;
        }, css, number), that.timeout);
    },

    closeDriver: function () {
        return this.sh.quit();
    },

    getNewestCommentIdAsync: function () {
        return this.sh.executeScript(function () {
            var commentsLecturer = require('commentsLecturer');
            return commentsLecturer.getNewestCommentId();
        });
    }
}; // prototype