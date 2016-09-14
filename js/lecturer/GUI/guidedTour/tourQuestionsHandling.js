/**
 * Created by Pascal on 14.06.2016.
 */

define(['jquery', "tourToc", 'handleTourOrder'], function ($, tourToc, handleTourOrder) {

    function TourQuestionsHandling() {
        var that = this;
        var delay = 500;
        this.tourName = tourToc.tocEntries.qHandling.name;
        this.tour = new Tour({
            name: that.tourName.replace(/\s/g, ""), // next button doesn't work if name has whitespaces
            storage: false,
            autoscroll: true,
            onShown: function (tour) {
                $("h3.popover-title").append('<a href="#" class="tourStep pull-right">ToC</a>');
            },
            debug: true,
            steps: [
                {
                    element: "#qTablePanel",
                    title: "Questions Handling",
                    content: "This table contains all the questions that you've created so far.",
                    placement: "auto bottom",
                    backdrop: true,
                    backdropPadding: 50
                },
                {
                    element: ".shareButtonFunc:last",
                    title: "Sharing a Question",
                    content: "Click here to share this question with your students.<br><br>" +
                    "Note: If you aren't connected to your students yet, the questions will be shared as soon as you have created a room by clicking on 'Start Lecture'.",
                    reflex: true,
                    onNext: function () {
                        var $shareButton = $(".shareButtonFunc:last");
                        if (!$shareButton.is(":disabled")) {
                            $shareButton.click();
                        }
                    },
                    placement: "auto bottom"
                },
                {
                    element: ".votesPerStudentColumn:last",
                    title: "Question has been shared.",
                    content: "This field indicates that your question has been shared.<br>" +
                    "It displays the number of votes received / total students connected.",
                    delay: 200,
                    placement: "auto bottom"
                },
                {
                    element: ".statsButton:last",
                    title: "Question Stats",
                    content: "Click here to see the answers of your students to this question.<br><br>" +
                    "Note: For the purpose of this tour some dummy answers have been created.",
                    onShow: function () {
                        that.__createDummyStats();
                    },
                    reflex: true,
                    onNext: function () {
                        if (!$(".webix_window[view_id='chartsWindow']").length) {
                            $(".statsButton:last").click();
                        }
                    },
                    placement: "auto bottom"
                },
                {
                    element: ".webix_window[view_id='chartsWindow'] [view_id^='$label']",
                    content: "This shows you the question.",
                    placement: "auto bottom",
                    delay: delay
                },
                {
                    element: ".webix_window[view_id='chartsWindow'] [view_id^='$checkbox']",
                    content: "Click here to highlight the solution during the lecture.",
                    placement: "auto bottom"
                },
                {
                    element: ".webix_window[view_id='chartsWindow'] select",
                    content: "There are many different views for you to select from.",
                    placement: "auto bottom"
                },
                {
                    element: ".webix_window[view_id='chartsWindow'] button",
                    content: "Click this button to close the window again.",
                    placement: "auto bottom",
                    onNext: function () {
                        if ($(".webix_window[view_id='chartsWindow']").is(":visible")) {
                            $(".webix_window[view_id='chartsWindow'] button").click();
                        }
                    }
                },
                {
                    orphan: true,
                    onShow: function () {
                        handleTourOrder.startNextTour(that.tour, that.tourName);
                    }
                }
            ],
            onShow: function () {
                that.__addDummyQuestion();
            }
        });
    } // EOF class

    TourQuestionsHandling.prototype = {
        constructor: TourQuestionsHandling,

        startTourQuestionsRunning: function () {
            this.tour.init();
            this.tour.restart();
        },

        __addDummyQuestion: function () {
            require(['McQuestion', 'questionsControlTable'], function (mcQ, qControlTable) {
                var questionMC = mcQ.createMcQuestion("This is a McQuestion", [{
                    answer: "That's right",
                    correct: true
                }, {answer: "I don't know", correct: false}]);
                qControlTable.add(questionMC);
            });
        },
        __createDummyStats: function () {
            require(['stats'], function (stats) {
                stats.addResponse({
                    "questionID": "This is a McQuestion",
                    "questionType": "Mc",
                    "peerID": "stud1",
                    "answerIDs": ["That's right"]
                });
                stats.addResponse({
                    "questionID": "This is a McQuestion",
                    "questionType": "Mc",
                    "peerID": "stud2",
                    "answerIDs": ["That's right"]
                });
                stats.addResponse({
                    "questionID": "This is a McQuestion",
                    "questionType": "Mc",
                    "peerID": "stud3",
                    "answerIDs": ["That's right"]
                });
                stats.addResponse({
                    "questionID": "This is a McQuestion",
                    "questionType": "Mc",
                    "peerID": "stud4",
                    "answerIDs": ["That's right"]
                });
                stats.addResponse({
                    "questionID": "This is a McQuestion",
                    "questionType": "Mc",
                    "peerID": "stud5",
                    "answerIDs": ["I don't know"]
                });
            });
        }

    }; // prototype

    return new TourQuestionsHandling();
}); // requireJS define