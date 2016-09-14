package framework.lecturer;

import com.google.common.base.Function;
import framework.Resources;
import framework.SeleniumHelper;
import framework.comments.Comment;
import framework.comments.HelperComments;
import framework.lecturer.notifications.NotificationSettings;
import framework.questions.*;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Pascal on 23.02.2016.
 */
public class Lecturer {
    public final Questions questions;
    public WebDriver driver;
    public SeleniumHelper sh;
    private HelperComments helperComments;
    private NumPeersConnected numPeersConnected;
    private PeerTableMgr peerTableMgr;
    private ChannelSetupWindow channelSetupWindow;
    public SavePopup savePopup;
    public NotificationSettings notificationSettings;

    public Lecturer(WebDriver driver) {
        this.driver = driver;
        this.sh = new SeleniumHelper(this.driver);
        this.helperComments = new HelperComments(this.sh);
        this.numPeersConnected = new NumPeersConnected(this.sh);
        this.peerTableMgr = new PeerTableMgr(this.sh);
        this.channelSetupWindow = new ChannelSetupWindow(this.sh);
        this.questions = new Questions();
        this.savePopup = new SavePopup(this.sh);
        this.notificationSettings = new NotificationSettings(this.sh);
    }

    public void launchWebsite() {
        sh.waitTillConditionIsTrue(new Function<WebDriver, Boolean>() {
            public Boolean apply(WebDriver driver) {
                driver.get(sh.consts.lecturerWebsite);
                try {
                    sh.waitTillPresentInDom(By.cssSelector(".no-comments.no-data"));
                    return true;
                } catch (Exception e) {
                    sh.refresh();
                    return false;
                }
            }
        });
    }

    public void refreshPage() {
        sh.refresh();
    }

    public int setTimeout(int timeoutInSecs) {
        return sh.setTimeout(timeoutInSecs);
    }

    public void quit() {
        sh.quit();
    }

    public void createChannel(String roomName, String adminPwd, String roomPwd) {
        sh.click(By.id("connectButton"));
        channelSetupWindow.createChannel(roomName, adminPwd, roomPwd);
    }

    public boolean isChannelSetupWindowVisible() {
        return channelSetupWindow.isWindowVisible();
    }

    public String loadLectureFromResourceFolder(String filename) {
        final String absPath = Resources.getFilepathFromResourceFolder(filename);
        this.sh.sendKeys(By.id("filesLoadLecture"), absPath);
        return absPath;
    }

    public String loadLecture(String filename) {
        final String absPath = new File(filename).toString();
        this.sh.sendKeys(By.id("filesLoadLecture"), absPath);
        return absPath;
    }

    public void initTestDiv() {
        sh.getJavascriptExecutor().executeScript("$('body').append(\"<div id='testDiv'> </div>\")");
    }

    public String getTestDivText() {
        return sh.getText(By.id("testDiv")).replaceAll("\\s+'$", "'");   // firefox would add a whitespace at the end
    }

    public String getAlertText() {
        Alert alert = driver.switchTo().alert();
        return alert.getText();
    }

    public void leaveChannel() {
        sh.click(By.id("disconnectButton"));
    }

    public void sendComment(String content) {
        helperComments.sendComment(content);
    }

    public void downloadComment(String commentId) {
        helperComments.downloadComment(commentId);
    }

    public void sendFile(String absFilePath) {
        helperComments.sendFile(absFilePath);
    }

    public Comment getCommentDOMInformation(String commentId) {
        return helperComments.getDOMInformation(commentId);
    }

    public int getUpvotes(Comment comment) {
        return helperComments.getUpvotes(comment);
    }

    public int getNumPeersConnected() {
        return numPeersConnected.get();
    }

    public void kick(String nickname) {
        peerTableMgr.kick(nickname);
    }

    public Object getStatsData() {
        return sh.getJavascriptExecutor().executeScript("return JSON.stringify(require('stats').data);");
    }

    public class Questions {
        public final ModalWindow modal = new ModalWindow(sh);
        public final McQuestion mcQuestion = new McQuestion(sh, modal);
        public final OpenQuestion openQuestion = new OpenQuestion(sh, modal);
        public final RatingQuestion ratingQuestion = new RatingQuestion(sh, modal);

        public final McQuestionEdit mcEdit = new McQuestionEdit(mcQuestion, modal);
        public final OpenQuestionEdit openEdit = new OpenQuestionEdit(openQuestion, modal);
        public final RatingQuestionEdit ratingEdit = new RatingQuestionEdit(ratingQuestion, modal);

        public void createAllTypes(String openQuestionName, String ratingQuestionName, String mcQuestionName) {
            mcQuestion.createQuestion(mcQuestionName);
            openQuestion.createQuestion(openQuestionName);
            ratingQuestion.createDefaultQuestion(ratingQuestionName);
        }

        public void shareAllQuestions() {
            List<WebElement> shareButtons = sh.findElements(By.cssSelector(".shareButtonFunc"));
            for (WebElement button: shareButtons) {
                sh.click(button);
            }
        }

        public void shareNthQuestion(int n) {
            List<WebElement> shareButtons = sh.findElements(By.cssSelector(".shareButtonFunc"));
            sh.click(shareButtons.get(n-1));
        }

        public List<String> getCurrentVotesOfAllQuestions() {
            List<WebElement> voteElements = sh.findElements(By.className("votesPerStudentColumn"));
            List<String> results = new ArrayList<>();
            for (WebElement el : voteElements) {
                final String text = el.getText();
                if (text.equals("")){
                    return getCurrentVotesOfAllQuestions();
                }
                results.add(text);
            }
            return results;
        }
    }
}