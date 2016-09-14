/**
 * Created by Pascal on 27.01.2016.
 */

define(['jquery', 'settingsLoader', 'messageTypes', 'peerTableMgr', 'connectedPeers', 'webRTCHandlersCommon', 'channelSetupWindow', 'webRTCHandlersLecturer', 'webRTCFactory', 'roomCredentials'], function ($, settings, messageTypes, peerTableMgr, connectedPeers, webRTCHandlersCommon, channelSetupWindow, webRTCHandlersLecturer, webRTCFactory, roomCredentials) {

    function WebRTCLecturer() {

        // create our webrtc connection
        this.webrtc = webRTCFactory.create();

        var that = this;
        webRTCHandlersCommon.setHandlers(that.webrtc, webRTCHandlersLecturer);

    } // EOF class

    WebRTCLecturer.prototype = {
        constructor: WebRTCLecturer,

        connectButtonLogic: function () {
            var that = this;
            var win = new channelSetupWindow();
            win.showAsync().then(function (roomName, adminPwd, roomPwd) {
                that.webrtc.createRoom(roomName, adminPwd, roomPwd, function (errorMsg, roomName) {
                    console.log("createRoom cb:", arguments);
                    if (errorMsg) {
                        webix.message({type: "error", text: errorMsg});
                        if (errorMsg !== settings.getErrWrongAdminPassword()) {
                            console.error("Unexpected error while creating room: " + errorMsg);
                        }
                        that.connectButtonLogic();
                        return;
                    }
                    roomCredentials.setCredentials(roomName, roomPwd);
                    that.__toggleConnectionButtons();
                });
            });
        },

        disconnectButtonLogic: function () {
            this.__toggleConnectionButtons();
            this.webrtc.connection.emit('leave');
        },

        __toggleConnectionButtons: function() {
            $(".connectionButtons").toggle();
        },

        kick: function (peerId) {
            var that = this;
            var peerArray = connectedPeers.getPeerById(peerId);
            peerArray.forEach(function (peer) {
                that.webrtc.webrtc.removePeers(peer.id);
                connectedPeers.remove(peer.id);
            });
        },

        /**
         *
         * @param comment {Object}
         * @param msgType {String}
         * @param optFile {File=}
         * @returns {boolean}
         */
        sendMsgToAllStudents: function (comment, msgType, optFile) {
            var peers = connectedPeers.getAllPeersAsArray();
            return this.sendMsg(peers, comment, msgType, optFile);
        },

        /**
         *
         * @param peer {Peer}
         * @param msg {Object}
         * @param type {String}
         * @param optFile {String=}
         * @returns {boolean}
         */
        sendMsgToSpecificStudent: function (peer, msg, type, optFile) {
            return this.sendMsg([peer], msg, type, optFile);
        },

        /**
         *
         * @param delPeersArray {Array<Peer>}
         * @param msg
         * @param type {String}
         * @param optFile {String=}
         * @returns {boolean}
         */
        sendMsgToAllStudentsExcept: function (delPeersArray, msg, type, optFile) {
            var peers = connectedPeers.getAllPeersAsArray();
            delPeersArray.forEach(function (delPeer) {
                var index = peers.indexOf(delPeer);
                if (index > -1) {
                    peers.splice(index, 1);
                }
            });

            // prevent error msg when only 1 student is connected
            if (peers.length > 0) {
                return this.sendMsg(peers, msg, type, optFile);
            } else {
                return false;
            }
        },

        /**
         *
         * @param peers {Array<Peer>}
         * @param comment {JSON}
         * @param msgType {String}
         * @param optFile {File=}
         * @returns {boolean}
         */
        sendMsg: function (peers, comment, msgType, optFile) {
            if (!peers.length) {
                $("#infoNotConnected").trigger("showInfo");
                return false;
            }

            var successfulSends = 0;
            peers.forEach(function (studentPeer) {

                try {
                    if (msgType === messageTypes.commentFile) {
                        var sender = studentPeer.sendFile(comment, msgType, optFile);
                        webRTCHandlersCommon.setSenderHandlers(sender);

                    } else {
                        studentPeer.sendDirectly(settings.getRoomName(), msgType, comment);
                    }
                    successfulSends++;
                }
                catch (err) {
                    console.log(err);
                    peerTableMgr.removePeer(studentPeer.id);
                    connectedPeers.remove(studentPeer.id);
                    console.log("Peer " + studentPeer.id + " has been removed");
                }   // catch
            }); // for studentId in peers
            return (successfulSends > 0);
        }
    }; // prototype

    return new WebRTCLecturer();
}); // requireJS define