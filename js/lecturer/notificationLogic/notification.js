/**
 * Created by Pascal on 21.07.2014.
 *
 * This class contains the functionallity for the notification settings of lecturerRun
 */


define(['AudioNotification', 'VisualNotification', 'settingsLoader', 'testLogger'], function (AudioNotification, VisualNotification, settingsLoader, testLogger) {

    function Notifications() {
        this.audioFile = settingsLoader.getNotificationSoundURL();
    } // EOF class

    Notifications.prototype = {
        constructor: Notifications,

        initNotification: function (notificationType, bodyText) {
            switch (notificationType) {
                case "Show Popup":
                    this.__startVisualNotification(bodyText);
                    break;
                case "Play Sound":
                    this.__startAudioNotification();
                    break;
                case "Play Sound & Show Popup":
                    this.__startAudioNotification();
                    this.__startVisualNotification(bodyText);
                    break;
                case "Don't notify me":
                    break;
                default:
                    console.error("Unknown notificationType");
            }
            testLogger.logForTesting("Notification Type: '" + notificationType + "' Comment: '" + bodyText + "'");
        },

        __startVisualNotification: function (bodyText) {
            new VisualNotification(bodyText).startNotification();
        },

        __startAudioNotification: function () {
            new AudioNotification(this.audioFile).startNotification();
        }
    };

    return new Notifications();
});   // define requireJs