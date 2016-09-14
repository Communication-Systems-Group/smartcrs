/**
 * Created by Pascal on 16.08.2015.
 */

module.exports = {
    create: function (selenium) {
        return new HelperQuestionTester(selenium);
    }
};

function HelperQuestionTester(selenium) {
    this.sh = selenium;
    this.driver = this.sh.driver;
    this.By = this.sh.By;

    this.consts = require('./Constants').create();
    this.fs = require('fs');
    this.path = require('path');
}

HelperQuestionTester.prototype = {
    constructor: HelperQuestionTester,

    readLectureFile: function (fileName) {
        var defer = this.sh.webdriver.promise.defer();
        var absPath = this.path.join(this.consts.testOutputFolder, fileName + ".txt");
        var file = this.fs.readFile(absPath, 'utf8', function (err, data) {
            if (err) {
                if (err.code === 'ENOENT'){
                    console.log("Couldn't find saved lecture file");
                }
                else {
                    throw err;
                }
            } // if (err)
            else {
                var lectureTestFile = JSON.parse(this.removeIdAttributeFrom(file));
                var stringified = JSON.stringify(lectureTestFile);
                defer.fulfill(stringified);
            }
            console.log(data);
        });

        return defer.promise;
    },

    loadLectureData: function (data) {
        var testData = require('./TestData').create()[data];
        this.driver.executeScript(loadDataInBrowser, testData);

        function loadDataInBrowser(testData) {
            require(['LoadLecture', 'questionsControlTable'], function (loadLecture, qTable) {
                loadLecture.__setLecturerFieldValues(JSON.stringify(testData));
            });
        }
    },

    injectStudAnswer: function () {
        var studAnswers = require('./TestData').create().studAnswer3QTypes;
        this.driver.executeScript(function (studAnswer) {
            require(['stats'], function (stats) {
                stats.data = studAnswer;
            });
        }, studAnswers);
    },

    getWindowHeaderText: function () {
        var d = this.sh.webdriver.promise.defer();
        var winHeader = this.driver.findElement(this.By.css(".webix_el_label > div"));
        winHeader.getText().then(function (title) {
            d.fulfill(title);
        });

        return d.promise;
    }
};

