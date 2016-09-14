/**
 * Created by Pascal on 15.06.2016.
 */

define(['jquery', "tourToc", 'handleTourOrder'], function ($, tourToc, handleTourOrder) {

    function TourCommentsFiles() {
        var that = this;
        this.tourName = tourToc.tocEntries.commentsAndFiles.name;
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
                    title: "Comments and Files",
                    content: "Here you can send messages and files to your students.<br>" +
                    "At the same time, this is where comments from your students appear.",
                    placement: "auto bottom",
                    backdrop: true,
                    backdropPadding: 80
                },
                {
                    element: "#comments-container .textarea-wrapper",
                    title: "Comments and Files",
                    content: "It is possible to send comments, URLs and files with this interface.",
                    placement: "auto bottom"
                },
                {
                    element: "#comments-container .textarea-wrapper .send.save",
                    title: "Comments and Files",
                    content: "Click here or hit CTRL+ENTER while in the above textarea to send your message.",
                    placement: "auto bottom"
                },
                {
                    element: "#comments-container .textarea-wrapper .enabled.upload",
                    title: "Sending a File",
                    content: "There are two ways to send a file to your students:<br>" +
                    "<ul><li>Drag and drop a file to the textarea above.</li>" +
                    "<li>Click on the textarea and then click on this button to open a file dialog</li></ul>",
                    placement: "auto bottom",
                    onShow: function () {
                        $("#comments-container").find(".textarea-wrapper .textarea").click();
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

    TourCommentsFiles.prototype = {
        constructor: TourCommentsFiles,

        startCommentsFilesTour: function () {
            this.tour.init();
            this.tour.restart();
        }

    }; // prototype

    return new TourCommentsFiles();
}); // requireJS define