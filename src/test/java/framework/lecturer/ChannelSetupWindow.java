package framework.lecturer;


import framework.SeleniumHelper;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;

/**
 * Created by Pascal on 07.03.2016.
 */
public class ChannelSetupWindow {

    private SeleniumHelper sh;
    private String windowCSS = ".webix_window[view_id='channelSetupWindow']";
    private String roomNameInputCSS = ".webix_el_text[view_id='roomName'] input";
    private String adminPwdInputCSS = ".webix_el_text[view_id='adminPwdInput'] input";
    private String roomPwdInputCSS = ".webix_el_text[view_id='roomPwdInput'] input";


    public ChannelSetupWindow(SeleniumHelper sh) {
        this.sh = sh;
    }

    public void createChannel(String roomName, String adminPwd, String roomPwd) {
        setInputField(roomNameInputCSS, roomName);
        setInputField(adminPwdInputCSS, adminPwd);
        setInputField(roomPwdInputCSS, roomPwd);
        submit();
    }

    public boolean isWindowVisible() {
        return sh.isPresent(By.cssSelector(windowCSS));
    }

    private void setInputField(String css, String text) {
        By by = By.cssSelector(css);
        sh.sendKeys(by, text);
        sh.sendKeys(by, Keys.TAB);
    }

    private void submit() {
        sh.getFocussedElement().sendKeys(Keys.ENTER);
    }
}
