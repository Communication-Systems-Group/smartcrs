/**
 * Created by Pascal on 28.02.2016.
 */

define(['jquery'], function ($) {

    function WebRTCLecturerPeer() {
        this.lecturerPeer = null;
    } // EOF class

    WebRTCLecturerPeer.prototype = {
        constructor: WebRTCLecturerPeer,

        set: function (peer) {
            this.lecturerPeer = peer;
        },

        get: function() {
            return this.lecturerPeer;
        }

    }; // prototype

    return new WebRTCLecturerPeer();
}); // requireJS define