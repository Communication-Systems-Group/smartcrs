/**
 * Created by Henriette on 04.04.2016.
 */

define(['simpleWebRTC', 'settingsLoader'], function (simpleWebRTC, settings) {

    function WebRTCFactory() {

        var stun = {
            'url': 'stun:' + settings.createWebsocketAddress()
        };

        var turn = {
            'url': 'turn:' + settings.createWebsocketAddress(),
            'username': 'user@myrealm',
            'credential': 'pwd'
        };

        this.config = {
            // we don't do video
            localVideoEl: '',
            remoteVideosEl: '',
            // dont ask for camera access
            autoRequestMedia: false,
            // dont negotiate media
            receiveMedia: {
                mandatory: {
                    OfferToReceiveAudio: false,
                    OfferToReceiveVideo: false
                }
            },
            url: settings.createWebsocketAddress(), // set signaling server
            peerConnectionConfig: {
                iceServers: { 'iceServers': [stun, turn] }
            }
        };

    }

    WebRTCFactory.prototype = {
        constructor: WebRTCFactory,

        create: function() {
            return new simpleWebRTC(this.config);
        }
    };

    return new WebRTCFactory();
}); // define requireJS
