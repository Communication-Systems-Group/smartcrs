define(function () {

    /**
     *
     * @param author: optional nickname
     * @param peerID: to avoid that lecturer broadcasts question back to sender
     */
    function StudentQuestion(subject, content, author, peerID) {

        var that = this;

        this.subject = subject;
        this.content = content;
        this.author = author;
        this.peerID = peerID;


        this.date = new Date();
        this.votes = this.createVoteStruct(0, peerID);
    } // EOF class


    StudentQuestion.prototype = {
        constructor: StudentQuestion,

        // defines the message content for votes
        studentVoteMessage: function (studentQuestion, voterPeerID) {

            var voteMessage = new StudentQuestion(studentQuestion.subject, studentQuestion.content, studentQuestion.author, studentQuestion.peerID);

            // setting the actual vote
            voteMessage.votes = studentQuestion.votes;
            voteMessage.voterPeerID = voterPeerID;

            return voteMessage;
        },
        // Removes "disabled" attribute and returns a cleaned studentQuestion for transmission
        listItemToStudentQuestion: function (listItem) {

            var sQuestion = new StudentQuestion(listItem.subject, listItem.content, listItem.author, listItem.peerID);

            sQuestion.date = listItem.date;
            sQuestion.votes = listItem.votes;
            sQuestion.id = listItem.id; // ID is required for duplicate check in upVotedList

            return sQuestion;
        },

        /**
         * Compares for subject, content & author. Returns true if equal
         * 'votes' & 'date' are excluded from comparison
         */
        equals: function (item1, item2) {

            if (item1.content === item2.content) {
                if (item1.subject === item2.subject) {
                    if (item1.author === item2.author) {
                        if (item1.peerID === item2.peerID) {
                            return true;
                        }
                    }
                }
            }

            return false;
        },

        createVoteStruct: function (numVotes, peerID) {
            return {votes: numVotes, peers: [peerID]};
        }


    }; // prototype


    return StudentQuestion;
}); // requireJS define