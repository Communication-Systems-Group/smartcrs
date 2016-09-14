/**
 * Created by Pascal on 27.01.2016.
 */

define(['jquery', 'settingsLoader', 'webRTCFactory', 'webRTCLecturerPeer', 'messageTypes', 'commentsStudentsConstructor', 'webRTCHandlersStudentsConstructor', 'webRTCHandlersCommon', 'studentNickname'], function ($, settings, webRTCFactory, webRTCLecturerPeer, msgTypes, commentsStudents, webRTCHandlersStudents, webRTCHandlersCommon, studentNickname) {

    function WebRTCStudents() {
        var that = this;
        that.joinRoomRetryDelay = 1000;
        that.commentsStudents = new commentsStudents(that);
        that.webRTCHandlersStudents = new webRTCHandlersStudents(this, that.commentsStudents);
        that.webrtc = webRTCFactory.create();  // create our webrtc connection
        webRTCHandlersCommon.setHandlers(that.webrtc, that.webRTCHandlersStudents);
    } // EOF class

    WebRTCStudents.prototype = {
        constructor: WebRTCStudents,

        fetchAvailableRooms: function (cb) {
            this.webrtc.connection.emit('fetchAvailableRooms', function (rooms) {
                cb(rooms);
            });
        },

        connectToRoom: function (roomName, pwd, nickname) {
            var that = this;

            // Already connected. Nickname has been rejected last time
            if (that.__isWebrtcChannelOpen()) {
                var nickRequest = studentNickname.prepareNicknameRequest(nickname);
                this.sendMsg(nickRequest, msgTypes.nicknameRequest);
            } else {
                that.webrtc.joinRoom(roomName, pwd, function () {
                    if (arguments[0] === settings.getErrWrongRoomPassword()) {
                        $("#connectionEvents").trigger('connectionEvent', settings.getErrWrongRoomPassword());
                        return;
                    } else if (arguments[0] === settings.getErrNoLecturerInRoom()) {
                        $("#connectionEvents").trigger('connectionEvent', settings.getErrNoLecturerInRoom());
                        return;
                    }

                    var lecturerPeer = that.webrtc.getPeers(arguments[1].lecturerId)[0];
                    webRTCLecturerPeer.set(lecturerPeer);
                    that.__waitTillChannelReady(roomName, nickname);
                });
            }
        },
        __waitTillChannelReady: function (roomName, nickname) {
            var that = this;
            var intervalId = setInterval(function () {
                if (that.__isWebrtcChannelOpen(roomName)) {
                    clearInterval(intervalId);
                    that.webRTCHandlersStudents.onJoinedRoom(nickname);
                }
            }, that.joinRoomRetryDelay);
        },

        __isWebrtcChannelOpen: function (roomName) {
            const lecturerPeer = webRTCLecturerPeer.get();
            if (lecturerPeer) {
                var dc = lecturerPeer.getDataChannel(roomName);
                return dc.readyState === 'open';
            } else {
                return false;
            }
        },

        sendMsg: function (comment, msgType) {
            try {
                webRTCLecturerPeer.get().sendDirectly(settings.getRoomName(), msgType, comment);
                return true;
            } catch (err) {
                console.log("webRTCStudents.js: Message could not be send to Lecturer.\n" + err);
                return false;
            }
        }
    }; // prototype

    return new WebRTCStudents();
}); // requireJS define