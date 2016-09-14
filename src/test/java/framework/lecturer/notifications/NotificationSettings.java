package framework.lecturer.notifications;

import framework.SeleniumHelper;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.Select;

/**
 * Created by Pascal on 15.05.2016.
 */
public class NotificationSettings {
    private final By dropdownButton = By.id("notificationSettingsDropdown");
    private final By thresholdInput = By.id("fieldThreshold");
    private final SeleniumHelper sh;

    public NotificationSettings(SeleniumHelper sh) {
        this.sh = sh;
    }

    public NotificationSettings setThreshold(int threshold, ThresholdTypes type) {
        showDropDown();
        final Select absPercent = new Select(sh.findElement(By.id("selAbsPercent")));
        absPercent.selectByVisibleText(type.toString());
        sh.clear(thresholdInput);
        sh.sendKeys(thresholdInput, Integer.toString(threshold));
        closeDropDown();
        return this;
    }

    public NotificationSettings setNotification(NotificationTypes threshold) {
        showDropDown();
        final Select notification = new Select(sh.findElement(By.id("buttonNotification")));
        notification.selectByVisibleText(threshold.toString());
        closeDropDown();
        return this;
    }

    private void showDropDown() {
        if (!sh.isDisplayed(thresholdInput)) {
            sh.click(dropdownButton);
        }
    }

    private void closeDropDown() {
        if (sh.isDisplayed(thresholdInput)) {
            sh.click(dropdownButton);
        }
    }
}
