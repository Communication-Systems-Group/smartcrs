/**
 * Created by Pascal on 20.12.2015.
 */

module.exports = {
    create: function (selenium) {
        return new SeleniumHelper(selenium);
    }
};

function SeleniumHelper(selenium) {
    this.sel = selenium;
    this.driver = this.sel.driver;
    this.until = this.sel.until;
    this.assert = require('assert');

    this.defaultWait = 1000;
}

SeleniumHelper.prototype = {
    constructor: SeleniumHelper,

    click: function (element, optTimeout) {
        this.waitTillVisible(element, optTimeout);
        element.click();
        return element;
    },

    clickById: function (id, optTimeout) {
        return this.click(this.findElementById(id, optTimeout), optTimeout);
    },

    clickByCss: function (css, optTimeout) {
        return this.click(this.findElementByCss(css, optTimeout), optTimeout);
    },

    doubleClickByCss: function(css, optTimeout) {
        this.findElementByCss(css, optTimeout).click();
        return this.findElementByCss(css, optTimeout).click();
    },

    sendKeys: function (element, newValue, optTimeout) {
        this.waitTillVisible(element, optTimeout);
        return element.sendKeys(newValue);
    },

    sendKeysToNotVisible: function (element, newValue) {
        return element.sendKeys(newValue);
    },

    sendKeysJavascript: function (element, newValue, optTimeout) {
        var that = this;
        that.waitTillVisible(element, optTimeout);

        that.executeScript(function () {
            // 2d arrays because passing an array as single parameters in that.executeScript() doesn't seem possible
            // Problem: Which this-object to pass into apply()?
            var el = arguments[0][0];
            var value = arguments[0][1];
            $(el).val(value);
        }, element, newValue);

        that.__tempAssertSendKeys(element, newValue);
    },

    sendKeysJavascriptWithClear: function (element, newValue, optTimeout) {
        var that = this;
        that.waitTillVisible(element, optTimeout);
        element.clear().then(function () {
            that.sendKeysJavascript(element, newValue, optTimeout);
        });
    },

    // TODO: Temporary assert --> remove
    __tempAssertSendKeys: function (element, newValue) {
        var that = this;
        if (that.__isASCIIWithoutNewline(newValue)) {
            element.getAttribute("value").then(function (value) {
                that.assert.equal(value, newValue);
            });
        }
    },

    __isASCIIWithoutNewline: function (str) {
        return /^[\x00-\x7F]*$/.test(str) && /(?:[^\r\n]|\r(?!\n))/.test(str);
    },

    get: function (website, optTimeout) {
        optTimeout = this.__setOptTimeout();
        this.sel.driver.get(website);   // launch website
        return this.sel.driver.wait(this.sel.driver.executeScript(function () {
            return document.readyState === "complete";
        }), optTimeout);
    },

    getDefer: function () {
        return this.sel.webdriver.promise.defer();
    },

    getKey: function (key) {
        return this.sel.webdriver.Key[key];
    },

    // TODO: Couldn't find a way to wait() for text. Reason: getText() doesn't return a webelement
    getTextAsync: function (element, optTimeout) {
        this.waitTillVisible(element, optTimeout);
        return element.getText();
    },

    getTextByCssAsync: function(css, optTimeout) {
        var el = this.findElementByCss(css, optTimeout);
        return this.getTextAsync(el, optTimeout);
    },

    getTextFromInputOrTextArea: function(element, optTimeout) {
        this.waitTillVisible(element, optTimeout);
        return element.getAttribute("value");
    },

    sleep: function (timeout) {
        return this.driver.sleep(timeout);
    },

    wait: function (condition, optTimeout) {
        optTimeout = this.__setOptTimeout(optTimeout);
        return this.driver.wait(condition, optTimeout);
    },

    waitUntilNotVisible: function (element, optTimeout) {
        return this.wait(this.sel.until.elementIsNotVisible(element), optTimeout);
    },

    waitUntilStale: function(element, optTimeout) {
        return this.wait(this.sel.until.stalenessOf(element), optTimeout);
    },

    // arguments object mustn't be passed around. Hence this bothersome approach:
    // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
    executeScript: function () {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i) {
            args[i] = arguments[i];
        }

        var func = args[0];
        var var_args = Array.prototype.slice.call(args, 1);
        return this.sel.driver.executeScript(func, var_args);
    },

    executeAsyncScript: function () {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i) {
            args[i] = arguments[i];
        }

        var func = args[0];
        var var_args = Array.prototype.slice.call(args, 1);

        return this.sel.driver.executeAsyncScript(func, var_args);
    },

    quit: function () {
        return this.sel.driver.quit();
    },

    findElementById: function (id, optTimeout) {
        var locator = this.sel.By.id(id);
        return this.__findElement(locator, optTimeout);
    },

    findElementByCss: function (css, optTimeout) {
        var locator = this.sel.By.css(css);
        return this.__findElement(locator, optTimeout);
    },

    findElementsByCss: function (css, optTimeout) {
        var locator = this.sel.By.css(css);
        return this.__findElements(locator, optTimeout);
    },

    findElementByXpath: function (xpath, optTimeout) {
        var locator = this.sel.By.xpath(xpath);
        return this.__findElement(locator, optTimeout);
    },

    findElementByName: function (name, optTimeout) {
        var locator = this.sel.By.name(name);
        return this.__findElement(locator, optTimeout);
    },

    createFlow: function(func) {
        return this.sel.webdriver.promise.createFlow(func);
    },

    getControlFlow: function() {
        return this.sel.webdriver.promise.controlFlow();
    },

    fullyResolved: function(flow) {
        return this.sel.webdriver.promise.fullyResolved(flow);
    },

    fulfilled: function(func) {
        return this.sel.webdriver.promise.fulfilled(func);
    },

    __setOptTimeout: function (optTimeout) {
        return optTimeout || this.defaultWait;
    },

    waitTillVisible: function (element, optTimeout) {
        optTimeout = this.__setOptTimeout(optTimeout);
        return this.wait(this.sel.until.elementIsVisible(element), optTimeout);
    },

    __waitTillFindable: function (locator, optTimeout) {
        optTimeout = this.__setOptTimeout(optTimeout);
        return this.wait(this.sel.until.elementLocated(locator), optTimeout);
    },

    __findElement: function (locator, optTimeout) {
        this.__waitTillFindable(locator, optTimeout);
        return this.driver.findElement(locator);
    },

    __findElements: function (locator, optTimeout) {
        this.__waitTillFindable(locator, optTimeout);
        return this.driver.findElements(locator);
    }
};