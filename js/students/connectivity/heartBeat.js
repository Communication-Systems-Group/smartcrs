/**
 * Created by Pascal on 18.04.2016.
 */

define(['messageTypes'], function (msgTypes) {

    function HeartBeat() {
        this.intervalId = "";
        this.intervalInMs = 5000;
        this.stats = {};
    } // EOF class


    HeartBeat.prototype = {
        constructor: HeartBeat,
        
        startSendingHeartBeat: function () {
            var that = this;
            require(['webRTCStudents'], function(webRTCStudents){
                if (!that.intervalId) {
                    that.intervalId = setInterval(function(){
                        var millisecondsSince1970 = new Date().getTime();
                        webRTCStudents.sendMsg(millisecondsSince1970, msgTypes.ping);
                    }, that.intervalInMs);
                }
            });
        },

        receivePong: function(milisecondsSince1970) {
            var currentMili = new Date().getTime();
            var diff = currentMili - milisecondsSince1970;
            var initialDate = new Date(milisecondsSince1970);
            var key = initialDate.getHours() + ":" + initialDate.getMinutes() + ":" + initialDate.getSeconds();
            this.stats[key] = diff;
        }
        
    }; // prototype
    
    return new HeartBeat();
}); // requireJS define