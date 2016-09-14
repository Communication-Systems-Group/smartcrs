package setups;

import framework.Settings;
import framework.lecturer.Lecturer;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.rules.TemporaryFolder;

import java.nio.file.Path;


public class LecturerOnly extends BeforeClazz {
    public Lecturer lecturer;
    private BrowserWindowAligner aligner = new BrowserWindowAligner();
    protected Path lecturerFolder;
    private BrowserProfile browserProfile = new BrowserProfile();

    @Rule
    public TemporaryFolder tempFolder = new TemporaryFolder();

    @Before
    public void setup() throws Exception {
        lecturerFolder = new TempFolders(tempFolder).createTempLecturerFolder();

        lecturer = new Lecturer(browserProfile.createDownloadFolder(Settings.lecturerDriver, lecturerFolder));
        aligner.align(lecturer.sh);
        lecturer.launchWebsite();
    }

    @After
    public void tearDown() throws Exception {
        lecturer.quit();
    }
}
