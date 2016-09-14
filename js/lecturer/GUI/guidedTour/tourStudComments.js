/**
 * Created by Pascal on 15.06.2016.
 */

define(['jquery', "tourToc", 'handleTourOrder'], function ($, tourToc, handleTourOrder) {

    function TourStudComments() {
        var that = this;
        this.tourName = tourToc.tocEntries.studentComments.name;
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
                    element: "#comments-container",
                    title: "On Comment from Student",
                    content: "We are now going to simulate an incoming comment from a student.<br><br>" +
                    "Note that the notification settings have been changed to:" +
                    "<ul><li>Play Sound & Show Popup</li> <li>Threshold: 0</li></ul>" +
                    "This results in an immediate notification alert whenever a student comment arrives.",
                    placement: "auto bottom",
                    onShow: function () {
                        $("#fieldThreshold").val("0");
                        $("#buttonNotification").val("Play Sound & Show Popup").change();
                        that.__generateComment();
                    }
                },
                {
                    element: "#notificationSettingsDropdown",
                    title: "On Comment from Student",
                    content: "Chances are that you don't want to be notified during a lecture just because one of your students sends a message. Hence, it makes sense to adapt the notification settings to your liking." +
                    "<br><br>Feel free to change the notification settings now. You can click on the following button to generate student comments and learn how they trigger the notification alerts.<br><br>" +
                    ' <label for="tourFieldThreshold">Number of Upvotes</label> <input type="number" value="0" min="0" max="100" id="tourFieldThreshold" class="form-control"> <button class="btn btn-primary" id="tourGenStudComment">Generate Student Comment</button>',
                    onShow: function () {
                        $("#notificationSettingsDropdown").click();
                        $("body").on("click", "#tourGenStudComment", function () {
                            var numUpvotes = $("#tourFieldThreshold").val();
                            that.__generateComment(numUpvotes);
                        });
                    },
                    placement: "auto right"
                },
                {
                    orphan: true,
                    onShow: function () {
                        if ($(".dropdown.navBarButtons.open").length) {
                            $("#notificationSettingsDropdown").click(); // close dropdown
                        }
                        handleTourOrder.startNextTour(that.tour, that.tourName);
                    }
                }
            ]
        });
    } // EOF class

    TourStudComments.prototype = {
        constructor: TourStudComments,

        startTourStudComments: function () {
            this.tour.init();
            this.tour.restart();
        },

        __generateComment: function (numVotes) {
            require(['commentsLecturer'], function (commentsLecturer) {
                numVotes = numVotes || 0;

                var comment = {
                    "id": "c" + Number($("#comments-container").find("li[data-id^='c']").length + 1),
                    "parent": null,
                    "created": new Date().toString(),
                    "content": "This is a student comment which received " + numVotes + " upvotes.",
                    "fullname": "aStudent",
                    "profilePictureURL": "",
                    "createdByCurrentUser": false,
                    "upvoteCount": numVotes,
                    "userHasUpvoted": false,
                    "nickname": "aStudent"
                };
                commentsLecturer.__addStudentComment(comment);
            });
        }

    }; // prototype

    return new TourStudComments();
}); // requireJS define