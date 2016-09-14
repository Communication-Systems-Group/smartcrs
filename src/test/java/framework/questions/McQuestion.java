package framework.questions;

import framework.SeleniumHelper;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;

/**
 * Created by Pascal on 31.03.2016.
 */
public class McQuestion {

    private final SeleniumHelper sh;
    public final ModalWindow modal;
    private final int numAnswerOptions;
    private final String inactiveMcOptionTag = ".inactive-mcOption";
    private final String activeMcOptionTag = ".active-mcOption";
    private final String delOptionButtonTag = ".removeMcOptionButton";
    private final String correctButtonTag = ".mcTrueFalseToggle .btn[name=trueOption]";
    private final By qValidationErrorSpan = By.id("validationBlockQuestion");
    private final String qValidationErrorMsg = "Please enter a question.";
    private final By optionsValidationErrorSpan = By.id("helpBlockMcOptions");
    private final String optionsValidationErrorMsg = "Please create at least 1 option(s). 1 of them need(s) to be marked as correct";


    public McQuestion(SeleniumHelper sh, ModalWindow modal) {
        this.sh = sh;
        this.modal = modal;
        this.numAnswerOptions = 2;
    }


    public void createQuestion(String questionText) {
        openModal();
        this.setQuestion(questionText);
        this.setAnswerOptions("Answer Option", this.numAnswerOptions);
        this.setNthOptionTrue(1);
        saveAndClose();
    }

    public McQuestion save() {
        this.modal.saveQuestion();
        return this;
    }

    public void saveAndClose() {
        save();
        modal.closeModalWithWait();
    }

    public McQuestion openModal() {
        this.modal.openNewQuestionEditorFor(QuestionRadioTypes.mc);
        return this;
    }

    public McQuestion setQuestion(String questionText) {
        By inputQuestion = By.cssSelector("#qMcInputsForm #textareaQuestion");
        sh.clear(inputQuestion);
        sh.sendKeys(inputQuestion, questionText);
        return this;
    }

    public McQuestion setAnswerOptions(String answerText, int numOptions) {
        for (int i = 0; i < numOptions; ++i) {
            WebElement textarea = sh.findElement(By.cssSelector(inactiveMcOptionTag + " textarea"));
            sh.click(By.cssSelector(inactiveMcOptionTag));

            String currAnswerText = answerText + " #" + (i + 1);
            sh.sendKeys(textarea, currAnswerText);
        }
        return this;
    }

    public McQuestion removeAllAnswerOptions() {
        By delButton = By.cssSelector(activeMcOptionTag + " " + delOptionButtonTag);
        List<WebElement> delButtons = sh.findElements(delButton);
        int buttonCounter = delButtons.size();
        for (int i = 0; i < buttonCounter; i++) {
            final WebElement currButton = delButtons.get(i);
            sh.click(currButton);
            sh.click(By.cssSelector(".webix_popup_button.confirm"));
        }
        return this;
    }

    public McQuestion setNthOptionTrue(int answerNum) {
        assert answerNum > 0;
        List<WebElement> elems = sh.findElements(By.cssSelector(activeMcOptionTag + " " + correctButtonTag));
        WebElement option = elems.get(answerNum - 1);
        if (!option.getAttribute("class").contains("active")){
            sh.click(option);
        }
        return this;
    }

    public boolean isQuestionInvalid() {
        int timeout = sh.setTimeout(1);
        final boolean isShown = sh.isDisplayed(qValidationErrorSpan) && sh.getText(this.qValidationErrorSpan).equals(qValidationErrorMsg);
        sh.setTimeout(timeout);
        return isShown;
    }

    public boolean areOptionsInvalid() {
        int timeout = sh.setTimeout(1);
        final boolean isShown = sh.isDisplayed(optionsValidationErrorSpan) && sh.getText(this.optionsValidationErrorSpan).equals(optionsValidationErrorMsg);
        sh.setTimeout(timeout);
        return isShown;
    }
}
