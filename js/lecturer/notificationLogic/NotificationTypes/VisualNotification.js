define([], function () {

    /**
     *
     * Window & Tab blinks on new message
     */
    function VisualNotification(bodyText) {
        this.headerText = "New Message From Student";
        this.bodyText = bodyText;

    } // EOF class

    VisualNotification.prototype = {
        constructor: VisualNotification,

        startNotification: function() {
          if (!this.__isSupported()) {
              alert("This browser does not support desktop notification");
              return;
          }
            
            this.__getPermissionAndShow();
        },

        __getPermissionAndShow: function() {
            var that = this;

            if (Notification.permission === "granted") {
                // If it's okay let's create a notification
                that.__showNotification();
            }
            else {
                Notification.requestPermission(function (permission) {
                    // If the user accepts, let's create a notification
                    if (permission === "granted") {
                        that.__showNotification();
                    }
                });
            }
        },
        
        requestPermissionIfNecessary: function() {
            if (Notification.permission !== "granted") {
                Notification.requestPermission(function(permission){
                    console.log(permission);
                });
            }
        },

        __isSupported: function() {
            return ("Notification" in window);
        },

        __showNotification: function () {
            new Notification(this.headerText, {
                body: this.bodyText
            });
        }

    }; // prototype

    return VisualNotification;
}); // requireJS define