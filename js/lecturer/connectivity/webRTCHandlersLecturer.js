/**
 * Created by Pascal on 26.01.2016.
 */

define(['jquery', 'peerTableMgr', 'messageTypes', 'connectedPeers'], function ($, peerTableMgr, msgTypes, connectedPeers) {

    function WebRTCHandlersLecturer() {

    } // EOF class


    WebRTCHandlersLecturer.prototype = {
        constructor: WebRTCHandlersLecturer,

        onPeerConnection: function(peer) {
            connectedPeers.add(peer.id, peer);
            peerTableMgr.add(peer.id);
        },
        
        onleave: function (userid) {
            connectedPeers.remove(userid);
            peerTableMgr.removePeer(userid);
        },

        /**
         *
         * @param peer (Object)
         * @param comment (Object)
         * @param msgType (String)
         */
        handleMessage: function(peer, comment, msgType){
            require(['commentsLecturer'], function (commentsLecturer) {
                    switch (msgType) {
                        case msgTypes.getComments:
                            commentsLecturer.handleInitialGetCommentsRequest(peer);
                            require(['shareQuestion'], function(shareQuestion){
                                shareQuestion.shareAllAskedQuestions(peer);
                            });
                            break;

                        case msgTypes.commentFromStudent:
                            commentsLecturer.handleCommentFromStudent(comment, peer);
                            break;

                        case msgTypes.commentUpVote:
                            commentsLecturer.handleUpVote(comment, peer);
                            break;

                        case msgTypes.commentDownVote:
                            commentsLecturer.handleDownVote(comment, peer);
                            break;

                        case msgTypes.response:
                            require(['stats', 'messageResponse', 'webRTCLecturer'], function (stats, msgResponse, webRTCLecturer) {
                                var msgPeerid = new msgResponse(comment.questionID, comment.questionType, peer.id, comment.answerIDs);
                                stats.addResponse(msgPeerid);
                                webRTCLecturer.sendMsgToSpecificStudent(peer, "", msgTypes.responseAck);
                            });
                            break;

                        case msgTypes.nicknameRequest:
                            require(['lecturerNicknames'], function (lecturerNicknames) {
                                lecturerNicknames.handleNicknameRequest(peer, comment);
                            });
                            break;

                        case msgTypes.ping:
                            require(['webRTCLecturer'], function (webRTCLecturer) {
                                webRTCLecturer.sendMsgToSpecificStudent(peer, comment, msgTypes.pong);
                            });
                            break;


                        default:
                            console.log("webRTCHandlersLecturer.js: channel.onmessage encountered an invalid message type!", comment, msgType);
                    }
            });
        },

        handleConnectionState: function(peer) {
            peer.pc.on('iceConnectionStateChange', function (event) {
                var state = peer.pc.iceConnectionState;
                switch (state) {
                    case 'checking':
                        updatePeerTableMgr('Connecting to peer...');
                        break;
                    case 'connected':
                        updatePeerTableMgr('Connected');
                        break;
                    case 'completed': // on caller side
                        updatePeerTableMgr('Connection established.');
                        break;
                    case 'disconnected':
                        updatePeerTableMgr('Disconnected.');
                        connectedPeers.remove(peer.id);
                        peerTableMgr.removePeer(peer.id);
                        break;
                    case 'failed':
                        updatePeerTableMgr('Failed.');
                        connectedPeers.remove(peer.id);
                        peerTableMgr.removePeer(peer.id);
                        break;
                    case 'closed':
                        updatePeerTableMgr('Connection closed.');
                        connectedPeers.remove(peer.id);
                        peerTableMgr.removePeer(peer.id);
                        break;
                }

                function updatePeerTableMgr(state) {
                    require(['peerTableMgr'], function(peerTableMgr){
                        peerTableMgr.setConnectionStateForPeerId(peer.id, state);
                    });
                }
            });
        }
    }; // prototype

    return new WebRTCHandlersLecturer();
}); // requireJS define