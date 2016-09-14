/**
 * Created by Pascal on 14.06.2016.
 */

define(['jquery', "tourToc", 'handleTourOrder'], function ($, tourToc, handleTourOrder) {

    function TourStartingLecture() {
        var that = this;
        this.tourName = tourToc.tocEntries.startingLecture.name;
        var delay = 500;
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
                    element: "#connectButton",
                    title: "Starting a Lecture",
                    content: "Click here to start the lecture",
                    reflex: true,
                    onNext: function () {
                        setTimeout(function () {
                            if (!that.__connectWindowIsVisible()) {
                                $("#connectButton").click();
                            }
                        }, delay / 2);
                    }
                },
                {
                    element: '.webix_view.webix_window [view_id="createRoomForm"]',
                    placement: "auto right",
                    content: "<strong>Room Name</strong><br>" +
                    "The students will see a list of available room names. Make sure your room name is self-explanatory.<br>" +
                    "<strong>Admin Password</strong><br>" +
                    "This password ensures that no one else can join your room with admin rights.<br>" +
                    "<strong>Room Password</strong><br>" +
                    "Use this if you want to make sure that only students who know the room password can join your room.<br><br>" +
                    "Click create to continue.",
                    delay: 500,
                    backdrop: true,
                    reflex: true,
                    reflexElement: 'button.webixtype_form',
                    onShown: function () {
                        $(".popover").css("z-index", 9999);
                    },
                    onNext: function () {

                        var $submitButton = $("button.webixtype_form");
                        if ($submitButton.is(":visible")) {
                            var roomInput = $('[view_id="roomName"] input');
                            if (!roomInput.val()) {
                                roomInput.val("someRoomName");
                            }
                            var adminInput = $('[view_id="adminPwdInput"] input');
                            if (!adminInput.val()) {
                                adminInput.val("someRoomName");
                            }
                            $submitButton.click();
                        }
                    },

                    onPrev: function () {
                        if (that.__connectWindowIsVisible()) {
                            $("button.webixtype_base").click();
                        }
                    }
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

    TourStartingLecture.prototype = {
        constructor: TourStartingLecture,

        startLectureTour: function () {
            this.tour.init();
            this.tour.restart();
        },

        __connectWindowIsVisible: function () {
            return $('[view_id="roomName"]').is(":visible");
        }

    }; // prototype

    return new TourStartingLecture();
}); // requireJS define