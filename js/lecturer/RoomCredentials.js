/**
 * Created by Pascal on 14.04.2016.
 */

define([], function () {

    function RoomCredentials() {
        this.roomName = "";
        this.roomPwd = "";
    } // EOF class

    RoomCredentials.prototype = {
        constructor: RoomCredentials,
        
        getCredentials: function () {
            return {roomName: this.roomName, roomPwd: this.roomPwd};
        },

        setCredentials: function(roomName, roomPwd) {
            this.roomName = roomName;
            this.roomPwd = roomPwd;
        }
        
    }; // prototype

    return new RoomCredentials();
}); // requireJS define