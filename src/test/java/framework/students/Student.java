package framework.students;

import framework.SeleniumHelper;
import framework.comments.Comment;
import framework.comments.HelperComments;
import org.junit.rules.TemporaryFolder;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.Date;

/**
 * Created by Pascal on 23.02.2016.
 */
public class Student {

    public SeleniumHelper sh;
    private WebDriver driver;
    private String nickname;

    public RoomWindow roomWindow;
    public Commenting commenting;
    public Connectivity connIcon;
    public LecturerQuestions lecturerQuestions;

    public Student(WebDriver driver, String nickname) {
        this.driver = driver;
        this.nickname = nickname;
        this.sh = new SeleniumHelper(driver);
        commenting = new Commenting(new HelperComments(this.sh));
        connIcon = new Connectivity(new ConnectivityIcon(this.sh));
        roomWindow = new RoomWindow(new SelectRoomWindow(this.sh));
        lecturerQuestions = new LecturerQuestions(this.sh);
    }

        public void launchAndJoin(String roomName, String roomPwd) {
        launchWebsite();
        joinRoomWithNickname(roomName, roomPwd);
    }

    public void launchWebsite(){
        driver.get(sh.consts.studentsWebsite);
    }

    public void joinRoomWithNickname(String roomName, String roomPwd) {
        roomWindow.joinRoomAndWait(roomName, roomPwd);
    }

    public void quit() {
        sh.quit();
    }
    public String getNickname() {
        return nickname;
    }

    public Path save(Path folder) {
        sh.click(By.id("saveDataButton"));
        Date date = new Date();
        LocalDate localDate = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        int year  = localDate.getYear();
        int month = localDate.getMonthValue();
        int day   = localDate.getDayOfMonth();
        Path path = Paths.get(folder + "/" + "SmartCRS_Questions-" + year + "-" + month + "-" + day + ".html");
        return path;

    }
    public void refreshPage() {
        sh.refresh();
    }

    public boolean refreshPageAndWaitForCommentToAppear(String commentId, String commentMsg) {
        this.refreshPage();
        return waitForCommentToAppear(commentId, commentMsg);
    }

    public boolean waitForCommentToAppear(String commentId, String commentMsg) {
        Comment c = commenting.getCommentDOMInformation(commentId);
        return c.content.equals(commentMsg);
    }

    public void setLocalStorageDate1DayBack(){
        LocalDateTime dt = LocalDateTime.now();
        LocalDateTime dayLater = dt.minusDays(1);
        long milliseconds = dayLater.toInstant(ZoneOffset.ofTotalSeconds(0)).toEpochMilli();

        JavascriptExecutor t = sh.getJavascriptExecutor();
        t.executeScript("var lastConnectionJSON = localStorage.getItem('lastConnection');" +
                "var lastConnection = JSON.parse(lastConnectionJSON);" +
                "var ms = +arguments[0];" +
                "lastConnection.date = new Date(ms).toString();" +
                "localStorage.setItem('lastConnection', JSON.stringify(lastConnection));", milliseconds);
    }

    public void setWaitTimeout(int seconds) {
        sh.setTimeout(seconds);
    }

    public void cloneLocalStorage(Student dest) {
        JavascriptExecutor sourceExec = sh.getJavascriptExecutor();
        Object localStorage = sourceExec.executeScript("return localStorage.getItem('lastConnection');");

        JavascriptExecutor destExec = dest.sh.getJavascriptExecutor();
        destExec.executeScript("localStorage.setItem('lastConnection', arguments[0]);", localStorage);

    }

    public class RoomWindow {
        private SelectRoomWindow win;
        public RoomWindow(SelectRoomWindow window) {
            this.win = window;
        }

        public boolean windowIsShown() {
            return win.windowIsShown();
        }

        public void joinRoomAndWait(String roomName, String roomPwd) {
            win.joinRoomAndWait(roomName, roomPwd, nickname);
        }

        public void joinRoomAndWaitWithNick(String roomName, String roomPwd, String customNickname) {
            win.joinRoomAndWait(roomName, roomPwd, customNickname);
        }

        public void joinRoom(String roomName, String roomPwd) {
            win.joinRoom(roomName, roomPwd, nickname);
        }

        public void joinRoomWithNick(String roomName, String roomPwd, String customNickname) {
            win.joinRoom(roomName, roomPwd, customNickname);
        }

        public void joinNotExistingRoom(String roomName, String roomPwd) {
            win.joinNotExistingRoom(roomName, roomPwd, nickname);
        }

        public void refreshRoomList() {
            win.refresh();
        }

        public int getNumRooms() { return win.getNumRooms(); }
        public boolean noRoomsShown() { return win.noRoomsShown(); }

        public boolean waitTillPwdInputRed() {
            return win.waitTillPwdInputRed();
        }

        public boolean waitTillNicknameInputRed() {
            return win.waitTillNicknameInputRed();
        }

        public boolean isJoinButtonEnabled() {
            return win.isJoinButtonEnabled();
        }

        public void refreshTillListEmpty() {
            win.refreshTillListEmpty();
        }

        public void refreshTillItemInList() {
            win.refreshTillItemInList();
        }

        public void selectRoom(String roomName) {
            win.selectMatchingRoom(roomName);
        }

        public boolean isRoomPwdInputEnabled() {
            return win.isRoomPwdInputEnabled();
        }

        public void joinByEnterHotkey() {
            win.joinByEnterHotkey();
        }
    }

    public class Commenting {
        HelperComments comments;
        public Commenting(HelperComments helperComments) {
            this.comments = helperComments;
        }

        public void sendComment(String content) {
            comments.sendComment(content);
        }

        public void upVote(String commentId) {
            comments.upVote(commentId);
        }

        public void downloadComment(String commentId) {
            comments.downloadComment(commentId);
        }

        public Comment getCommentDOMInformation(String commentId) {
            return comments.getDOMInformation(commentId);
        }
    }

    public class Connectivity {
        private ConnectivityIcon connIcon;

        public Connectivity(ConnectivityIcon connectivityIcon) {
            this.connIcon = connectivityIcon;
        }

        public boolean isConnectionStatusGreen() {
            return connIcon.isConnected();
        }

        public boolean isConnectionStatusRed() {
            return connIcon.isDisconnected();
        }
    }
}
