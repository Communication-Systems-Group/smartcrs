/**
 * Created by Pascal on 13.02.2016.
 */

define(['jquery', 'settingsLoader', 'localStorage'], function ($, settingsLoader, localStorage) {

    function StudentNickname() {
        this.nickname = null;
        this.uuid = "";
        this.minLength = 1;
    }

    StudentNickname.prototype = {
        constructor: StudentNickname,

        nicknameAccepted: function (nickname) {
            this.__setNickname(nickname);
            $("#connectionEvents").trigger('connectionEvent', true);
        },

        nicknameDeclined: function () {
            $("#connectionEvents").trigger('connectionEvent', settingsLoader.getErrNicknameInUse());
        },

        getNickname: function() {
            return this.nickname;
        },
        
        __setNickname: function (nickname) {
            this.nickname = nickname;
        },

        hasMinLength: function(nick) {
            return nick.length >= this.minLength;
        },

        isValidNickname: function(nick) {
            var lecturerNick = settingsLoader.getLecturerName();
            if (lecturerNick.length > nick.length) {
                return lecturerNick.indexOf(nick) === -1;
            } else {
                return nick.indexOf(lecturerNick) === -1;
            }
        },

        prepareNicknameRequest: function(nickname) {
            var lastConnectionJSON = localStorage.getLastConnectionJSON();
            if (!lastConnectionJSON) {
                this.uuid = this.__createUUID();
            } else {
                var lastConnection = JSON.parse(lastConnectionJSON);
                this.uuid = lastConnection.uuid;
            }
            if (!this.uuid) {
                console.error("uuid is empty!");
            }
            return {nickname: nickname, uuid: this.uuid};
        },
        
        __createUUID: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        }
    };

    return new StudentNickname();

}); // requireJS define