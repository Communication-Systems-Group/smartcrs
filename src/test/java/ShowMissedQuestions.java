import framework.students.Student;
import junit.framework.TestCase;
import org.junit.After;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.openqa.selenium.firefox.FirefoxDriver;
import setups.OneStudentLogin;

/**
 * Created by Pascal on 17.04.2016.
 */
public class ShowMissedQuestions extends OneStudentLogin {

    private Student latecomer;
    @Rule
    public ExpectedException exception = ExpectedException.none();
    @Test
    public void missedQuestionsAreOnlyShownToLatecomer(){
        lecturer.loadLectureFromResourceFolder("LoadLectureFile.json");
        lecturer.questions.shareAllQuestions();
        student1.lecturerQuestions.answerAllQuestions(4.0, "This is the student's answer", 0, 3);

        latecomer = new Student(new FirefoxDriver(), "latecomer");
        latecomer.launchAndJoin(consts.defaultRoomName, consts.defaultRoomPwd);
        latecomer.lecturerQuestions.answerAllQuestions(5.0, "This is the latecomer's answer", 1, 3);

        student1.refreshPage();

        exception.expect(org.openqa.selenium.TimeoutException.class);
        student1.lecturerQuestions.setTimeoutFindingResponseWindow(3).findResponseWindow();
    }

    @After
    public void tearDownExtraStudent() throws Exception {
        latecomer.quit();
    }
}
