import framework.lecturer.Lecturer;
import framework.questions.ModalWindow;
import framework.questions.QuestionRadioTypes;
import org.junit.Test;
import setups.LecturerOnly;

import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.assertFalse;

/**
 * Created by Pascal on 16.05.2016.
 */
public class QuestionCreationModal extends LecturerOnly {


    @Test
    public void closeModalWhenNoQuestionTypeSelected() {
        Lecturer.Questions questions = lecturer.questions;
        ModalWindow modal = questions.modal;

        modal.openNewModal();
        modal.closeModalWithWait();

        assertFalse(modal.isModalVisible());
    }

    @Test
    public void closeModalInEditModeDoesntShowPrompt() {
        Lecturer.Questions questions = lecturer.questions;
        ModalWindow modal = questions.modal;

        final String qText = "question";
        questions.openQuestion.createQuestion(qText);
        modal.openEditQuestionEditorFor(qText);
        modal.closeModalWithWait();

        assertFalse(modal.isModalVisible());

        modal.openEditQuestionEditorFor(qText);
        questions.openQuestion.setQuestion("newQuestion");
        modal.closeModalWithWait();

        assertFalse(modal.isModalVisible());
    }

    @Test
    public void warnOnCloseDirtyForm(){
        Lecturer.Questions questions = lecturer.questions;
        ModalWindow modal = questions.modal;

        modal.openNewQuestionEditorFor(QuestionRadioTypes.open);
        questions.openQuestion.setQuestion("dirtyForm!");

        modal.closeModeNoWait();
        assertTrue(modal.isDirtyFormsErrorShown());
    }

    @Test
    public void dontWarnOnCloseCleanForm() {
        Lecturer.Questions questions = lecturer.questions;
        ModalWindow modal = questions.modal;

        modal.openNewQuestionEditorFor(QuestionRadioTypes.open);
        modal.closeModeNoWait();

        assertFalse(modal.isDirtyFormsErrorShown());
    }

    @Test
    public void dirtyWarningNoStay() {
        Lecturer.Questions questions = lecturer.questions;
        ModalWindow modal = questions.modal;

        modal.openNewQuestionEditorFor(QuestionRadioTypes.open);
        questions.openQuestion.setQuestion("dirtyForm!");
        modal.closeModeNoWait();
        modal.dirtyFormsErrorStayOnModal();

        assertTrue(modal.isModalVisible());
    }

    @Test
    public void dirtyWarningYesIAmSure() {
        Lecturer.Questions questions = lecturer.questions;
        ModalWindow modal = questions.modal;

        modal.openNewQuestionEditorFor(QuestionRadioTypes.open);
        questions.openQuestion.setQuestion("dirtyForm!");
        modal.closeModeNoWait();
        modal.dirtyFormsErrorCloseModal();

        assertFalse(modal.isModalVisible());
    }
}
