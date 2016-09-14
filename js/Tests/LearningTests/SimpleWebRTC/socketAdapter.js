/**
 * Created by Pascal on 16.02.2016.
 */

var socketAdapter = (function() {
    var socketAdapter = setupWebsocket();
    var unsentMsgs = [];
    socketAdapter.on = function (ev, fn) {
        console.log("in on()", arguments);
        webrtc.on(arguments[0][0]);
    };

    function send(json) {
        if (socketAdapter.isConnected) {
            unsentMsgs.forEach(function(msg){
                socketAdapter.send(msg);
            });
            socketAdapter.send(json);
        } else {
            if ($.inArray(json, unsentMsgs) === -1) {
                unsentMsgs.push(json);
            }
            setTimeout(function(){
                send(json);
            }, 500);
        }
    }
    socketAdapter.emit = function () {
        console.log("in emit()", JSON.stringify(arguments));
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        var el = {};
        el.ev = args[0];
        el.name = args[1];
        el.fn = args[2];
        var json = JSON.stringify(el);
        send(el);
    };
    socketAdapter.getSessionId = function (ev, fn) {
        console.log("in getSessionId()", "ev=", JSON.stringify(ev), "function=", fn);
    };
    socketAdapter.disconnect = function (ev, fn) {
        console.log("in disconnect()", "ev=", JSON.stringify(ev), "function=", fn);
    };
    return socketAdapter;
}());

function setupWebsocket() {
    var websocket = new WebSocket("ws://localhost:12034/");
    websocket.isConnected = false;

    console.log("status after constructor call", websocket.readyState);

    websocket.onmessage = function (event) {
        console.log(JSON.stringify(event));
        var data = JSON.parse(arguments[0].data);

        websocket.on();
    };
    websocket.onerror = function (event) {
        console.log("In onerror()", websocket.readyState);
        console.log(JSON.stringify(event));
        websocket.isConnected = false;
    };
    websocket.onopen = function (event) {
        console.log("In onopen()", websocket.readyState);
        console.log(JSON.stringify(event));
        websocket.isConnected = true;
    };
    websocket.onclose = function (event) {
        console.log("In onclose()", websocket.readyState);
        console.log(JSON.stringify(event));
        websocket.isConnected = false;
    };

    return websocket;
}
// setupWebsocket();
