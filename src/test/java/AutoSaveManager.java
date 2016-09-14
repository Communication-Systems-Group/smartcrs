import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import setups.OneStudentLogin;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertTrue;

/**
 * Created by Pascal on 17.05.2016.
 */
public class AutoSaveManager extends OneStudentLogin {
    @Rule
    public ExpectedException exception = ExpectedException.none();

    @Test
    public void shownOnNewQuestion() {
        lecturer.questions.openQuestion.openModal()
                .setQuestion("openQ").saveAndClose();
        refreshPageAndAssertAlertShown();
    }

    @Test
    public void shownOnLecturerComment() {
        lecturer.sendComment("This should trigger");
        refreshPageAndAssertAlertShown();
    }

    @Test
    public void shownOnStudentComment() {
        student1.commenting.sendComment("This should trigger");
        lecturer.getCommentDOMInformation("c1"); // wait till comment arrived
        refreshPageAndAssertAlertShown();
    }

    @Test
    public void DontShowOnLoadedLecture() {
        lecturer.loadLectureFromResourceFolder("LoadSave.json");
        lecturer.refreshPage();
        exception.expect(org.openqa.selenium.NoAlertPresentException.class );
        lecturer.getAlertText();
    }

    @Test
    public void showOnLoadedAndEditedLecture() {
        lecturer.loadLectureFromResourceFolder("LoadSave.json");
        lecturer.questions.mcEdit
                .changeQuestion("mcQuestion from Save 3", "Edited --> Show alert")
                .start();
        refreshPageAndAssertAlertShown();
    }


    private void refreshPageAndAssertAlertShown() {
        lecturer.refreshPage();
        String alertText = lecturer.getAlertText();
        List<String> expected = new ArrayList<String>(Arrays.asList(
                "There are unsaved questions or comments.",
                "Diese Seite bittet Sie zu bestätigen, dass Sie die Seite verlassen möchten – Daten, die Sie eingegeben haben, werden unter Umständen nicht gespeichert."
        ));
        assertTrue(expected.contains(alertText));
    }
}
