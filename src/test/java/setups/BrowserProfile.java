package setups;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxProfile;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;

import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Henriette on 01.04.2016.
 */

class BrowserProfile {

    ChromeDriver createChromeDriverWithDownloadFolder(String folder) {
        Map<String, Object> chromePrefs = new HashMap<String, Object>();
        chromePrefs.put("profile.default_content_settings.popups", 0);
        chromePrefs.put("download.default_directory", folder);
        chromePrefs.put("profile.content_settings.exceptions.automatic_downloads.*.setting", 1 );
        chromePrefs.put("download.prompt_for_download", false);

        ChromeOptions options = new ChromeOptions();
        options.setExperimentalOption("prefs", chromePrefs);
        DesiredCapabilities cap = DesiredCapabilities.chrome();
        cap.setCapability(CapabilityType.ACCEPT_SSL_CERTS, true);
        cap.setCapability(ChromeOptions.CAPABILITY, options);
        return new ChromeDriver(cap);
    }

    FirefoxDriver createFirefoxDriverWithDownloadFolder(String folder) {
        FirefoxProfile profile = new FirefoxProfile();
        profile.setPreference("browser.download.dir", folder);
        profile.setPreference("browser.download.folderList", 2);
        profile.setPreference("browser.helperApps.neverAsk.openFile", "application/xml,text/plain,text/xml,image/jpeg,text/csv");
        profile.setPreference("browser.helperApps.neverAsk.saveToDisk", "application/xml,text/plain,text/xml,image/jpeg,text/csv,application/octet-stream,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel");
        return new FirefoxDriver(profile);
    }

    WebDriver createDownloadFolder(String driverClass, Path lecturerFolder) {
        if (driverClass.endsWith("ChromeDriver")) {
            return createChromeDriverWithDownloadFolder(lecturerFolder.toString());
        } else {
            return createFirefoxDriverWithDownloadFolder(lecturerFolder.toString());
        }

    }
}
