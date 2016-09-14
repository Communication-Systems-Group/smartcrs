/**
 * Created by Pascal on 02.03.2016.
 */

define(['jquery'], function ($) {

    function SliderCSS() {
    } // EOF class


    SliderCSS.prototype = {
        constructor: SliderCSS,
        
        getCssForThisWindow: function (thisWin) {
            return ".webix_view.webix_window[view_id='" + thisWin.winDow.config.id + "'] ";
        }
        
    }; // prototype
    
    return new SliderCSS();
}); // requireJS define