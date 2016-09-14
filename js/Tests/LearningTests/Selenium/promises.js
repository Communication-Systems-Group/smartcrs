describe("should ", function () {
    beforeEach(function () {
    });

    it("should return the correct value", function (done) {

        var selenium = require("../Utilities/SeleniumFactory").create();
        var server = require("../../../../server");
        server.run();
        selenium.driver.get("http://localhost:12034/js/Tests/AcceptanceTests/LearnSelenium/learnSelenium.html");

        var greetingPromise = getStringAsync();
        greetingPromise.then(addToStringAsync)
            .then(function (greeting) {
            console.log(greeting);    // 'hello world!!!!’
            done();
        });

        function getStringAsync(){
            var d = selenium.webdriver.promise.defer();
            selenium.driver.sleep(1).then(function(){
                d.fulfill("Say hello");
            });
            return d.promise;
        }

        function addToStringAsync(str) {
            return selenium.driver.findElement({id: 'div2'}).getText().then(function(div2Text){
                return str + " " + div2Text;
            });
        }
    }, 99999);
});