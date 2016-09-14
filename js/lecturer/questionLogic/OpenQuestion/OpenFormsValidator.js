/**
 * Created by Pascal on 08.05.2016.
 */

define(['jquery', 'FormsValidation'], function ($, FormsValidation) {

    function OpenFormsValidator() {
        $.extend(OpenFormsValidator.prototype, FormsValidation.__proto__);
    } // EOF class


    OpenFormsValidator.prototype = {
        constructor: OpenFormsValidator,

        validateForms: function () {
            return this.validateQuestion();
        }
        
    }; // prototype
    
    return new OpenFormsValidator();
}); // requireJS define