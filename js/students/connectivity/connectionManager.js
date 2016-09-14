/**
 * Created by Pascal on 13.04.2016.
 */

define(['jquery', 'webix', 'localStorage'], function ($, webix, localStorage) {

    function ConnectionManager() {
        this.reconnectionWindowInMins = 300;
    } // EOF class

    ConnectionManager.prototype = {
        constructor: ConnectionManager,


        startConnectionManager: function () {
            var that = this;
            require(['selectRoomWindow'], function (selectRoomWindow) {

                if (!localStorage.isLocalStorageSupported()) {
                    webix.message("Your browser does not support localStorage", "error");
                    console.error("Your browser does not support localStorage");
                    return;
                }

                var lastConnectionJSON = localStorage.getLastConnectionJSON();
                if (!lastConnectionJSON) {
                    selectRoomWindow.show();
                    return;
                }

                var lastConnection = JSON.parse(lastConnectionJSON);
                if (that.__isLastConnectionStillValid(lastConnection.date)) {
                    selectRoomWindow.reconnect(lastConnection);
                } else {
                    localStorage.resetAnsweredQuestions();
                    selectRoomWindow.show();
                }
            });

        },

        __isLastConnectionStillValid: function (dateString) {
            var lastDate = new Date(dateString);
            var lastMinutes = lastDate.getTime() / (60 * 1000);
            var currentMinutes = new Date().getTime() / (60 * 1000);
            return (currentMinutes - lastMinutes) <= this.reconnectionWindowInMins;
        }

    }; // prototype

    return new ConnectionManager();
}); // requireJS define