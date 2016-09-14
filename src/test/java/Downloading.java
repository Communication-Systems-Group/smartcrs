

import framework.FileAsserter;
import framework.Resources;
import framework.lecturer.SavePopup;
import org.junit.Test;
import setups.OneStudentDownloadFolderChromeAndFF;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Paths;

/**
 * Created by Pascal on 09.03.2016.
 */
public class Downloading extends OneStudentDownloadFolderChromeAndFF {

    @Test
    public void loadAndSaveLecture() throws IOException, InterruptedException, URISyntaxException {
        final String loadedDataPath = lecturer.loadLectureFromResourceFolder("LoadLectureFile.json");
        final String savedFilenames = "downloadTest";
        SavePopup.SavedFiles data = lecturer.savePopup.openPopup()
                .saveAllAsAndClose(lecturerFolder.toString(), savedFilenames);
        FileAsserter.JSONequals(loadedDataPath, data.txtFilePath);
    }

    @Test
    public void saveFileComment() throws IOException, InterruptedException {
        final String filename = "10kb.txt";
        String file10kb = Resources.getFilepathFromResourceFolder(filename);
        lecturer.sendFile(file10kb);
        student1.commenting.downloadComment("c1");
        lecturer.downloadComment("c1");
        String studentFolder2 = Paths.get(studentsFolder.toString(), filename).toString();
        String lecturerFolder2 = Paths.get(lecturerFolder.toString(), filename).toString();
        FileAsserter.TXTequals(file10kb, studentFolder2);
        FileAsserter.TXTequals(file10kb, lecturerFolder2);
    }
}
