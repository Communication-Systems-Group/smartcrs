/**
 * Created by Pascal on 22.12.2015.
 */

try {
    var httpServer = require("./serverHttp");
    var server = httpServer.create();
    httpServer.run();
    var signallingServer = require("./serverSignal").run(server);
} catch(e) {
    console.error("runServer.js: " + e);
}
