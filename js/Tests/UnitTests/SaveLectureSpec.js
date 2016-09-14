///**
// * Created by Pascal on 11.09.2015.
// */
//define(["TestHTMLConverter"], function (converter) {
//    describe("When saving a lecture as lecturer", function () {
//        beforeEach(function (done) {
//            var that = this;
//            jasmine.getFixtures().fixturesPath = 'base';
//            converter.prepareAndLoadStrippedPageForTest('lecturer.html');
//
//            require(['FieldsLecturer', 'SaveLecturer', "fs"], function (fieldsLecturer, saveLecturer, fs) {
//                that.fieldsLecturer = fieldsLecturer;
//                that.saveLecturer = saveLecturer;
//                that.fs = fs;
//                spyOn(that.fs, "saveBlobLocally");
//                done();
//            });
//        });
//
//
//        it("it should throw an exception if no lecture name exists", function () {
//            expect(this.fieldsLecturer.tryToGetFields).toThrow();
//        });
//
//
//        it("should have the correct filename", function (done) {
//            var lectureName = setLectureNameInDOM("A lecture name");
//
//            this.saveLecturer.save();
//
//            var that = this;
//            setTimeout(function(){
//                expect(that.fs.saveBlobLocally).toHaveBeenCalledWith(jasmine.anything(), lectureName + ".txt");
//                done();
//            }, 5);  // waits for 5ms. Required as FileReader.onload is async and html fixture would be deleted
//
//            function setLectureNameInDOM(lectureName) {
//                $("#fieldLecturename").val(lectureName);
//                return lectureName;
//            }
//        }, 4000);
//    });
//});