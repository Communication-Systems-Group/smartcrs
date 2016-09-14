/**
 * Created by Pascal on 04.07.2014.
 */

define(["jquery"], function ($) {

    function MessageResponse(questionID, questionType, peerID, answerIDs) {

        this.questionID = questionID;
        this.questionType = questionType;
        this.peerID = peerID;
        this.answerIDs = answerIDs;

    } // EOF class

    MessageResponse.prototype = {
        constructor: MessageResponse,


        /**
         * Compares a messageResponse to a qMgr formatted question
         * @param messageResponse
         * @param qMgrFormat
         * @returns {boolean}
         */
        equal: function(messageResponse, qMgrFormat) {
            if (messageResponse.questionID === qMgrFormat.question) {
                return messageResponse.questionType === qMgrFormat.type;
            }
        }
    };

    return MessageResponse;
}); // requireJs define