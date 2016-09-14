/**
 * Required for intitialization.
 * Detects which website (lecturer.html, lecturerRun.html, students.html) has been loaded
 */

define(['jquery', 'questionManager', 'UserIdentifier', 'jqueryComments', 'bootstrap', 'webix'], function($, qMgr, ident){

    if (ident.isLecturerRun()) {
        startLecturerRun();
    }

    else if (ident.isStudent()) {
        startStudent();

    }

    function startLecturerRun() {
        require(['sliders', 'commentsLecturer', 'webRTCLecturer', 'stats', 'charts', 'buttonHandlers', 'bootstrap-toggle', 'questionsControlTable'], function (sliders) {
            sliders.Sliders();
        });
        $("#fileUpload").css('opacity', '0');
        $('[data-toggle="popover"]').popover(); // Notification Settings: init popover help texts
    }

    function startStudent() {
        require(['connectionManager', 'webRTCStudents', 'studentNickname', 'studentHandlers'], function(connectionManager){
            connectionManager.startConnectionManager();
        });
    }
}); // requireJs define