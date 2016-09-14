package setups;

import framework.Settings;
import framework.lecturer.Lecturer;
import framework.students.Student;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.rules.TemporaryFolder;

import java.nio.file.Path;

/**
 * Created by Pascal on 01.03.2016.
 */
public class OneStudent extends BeforeClazz {
    public Lecturer lecturer;
    public Student student1;
    protected Path lecturerFolder;
    public Path student1Folder;

    @Rule
    public TemporaryFolder tempFolder = new TemporaryFolder();

    private BrowserWindowAligner aligner = new BrowserWindowAligner();
    private BrowserProfile browserProfile = new BrowserProfile();

    @Before
    public void setup() throws Exception {
        final TempFolders tempFolders = new TempFolders(tempFolder);
        lecturerFolder = tempFolders.createTempLecturerFolder();
        student1Folder = tempFolders.createTempStudentsFolder();
        lecturer = new Lecturer(browserProfile.createDownloadFolder(Settings.lecturerDriver, lecturerFolder));
        student1 = new Student(browserProfile.createDownloadFolder(Settings.student1Driver, student1Folder), "Student1");


        aligner.align(lecturer.sh, student1.sh);

        lecturer.launchWebsite();
        student1.launchWebsite();
    }


    @After
    public void tearDown() throws Exception {
        student1.quit();
        lecturer.quit();
    }
}
