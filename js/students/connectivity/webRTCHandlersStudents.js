/**
 * Created by Pascal on 26.01.2016.
 */

define(['messageTypes', 'popupWindow', 'studentNickname', 'webRTCLecturerPeer', 'selectRoomWindow', 'localStorage', 'heartBeat', 'incomingQuestionManager', 'answerAcknowledger'], function (msgTypes, popupWindow, studentNickname, webRTCLecturerPeer, selectRoomWindow, localStorage, heartBeat, incomingQuestionManager, answerAcknowledger) {

    function WebRTCHandlersStudents(webRTCStudents, commentsStudents) {
        this.webRTCStudents = webRTCStudents;
        this.commentsStudents = commentsStudents;
    }

    WebRTCHandlersStudents.prototype = {
        constructor: WebRTCHandlersStudents,

        onJoinedRoom: function (nickname) {
            console.log("onJoinedRoom has been called");
            selectRoomWindow.setLabelText(selectRoomWindow.labelTextConnected);
            var nickRequest = studentNickname.prepareNicknameRequest(nickname);
            this.webRTCStudents.sendMsg(nickRequest, msgTypes.nicknameRequest);
            $("#connectionStatusIcon").removeClass("disconnected").addClass("connected");
            heartBeat.startSendingHeartBeat()
        },

        onclose: function () {
            console.log("onclose() has been called");
            $("#connectionStatusIcon").removeClass("connected").addClass("disconnected");
            popupWindow(5000, "Connection to lecturer closed", "The connection to the lecturer has been closed.<br>Reload your browser if this happened without good reason (e.g. lecture ended).");
        },

        /**
         *
         * @param peer (Object)
         * @param comment (Object)
         * @param msgType (String)
         * @param optFile (File=)
         */
        handleMessage: function (peer, comment, msgType, optFile) {
            switch (msgType) {
                case msgTypes.question:
                    incomingQuestionManager.handleIncomingQuestion(comment);
                    break;
                
                case msgTypes.responseAck:
                    answerAcknowledger.answerWasAcknowledged();
                    break;

                case msgTypes.nicknameResponse:

                    if (comment.successful === true) {
                        studentNickname.nicknameAccepted(comment.nickname);
                        localStorage.storeLastConnection(comment.nickname, comment.roomName, comment.roomPwd, studentNickname.uuid);
                        this.webRTCStudents.sendMsg("", msgTypes.getComments);

                    } else if (comment.successful === false) {
                        studentNickname.nicknameDeclined();
                    } else {
                        console.log("WebRTCHandlersStudents.js: nicknameResponse comment not a boolean: ", comment);
                    }

                    break;

                case msgTypes.commentFromLecturer:
                    this.commentsStudents.addNewComment(comment);
                    break;

                case msgTypes.commentFile:
                    comment.file = optFile;
                    this.commentsStudents.addNewComment(comment);
                    break;

                case msgTypes.commentFromStudentCB:
                    this.commentsStudents.handlePostCommentRequestCB(comment);
                    break;

                case msgTypes.commentUpVote:
                    this.commentsStudents.upVote(comment);
                    break;

                case msgTypes.commentDownVote:
                    this.commentsStudents.downVote(comment);
                    break;

                case msgTypes.pong:
                    heartBeat.receivePong(comment);
                    break;

                default:
                    console.log("webRTCHandlersStudents.js: channel.onmessage encountered an invalid message type!", comment);
            }
        },

        handleConnectionState: function (peer) {
            var that = this;
            peer.pc.on('iceConnectionStateChange', function (event) {
                var state = peer.pc.iceConnectionState;
                switch (state) {
                    case 'checking':
                        logState('Connecting to peer...');
                        break;
                    case 'connected':
                        logState('Connected to:');
                        break;
                    case 'completed': // on caller side
                        logState('Connection established to:');
                        break;
                    case 'disconnected':
                        logState('Disconnected from:');
                        closeIfLecturer();
                        break;
                    case 'failed':
                        logState('Failed connection with:');
                        closeIfLecturer();
                        break;
                    case 'closed':
                        logState('Connection closed to:');
                        closeIfLecturer();
                        break;
                    default:
                        console.error("default case");
                }

                function logState(state) {
                    console.log(state, peer.id);
                }

                function closeIfLecturer() {
                    var lecturerPeer = webRTCLecturerPeer.get();
                    if (lecturerPeer === peer) {
                        that.onclose();
                    }
                }
            });
        }
    }; // prototype

    return WebRTCHandlersStudents;
}); // requireJS define