/**
 * Created by Pascal on 06.03.2016.
 */

module.exports = function (io) {
    return new SocketsCustom(io);
};

function SocketsCustom(io) {
    this.__io = io;
    /**
     *
     * @type {{roomName (String), roomPwd (String), adminPwd (String), lecturerPeer (Socket)}}
     * @private
     */
    this.__roomsInfo = {};
}

SocketsCustom.prototype = {
    constructor: SocketsCustom,

    roomExistsAsSocket: function (roomName) {
        var nsp = this.__io.nsps['/'];
        var adapter = nsp.adapter;
        var rooms = adapter.rooms;
        var room = rooms[roomName];
        return !!room;
    },

    roomExists: function (roomName) {
        return this.__roomsInfo.hasOwnProperty(roomName);
    },

    isRoomFull: function (config, name, cb) {
        return (config.rooms && config.rooms.maxClients > 0 &&
        clientsInRoom(name) >= config.rooms.maxClients);
    },

    createRoom: function (roomName, adminPwd, roomPwd, lecturerPeer) {
        this.__roomsInfo[roomName] = {
            adminPwd: adminPwd,
            roomPwd: roomPwd,
            lecturerPeer: lecturerPeer
        };
    },

    getLecturerPeerOfRoom: function (roomName) {
        return this.__roomsInfo[roomName].lecturerPeer;
    },

    removeRoomOnLecturerDisconnect: function (clientId, roomName) {
        if (this.isLecturer(clientId, roomName)) {
            delete this.__roomsInfo[roomName];
        }
    },

    getRooms: function () {
        var that = this;
        var rooms = [];
        Object.keys(this.__roomsInfo).forEach(function (roomName) {
            rooms.push({
                roomName: roomName, 
                hasRoomPwd: !!that.__roomsInfo[roomName].roomPwd
            });
        });
        return rooms;
    },

    isRoomPwdCorrect: function (roomName, pwd) {
        return this.__roomsInfo[roomName].roomPwd === pwd;
    },

    isAdminPwdCorrect: function (roomName, adminPwd) {
        return this.__roomsInfo[roomName].adminPwd === adminPwd;
    },

    isLecturer: function (clientId, roomName) {
        if (!roomName || !this.__roomsInfo.hasOwnProperty(roomName)) {    // peer connects to socket server on browser load. Room might not exist until he manually creates/joins it
            return false;
        }
        return clientId === this.__roomsInfo[roomName].lecturerPeer.id;
    }
}; // prototype