/**
 * Created by Pascal on 17.05.2016.
 */

define(['jquery'], function ($) {

    function TestLogger() {

    } // EOF class


    TestLogger.prototype = {
        constructor: TestLogger,
        
        logForTesting: function (data) {
            var $testDiv = $("#testDiv");
            if ($testDiv.length) {
                $testDiv.append(data);
            }
        }
        
    }; // prototype

    return new TestLogger();
}); // requireJS define