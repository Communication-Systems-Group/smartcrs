/**
 * Created by Pascal on 25.06.2014.
 * Creates downloadable link from data in memory
 */
define(['jquery'], function ($) {
    function Fs() {

    } // EOF Class

    Fs.prototype = {
        constructor: Fs,

        saveBlobLocally: function (fileUrl, name) {

            if (!window.URL && window.webkitURL) {
                window.URL = window.webkitURL;
            }

            var a = document.createElement('a');
            a.download = name;
            a.setAttribute('href', fileUrl);

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

        },

        readFileAsBinaryStringAsync: function (file) {
            var defer = $.Deferred();
            var reader = new FileReader();

            reader.onload = function (event) {
                defer.resolve(reader.result);
            };
            reader.readAsBinaryString(file);
            return defer.promise();
        },

        readFileAsURLAsync: function (file) {
            var defer = $.Deferred();
            var reader = new FileReader();
            
            reader.onloadend = function (ev) {
                defer.resolve(reader.result);
            };
            
            reader.readAsDataURL(file);
            return defer.promise();
        },

        convertStringToURLAsync: function (string) {
            var blob = new Blob([string], {type: "text/plain"});
            return this.readFileAsURLAsync(blob);
        },

        convertObjectToURLAsync: function (dataObject) {
            var dataJson = JSON.stringify(dataObject);
            return this.convertStringToURLAsync(dataJson);
        },

        saveToDisk: function (message, filename, optExtension) {
            optExtension = optExtension || ".txt";
            this.saveBlobLocally(message, filename + optExtension);
        }
    };



    return new Fs();
}); // requireJs define