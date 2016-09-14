/**
 * Created by Pascal on 27.01.2016.
 */
({
    define: typeof define === "function"
        ? define
        : function (A, F) {
        module.exports = F.apply(null, A.map(require))
    }
}).define([], function () {

        function SettingsLoader() {
            this.settings = {
                "httpServerIP": "nodejs2.csg.uzh.ch",
                "httpServerPort": "8080",
                "httpServerProtocol": "http",
                "lecturerName": "Lecturer",
                "roomName": "myRoom",
                "notificationSound": "http://nodejs2.csg.uzh.ch/sound.mp3",
                "lecturerId": "123456789",
                "errWrongRoomPassword": "Password for room is not correct",
                "errWrongAdminPassword": "Admin password for room is not correct",
                "errNoLecturerInRoom": "No lecturer in room",
                "errNicknameInUse": "Nickname is already reserved",
                "lecturerHTML": "lecturerRun.html",
                "studentsHTML": "students.html"
            };
        } // EOF class

        SettingsLoader.prototype = {
            constructor: SettingsLoader,

            getHttpServerProtocol: function () {
                return this.settings.httpServerProtocol;
            },

            getHttpServerPort: function() {
                return this.settings.httpServerPort;
            },

            getHttpServerIP: function() {
                return this.settings.httpServerIP;
            },

            getLecturerId: function () {
                return this.settings.lecturerId;
            },

            getNotificationSoundURL: function() {
                return this.settings.notificationSound;
            },
            
            getLecturerName: function(){
                return this.settings.lecturerName;
            },

            getRoomName: function () {
                return this.settings.roomName;
            },

            getErrWrongRoomPassword: function() {
                return this.settings.errWrongRoomPassword;
            },

            getErrWrongAdminPassword: function() {
                return this.settings.errWrongAdminPassword;
            },

            getErrNoLecturerInRoom: function() {
                return this.settings.errNoLecturerInRoom;
            },

            getErrNicknameInUse: function() {
                return this.settings.errNicknameInUse;
            },

            getLecturerPage: function() {
                return this.settings.lecturerHTML;
            },

            getStudentsPage: function() {
                return this.settings.studentsHTML;
            },

            createWebsocketAddress: function () {
                var ip = this.getHttpServerIP();
                var port = this.getHttpServerPort();
                return ip + ":" + port + "/";
            },

            createHttpAddress: function () {
                var protocol = this.getHttpServerProtocol();
                var ip = this.getHttpServerIP();
                var port = this.getHttpServerPort();
                return protocol + "://" + ip + ":" + port + "/";
            },

            createLecturerRunHttpAddress: function () {
                var url = this.createHttpAddress();
                return url + this.getLecturerPage();
            },

            createStudentsHttpAddress: function () {
                var url = this.createHttpAddress();
                return url + this.getStudentsPage();
            }
        }; // prototype

        return new SettingsLoader();
    }
);