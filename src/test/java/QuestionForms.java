import framework.lecturer.Lecturer;
import framework.questions.McQuestion;
import framework.questions.QuestionRadioTypes;
import framework.questions.RatingQuestion;
import org.junit.Test;
import org.openqa.selenium.By;
import setups.LecturerOnly;

import java.io.IOException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

/**
 * Created by Pascal on 15.05.2016.
 */
public class QuestionForms extends LecturerOnly{
    @Test
    public void McForms() throws IOException {
        final McQuestion mcQuestion = lecturer.questions.mcQuestion;
        mcQuestion
                .openModal()
                .save();

        assertTrue(mcQuestion.isQuestionInvalid());
        assertTrue(mcQuestion.areOptionsInvalid());


        mcQuestion
                .setQuestion("McQuestion")
                .save();

        assertFalse(mcQuestion.isQuestionInvalid());
        assertTrue(mcQuestion.areOptionsInvalid());

        mcQuestion
                .setAnswerOptions("McOption", 4)
                .save();

        assertFalse(mcQuestion.isQuestionInvalid());
        assertTrue(mcQuestion.areOptionsInvalid());

        mcQuestion
                .setNthOptionTrue(1)
                .setNthOptionTrue(3)
                .save();

        assertFalse(mcQuestion.isQuestionInvalid());
        assertFalse(mcQuestion.areOptionsInvalid());
    }

    @Test
    public void RatingForms() throws IOException {
        final RatingQuestion ratingQ = lecturer.questions.ratingQuestion;

        ratingQ.openModal()
                .save();

        assertFalse(ratingQ.isSolutionInvalidMsgShown());
        assertFalse(ratingQ.isSliderEndpointsInvalidMsgShown());

        ratingQ.setAnswer(12f)
                .save();

        assertTrue(ratingQ.isSolutionInvalidMsgShown());
        assertFalse(ratingQ.isSliderEndpointsInvalidMsgShown());

        ratingQ.setScalePoints(1f, 2f, 1f)
                .save();

        assertTrue(ratingQ.isSolutionInvalidMsgShown());
        assertFalse(ratingQ.isSliderEndpointsInvalidMsgShown());

        ratingQ.setAnswer(1f)
                .save();

        assertFalse(ratingQ.isSolutionInvalidMsgShown());
        assertFalse(ratingQ.isSliderEndpointsInvalidMsgShown());
    }

    @Test
    public void addNewQAfterCancelledEditResultsInCleanForm() {
        Lecturer.Questions questions = lecturer.questions;
        final String qText = "MyQuestion";
        questions.openQuestion.createQuestion(qText);
        questions.openEdit.openAndCloseEditor(qText);
        questions.openQuestion.modal.openNewQuestionEditorFor(QuestionRadioTypes.open);
        String clearedText = lecturer.sh.getTextFromTextarea(By.id("textareaQuestion"));
        assertEquals("", clearedText);
    }
}
