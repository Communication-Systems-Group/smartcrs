module.exports = {
    create: function (lecturerPage, seleniumHelper, testData) {
        return new Asserter(lecturerPage, seleniumHelper, testData);
    }
};

function Asserter(lecturerPage, seleniumHelper, testData) {
    this.lecturerPage = lecturerPage;
    this.sh = seleniumHelper;
    this.testData = testData;
}

Asserter.prototype = {
    constructor: Asserter,

    equalsWebsiteDataAsync: function (jsonFilename) {
        var that = this;
        return that.lecturerPage.getAllDataAsync()
            .then(function(data) {
                that.__assertIsEqual(data, jsonFilename);
            });
    },

    __assertIsEqual: function (websiteDataJson, testDataFilename) {
        var testJson = this.testData.getJson(testDataFilename);
        var fieldsJsonNoId = this.testData.removeIdFromJson(websiteDataJson);
        console.log(JSON.stringify(fieldsJsonNoId));
        expect(testJson).toEqual(fieldsJsonNoId);
    }

}; // prototype