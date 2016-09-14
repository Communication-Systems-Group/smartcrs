package framework.questions;

import com.google.common.base.Function;
import framework.SeleniumHelper;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

/**
 * Created by Pascal on 31.03.2016.
 */
public class RatingQuestion {

    private final SeleniumHelper sh;
    private final ModalWindow modal;
    private double targetValue;
    private final By solutionErrorSpan = By.id("helpBlockInputScaleSolution");
    private final By scalesErrorSpan = By.id("helpBlockScales");

    public RatingQuestion(SeleniumHelper sh, ModalWindow modal) {
        this.sh = sh;
        this.modal = modal;
        this.targetValue = 0.00;
    }

    public void createDefaultQuestion(String questionText) {
        openModal();
        setQuestion(questionText);
        setSliderTo(5.00, By.id("sliderStatusLabel"));
        saveAndClose();
    }

    public void createQuestion(String questionText, float scaleStart, float scaleEnd, float scaleStep, float moveSliderTo) {
        openModal();
        setQuestion(questionText);
        setScalePoints(scaleStart, scaleEnd, scaleStep);
        setSliderTo(moveSliderTo, By.id("sliderStatusLabel"));
        saveAndClose();
    }

    public RatingQuestion openModal() {
        modal.openNewQuestionEditorFor(QuestionRadioTypes.rating);
        return this;
    }

    public void save() {
        modal.saveQuestion();
    }
    public void saveAndClose() {
        save();
        modal.closeModalWithWait();
    }


    public RatingQuestion setQuestion(String questionText) {
        By inputQuestion = By.cssSelector("#qScaleForm #textareaQuestion");
        sh.clear(inputQuestion);
        sh.sendKeys(inputQuestion, questionText);
        return this;
    }

    public RatingQuestion setAnswer(Float answer) {
        By inputQuestion = By.id("inputScaleSolution");
        sh.clear(inputQuestion);
        sh.sendKeys(inputQuestion, String.valueOf(answer));
        return this;
    }

    public RatingQuestion setScalePoints(Float start, Float end, Float step) {
        final By inputSliderStart = By.id("inputSliderStart");
        final By inputSliderEnd = By.id("inputSliderEnd");
        final By inputSliderStep = By.id("inputSliderStep");

        sh.clear(inputSliderStart);
        sh.clear(inputSliderEnd);
        sh.clear(inputSliderStep);

        sh.sendKeys(inputSliderStart, String.valueOf(start.intValue()));
        sh.sendKeys(inputSliderEnd, String.valueOf(end.intValue()));
        sh.sendKeys(inputSliderStep, String.valueOf(step.intValue()));
        return this;
    }

    public void setSliderTo(double number, By sliderStatusLabel) {
        targetValue = number;

        sh.waitTillConditionIsTrue(new Function<WebDriver, Boolean>() {
            public Boolean apply(WebDriver driver) {
                boolean done = Double.parseDouble(sh.getText(sliderStatusLabel)) == targetValue;
                if (!done) {
                    sh.sendKeys(sliderStatusLabel, sh.getKey("ARROW_UP"));
                }
                return done;
            }}
        );
    }

    public boolean isSolutionInvalidMsgShown() {
        int timeout = sh.setTimeout(1);
        final String solutionErrorMsg = constructSolutionErrorMsg();
        final boolean isShown = sh.isDisplayed(solutionErrorSpan) && sh.getText(solutionErrorSpan).equals(solutionErrorMsg);
        sh.setTimeout(timeout);
        return isShown;
    }

    private String constructSolutionErrorMsg() {
        final String solution = replaceTrailingZeros(sh.getTextFromTextarea(By.id("inputScaleSolution")));
        final String start = replaceTrailingZeros(sh.getTextFromTextarea(By.id("inputSliderStart")));
        final String end = replaceTrailingZeros(sh.getTextFromTextarea(By.id("inputSliderEnd")));

        return solution + " is not in the bounds of the slider settings: " + start + "-" + end;
    }

    /**
     * JavaScript's parseFloat() removes trailing zeros. Hence we need to remove them from the input fields values as well.
     */
    private String replaceTrailingZeros(String s) {
        return s.replaceFirst("\\.0+$", "");
    }

    public boolean isSliderEndpointsInvalidMsgShown() {
        int timeout = sh.setTimeout(1);
        final boolean isShown = sh.isDisplayed(scalesErrorSpan) && sh.getText(scalesErrorSpan).equals("Not allowed: start > end");;
        sh.setTimeout(timeout);
        return isShown;
    }
}
