/**
 * Created by Pascal on 31.03.2016.
 */

import framework.FileAsserter;
import framework.Resources;
import framework.lecturer.Lecturer;
import framework.lecturer.SavePopup;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.openqa.selenium.By;
import setups.LecturerOnly;
import java.io.IOException;
import static org.junit.Assert.*;

public class QuestionCreation extends LecturerOnly {

    @Test
    public void createAll3Types() throws Exception {
        lecturer.questions.createAllTypes("Open Question #1", "Rating Question #1", "MC Question #1");
        SavePopup.SavedFiles files = lecturer.savePopup.openPopup().saveAllAsAndClose(lecturerFolder.toString(), "temp");
        String json = Resources.getFilepathFromResourceFolder("QuestionCreation.json");
        FileAsserter.JSONequals(json, files.txtFilePath);
    }

    @Test
    public void editAll3Types() throws IOException {
        Lecturer.Questions questions = lecturer.questions;
        questions.createAllTypes("Open Question #1", "Rating Question #1", "MC Question #1");

        questions.mcEdit.changeQuestion("MC Question #1", "Edited MC Question #1")
                .changeOptionsNameAndNumber("newOption", 3)
                .changeToTrue(1, 3)
                .start();

        questions.ratingEdit.changeQuestion("Rating Question #1", "Edited Rating Question #1")
                .changeScalePoints(10, 100, 15)
                .start();

        questions.openEdit.changeQuestion("Open Question #1", "Edited Open Question #1")
                .changeAnswer("Edited Open Answer #1")
                .start();

        SavePopup.SavedFiles files = lecturer.savePopup.openPopup().saveAllAsAndClose(lecturerFolder.toString(), "temp");
        String json = Resources.getFilepathFromResourceFolder("EditAllQuestions.json");
        FileAsserter.JSONequals(json, files.txtFilePath);
    }

    @Rule
    public ExpectedException thrown=ExpectedException.none();
    @Test
    public void addingDuplicateAnswerDoesntWork() {
        Lecturer.Questions questions = lecturer.questions;
        questions.openQuestion.createQuestion("A");
        lecturer.setTimeout(1);
        thrown.expect( org.openqa.selenium.TimeoutException.class );
        questions.ratingQuestion.createQuestion("A", 9f, 36f, 9f, 36f);
    }
}