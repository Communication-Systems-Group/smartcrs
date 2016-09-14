import framework.FileAsserter;
import framework.Resources;
import framework.lecturer.notifications.NotificationTypes;
import framework.lecturer.notifications.ThresholdTypes;
import framework.lecturer.SavePopup;
import org.junit.Test;
import setups.OneStudentLogin;

import java.io.IOException;
import java.nio.file.Path;

/**
 * Created by Pascal on 15.05.2016.
 */
public class SaveLoad extends OneStudentLogin {

    @Test
    public void saveLoad3Times() throws IOException {

        lecturer.questions.ratingQuestion.openModal()
                .setQuestion("customRatingQuestion")
                .setScalePoints(1f, 40f, 5f)
                .setAnswer(40f)
                .saveAndClose();
        lecturer.questions.mcQuestion.openModal()
                .setQuestion("customMcQuestion")
                .setAnswerOptions("answerOption", 4)
                .setNthOptionTrue(3)
                .saveAndClose();
        lecturer.questions.openQuestion.openModal()
                .setQuestion("openQuestion")
                .setAnswer("Dü Änswer")
                .saveAndClose();

        String file10kb = Resources.getFilepathFromResourceFolder("10kb.txt");
        lecturer.sendFile(file10kb);
        lecturer.sendComment("Thüs ös ä cômmênt");
        lecturer.notificationSettings
                .setNotification(NotificationTypes.POPUP)
                .setThreshold(50, ThresholdTypes.PERCENT);

        lecturer.questions.shareAllQuestions();
        student1.lecturerQuestions.answerAllQuestions(6d, "openAnswer", 3, 3);

        SavePopup.SavedFiles save1 = lecturer.savePopup.openPopup().saveAllAsAndClose(lecturerFolder.toString(), "save1");

        refreshAndLoad(save1);
        lecturer.questions.ratingEdit
                .changeQuestion("customRatingQuestion", "editedRatingQ")
                .changeScalePoints(20, 40, 10).start();
        lecturer.sendComment("Comment from save2");
        SavePopup.SavedFiles save2 = lecturer.savePopup.openPopup().saveAllAsAndClose(lecturerFolder.toString(), "save2");

        refreshAndLoad(save2);
        lecturer.questions.mcEdit.
                changeQuestion("customMcQuestion", "mcQuestion from Save 3")
                .changeOptionsNameAndNumber("New Options", 6)
                .changeToTrue(1, 3, 5).start();
        SavePopup.SavedFiles save3 = lecturer.savePopup.openPopup().saveAllAsAndClose(lecturerFolder.toString(), "save3");

        String loadSaveOrig = Resources.getFilepathFromResourceFolder("LoadSave.json");
        Path save3JsonPath = FileAsserter.removePeerIdsVotedANDCreatedDate(save3.txtFilePath, tempFolder);
        FileAsserter.JSONequals(loadSaveOrig, save3JsonPath.toString());
    }

    private void refreshAndLoad(SavePopup.SavedFiles save) {
        lecturer.refreshPage();
        lecturer.loadLecture(save.txtFilePath);
    }
}
