/**
 * Created by Pascal on 18.02.2016.
 */

define(['jquery', 'messageTypes'], function ($, messageTypes) {

    function WebRTCHandlersCommon() {
    } // EOF class

    WebRTCHandlersCommon.prototype = {
        constructor: WebRTCHandlersCommon,

        setHandlers: function (webrtc, handlers) {
            var that = this;

            // testReadiness() could be used to test if socket connection is still established
            webrtc.on('connectionReady', function (sessionId) {
                console.log('signalling server connection established', arguments);
            });
            webrtc.on('stunservers', function () {
                console.log('stunservers', arguments);
            });
            webrtc.on('turnservers', function () {
                console.log('turnservers', arguments);
            });

            // TODO: Is this called?
            // probably only called if leaveRoom() is used
            webrtc.on('leftRoom', function (roomName) {
                console.log('leftRoom', roomName);
            });

            /* Is called
             - when joining a room with existing peers, once for each peer
             - when a new peer joins a joined room
             - when sharing screen, once for each peer
             */
            webrtc.on('createdPeer', function (peer) {
                console.log("createdPeer", peer);
                // lecturer only
                if (handlers.onPeerConnection && typeof handlers.onPeerConnection === "function") {
                    handlers.onPeerConnection(peer);
                }

                // show the ice connection state
                if (peer && peer.pc) {
                    handlers.handleConnectionState(peer);
                }


                peer.on('channelMessage', function (peer, roomName, payloadAndType, channel, event) {
                    console.log(arguments);
                    handlers.handleMessage(peer, payloadAndType.payload, payloadAndType.type);
                });
                /**
                 * receiving an incoming filetransfer
                 * @param metadata (
                     * commentJSON: (Object),
                     * msgType (String)
                     * name (String)
                     * size (Number)
                 * }
                 */
                peer.on('fileTransfer', function (metadata, receiver) {
                    receiver.on('progress', that.fileReceivedProgressHandler);

                    // non-file messages don't trigger the receivedFile handler below
                    // hence we must add it manually
                    console.log("filetransfer has been called directly with:", metadata);
                    if (metadata.msgType !== messageTypes.commentFile) {
                        handleMessage(metadata);
                    }

                    // get notified when file is done
                    receiver.on('receivedFile', function (optFile, metadata) {
                        handleMessage(metadata, optFile);
                    });

                    function handleMessage(metadata, optFile) {
                        console.log('received file', metadata);
                        handlers.handleMessage(peer, metadata.commentJSON, metadata.msgType, optFile);
                    }

                });
            });
        },

        setSenderHandlers: function (sender) {
            sender.on('progress', this.fileSenderProgressHandler);
            sender.on('sentFile', this.fileSentHandler);
            sender.on('complete', this.fileSenderCompleteHandler);
        },

        fileSenderProgressHandler: function (bytesSent) {
            console.log("on progress:", bytesSent);
        },

        /**
         * sending done
         * ==> might be called before the receiver got the whole file
         * hence, don't close the connection here!
         */
        fileSentHandler: function () {
            console.log("on sentFile:", arguments);
        },

        /**
         * receiver has actually received the file
         */
        fileSenderCompleteHandler: function () {
            console.log("on complete:", arguments);
        },

        fileReceivedProgressHandler: function (bytesReceived) {
            console.log("progress", bytesReceived);
        },

        // TODO: Not used yet
        closeWebrtcConnection: function (receiver) {
            receiver.channel.close();
        }

    }; // prototype

    return new WebRTCHandlersCommon();
}); // requireJS define