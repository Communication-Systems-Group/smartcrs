///**
// * Created by Pascal on 11.09.2015.
// */
//define(["TestHTMLConverter"], function (converter) {
//
//    describe("Saving lecture for lecturer", function () {
//        beforeEach(function (done) {
//            var that = this;
//            jasmine.getFixtures().fixturesPath = 'base';
//            converter.prepareAndLoadStrippedPageForTest('lecturer.html');
//
//            require(['LoadLecture', 'TestData'], function (loader, testData) {
//                that.loader = loader;
//                that.testData = testData;
//                done();
//            });
//        });
//
//        it("should throw exception if no lecture name was given", function () {
//            var f = new File([this.testData.ThreeQ_NoFile_Thres0_Sound_Percent], "testLecture.txt", {
//                type: "text/plain",
//                lastModified: date
//            });
//            expect(this.loader).toThrow();
//
//        }, 100000);
//
//    });
//});