/**
 * Created by Pascal on 18.03.2016.
 */

define(['jquery', 'fs'], function ($, fs) {

    function SaveData() {

    } // EOF class

    SaveData.prototype = {
        constructor: SaveData,

        __injectCssIntoHTML: function (html) {
            var rules = [];
            $.each(document.styleSheets, function (sheetIndex, sheet) {
                $.each(sheet.cssRules || sheet.rules, function (ruleIndex, rule) {
                    rules.push(rule.cssText);
                });
            });
            var style = $('<style>' + rules.join(" ") + '</style>');
            var $head = $(html).find("head");
            $head.append(style);
        },

        saveQuestions: function() {
            require(['PrettyPrinter'], function(prettyPrinter) {
                prettyPrinter.prettyPrint();
            });
        },
        
        saveComments: function () {
            var html = $("html").clone();
            var commentsContainer = $(html).find("#comments-container");
            html.html("");
            html.find("body").append(commentsContainer);
            this.__injectCssIntoHTML(html);

            $(html).find(".commenting-field.main").remove();
            $(html).find(".navigation").remove();
            $(html).find(".action.reply").each(function (i, reply) {
                reply.remove();
            });
            $(html).find(".separator").each(function (i, separator) {
                separator.remove();
            });

            $(html).find(".fa.fa-user.profile-picture").each(function(i, profile) {
                profile.remove();
            });

            $(html).find(".fa.fa-thumbs-up").each(function(i, thumbsup) {
                thumbsup.remove();
            });

            var h = html.get(0).innerHTML;
            fs.convertStringToURLAsync(h).done(function (result) {
                fs.saveToDisk(result, Date(), ".html");
            });
        }

    }; // prototype

    return new SaveData();
}); // requireJS define