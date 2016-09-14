/**
 * Created by Pascal on 07.06.2016.
 */

define(['jquery', 'bootstrap-tour', 'tourToc', 'handleTourOrder'], function ($, Tour, tourToc, handleTourOrder) {

    function TourGuide() {
        var that = this;
        this.tourName = tourToc.tocEntries.generalOverview.name;
        this.tour = new Tour({
            name: that.tourName.replace(/\s/g, ""), // next button doesn't work if name has whitespaces
            debug: true,
            storage: false,
            autoscroll: true,
            onShown: function (tour) {
                // add ToC button
                $("h3.popover-title").append('<a href="#" class="tourStep pull-right">ToC</a>');
            },
            steps: [
                {
                    element: "#qTablePanel",
                    title: "Creating Questions",
                    content: "This is the main table that will contain all the questions that you create.",
                    placement: "auto bottom",
                    backdrop: true,
                    backdropPadding: 50
                },
                {
                    element: "#comments-container",
                    title: "Comments",
                    content: "Here you can send messages and files to your students.",
                    placement: "auto bottom",
                    backdrop: true,
                    backdropPadding: 80
                },
                {
                    element: "#notificationSettingsDropdown",
                    title: "Notification Settings",
                    content: "Your students can send you questions during the lecture. In this section you can define the number of students that must upvote a question until you are notified.",
                    placement: "auto bottom"
                },
                {
                    element: "#connectButton",
                    title: "Connect to your students",
                    content: "At the beginning of each lecture you must create a room where your students can join you.",
                    placement: "auto bottom"
                },
                {
                    orphan: true,
                    onShow: function () {
                        handleTourOrder.startNextTour(that.tour, that.tourName);
                    }
                }
            ]
        });
    } // EOF class

    TourGuide.prototype = {
        constructor: TourGuide,

        startOverviewTour: function () {
            this.tour.init();
            this.tour.restart();
        }

    }; // prototype

    return new TourGuide();
}); // requireJS define