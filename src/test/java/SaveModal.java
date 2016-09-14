import framework.FileAsserter;
import framework.Resources;
import framework.lecturer.SavePopup;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import setups.LecturerOnly;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Path;

/**
 * Created by Pascal on 23.04.2016.
 */
public class SaveModal extends LecturerOnly {
    @Rule
    public ExpectedException exception = ExpectedException.none();

    @Test
    public void saveAll() throws IOException {
        String origPath = lecturer.loadLectureFromResourceFolder("QuestionsWithStats.json");
        SavePopup save = new SavePopup(lecturer.sh);
        final String filename = "saveAll";
        SavePopup.SavedFiles data = save.openPopup()
                .selectAllCheckBoxes()
                .saveAsAndClose(lecturerFolder.toString(), filename);

        Path origNoNumAnswered = FileAsserter.removeNumAnswersCollected(origPath, tempFolder);
        FileAsserter.JSONequals(origNoNumAnswered.toString(), data.txtFilePath);
        FileAsserter.TXTequals(Resources.getFilepathFromResourceFolder("QuestionsWithStatsXLS.txt"), data.xlsFilePath);
    }

    @Test
    public void saveQuestionsOnly() throws IOException {
        lecturer.loadLectureFromResourceFolder("QuestionsWithStats.json");
        SavePopup save = new SavePopup(lecturer.sh);
        final String filename = "saveQsOnly";
        SavePopup.SavedFiles data = save.openPopup()
                .deselectAllCheckBoxes()
                .selectCheckboxes(SavePopup.CheckboxNames.QsWithoutStats)
                .saveAsAndClose(lecturerFolder.toString(), filename);

        FileAsserter.JSONequals(Resources.getFilepathFromResourceFolder("QuestionsOnly.json"), data.txtFilePath);
        exception.expect(java.io.FileNotFoundException.class );
        new FileInputStream(data.xlsFilePath);
    }

    @Test
    public void saveStatsOnly() throws IOException {
        lecturer.loadLectureFromResourceFolder("QuestionsWithStats.json");
        SavePopup save = new SavePopup(lecturer.sh);
        final String filename = "saveAll";
        SavePopup.SavedFiles data = save.openPopup()
                .deselectAllCheckBoxes()
                .selectCheckboxes(SavePopup.CheckboxNames.QsWithStats)
                .saveAsAndClose(lecturerFolder.toString(), filename);

        FileAsserter.JSONequals(Resources.getFilepathFromResourceFolder("StatsOnly.json"), data.txtFilePath);
        FileAsserter.TXTequals(Resources.getFilepathFromResourceFolder("QuestionsWithStatsXLS.txt"), data.xlsFilePath);
    }

    @Test
    public void saveNotifcationSettingsOnly() throws IOException {
        lecturer.loadLectureFromResourceFolder("QuestionsWithStats.json");
        SavePopup save = new SavePopup(lecturer.sh);
        final String filename = "saveAll";
        SavePopup.SavedFiles data = save.openPopup()
                .deselectAllCheckBoxes()
                .selectCheckboxes(SavePopup.CheckboxNames.NotificationSettings)
                .saveAsAndClose(lecturerFolder.toString(), filename);

        FileAsserter.JSONequals(Resources.getFilepathFromResourceFolder("NotificationSettingsOnly.json"), data.txtFilePath);
        exception.expect(java.io.FileNotFoundException.class );
        new FileInputStream(data.xlsFilePath);
    }

    // TODO: Add Comments & Files
    @Test
    public void saveCommentsAndFilesOnly() throws IOException {
        lecturer.loadLectureFromResourceFolder("QuestionsWithStats.json");
        SavePopup save = new SavePopup(lecturer.sh);
        final String filename = "saveAll";
        SavePopup.SavedFiles data = save.openPopup()
                .deselectAllCheckBoxes()
                .selectCheckboxes(SavePopup.CheckboxNames.CommentsAndFiles)
                .saveAsAndClose(lecturerFolder.toString(), filename);

        FileAsserter.JSONequals(Resources.getFilepathFromResourceFolder("CommentsAndFilesOnly.json"), data.txtFilePath);
        exception.expect(java.io.FileNotFoundException.class );
        new FileInputStream(data.xlsFilePath);
    }
}
