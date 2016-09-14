/**
 * Created by Pascal on 14.06.2016.
 */

define(['jquery', "tourToc", 'handleTourOrder'], function ($, tourToc, handleTourOrder) {

    function TourSave() {
        var that = this;
        this.tourName = tourToc.tocEntries.saving.name;
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
                    element: "#saveButtonLecturerRun",
                    title: "Saving Your Data",
                    content: "Click here to save all your questions and other settings.",
                    placement: "auto bottom",
                    reflex: true,
                    onNext: function () {
                        $("#saveButtonLecturerRun").click();
                    }
                },
                {
                    orphan: true,
                    title: "Save Settings",
                    content: "Enter a name for your lecture file.",
                    placement: "auto bottom",
                    onNext: function () {
                        var $filenameInput = $(".webix_el_text[view_id='savePopupFilename'] input");
                        if (!$filenameInput.val()) {
                            $filenameInput.val("aFilename");
                        }
                    }
                },
                {
                    element: ".webix_window[view_id='saveLectureWindow']",
                    title: "Save Settings",
                    content: "<strong>Questions</strong><br>" +
                    "Saves the questions that you've created.<br>" +
                    "<strong>Stats</strong><br>" +
                    "Stores students answers. A separate XLS file will be generated<br>" +
                    "<strong>Notification Settings</strong><br>" +
                    "Stores the notification settings<br>" +
                    "<strong>Comments & Files</strong><br>" +
                    "Stores all files that you have shared and any comments that have been exchanged.",
                    placement: "auto left"
                },
                {
                    orphan: true,
                    onShow: function () {
                        if ($(".webix_window[view_id='saveLectureWindow']").is(":visible")) {
                            $(".webix_el_button[view_id^='$button'] button").click();
                        }
                        handleTourOrder.startNextTour(that.tour, that.tourName);
                    }
                }
            ]
        });
    } // EOF class

    TourSave.prototype = {
        constructor: TourSave,

        startTourSave: function () {
            this.tour.init();
            this.tour.restart();
        }

    }; // prototype

    return new TourSave();
}); // requireJS define