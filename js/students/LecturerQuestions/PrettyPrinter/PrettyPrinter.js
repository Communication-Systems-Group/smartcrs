/**
 * Created by Pascal on 19.05.2016.
 */

define(['jquery', 'handlebars', 'localStorage', 'fs', 'text!saveQuestionsTemplateCore', 'text!saveQuestionsTemplate'], function ($, Handlebars, localStorage, fs, htmlCore, htmlTemplate) {

    function PrettyPrinter() {
        var dateObj = new Date();
        var month = (+dateObj.getMonth()) + 1;
        var date = dateObj.getFullYear() + "-" + month + "-" + dateObj.getDate();
        this.filename = "SmartCRS_Questions-" + date;
        
    } // EOF class

    PrettyPrinter.prototype = {
        constructor: PrettyPrinter,
        
        prettyPrint: function () {
            var that = this;
            var theTemplateScript = $(htmlTemplate).find("#saveLecturerQuestionsTemplate").html();
            var theTemplate = Handlebars.compile(theTemplateScript);
            var context = localStorage.__getStoredQuestions();
            var qs = [];
            Object.keys(context).forEach(function(key){
                qs.push(context[key]);
            });
            var bodyContent = theTemplate(context);
            var finalHTML = htmlCore.replace("<body></body>", bodyContent);
            fs.convertStringToURLAsync(finalHTML).done(function (result) {
                fs.saveToDisk(result, that.filename, ".html");
            });

        }
        
    }; // prototype
    
    return new PrettyPrinter();
}); // requireJS define