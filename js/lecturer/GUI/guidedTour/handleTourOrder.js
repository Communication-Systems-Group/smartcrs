/**
 * Created by Pascal on 15.06.2016.
 */

define(['jquery', 'tourToc'], function ($, tourToc) {

    function HandleTourOrder() {

    } // EOF class

    HandleTourOrder.prototype = {
        constructor: HandleTourOrder,

        startNextTour: function (oldTour, oldTourName) {
            oldTour.end();

            var newOrderNum = this.__findNextOrderNumByName(oldTourName);
            var nextTourName = "";
            if (newOrderNum === -1) {
                nextTourName = this.__findTocEntryWithOrderNum(0).name;
            } else {
                nextTourName = this.__findTocEntryWithOrderNum(newOrderNum).name;
            }

            this.__showTourCompleted(oldTourName, nextTourName);
        },

        __findTocEntryWithOrderNum: function (orderNum) {
            var newEntry;
            Object.keys(tourToc.tocEntries).forEach(function (entry) {
                if (tourToc.tocEntries[entry].order === orderNum) {
                    newEntry = tourToc.tocEntries[entry];
                }
            });
            return newEntry;
        },

        __findNextOrderNumByName: function (name) {
            var foundEntry;
            Object.keys(tourToc.tocEntries).forEach(function (entry) {
                if (tourToc.tocEntries[entry].name === name) {
                    foundEntry = tourToc.tocEntries[entry];
                }
            });

            if (foundEntry.hasOwnProperty("end")) {
                return -1;
            } else {
                return foundEntry.order + 1;
            }
        },

        __showTourCompleted: function (oldTourName, nextTourName) {
            var tour = new Tour({
                name: "TourSuccess" + Number(Math.floor(Math.random() * 100)),  // there might be several of these windows open
                debug: true,
                storage: false,
                autoscroll: true,
                onShown: function (tour) {
                    $("h3.popover-title").append('<a href="#" class="tourStep pull-right">ToC</a>');
                },
                steps: [
                    {
                        orphan: true,
                        content: "Congratulations, you completed the <strong>" + oldTourName + "</strong> tour!</br></br>" +
                        "Click next to continue with the <strong>" + nextTourName + "</strong> tour.",
                        title: oldTourName + " completed",
                        onNext: function () {
                            tourToc.goToToCEntry(nextTourName);
                        }
                    },
                    {
                        orphan: true
                    }
                ]
            });
            tour.init();
            tour.restart();
        }
    }; // prototype

    return new HandleTourOrder();
}); // requireJS define