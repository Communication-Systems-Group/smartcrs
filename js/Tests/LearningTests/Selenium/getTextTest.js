/**
 * Created by Pascal on 29.12.2015.
 */

describe("blah", function () {
    it("blahah", function (done) {

        var selenium = require("../Utilities/SeleniumFactory").create();
        var server = require("../../../../server");
        server.run();

        var loaded = 0;

        selenium.driver.get("http://localhost:12034/js/Tests/AcceptanceTests/LearnSelenium/learnSelenium.html").then(function(){
            loaded = new Date().getTime();
            console.log("Website loaded: ", loaded);
        });

        var afterWait = 0;

        function waiting() {
            return selenium.driver.wait(selenium.until.elementLocated({css: "button"}), 7000).then(function () {
                afterWait = new Date().getTime();
                console.log("After wait: ", afterWait - loaded);
                return afterWait;
            });
        }

        selenium.driver.sleep(1).then(function(){
            var returnValue = waiting();
            var a = selenium.webdriver.promise.defer();
            var c = selenium.webdriver.promise.fullyResolved(a.promise);
            var b = 12;
        });
        selenium.driver.findElement({css: "button"}).click().then(function(){
            var afterClick = new Date().getTime()- afterWait;
            console.log("After click", afterClick);
        });


        selenium.driver.sleep(100000).then(function(){
            selenium.driver.quit();
            done();
        });

    }, 50000000);
});
