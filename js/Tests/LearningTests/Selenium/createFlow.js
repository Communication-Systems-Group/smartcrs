/**
 * Created by Pascal on 03.01.2016.
 */

describe("should ", function () {
    beforeEach(function () {
    });

    it("should ", function (done) {
        var webdriver = require('selenium-webdriver');

        var server = require("../../../../server");
        server.run();

         //var flows = workingExample(); // opens browsers simutaneously
        // var flows = halfWorkingExample();
         var flows = nonWorkingExample(); // opens browsers consecutively



        webdriver.promise.fullyResolved(flows).then(function () {
                console.log('All tests passed!');
                done();
        });

        function workingExample() {
            var terms = [
                'javascript',
                'selenium',
                'webdriver'
            ];

            var flows = terms.map(function (term) {
                return webdriver.promise.createFlow(function () {
                    var selenium = require("../Utilities/SeleniumFactory").create();
                    var sh = require("../Utilities/SeleniumHelper").create(selenium);

                    sh.get('http://www.google.com');
                    sh.findElementByName('q').sendKeys(term);
                    sh.findElementByName('btnG').click();
                    sh.getTextByCssAsync(".r", 5000).then(function (title) {
                        console.log(title);
                    });
                });
            });

            return flows;
        }

        function halfWorkingExample() {
            var terms = [
                'javascript',
                'selenium',
                'webdriver'
            ];

            var students = [];
            var studentClass = require('../Framework/Students/TestStudent');

            students.push(studentClass.createStudent(this.timeout, terms[0]));
            students.push(studentClass.createStudent(this.timeout, terms[1]));
            students.push(studentClass.createStudent(this.timeout, terms[2]));

            var flows = students.map(function (student) {
                return webdriver.promise.createFlow(function () {
                    student.sh.get('http://www.google.com');
                    student.sh.findElementByName('q').sendKeys(student.tempText);
                    student.sh.findElementByName('btnG').click();
                    student.sh.getTextByCssAsync(".r", 5000).then(function (title) {
                        console.log(title);
                    });
                });
            });

            return flows;
        }

        function nonWorkingExample() {
            var students = [];
            var studentClass = require('../Framework/Students/TestStudent');

            students.push(studentClass.createStudent(this.timeout));
            students.push(studentClass.createStudent(this.timeout));
            students.push(studentClass.createStudent(this.timeout));

            var flows = students.map(function (student) {
                //return webdriver.promise.createFlow(function () {
                    return student.launchWebsite();
                    // that.students[i].waitTillConnectedWithLecturer();
                //});
            });

            return flows;
        }
    }, 99999999);
});