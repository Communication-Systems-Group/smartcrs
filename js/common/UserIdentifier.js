define(['jquery'], function ($) {

    function UserIdentifier() {}

    UserIdentifier.prototype = {
        constructor: UserIdentifier,

        isLecturerRun: function() {
            return (typeof $("#lecturerRunID").val() != 'undefined');
        },

        isStudent: function() {
            return (typeof $("#studentID").val() != 'undefined');
        }
        
    }; // prototype
    
    return new UserIdentifier();
}); // requireJS define