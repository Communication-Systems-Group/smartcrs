/**
 * Created by Pascal on 18.08.2015.
 */

module.exports = {
    // optNewFlowObj = {createNewFlow: true}
    create: function (optNewFlowObj) {
        return new SeleniumFactory(optNewFlowObj);
    }
};

function SeleniumFactory(optNewFlowObj) {
    var webdriver = require('selenium-webdriver'),
        By = require('selenium-webdriver').By,
        until = require('selenium-webdriver').until;

    var flow = null;
    if(optNewFlowObj && optNewFlowObj.createNewFlow === true) {
        flow = __createNewFlow(webdriver);
    }

    var driver = new webdriver.Builder().
    forBrowser('firefox').
    setControlFlow(flow).  // Required for running browsers in parallel
    build(); // opens a browser window

    return {webdriver: webdriver, By: By, until: until, driver: driver};
}

function __createNewFlow(webdriver) {
    return new webdriver.promise.ControlFlow()
        .on('uncaughtException', function (e) {
            console.log('%s', e);
        });
}