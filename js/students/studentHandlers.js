/**
 * Created by Pascal on 28.02.2016.
 */

define(['jquery', 'saveStudentData'], function ($, saveData) {

    function StudentHandlers() {

    } // EOF class
    
    $("#saveDataButton").click(function(){
        saveData.saveQuestions();
    });


    $('#connectionEvents').on('connectionEvent', function(event, response) {
        require(['selectRoomWindow'], function(selectRoomWindow){
            selectRoomWindow.handleConnectResponse(response);
        });
    });

    return new StudentHandlers();
}); // requireJS define