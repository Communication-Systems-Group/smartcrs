package framework.students;

import framework.SeleniumHelper;
import org.openqa.selenium.By;

/**
 * Created by Pascal on 04.03.2016.
 */
public class ConnectivityIcon {
    private By cssConnected = By.cssSelector("#connectionStatusIcon.connected");
    private By cssDisconnected = By.cssSelector("#connectionStatusIcon.disconnected");
    private SeleniumHelper sh;

    public ConnectivityIcon(SeleniumHelper sh) {
        this.sh = sh;
    }

    public boolean isConnected() {
        return sh.isPresent(cssConnected);
    }

    public boolean isDisconnected() {
        return sh.isPresent(cssDisconnected);
    }
}
