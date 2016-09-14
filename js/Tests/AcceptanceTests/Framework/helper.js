/**
 * Created by Pascal on 12.02.2016.
 */

module.exports = {
    create: function (seleniumHelper) {
        return new Helper(seleniumHelper);
    }
};

function Helper(seleniumHelper) {
    this.sh = seleniumHelper;
}

Helper.prototype = {
    constructor: Helper,

    sendComment: function (seleniumHelper, text) {
        var textArea = seleniumHelper.findElementByCss(".textarea-wrapper .textarea");
        seleniumHelper.sendKeys(textArea, text);
        seleniumHelper.click(textArea);    // required to make send button visible
        return seleniumHelper.clickByCss(".send.save");
    },


    // requirejs (in the browser) doesn't have a sync require method
    // As a workaround, we require it here and then use it in the other function
    // TODO: is there a better way?
    preRequireJsScript: function (moduleName) {
        this.sh.executeScript(requireScript, moduleName);

        function requireScript() {
            require([arguments[0][0]]);
        }
    },

    getFileURLOfCommentId: function(commentId) {
        console.log("executeScript testing start");
        console.log(this.sh.driver.executeScript(function(){
            return $("#connectionstate");
        }));
        var that = this;
        return this.sh.wait(function(){
            return that.sh.executeScript(function(){
                console.log("In getFileUrlCommentId", arguments);
                console.log("In getFileUrlCommentId", arguments[0][0]);
                return $("li[data-id='" + arguments[0[0]] + "'] a[class='attachment']").attr("href");
            }, commentId);
        }, 50000);

    }
}; // prototype