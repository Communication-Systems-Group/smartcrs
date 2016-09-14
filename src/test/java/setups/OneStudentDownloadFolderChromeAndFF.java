package setups;

import framework.lecturer.Lecturer;
import framework.students.Student;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.rules.TemporaryFolder;

import java.nio.file.Path;

/**
 * Created by Pascal on 10.03.2016.
 */
public class OneStudentDownloadFolderChromeAndFF extends BeforeClazz {

    @Rule
    public TemporaryFolder tempFolder = new TemporaryFolder();
    private TempFolders tempFolders = new TempFolders(tempFolder);
    private BrowserProfile browserProfile = new BrowserProfile();
    public Path lecturerFolder;
    public Path studentsFolder;
    public Lecturer lecturer;
    public Student student1;
    public BrowserWindowAligner aligner;

    @Before
    public void setup() throws Exception {
        lecturerFolder = tempFolders.createTempLecturerFolder();
        studentsFolder = tempFolders.createTempStudentsFolder();
        lecturer = new Lecturer(browserProfile.createFirefoxDriverWithDownloadFolder(lecturerFolder.toString()));
        student1 = new Student(browserProfile.createChromeDriverWithDownloadFolder(studentsFolder.toString()), "Student1");

        aligner = new BrowserWindowAligner();
        aligner.align(lecturer.sh, student1.sh);

        lecturer.launchWebsite();
        lecturer.createChannel(consts.defaultRoomName, "adminPwd", consts.defaultRoomPwd);
        student1.launchAndJoin(consts.defaultRoomName, consts.defaultRoomPwd);
    }

    @After
    public void tearDown() {
        lecturer.quit();
        student1.quit();
    }
}
