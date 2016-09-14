/**
 * Created by Pascal on 13.06.2016.
 */

define(['jquery', 'bootstrap-tour', 'tourToc', 'handleTourOrder'], function ($, Tour, tourToc, handleTourOrder) {

    function TourQuestionCreation() {
        var that = this;

        this.delay = 500;
        this.tourName = tourToc.tocEntries.qCreation.name;
        this.tour = new Tour({
            name: that.tourName.replace(/\s/g, ""), // next button doesn't work if name has whitespaces
            debug: true,
            storage: false,
            autoscroll: true,
            onShown: function (tour) {
                $("h3.popover-title").append('<a href="#" class="tourStep pull-right">ToC</a>');
            },
            steps: [
                {
                    element: "#buttonAddNewQuestion",
                    title: "Creating New Questions",
                    content: "Click on this button to create a new question.",
                    placement: "auto bottom",
                    backdrop: true,
                    backdropPadding: 20,
                    reflex: true,
                    onNext: function () {
                        that.switchToQType("#qMc");
                    }
                },

                that.__getQuestionInputStep("This is a MC Question", function () {
                    if (that.isModalShown()) {
                        $("#buttonModalClose").click();
                    }
                }),

                {
                    element: ".inactive-mcOption:first",
                    title: "Adding a Posibble Answer",
                    content: "Click on the greyed-out textarea to add a possible answer to your question",
                    placement: "auto bottom",
                    reflex: true,
                    onNext: function () {
                        if (!$(".active-mcOption").length) {
                            require(['McForms'], function (mcForms) {
                                mcForms.focusOnInactiveMcOption($(".inactive-mcOption:last"));
                                $(".active-mcOption:last textarea").text("This is a possible answer");
                                mcForms.focusOnInactiveMcOption($(".inactive-mcOption:last"));
                                $(".active-mcOption:last textarea").text("This is another possible answer");
                            });
                        }
                    }
                },
                {
                    element: ".mcTrueFalseToggle:first",
                    title: "Defining the Correct Answers",
                    content: "You must define at least one question to be true. This allows the system to automatically evaluate statistics during the lecture.",
                    placement: "auto bottom",
                    onNext: function () {
                        if (!$(".mcTrueFalseToggle button[name='trueOption'].active").length) {
                            $("button[name='trueOption']:first").click();
                        }
                    }
                },
                {
                    element: ".removeMcOptionButton:first",
                    title: "Removing an Answer",
                    content: "Use the red cross to delete any option that you don't want anymore.",
                    placement: "auto bottom"
                },
                this.stepAddQToMainTable(),
                {
                    orphan: true,
                    title: "Saving a Question",
                    content: "The question has been stored in the main question table. You can now continue to add more questions.",
                    placement: "auto top"
                },
                {
                    element: "#qScale",
                    title: "Adding a Rating Question",
                    content: "Let's Add a Rating Question next.",
                    placement: "auto bottom",
                    reflex: true,
                    onNext: function () {
                        that.switchToQType("#qScale");
                    }
                },

                that.__getQuestionInputStep("This is a Rating Question", function () {
                    if (that.isModalShown()) {
                        that.switchToQType("#qMc");
                    }
                }),

                {
                    element: "#inputScaleSolution",
                    title: "Adding an Optional Solution",
                    content: "If there is a solution to you answer it can be shown in the stats graph during the lecture. Note that this is optional.",
                    placement: "auto bottom"
                },
                {
                    element: "#sliderDiv",
                    title: "Preview of the Slider",
                    content: "This is the slider that the students will use to answer your question.<br>" +
                    "Depending on the values you type in the fields above this slider will behave differently.",
                    placement: "auto bottom"
                },
                {
                    element: "#formGroupScales",
                    title: "Defining the End Points of Your Scale & its Step Size",
                    content: "You can define where the starting and point of the slider should be. Additionally, the step size can be defined here.",
                    placement: "auto bottom"
                },
                this.stepAddQToMainTable(),
                {
                    element: "#qOpen",
                    title: "Creating an Open Question",
                    content: "Last but not least, let's create an open question.",
                    placement: "auto bottom",
                    reflex: true,
                    onNext: function () {
                        that.switchToQType("#qOpen");
                    }
                },

                that.__getQuestionInputStep("This is an Open Question", function () {
                    if (that.isModalShown()) {
                        that.switchToQType("#qScale");
                    }
                }),

                {
                    element: "#textareaOpenSolution",
                    title: "Adding an Optional Solution",
                    content: "In case your question has a single correct answer you can have it displayed in the stats graph during the lecture.",
                    placement: "auto bottom"
                },
                this.stepAddQToMainTable(),
                {
                    orphan: true,
                    onShow: function () {
                        if (that.isModalShown()) {
                            $("#buttonModalClose").click();
                            setTimeout(function () {
                                if ($(".webix_popup_title").is(":contains('Discard Question?')")) {
                                    $(".webix_modal_box.webix_alert .webix_popup_button").eq(0).click();
                                }
                            }, 300);
                        }
                        handleTourOrder.startNextTour(that.tour, that.tourName);
                    }
                }
            ]
        });
    } // EOF class

    TourQuestionCreation.prototype = {
        constructor: TourQuestionCreation,

        switchToQType: function (qTypeId) {
            if (!this.isModalShown()) {
                $("#buttonAddNewQuestion").click();
            }
            $(qTypeId).click();
        },

        isModalShown: function () {
            return ($("#modalCreateQuestion").data('bs.modal') || {}).isShown;
        },

        stepAddQToMainTable: function () {
            return {
                element: "#buttonAddQuestionToMainTable",
                title: "Saving a Question",
                content: "Click here to save the question now.",
                placement: "auto top",
                reflex: true,
                delay: this.delay / 2,
                onNext: function () {
                    if (!$("#questionAddedAlert").is(":visible")) {
                        $("#buttonAddQuestionToMainTable").click();
                    }
                }

            };
        },

        __getQuestionInputStep: function (text, onPrev) {
            return {
                element: "#textareaQuestion",
                title: "Type in Your Question",
                content: "This question will be shown to the students.",
                placement: "auto top",
                delay: this.delay,
                onNext: function () {
                    var $textareaQuestion = $("#textareaQuestion");
                    if (!$textareaQuestion.val()) {
                        $textareaQuestion.val(text);
                    }
                },
                onPrev: onPrev
            }
        },

        startQCreationTour: function () {
            this.tour.init();
            this.tour.restart();
        }

    }; // prototype

    return new TourQuestionCreation();
}); // requireJS define