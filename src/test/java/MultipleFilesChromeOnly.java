
import framework.Resources;
import framework.comments.Comment;
import framework.comments.CommentsAsserter;
import org.junit.Test;
import setups.OneStudentChrome;

/**
 * Sending multiple files with Selenium only works with Chrome
 */
public class MultipleFilesChromeOnly extends OneStudentChrome {
    private CommentsAsserter asserter = new CommentsAsserter();

    @Test
    public void multipleFiles() throws Exception {
        Comment commentFile1 = new Comment().createFileComment(consts.lecturerName, "10kb.txt", "c1", 0);
        Comment commentFile2 = new Comment().createFileComment(consts.lecturerName, "100kb.txt", "c2", 0);

        String file10kb = null;
        String file100kb = null;
        file10kb = Resources.getFilepathFromResourceFolder("10kb.txt");
        file100kb = Resources.getFilepathFromResourceFolder("100kb.txt");

        String abs2FilesPath = file10kb + "\n" + file100kb;
        lecturer.sendFile(abs2FilesPath);

        asserter.assertLecturerMsg(lecturer, student1, commentFile1);
        asserter.assertLecturerMsg(lecturer, student1, commentFile2);

    }

}
