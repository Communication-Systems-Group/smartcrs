/**
 * Created by Pascal on 22.01.2016.
 */

describe("should wait until condition is true", function () {
    beforeEach(function () {
    });

    it("should wait till true", function (done) {
        var selenium = require('../Utilities/SeleniumFactory').create();
        var sh = require("../Utilities/SeleniumHelper").create(selenium);

        var server = require("../../../../server");
        server.run();

        selenium.driver.get("http://localhost:12034/lecturerRun.html").then(function(){
            sh.executeScript(function () {
                require(['notification']);
            });
            sh.wait(function() {
                sh.executeScript(function () {
                    var value = require('notification').activeNotificationId;
                    console.log(value, typeof value);
                    return typeof value === "number";
                })}, 5000)
            });
    }, 99999);
});