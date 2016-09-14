define(['jquery', 'webRTCStudents', 'messageTypes', 'messageResponse', 'popupWindow', 'answerAcknowledger'], function ($, webRTCStudents, messageTypes, messageResponse, popupWindow, answerAcknowledger) {

    function ResponseLogic(question, answers, winDow) {

        var type = question.type;

        if (!answers.length) {
            popupWindow(2000, "No answer selected", "Please select an answer");
            winDow.show();
            return;
        }

        var response = new messageResponse(question.question, type, "", answers);
        var successful = webRTCStudents.sendMsg(response, messageTypes.response);
        if (!successful) {
            answerAcknowledger.answerNotTransmitted(winDow);
            return;
        }

        answerAcknowledger.waitForAck(winDow);

    } // EOF class
    return ResponseLogic;
}); // requireJS define