package setups;

import framework.Settings;
import framework.lecturer.Lecturer;
import framework.students.Student;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.rules.TemporaryFolder;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.logging.LogEntries;
import org.openqa.selenium.logging.LogEntry;
import org.openqa.selenium.logging.LogType;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.fail;

/**
 * Created by Pascal on 01.03.2016.
 */
public class TwoStudents extends BeforeClazz {
    public Lecturer lecturer;
    public Student student1;
    public Student student2;
    public BrowserWindowAligner aligner;
    protected Path lecturerFolder;


    @Before
    public void setup() throws Exception {
        lecturer = new Lecturer(Settings.getLecturerDriver());
        student1 = new Student(Settings.getStudent1Driver(), "chromeStud1");
        student2 = new Student(Settings.getStudent2Driver(), "chromeStud2");

        lecturer.launchWebsite();
        student1.launchWebsite();
        student2.launchWebsite();

        aligner = new BrowserWindowAligner();
        aligner.align(lecturer.sh, student1.sh, student2.sh);
    }

    @After
    public void tearDown() throws Exception {
        student1.quit();
        student2.quit();
        lecturer.quit();
    }
}