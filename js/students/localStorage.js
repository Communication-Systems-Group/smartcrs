/**
 * Created by Pascal on 16.04.2016.
 */

define([], function () {

    function LocalStorage() {
        this.keyLastConnection = "lastConnection";
        this.keyAnsweredQuestions = "answeredQuestions";

    } // EOF class

    LocalStorage.prototype = {
        constructor: LocalStorage,

        // from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
        isLocalStorageSupported: function () {
            try {
                var storage = window["localStorage"],
                    x = '__storage_test__';
                storage.setItem(x, x);
                storage.removeItem(x);
                return true;
            }
            catch (e) {
                return false;
            }
        },

        hasQuestionAlreadyBeenAnswered: function(questionText) {
            var questions = this.__getStoredQuestions();
            return questionText in questions;
        },
        
        
        storeAnsweredQuestion: function (question) {
            var questions = this.__getStoredQuestions();
            questions[question.question] = question;
            this.__storeAnsweredQuestions(questions);
        },
        
        __getStoredQuestions: function () {
            var data = this.__getAnsweredQuestionsJSON();
            if (!data) {
                return {};
            } else {
                return JSON.parse(data);
            }
        },
        
        resetAnsweredQuestions: function() {
          this.__storeAnsweredQuestions({});
        },
        
        __getAnsweredQuestionsJSON: function() {
            return localStorage.getItem(this.keyAnsweredQuestions);
        },

        __storeAnsweredQuestions: function (keys) {
            var data = JSON.stringify(keys);
            localStorage.setItem(this.keyAnsweredQuestions, data);
        },


        storeLastConnection: function (nickname, roomName, roomPwd, uuid) {
            var date = new Date().toString();
            var data = this.__createLastConnectionData(nickname, roomName, roomPwd, uuid, date);
            localStorage.setItem(this.keyLastConnection, data);
        },
        
        getLastConnectionJSON: function() {
            return localStorage.getItem(this.keyLastConnection);
        },

        __createLastConnectionData: function (nickname, roomName, roomPwd, uuid, date) {
            return JSON.stringify({"nickname": nickname, "roomName": roomName, "roomPwd": roomPwd, "uuid": uuid, "date": date});
        }

    }; // prototype
    
    return new LocalStorage();
}); // requireJS define