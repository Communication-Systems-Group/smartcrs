/*global console*/
module.exports = {
    run: function (server) {

        var path = require('path');
        // process.env.GETCONFIG_ROOT = (require.main ? path.dirname(require.main.filename) : process.cwd());

        var settingsLoader = require('./settings.js');
        var config = require('getconfig');
        var fs = require('fs'),
            sockets = require('./sockets'),
            port = settingsLoader.getHttpServerProtocol(),
            server_handler = function (req, res) {
                res.writeHead(404);
                res.end();
            };

// Create an http(s) server instance to that socket.io can listen to
        if (config.server.secure) {
            server = require('https').Server({
                key: fs.readFileSync(config.server.key),
                cert: fs.readFileSync(config.server.cert),
                passphrase: config.server.password
            }, server_handler);
        } else {
            // server = require('http').Server(server_handler);
        }
        // server.listen(port);

        sockets(server, config);

        if (config.uid) process.setuid(config.uid);

        var httpUrl = settingsLoader.createWebsocketAddress();
        console.log('The signalling server is running at: ' + httpUrl);
    }
};