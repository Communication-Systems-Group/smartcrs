package framework.lecturer;

import framework.SeleniumHelper;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;

/**
 * Created by Pascal on 04.03.2016.
 */
public class PeerTableMgr {
    private SeleniumHelper sh;
    private String tableCss = ".webix_view.webix_dtable[view_id=peerTable]";
    private String nicknameColumnCss = ".webix_view.webix_dtable[view_id=peerTable] div[column='2'] .webix_cell";
    private String kickColumnCss = ".webix_view.webix_dtable[view_id=peerTable] div[column='4'] button";

    public PeerTableMgr(SeleniumHelper sh) {
        this.sh = sh;
    }

    private void open() {
        sh.click(By.id("connectedPeers"));
        sh.waitTillPresentInDom(By.cssSelector(tableCss));
    }

    public void kick(String nickname) {
        open();
        List<WebElement> nicks = sh.findElements(By.cssSelector(nicknameColumnCss));
        List<WebElement> kickButtons = sh.findElements(By.cssSelector(kickColumnCss));
        for (int i = 0; i < nicks.size(); i++) {
            WebElement nick = nicks.get(i);
            if (nick.getText().equals(nickname)) {
                final WebElement kickButton = kickButtons.get(i);
                kickButton.click();
            }
        };
    }
}
