package setups;

import framework.lecturer.Lecturer;
import framework.students.Student;
import org.junit.After;
import org.junit.Before;
import org.openqa.selenium.chrome.ChromeDriver;

/**
 * Created by Pascal on 01.03.2016.
 */
public class OneStudentChrome extends BeforeClazz {
    public Lecturer lecturer;
    public Student student1;
    public BrowserWindowAligner aligner;

    @Before
    public void setup() throws Exception {
        lecturer = new Lecturer(new ChromeDriver());
        student1 = new Student(new ChromeDriver(), "Student1");

        aligner = new BrowserWindowAligner();
        aligner.align(lecturer.sh, student1.sh);

        lecturer.launchWebsite();
        lecturer.createChannel(consts.defaultRoomName, "adminPwd", consts.defaultRoomPwd);
        student1.launchAndJoin(consts.defaultRoomName, consts.defaultRoomPwd);
    }

    @After
    public void tearDown() throws Exception {
        student1.quit();
        lecturer.quit();
    }
}
