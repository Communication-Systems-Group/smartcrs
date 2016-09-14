package framework.questions;

/**
 * Created by Henriette on 01.04.2016.
 */
public class OpenQuestionEdit {

    private final OpenQuestion openPage;
    private final ModalWindow modalPage;
    private String oldQuestion;
    private String newQuestion;
    private String newAnswer;

    public OpenQuestionEdit(OpenQuestion openPage, ModalWindow modalPage) {
        this.openPage = openPage;
        this.modalPage = modalPage;

        this.oldQuestion = "";
        this.newQuestion = "";
        this.newAnswer = "";
    }

    public void start() {

        modalPage.openEditQuestionEditorFor(oldQuestion);
        if (newQuestion.length() > 1) {
            openPage.setQuestion(newQuestion);
        }

        if (newAnswer.length() > 1) {
            openPage.setAnswer(newAnswer);
        }

        modalPage.closeEditModalWithSave();
    }

    public OpenQuestionEdit changeQuestion(String oldQ, String newQ) {
        this.oldQuestion = oldQ;
        this.newQuestion = newQ;
        return this;
    }

    public OpenQuestionEdit changeAnswer(String newAnswer) {
        this.newAnswer = newAnswer;
        return this;
    }

    public OpenQuestionEdit openAndCloseEditor(String qText) {
        modalPage.openEditQuestionEditorFor(qText);
        modalPage.closeModalWithWait();
        return this;
    }

}