/**
 * Created by Pascal on 15.06.2016.
 */

define(['jquery', "tourToc", 'handleTourOrder'], function ($, tourToc, handleTourOrder) {

    function TourPeerTableMgr() {
        var that = this;
        this.tourName = tourToc.tocEntries.connectedPeersTable.name;
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
                    element: "#connectedPeers",
                    title: "Connected Students",
                    content: "This shows you the number of connected students.<br>" +
                    "Additionally, you can click on it to see more details.",
                    reflex: true,
                    placement: "auto right"
                },

                that.__getToNextStepAndEnsureWindowIsStillOpen(),

                {
                    orphan: true,
                    title: "Connected Students",
                    content: "This window shows you details about the connected students."
                },

                that.__getToNextStepAndEnsureWindowIsStillOpen(),

                {
                    element: '[view_id="peerTable"] .delete_button',
                    title: "Kick a Student",
                    content: "Click on this button to kick a student from your room. <br><br>" +
                    "Note that the student is not permanently banned from the room. He can refresh his browser to reconnect again.",
                    reflex: true,
                    onNext: function () {
                        var delButton = $('[view_id="peerTable"] .delete_button');
                        if (delButton.length) {
                            delButton.click();
                        }
                        setTimeout(function(){
                            if ($('[view_id="peerTable"]').is(":visible")) {
                                $$("peerTable").hide();
                            }
                        }, 2000)
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

    TourPeerTableMgr.prototype = {
        constructor: TourPeerTableMgr,

        startTourPeerTableMgr: function () {
            this.tour.init();
            this.tour.restart();
        },


        // required if user clicks on next with mouse because window will close on any click outside
        __getToNextStepAndEnsureWindowIsStillOpen: function() {
            var that = this;
            return {
                orphan: true,
                onShown: function() {
                    if (!$(".webix_dtable[view_id='peerTable']").is(":visible")) {
                        $("#connectedPeers").click();
                    }
                    require(['peerTableMgr'], function (peerTableMgr) {
                        that.__addPeerToTable(peerTableMgr);
                        that.tour.goTo(that.tour.getCurrentStep()+1);
                    });
                }
            };
        },

        __addPeerToTable: function(peerTableMgr) {
            var peerId = "12342";
            peerTableMgr.removePeer(peerId);
            peerTableMgr.add(peerId);
            peerTableMgr.addNicknameToUserid(peerId, "A Nickname");
            peerTableMgr.setConnectionStateForPeerId(peerId, "connected");
        }

    }; // prototype

    return new TourPeerTableMgr();
}); // requireJS define