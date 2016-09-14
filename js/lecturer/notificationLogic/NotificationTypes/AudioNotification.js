define([], function () {

    function AudioNotification(audioTitle) {
        this.audioTitle = audioTitle;
        this.audioElement = document.createElement('audio');
        this.audioElement.setAttribute('src', this.audioTitle);
        this.audioElement.load();
    } // EOF class

    AudioNotification.prototype = {
        constructor: AudioNotification,

        startNotification: function () {
            this.audioElement.load();
            this.audioElement.play();
        }

    }; // prototype

    return AudioNotification;
}); // requireJS define