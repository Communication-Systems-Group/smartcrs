/**
 * Created by Pascal on 21.06.2016.
 */

define(['jquery', 'popupWindow'], function ($, popupWindow) {

    function AnswerAcknowledger() {
        this.waitInMs = 10 * 1000;
        this.timeoutID = "";
        this.winDow = "";
    } // EOF class

    AnswerAcknowledger.prototype = {
        constructor: AnswerAcknowledger,

        waitForAck: function (winDow) {
            var that = this;
            this.winDow = winDow;
            
            this.timeoutID = setTimeout(function () {
                that.answerNotTransmitted();
            }, that.waitInMs)
        },

        answerWasAcknowledged: function() {
            clearTimeout(this.timeoutID);
            this.winDow.close();
            popupWindow(1000, "Answer submitted", "Your answer has been submitted. Thank you!", true);
        },

        answerNotTransmitted: function(winDow) {
            win = winDow || this.winDow;
            win.show();
            popupWindow(10000, "Transmission Error", "Error while sending your answer to the lecturer! Please save your answer and refresh the browser.", true);
        }
    }; // prototype

    return new AnswerAcknowledger();
}); // requireJS define