/**
 * Created by Pascal on 23.08.2015.
 */
module.exports = {
    createStudent: function (optTimeout) {
        return new TestStudent(optTimeout);
    }
};


function TestStudent(optTimeout) {
    var selenium = require('../../Utilities/SeleniumFactory').create(/*{createNewFlow: true}*/);
    this.sh = require("../../Utilities/SeleniumHelper").create(selenium);
    this.consts = require('../../Utilities/Constants').create();
    this.helper = require('../Helper').create(this.sh);

    this.timeout = optTimeout || 50000000;
}

TestStudent.prototype = {
    constructor: TestStudent,

    launchWebsiteAndLoginWithNickname: function (nickname) {
        this.launchWebsite().then(function(){
            console.log("Student launched website.");
        });
        this.__loginWithNicknameAndWaitTillOk(nickname).then(function(){
            console.log("Student logged in & waited for ok.");
        });
        return this.waitTillConnectedWithLecturer().then(function(){
            console.log("Student is connected with lecturer.");
        });
    },

    __loginWithNicknameAndWaitTillOk: function(nickname){
        var nickInput = this.sh.findElementById("studentsNicknameInput", this.timeout);
        this.sh.sendKeysJavascript(nickInput, nickname, this.timeout);
        return this.sh.clickById("nicknameSubmitButton", this.timeout);
    },

    launchWebsite: function(){
        return this.sh.get(this.consts.websiteStudents);
    },

    waitTillConnectedWithLecturer: function() {
        return this.sh.findElementByCss("#connectionStatusIcon[class='connected']", this.timeout);
    },

    answerRatingQuestion: function (answerValue) {
        var that = this;
        that.sh.findElementByCss(".webix_window[view_id^='$window'] #sliderDiv", this.timeout);
        var ratingTester = require('../Lecturer/RatingQuestionPage').createQuestion(that.sh);
        that.sh.wait(ratingTester.setSliderToAsync(5.00), this.timeout);
        return that.__sendAnswer();
    },

    answerOpenQuestion: function (answerText) {
        var textArea = this.sh.findElementByCss(".webix_window[view_id^='$window'] .webix_inp_textarea", this.timeout);
        this.sh.sendKeysJavascript(textArea, answerText);
        return this.__sendAnswer();
    },

    answerMcQuestion: function (correctAnswerOptionZerobased) {
        var that = this;
        var promise = that.sh.findElementsByCss(".webix_window[view_id^='$window'] .webix_list_item", this.timeout).then(function (answerOptions) {
            that.sh.click(answerOptions[correctAnswerOptionZerobased]);
            return that.__sendAnswer();
        });
        return that.sh.wait(promise, that.timeout);
    },

    ask: function(questionText) {
        return require('../Helper').create().sendComment(this.sh, questionText).then(function(){
            console.log("Student asks question:", questionText);
        });
    },

    upVote: function(commentId) {
        var cssId = "li[data-id='" + commentId + "']";
        return this.sh.clickByCss(cssId +  " .upvote");
    },

    hasFileWithURLAndAuthorAsync: function (commentId, filename, senderName, optTimeout) {
        optTimeout = optTimeout || this.timeout;
        var that = this;
        // var studFileUrl = that.helper.getFileURLOfCommentId(commentId); // not working yet
        var cssId = "li[data-id='" + commentId + "']";
        return that.sh.getTextByCssAsync(cssId + " .content > .attachment", optTimeout).then(function(fname){
            return that.sh.getTextByCssAsync(cssId + " .comment-wrapper > .name", optTimeout).then(function(name){
                var sameFilename = fname === filename;
                var sameAuthor = name === senderName;
                return (sameFilename && sameAuthor);
            });
        });
                
    },

    hasChatMessageAsync: function(commentId, msg) {
        var that = this;
        var cssId = "li[data-id='" + commentId + "']";
        var senderNameObj = that.sh.findElementByCss(cssId + " .comment-wrapper > .name");
        var chatMsgObj = that.sh.findElementByCss(cssId + " .comment-wrapper > .wrapper > .content");
        return that.sh.getTextAsync(senderNameObj).then(function(senderName){
            return that.sh.getTextAsync(chatMsgObj).then(function(chatMsg){
                var sameChatMsgs = chatMsg === msg;
                var sameSenderName = senderName === "Lecturer";
                return sameChatMsgs && sameSenderName;
            })
        });
    },

    closeDriver: function () {
        return this.sh.quit();
    },

    __sendAnswer: function () {
        this.sh.clickByCss("button .glyphicon-ok");
        return this.__waitTillPopupStaled();
    },

    __waitTillPopupStaled: function () {
        var successPopup = this.sh.findElementByCss(".webix_popup[view_id^='$popup'");
        return this.sh.waitUntilStale(successPopup, this.timeout);
    }
};



