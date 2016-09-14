/**
 * Created by Pascal on 06.01.2016.
 */

var selenium = require('../Utilities/SeleniumFactory').create(/*{createNewFlow: true}*/);
var sh = require("../Utilities/SeleniumHelper").create(selenium);
// var driver2 = getNewDriver();

sh.get("http://localhost:1055/SmartCRS-2.0/LearnSelenium/learnSelenium.html2");
//driver2.wait(sh.findElementById("myButton"), 8000).then(function(){
//    console.log("wait successful")
//});




function getNewDriver() {
    var webdriver = require('selenium-webdriver'),
        By = webdriver.By,
        until = webdriver.until;

    return driver = new webdriver.Builder()
        .forBrowser('firefox')
        .setControlFlow(new webdriver.promise.ControlFlow())
        .build();
}