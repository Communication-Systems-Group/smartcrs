/**
 * Created by Pascal on 11.09.2015.
 */
define(["TestHTMLConverter"], function (converter) {

    describe("Commenting functionality for lecturer", function () {
        beforeEach(function (done) {
            var that = this;
            jasmine.getFixtures().fixturesPath = 'base';
            converter.prepareAndLoadStrippedPageForTest('lecturerRun.html');

            require(['commentsLecturer'], function (comments) {
                that.comments = comments;
                done();
            });
        });

        it("lecturer should be able to post a message", function () {
            var dummyfunc = function(){};
            var result = this.comments.postComment("comment", dummyfunc, dummyfunc);
            expect(result).toBe(false);

        }, 100000);

    });
});