package framework.students;


import com.google.common.base.Function;
import framework.SeleniumHelper;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

/**
 * Created by Pascal on 07.03.2016.
 */
public class SelectRoomWindow {

    private SeleniumHelper sh;
    private String listCss = ".webix_view.webix_list[view_id='selectRoomList'] .webix_list_item";
    private String pwdInputCss = "div[view_id='roomPwdInput'] input";
    private String nicknameInputCss = "div[view_id='nicknameInput'] input";
    private String joinButtonCss = ".webix_view.webix_control.webix_el_button[view_id='joinButton'] button";
    private String refreshButtonCss = ".webix_view.webix_control.webix_el_button[view_id='refreshRoomsButton'] button";

    public SelectRoomWindow(SeleniumHelper sh) {
        this.sh = sh;
    }

    public void joinRoomAndWait(String roomName, String roomPwd, String nickname) {
        refreshTillItemInList();
        join(roomName, roomPwd, nickname);
        sh.waitTillNotVisible(By.cssSelector(refreshButtonCss)); // wait till window disappears
    }

    public void joinRoom(String roomName, String roomPwd, String nickname) {
        refreshTillItemInList();
        join(roomName, roomPwd, nickname);
    }

    public void joinNotExistingRoom(String roomName, String roomPwd, String nickname) {
        join(roomName, roomPwd, nickname);
        // wait till outdated room has been removed from list
        sh.waitTillNotVisible(By.cssSelector(listCss + "[webix_l_id='" + roomName + "']"));
    }

    public void refresh() {
        sh.click(By.cssSelector(refreshButtonCss));
    }


    public int getNumRooms() {
        return sh.findElements(By.cssSelector(listCss)).size();
    }

    public boolean noRoomsShown() {
        return !sh.isPresent(By.cssSelector(listCss));
    }

    public void refreshTillListEmpty() {
        sh.waitTillConditionIsTrue(new Function<WebDriver, Boolean>() {
            public Boolean apply(WebDriver driver) {
                refresh();
                return !sh.isPresent(By.cssSelector(listCss));
            }
        });
    }

    public void refreshTillItemInList() {
        sh.waitTillConditionFindsElement(new Function<WebDriver, WebElement>() {
            public WebElement apply(WebDriver driver) {
                refresh();
                return driver.findElement(By.cssSelector(listCss));
            }
        });
    }

    private void join(String roomName, String roomPwd, String nickname) {
        if (selectMatchingRoom(roomName)) {
            writeRoomPwd(roomPwd);
            writeNickname(nickname);
            clickJoinButton();
        }
    }

    public boolean selectMatchingRoom(String roomName) {
        return sh.waitTillConditionIsTrue(new Function<WebDriver, Boolean>() {
            public Boolean apply(WebDriver driver) {
                List<WebElement> rooms = sh.findElements(By.cssSelector(listCss));
                for (WebElement room : rooms) {
                    String name = room.getText();
                    if (name.equals(roomName)) {
                        try {
                            sh.click(room);
                            return true;
                        } catch (Exception e) {}
                    }
                }
                return false;
            }
        });
    }

    private void clickJoinButton() {
        sh.click(By.cssSelector(joinButtonCss));
    }

    private void writeRoomPwd(String roomPwd) {
        final By cssSelector = By.cssSelector(pwdInputCss);
        sh.clear(cssSelector);
        sh.sendKeys(cssSelector, roomPwd);
    }

    private void writeNickname(String nickname) {
        final By cssSelector = By.cssSelector(nicknameInputCss);
        sh.clear(cssSelector);
        sh.sendKeys(cssSelector, nickname);
    }

    public boolean waitTillPwdInputRed() {
        By CSS = By.cssSelector(pwdInputCss);
        return waitTillFieldTurnsRed(CSS);
    }

    public boolean waitTillNicknameInputRed() {
        By CSS = By.cssSelector(nicknameInputCss);
        return waitTillFieldTurnsRed(CSS);
    }

    private boolean waitTillFieldTurnsRed(final By CSS) {
        return sh.waitTillConditionIsTrue(new Function<WebDriver, Boolean>() {
            public Boolean apply(WebDriver driver) {
                return isFieldBackgroundRed(CSS);
            }
        });
    }

    private boolean isFieldBackgroundRed(By byInput) {
        WebElement input = sh.findElement(byInput);
        String bgColor = input.getCssValue("background-color");
        return bgColor.equals("rgba(255, 0, 0, 1)");
    }

    public boolean isJoinButtonEnabled() {
        final WebElement joinButton = sh.findElement(By.cssSelector(".webix_el_button[view_id='joinButton']"));
        return isWebixComponentEnabled(joinButton);
    }

    public boolean isRoomPwdInputEnabled() {
        final WebElement roomPwdInput = sh.findElement(By.cssSelector("div[view_id='roomPwdInput']"));
        return isWebixComponentEnabled(roomPwdInput);
    }

    private boolean isWebixComponentEnabled(WebElement roomPwdInput) {
        String classes = roomPwdInput.getAttribute("class");
        boolean isDisabled = classes.contains("webix_disabled_view");
        return !isDisabled;
    }

    public boolean windowIsShown() {
        sh.waitTillClickable(By.cssSelector(this.refreshButtonCss));
        return true;
    }

    public void joinByEnterHotkey() {
        sh.sendKeys(By.cssSelector(refreshButtonCss), Keys.ENTER);
    }
}
