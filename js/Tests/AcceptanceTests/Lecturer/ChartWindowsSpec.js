///**
// * Created by Pascal on 01.09.2015.
// */
//
//
//var consts = require('../Utilities/Constants').create();
//
//xdescribe("Stats window tests", function () {
//    beforeEach(function () {
//        this.selenium = require('../Utilities/SeleniumFactory').create(1000);
//        this.helper = require('../Utilities/HelperQuestionTest').createHelper(this.selenium);
//    });
//
//    it("should show the correct header", function (done) {
//        var that = this;
//        that.done = done;
//        that.selenium.driver.get(consts.websiteLecturerRun);
//        that.selenium.driver.findElement(that.selenium.By.className("webix_datatable_overlay")); // sometimes the page won't load completely
//
//        that.helper.loadLectureData("ThreeQTypes_1File_Thresh25_Sound_Percent");
//        that.helper.injectStudAnswer();
//
//        that.selenium.driver.findElements(that.selenium.By.className("webix_el_htmlbutton")).then(function (buttonParents) {
//            buttonParents.forEach(assertChartWindowTitles, that);
//            });
//
//        }, consts.Timeout2Min * 5);
//
//    function assertChartWindowTitles(button, index, array) {
//        var that = this;
//        var titles = ["WebRTC...",
//            "Please rate this performance:\n1 = Very poor, 10 = Excellent".replace("\n", " "),
//            "1. What did you like about this car?\n2. Can it get any better?".replace("\n", " ")];
//
//        button.click().then(function() {
//            that.helper.getWindowHeaderText().then(function (title) {
//                expect(title).toBe(titles[index]);
//                if (index === array.length-1){
//                    that.selenium.driver.quit();
//                    that.done();
//                }
//            });
//        });
//    }
//    });