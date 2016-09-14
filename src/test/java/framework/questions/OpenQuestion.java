package framework.questions;

import framework.SeleniumHelper;
import org.openqa.selenium.By;

/**
 * Created by Pascal on 31.03.2016.
 */
public class OpenQuestion {

    private final SeleniumHelper sh;
    public final ModalWindow modal;

    public OpenQuestion(SeleniumHelper sh, ModalWindow modal) {
        this.sh = sh;
        this.modal = modal;
    }

    public void createQuestion(String questionText) {
        openModal();
        setQuestion(questionText);
        setAnswer("Answer: " + questionText);
        modal.saveQuestion();
        modal.closeModalWithWait();
    }

    public OpenQuestion openModal() {
        modal.openNewQuestionEditorFor(QuestionRadioTypes.open);
        return this;
    }

    public OpenQuestion setQuestion(String questionText) {
        By inputQuestion = By.cssSelector("#qOpenForm #textareaQuestion");
        sh.clear(inputQuestion);
        sh.sendKeys(inputQuestion, questionText);
        return this;
    }

    public OpenQuestion setAnswer(String answer) {
        By inputSolution = By.id("textareaOpenSolution");
        sh.clear(inputSolution);
        sh.sendKeys(inputSolution, answer);
        return this;
    }

    public OpenQuestion save() {
        modal.saveQuestion();
        return this;
    }

    public void saveAndClose() {
        save();
        modal.closeModalWithWait();
    }
}
