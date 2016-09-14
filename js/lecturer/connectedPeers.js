/**
 * Created by Pascal on 07.02.2016.
 */

define(['jquery', 'lecturerNicknames'], function ($, lecturerNicknames) {

    function ConnectedPeers() {
        /**
         * @type {{peerId, peerObj}}
         * @private
         */
        this.__data = {};
    } // EOF class

    ConnectedPeers.prototype = {
        constructor: ConnectedPeers,

        add: function (peerId, peerObj) {
            if (!(peerId in this.__data)) {
                this.__data[peerId] = peerObj;
            }
            this.__updateNumPeersDiv();
        },

        remove: function(peerId) {
            if (peerId in this.__data) {
                delete this.__data[peerId];
            }
            this.__updateNumPeersDiv();
        },

        /**
         *
         * @returns {Array}
         */
        getAllPeersAsArray: function(){
            var that = this;
            var peers = [];
            Object.keys(this.__data).forEach(function(key){
                peers.push(that.__data[key]);
            });
            return peers;
        },

        getNumPeers: function () {
            return Object.keys(this.__data).length;
        },

        /**
         *
         * @param id (String)
         * @returns {Array}
         */
        getPeerById: function (id) {
            var peer = [];
            if (id in this.__data) {
                peer.push(this.__data[id]);
            }
            return peer;
        },

        // displays the number of connected peers on lecturerRun.html
        __updateNumPeersDiv: function() {
            $("#numPeers").text(this.getNumPeers());
        }
        
    }; // prototype

    return new ConnectedPeers();
}); // requireJS define