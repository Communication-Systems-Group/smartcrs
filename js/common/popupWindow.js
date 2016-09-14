define(['jquery', 'webix'], function ($) {

    /**
     * @param timeout if > 0 the window will disappear after timeout ms
     * @param headText
     * @param bodyText
     * @param isMovableOptional
     * @param isModalOptional
     * @param optionalHeight - default width = 400
     * @param optionalWidth - default height = 200

     */
    function popupWindow(timeout, headText, bodyText, isMovableOptional, isModalOptional, optionalWidth, optionalHeight) {
        var that = this;

        isMovableOptional = typeof isMovableOptional === "undefined";
        isModalOptional = typeof isModalOptional === "undefined";
        optionalWidth = optionalWidth ||400;
        optionalHeight = optionalHeight ||200;

        that.winDow = webix.ui({
            view: "popup",

            move: isMovableOptional,
            modal: isModalOptional,

            width: optionalWidth,
            height: optionalHeight,

            position: "center",

            zIndex: 9999,

            /**
             * Body
             */
            body: {
                rows: [
                    {
                        view: "template",
                        template: headText,
                        type: "header" }, // header row
                    {
                        view: "template",
                        template: bodyText

                    }
                ]},  // body

            on: {
                onShow: function () {

                    var that = this;
                    if (timeout) {
                        window.setTimeout(function () {
                            that.close();
                        }, timeout);
                    }
                }
            } // on
        });

        that.winDow.show();
        webix.event(that.winDow.$view, "click", function () {
            that.winDow.close();
        });

    } // EOF class

    return popupWindow;
}); // requireJS define