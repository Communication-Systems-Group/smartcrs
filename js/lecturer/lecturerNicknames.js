/**
 * Created by Pascal on 13.02.2016.
 */

define([], function () {

    function LecturerNicknames() {
        this.__nicknames = {};
    } // EOF class

    LecturerNicknames.prototype = {
        constructor: LecturerNicknames,

        /**
         *
         * @param studentPeer {Peer}
         * @param nicknameRequest {{nickname: String, uuid: String}}
         */
        handleNicknameRequest: function (studentPeer, nicknameRequest) {
            var that = this;
            require(['webRTCLecturer', 'messageTypes', 'peerTableMgr', 'roomCredentials'], function (webRTCLecturer, msgTypes, peerTableMgr, roomCredentials) {
                var successful = that.__addNicknameForUUID(nicknameRequest.uuid, nicknameRequest.nickname, studentPeer.id);
                if (successful) {
                    var credentials = roomCredentials.getCredentials();
                    webRTCLecturer.sendMsgToSpecificStudent(studentPeer, {nickname: nicknameRequest.nickname, uuid: nicknameRequest.uuid, roomName: credentials.roomName, roomPwd: credentials.roomPwd, successful: true}, msgTypes.nicknameResponse);
                    peerTableMgr.addNicknameToUserid(studentPeer.id, nicknameRequest.nickname);
                } else {
                    webRTCLecturer.sendMsgToSpecificStudent(studentPeer, {nickname: nicknameRequest.nickname, successful: false}, msgTypes.nicknameResponse);
                }
            });
        },

        __addNicknameForUUID: function (uuid, nickname, studentPeerId) {
            if (this.__alreadyAuthorized(uuid, nickname, studentPeerId)){
                return true;
            }
            if (this.__isNicknameAvailable(uuid, nickname)) {
                this.__nicknames[uuid] = {nickname: nickname, peerid: studentPeerId};
                return true;
            }
            return false;
        },

        __alreadyAuthorized: function(uuid, nick, peerid) {
            if (this.__nicknames[uuid] && this.__nicknames[uuid].nickname === nick) {
                console.log("previous peer with with same nickname is being kicked", this.__nicknames[uuid]);
                this.__kickPreviousPeerWithNickname(this.__nicknames[uuid].peerid);
                this.__nicknames[uuid].peerid = peerid;
                return true;
            }
            return false;
        },

        __isNicknameAvailable: function (uuid, nick) {
            for (var id in this.__nicknames) {
                if (this.__nicknames.hasOwnProperty(id)) {
                    if (this.__nicknames[id].nickname === nick) {
                        if (this.__nicknames[id] !== uuid){
                            return false;
                        }
                    }
                }
            }
            return true;
        },

        __kickPreviousPeerWithNickname: function(studentPeerId) {
            require(['webRTCLecturer'], function (webRTCLecturer) {
                webRTCLecturer.kick(studentPeerId);
            });
        }

    }; // prototype

    return new LecturerNicknames();
}); // requireJS define