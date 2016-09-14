package framework.students;

import framework.SeleniumHelper;
import framework.questions.RatingQuestion;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;

/**
 * Created by Pascal on 03.04.2016.
 */
public class LecturerQuestions {

    private final SeleniumHelper sh;
    int timeoutFindingResponseWindow = 1;
    private final String responseWinCSS = " .webix_window[view_id='responseWindow'] ";

    public LecturerQuestions(SeleniumHelper sh) {
        this.sh = sh;
    }

    public void dismissAllQuestions(int numQuestions) {
        for (int i = 0; i < numQuestions; i++) {
            WebElement winDow = this.findResponseWindow();
            sh.setCssAttribute(winDow, "z-index", "500");
            sh.click(winDow.findElement(By.cssSelector(".webix_win_head button")));
            waitTillResponseWindowClosed();
        }
    }

    public void answerAllQuestions(double ratingAnswer, String openAnswer, int mcAnswerZeroBased, int numAnswers) {
        for (int i = 0; i < numAnswers; i++) {
            WebElement winDow = this.findResponseWindow();
            sh.setCssAttribute(winDow, "z-index", "500");
            if (sh.isPresentInElement(winDow, By.id("slider"))) {
                answerRatingQuestion(ratingAnswer, winDow);
            } else if (sh.isPresentInElement(winDow, By.cssSelector("textarea"))) {
                answerOpenQuestion(openAnswer, winDow);
            } else if (sh.isPresentInElement(winDow, By.cssSelector(responseWinCSS + " .webix_list_item"))) {
                answerMcQuestion(mcAnswerZeroBased, winDow);
            }
        }
    }

    public void answerRatingQuestion(double answer, WebElement window) {
        RatingQuestion ratingQuestion = new RatingQuestion(sh, null);

        ratingQuestion.setSliderTo(answer, By.cssSelector(responseWinCSS + " #sliderStatusLabel"));
        sendAnswer(window);
    }

    public void answerOpenQuestion(String answerText, WebElement window) {
        sh.sendKeys(By.cssSelector(responseWinCSS + " .webix_inp_textarea"), answerText);
        sendAnswer(window);
    }

    public void answerMcQuestion(int answerZerobased, WebElement window) {
        List<WebElement> answerOptions = sh.findElements(By.cssSelector(responseWinCSS + " .webix_list_item"));
        final WebElement mcAnswerOption = answerOptions.get(answerZerobased);
        sh.click(mcAnswerOption);
        sendAnswer(window);
    }

    private void sendAnswer(WebElement window) {
        sh.click(window.findElement(By.cssSelector("button .glyphicon-ok")));
        closeSuccessfullyAnsweredPopup();
    }

    private void closeSuccessfullyAnsweredPopup() {
        final By popupCss = By.cssSelector(".webix_popup[view_id^='$popup'");
        sh.click(popupCss);
        sh.waitTillNotVisible(popupCss);
    }

    private void waitTillResponseWindowClosed() {
        sh.waitTillNotVisible(By.cssSelector(responseWinCSS));
    }

    public WebElement findResponseWindow() {
        int oldTimeout = sh.setTimeout(timeoutFindingResponseWindow);
        try {
            WebElement win = sh.findElement(By.cssSelector(responseWinCSS));
            sh.setTimeout(oldTimeout);
            return win;
        } catch (Exception e) {
            sh.setTimeout(oldTimeout);
            throw e;
        }
    }

    public int getNumResponseWindowPresent() {
        return sh.findElements(By.cssSelector(responseWinCSS)).size();
    }

    public LecturerQuestions setTimeoutFindingResponseWindow(int timeoutFindingResponseWindow) {
        this.timeoutFindingResponseWindow = timeoutFindingResponseWindow;
        return this;
    }

}
