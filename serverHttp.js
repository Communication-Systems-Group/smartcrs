// https://www.webrtc-experiment.com/

// Dependencies:
// 1. WebSocket
// 2. Node-Static

// Features:
// 1. WebSocket over Nodejs connection
// 2. Now rooms; it is a simple implementation!

module.exports = {
    create: function() {
        var fs = require('fs');

        var _static = require('node-static');
        var file = new _static.Server(__dirname);
        this.settingsLoader = require('./settings.js');
        var that = this;


        // HTTP server
        this.app = require('http').createServer(function (request, response) {
            request.addListener('end', function () {
                if (__wrongHTMLPage(request)) {
                    file.serveFile('/students.html', 301, {"Location": "/students.html"}, request, response);
                } else {
                    file.serve(request, response);
                }
            }).resume();
        });
        
        function __wrongHTMLPage(request) {
            // access to root
            if (request.url === "/") {
                return true;
                // url is a html page...
            } else if (~request.url.indexOf(".htm")) {
                // ...but not a legit one
                if (["/" + that.settingsLoader.getLecturerPage(), "/" + that.settingsLoader.getStudentsPage()].indexOf(request.url) == -1) {
                    return true;
                }
            }
            return false;
        }
        
        return this.app;
    },
    run: function () {
        this.app.listen(this.settingsLoader.getHttpServerPort());
        console.log('Please open URL:', this.settingsLoader.createLecturerRunHttpAddress());
    }
};