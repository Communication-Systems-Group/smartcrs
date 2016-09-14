import framework.Resources;
import framework.comments.Comment;
import framework.comments.CommentsAsserter;
import org.junit.Test;
import setups.OneStudentLogin;

public class MessagingOneStudent extends OneStudentLogin {
    private CommentsAsserter asserter = new CommentsAsserter();

    @Test
    public void oneMsgOneFileFromLecturer() throws Exception {
        Comment commentMsg = new Comment().createMessageComment(consts.lecturerName, "lecMessage1", "c1", 0);
        lecturer.sendComment(commentMsg.content);
        asserter.assertLecturerMsg(lecturer, student1, commentMsg);

        String filename = "10kb.txt";
        Comment fileComment = new Comment().createFileComment(consts.lecturerName, filename, "c2", 0);
        String file10kb = Resources.getFilepathFromResourceFolder(filename);
        lecturer.sendFile(file10kb);
        asserter.assertLecturerMsg(lecturer, student1, fileComment);
    }

    @Test
    public void studentSendsMsg() throws Exception {
        Comment studComment = new Comment().createMessageComment(student1.getNickname(), "This is a message.", "c1", 0);
        student1.commenting.sendComment(studComment.content);

        CommentsAsserter asserter = new CommentsAsserter();
        asserter.assertStudentMsg(student1, lecturer, studComment);
    }

    @Test
    public void sendMsgDoesntResultInDisconnect() throws Exception {
        Comment commentStud = new Comment().createMessageComment(student1.getNickname(), "This is a message from the student.", "c1", 0);
        student1.commenting.sendComment(commentStud.content);

        Comment lecComment = new Comment().createMessageComment(consts.lecturerName, "This is a message from the lecturer.", "c2", 0);
        lecturer.sendComment(lecComment.content);

        CommentsAsserter asserter = new CommentsAsserter();
        asserter.assertStudentMsg(student1, lecturer, commentStud);
        asserter.assertLecturerMsg(lecturer, student1, lecComment);
    }

}
