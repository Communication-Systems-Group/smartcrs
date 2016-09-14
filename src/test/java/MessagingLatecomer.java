import framework.Resources;
import framework.comments.Comment;
import framework.comments.CommentsAsserter;
import framework.students.Student;
import org.junit.After;
import org.junit.Test;
import org.openqa.selenium.chrome.ChromeDriver;
import setups.OneStudentLogin;

public class MessagingLatecomer extends OneStudentLogin {
    private CommentsAsserter asserter = new CommentsAsserter();
    private Student latecomer;

    @Test
    public void latecomer1Msg1File() throws Exception {
        Comment msgComment = new Comment().createMessageComment(consts.lecturerName, "lecMessage1", "c1", 0);
        lecturer.sendComment(msgComment.content);

        final String filename = "10kb.txt";
        Comment fileComment = new Comment().createFileComment(consts.lecturerName, filename, "c2", 0);
        String file10kb = Resources.getFilepathFromResourceFolder("10kb.txt");
        lecturer.sendFile(file10kb);

        latecomer = new Student(new ChromeDriver(), "latercomer");
        latecomer.launchAndJoin(consts.defaultRoomName, consts.defaultRoomPwd);

        asserter.assertLecturerMsg(lecturer, student1, msgComment);
        asserter.assertLecturerMsg(lecturer, student1, fileComment);
    }

    @After
    public void quitLatecomer() {
        latecomer.quit();
    }
}
