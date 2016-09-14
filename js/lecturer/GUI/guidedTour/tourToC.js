/**
 * Created by Pascal on 14.06.2016.
 */

define(['jquery', 'bootstrap-tour'], function ($, Tour) {

    function TourToC() {
        var that = this;

        this.tocEntries = {
            toc: {name: "ToC", order: 0},
            generalOverview: {name: "General Overview", order: 1},
            qCreation: {name: "Question Creation", order: 2},
            qHandling: {name: "Question Handling", order: 3},
            commentsAndFiles: {name: "Sharing Comments and Files", order: 4},
            studentComments: {name: "Student Comments and Notification Settings", order: 5},
            saving: {name: "Saving a Lecture", order: 6},
            startingLecture: {name: "Starting a Lecture", order: 7},
            connectedPeersTable: {name: "Connected Peers Table", order: 8, end: true}
        };

        this.tourName = this.tocEntries.commentsAndFiles.name;

        this.tour = new Tour({
            name: that.tourName.replace(/\s/g, ""), // next button doesn't work if name has whitespaces
            debug: true,
            storage: false,
            autoscroll: true,
            onShown: function (tour) {  // add ToC button
                $("h3.popover-title").append('<a href="#" class="tourStep pull-right">ToC</a>');
            },
            steps: [
                {
                    orphan: true,
                    title: "Welcome to SmartCRS",
                    content: 'This tour will provide you with an overview of the following topics:<br><br>' +
                    that.__generateToC() +
                    'You can click on ToC at the top right of this window to get back to this table of contents at any time',
                    onNext: function () {
                        require(['handleTourOrder'], function (handleTourOrder) {
                            handleTourOrder.startNextTour(that.tour, that.tourName);
                        });
                    }
                }
            ]
        });
    } // EOF class

    TourToC.prototype = {
        constructor: TourToC,

        startTourToC: function () {
            this.tour.init();
            this.tour.restart();
        },

        goToToCEntry: function (text) {
            var that = this;
            require(['tourOverview', 'tourQuestionCreation', 'tourQuestionsHandling', 'tourCommentsFiles', 'tourStudComments', 'tourSave', 'tourPeerTableMgr', 'tourStartingLecture'], function (overview, qCreationTour, qHandling, commentsFiles, studComments, tourSave, peerTable, startLecture) {
                text = text.trim();
                that.tour.end();

                switch (text) {
                    case that.tocEntries.toc.name:
                        that.tour.restart();
                        break;
                    case that.tocEntries.generalOverview.name:
                        overview.startOverviewTour();
                        break;
                    case that.tocEntries.qCreation.name:
                        qCreationTour.startQCreationTour();
                        break;
                    case that.tocEntries.qHandling.name:
                        qHandling.startTourQuestionsRunning();
                        break;
                    case that.tocEntries.commentsAndFiles.name:
                        commentsFiles.startCommentsFilesTour();
                        break;
                    case that.tocEntries.studentComments.name:
                        studComments.startTourStudComments();
                        break;
                    case that.tocEntries.saving.name:
                        tourSave.startTourSave();
                        break;
                    case that.tocEntries.startingLecture.name:
                        startLecture.startLectureTour();
                        break;
                    case that.tocEntries.connectedPeersTable.name:
                        peerTable.startTourPeerTableMgr();
                        break;
                    default:
                        console.error("Unknown switch argument in goToToCEntry():", text);
                }
            });
        },

        __generateToC: function () {
            var that = this;
            var finalString = "";
            Object.keys(this.tocEntries).forEach(function (key) {
                if (that.tocEntries[key].order !== 0) {
                    finalString += '<li><a href="#" class="tourStep">' + that.tocEntries[key].name + '</a></li>'
                }
            });
            return '<ul>' + finalString + '</ul><br>';
        }

    }; // prototype

    return new TourToC();
}); // requireJS define