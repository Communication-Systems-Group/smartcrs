package framework.lecturer;

import framework.SeleniumHelper;
import org.openqa.selenium.By;

/**
 * Created by Pascal on 04.03.2016.
 */
public class NumPeersConnected {
    private String css = "#numPeers";
    private SeleniumHelper sh;

    public NumPeersConnected(SeleniumHelper sh) {
        this.sh = sh;
    }

    public int get() {
        return Integer.parseInt(sh.getText(By.cssSelector(css)));
    }
}
