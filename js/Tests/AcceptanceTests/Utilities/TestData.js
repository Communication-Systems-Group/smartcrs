/**
 * Created by Pascal on 25.08.2015.
 */

module.exports = {
    create: function (seleniumHelper) {
        return new TestData(seleniumHelper);
    }
};
function TestData(seleniumHelper) {
    this.path = require("path");
    this.fs = require("fs");
    this.sh = seleniumHelper;
    this.consts = require('../Utilities/Constants').create();
}

TestData.prototype = {
    constructor: TestData,

    getJson: function (filename) {
        var testFile = this.__readFileFromTestfilesDir(filename);
        return JSON.parse(testFile);
    },

    removeIdFromJson: function (fieldsJson) {
        var removedId = this.__removeIdAttributeFrom(JSON.stringify(fieldsJson));
        return JSON.parse(removedId);
    },

    loadLecture: function(jsonFilename) {
        var absFilePath = this.path.join(this.consts.testDataFolder, jsonFilename);
        var uploadButton = this.sh.findElementById("filesLoadLecture");
        this.sh.sendKeysToNotVisible(uploadButton, absFilePath);
    },

    __readFileFromTestfilesDir: function (filename) {
        var testFilePath = this.path.join(this.consts.testDataFolder, filename);
        return this.fs.readFileSync(testFilePath, 'utf8');
    },

    // the id attribute is unique & therefore needs to be removed before comparison
    __removeIdAttributeFrom: function (lectureFileString) {
        var regex = /,"id":\d*/g;
        return lectureFileString.replace(regex, "");
    }
};
