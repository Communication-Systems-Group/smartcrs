var socketIO = require('socket.io'),
    uuid = require('node-uuid'),
    crypto = require('crypto');

module.exports = function (server, config) {
    var io = socketIO.listen(server);
    var custom = require('./socketsCustom')(io);
    var settingsLoader = require('./settings.js');

    if (config.logLevel) {
        // https://github.com/Automattic/socket.io/wiki/Configuring-Socket.IO
        // io.set('log level', config.logLevel);
    }

    io.sockets.on('connection', function (client) {
        client.resources = {
            screen: false,
            video: true,
            audio: false
        };

        // pass a message to another id
        client.on('message', function (details) {
            if (!details) return;

            var otherClient = io.to(details.to);
            if (!otherClient) return;

            details.from = client.id;
            otherClient.emit('message', details);
        });

        client.on('shareScreen', function () {
            client.resources.screen = true;
        });

        client.on('unshareScreen', function (type) {
            client.resources.screen = false;
            removeFeed('screen');
        });

        client.on('fetchAvailableRooms', function(cb) {
            var rooms = custom.getRooms();
            safeCb(cb)(rooms);
        });

        client.on('join', join);

        function removeFeed(type) {
            if (client.room) {
                io.sockets.in(client.room).emit('remove', {
                    id: client.id,
                    type: type
                });
                if (!type) {
                    client.leave(client.room);
                    client.room = undefined;
                }
            }
        }

        function join(roomName, pwd, cb) {
            // sanity check
            if (typeof roomName !== 'string') return;
            if (!custom.roomExists(roomName) && !custom.isLecturer(client.id, roomName)) {
                safeCb(cb)(settingsLoader.getErrNoLecturerInRoom());
                return;
            }
            if (!custom.isRoomPwdCorrect(roomName, pwd)) {
                safeCb(cb)(settingsLoader.getErrWrongRoomPassword());
                return;
            }
            if (custom.isRoomFull(config, roomName, cb) ){
                safeCb(cb)('full');
                return;
            }

            // leave any existing rooms
            removeFeed();
            safeCb(cb)(null, describeRoom(roomName));
            client.join(roomName);
            client.room = roomName;
        }

        // we don't want to pass "leave" directly because the
        // event type string of "socket end" gets passed too.
        client.on('disconnect', function () {
            custom.removeRoomOnLecturerDisconnect(client.id, client.room);
            removeFeed();
        });
        client.on('leave', function () {
            custom.removeRoomOnLecturerDisconnect(client.id, client.room);
            removeFeed();
        });

        client.on('create', function (roomName, adminPwd, roomPwd, cb) {

            function createRoom() {
                custom.createRoom(roomName, adminPwd, roomPwd, client);
                join(roomName, roomPwd);
                safeCb(cb)(null, roomName);
            }

            if (custom.roomExistsAsSocket(roomName) && !custom.isAdminPwdCorrect(roomName, adminPwd)) {
                    safeCb(cb)(settingsLoader.getErrWrongAdminPassword());
            } else {
                createRoom();
            }
        });

        // support for logging full webrtc traces to stdout
        // useful for large-scale error monitoring
        client.on('trace', function (data) {
            console.log('trace', JSON.stringify(
            [data.type, data.session, data.prefix, data.peer, data.time, data.value]
            ));
        });


        // tell client about stun and turn servers and generate nonces
        client.emit('stunservers', config.stunservers || []);

        // create shared secret nonces for TURN authentication
        // the process is described in draft-uberti-behave-turn-rest
        var credentials = [];
        // allow selectively vending turn credentials based on origin.
        var origin = client.handshake.headers.origin;
        if (!config.turnorigins || config.turnorigins.indexOf(origin) !== -1) {
            config.turnservers.forEach(function (server) {
                var hmac = crypto.createHmac('sha1', server.secret);
                // default to 86400 seconds timeout unless specified
                var username = Math.floor(new Date().getTime() / 1000) + (server.expiry || 86400) + "";
                hmac.update(username);
                //credentials.push({
                //    username: username,
                //    credential: hmac.digest('base64'),
                //    urls: server.urls || server.url
                //});
                credentials.push({
                    username: 'user',
                    credential: 'pwd',
                    urls: server.urls || server.url
                });
            });
        }
        client.emit('turnservers', credentials);
    });


    function describeRoom(name) {
        var adapter = io.nsps['/'].adapter;
        var clients = adapter.rooms[name] || {};
        var result = {
            clients: {},
            lecturerId: custom.getLecturerPeerOfRoom(name).id
        };
        Object.keys(clients).forEach(function (id) {
            // resources:{audio: false, screen: false, video: true}
            result.clients[id] = adapter.nsp.connected[id].resources;
        });
        return result;
    }

    function clientsInRoom(name) {
        return io.sockets.clients(name).length;
    }



};

function safeCb(cb) {
    if (typeof cb === 'function') {
        return cb;
    } else {
        return function () {};
    }
}


