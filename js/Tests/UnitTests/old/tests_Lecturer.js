define(['jquery', 'tests_Lecturer_helper', 'QUnit', 'questionManager', 'mcTable', 'tableQuestionMain', 'testData', 'fileUploadTable', 'dataManager', 'webix'], function ($, helper, QUnit, qMgr, mcTable, mainTable, testData, fileUploadTable, dataManager) {

    // defining the clean up procedure for the tests
    module("testsForLecturer", {

        teardown: function () {
            // clean up after each test
            mcTable.table.clearAll();
            mainTable.table.clearAll();

        }
    });

    // containing all tests for lecturer.html
    function testsLecturer() {

        this.run = function () {

            test("mcQuestion creation", function () {

                var numOptions = 3;
                var mcQuestionOptions = helper.createMcOptions(numOptions);

                var question = "McQuestion #1";

                var mcQuestion = new qMgr.mcQuestion(question, mcQuestionOptions);

                strictEqual(mcQuestion.type, "mc", "mcQuestion has correct type");
                strictEqual(mcQuestion.question, question, "mcQuestion has correct question");
                deepEqual(mcQuestion.possibleAnswers, mcQuestionOptions, "mcQuestion has correct possibleAnswers");

            });

            test("scaleQuestion creation", function () {

                var num = 1;

                var scaleQ = helper.createScaleQuestion(num);

                for (var i = 0; i < num; ++i) {
                    strictEqual(scaleQ[i].type, "scale", "scaleQ has correct type");
                    strictEqual(scaleQ[i].question, "scaleQuestion#" + (i + 1), "scaleQ has correct question");
                    strictEqual(scaleQ[i].solution, "scaleAnswer#" + (i + 1), "scaleQ has correct answer");
                    strictEqual(scaleQ[i].scaleStart, (i + 1), "scaleQ has correct scaleStart");
                    strictEqual(scaleQ[i].scaleEnd, ((i + 1) * 10 ), "scaleQ has correct scaleEnd");
                    strictEqual(scaleQ[i].scaleStep, (i + 1), "scaleQ has correct scaleStep");

                }

            });

            test("openQuestion creation", function () {

                var num = 1;
                var openQ = helper.createMCQuestion(num);

                for (var i = 0; i < num; ++i) {
                    strictEqual(openQ[i].type, "open", "openQ has correct type");
                    strictEqual(openQ[i].question, "openQuestion#" + (i + 1), "openQ has correct question");
                    strictEqual(openQ[i].solution, "openAnswer#" + (i + 1), "openQ has correct answer");
                }
            });

            test("Add questions to mcTable", function () {

                var num = 5;

                helper.addOptionsToMcTable(num);

                var mcQuestion = mcTable.table.serialize();
                strictEqual(mcQuestion.length, num, "Adding mcQuestion to mcTable");

            });

            test("Remove questions from mcTable", function () {

                var num = 3;
                var ids = [];

                helper.addOptionsToMcTable(num);

                for (var i = 0; i < num; ++i) {

                    ids.push(mcTable.table.getIdByIndex(i));
                }

                for (var i = 0; i < num; ++i) {

                    mcTable.table.remove(ids[i]);
                }

                strictEqual(mcTable.table.count(), 0, "Removing mcQuestion from mcTable");

            });

            test("Adding questions to main table", function () {

                var num = 5;

                var openQ = helper.createMCQuestion(num);
                var scaleQ = helper.createScaleQuestion(num);
                var mcQ = helper.createMcQuestions(num, helper.createMcOptions(5));

                for (var i = 0; i < num; ++i) {

                    mainTable.add(openQ[i]);
                    mainTable.add(scaleQ[i]);
                    mainTable.add(mcQ[i]);

                }

                strictEqual(mainTable.table.data.count(), num * 3, num * 3 + " questions successfully added to main table");

            });

            test("Removing questions from main table", function () {

                var num = 5;

                var openQ = helper.createMCQuestion(num);
                var scaleQ = helper.createScaleQuestion(num);
                var mcQ = helper.createMcQuestions(num, helper.createMcOptions(5));

                for (var i = 0; i < num; ++i) {

                    mainTable.add(openQ[i]);
                    mainTable.add(scaleQ[i]);
                    mainTable.add(mcQ[i]);

                }

                for (var i = 0; i < num * 3; ++i) {
                    var id = mainTable.table.getFirstId();
                    mainTable.table.remove(id);
                }

                strictEqual(mainTable.table.count(), 0, num * 3 + " questions successfully removed from main table");

            });

            test("Saving Settings", function () {

                var num = 1;

                // 1. adding files to mainTable
                var openQ = helper.createMCQuestion(num);
                var scaleQ = helper.createScaleQuestion(num);
                var mcQ = helper.createMcQuestions(num, helper.createMcOptions(5));

                for (var i = 0; i < num; ++i) {

                    mainTable.add(openQ[i]);
                    mainTable.add(scaleQ[i]);
                    mainTable.add(mcQ[i]);

                }

                // 2. adding files to uploadTable
                fileUploadTable.add(testData.files[0]);


                // 3. notification settings
                $("#fieldThreshold").text(100);
                $("#selAbsPercent").val("Absolute");
                var notificationType = $('.dropdown-toggle').text().trim();



                // 4. setting lecturename/filename
                $("#fieldLecturename").val("testFile.txt");
                var t = $("#fieldLecturename").val();
                dataManager.saveLecturerSettings();

                QUnit.expect(0);
                //strictEqual(mainTable.table.count(), 0, num * 3 + " questions successfully removed from main table");

            });

        };
        // this.run

    }// EOF class

    return new testsLecturer();
});
// requireJs define