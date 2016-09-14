/**
 * Created by Pascal on 10.05.2016.
 */

define(['jquery'], function ($) {

    function QuestionQueue() {
        this.queue = [];

    } // EOF class

    QuestionQueue.prototype = {
        constructor: QuestionQueue,
        
        addToQueue: function (question) {
            this.queue.push(question);
        },

        popFromQueue: function() {
            return this.queue.shift();
        }
        
    }; // prototype

    return new QuestionQueue();
}); // requireJS define