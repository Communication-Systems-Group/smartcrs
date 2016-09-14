package framework;

import com.google.common.base.Function;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.FluentWait;
import org.openqa.selenium.support.ui.Wait;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;
import java.util.concurrent.*;

/**
 * Created by Pascal on 21.02.2016.
 */
public class SeleniumHelper {

    private WebDriver driver;
    public final Constants consts;
    private int timeout = 5;

    public SeleniumHelper(WebDriver driver) {
        this.driver = driver;
        consts = Constants.createInstance();
    }

    public int setTimeout(int timeout) {
        int oldTimeout = this.timeout;
        this.timeout = timeout;
        return oldTimeout;
    }

    public void quit() {
        driver.quit();
    }

    public void click(By id) {
        final WebElement el = findElement(id);
        waitForClick(el).click();
    }

    public void click(WebElement el) {
        waitForClick(el).click();
    }

    private WebElement waitForClick(WebElement el) {
        Wait<WebDriver> wait = new FluentWait<WebDriver>(driver)
                .withTimeout(timeout, TimeUnit.SECONDS)
                .pollingEvery(1, TimeUnit.SECONDS)
                .ignoring(NoSuchElementException.class)
                .ignoring(WebDriverException.class);

        return wait.until(ExpectedConditions.elementToBeClickable(el));
    }

    public void doubleClick(WebElement el) {
        Actions action = new Actions(driver);
        action.doubleClick(el).perform();
    }

    public void clear(By id) {
        WebElement el = findElement(id);
        el.clear();
    }

    public Keys getKey(String key) {
        return Keys.valueOf(key);
    }

    public WebElement waitTillClickable(By id) {
        return (new WebDriverWait(driver, timeout))
                .until(ExpectedConditions.elementToBeClickable(id));
    }

    public WebElement waitTillPresentInDom(By id) {
        return (new WebDriverWait(driver, timeout))
                .until(ExpectedConditions.presenceOfElementLocated(id));
    }


    public void waitTillConditionFindsElement(Function<WebDriver, WebElement> func) {
        Wait<WebDriver> wait = new FluentWait<WebDriver>(driver)
                .withTimeout(timeout, TimeUnit.SECONDS)
                .pollingEvery(1, TimeUnit.SECONDS)
                .ignoring(NoSuchElementException.class);

        wait.until(func);
    }

    public Boolean waitTillConditionIsTrue(Function<WebDriver, Boolean> func) {
        Wait<WebDriver> wait = new FluentWait<WebDriver>(driver)
                .withTimeout(timeout, TimeUnit.SECONDS)
                .pollingEvery(100, TimeUnit.MILLISECONDS)
                .ignoring(NoSuchElementException.class)
                .ignoring(org.openqa.selenium.TimeoutException.class);

        return wait.until(func);
    }

    public void waitTillNotVisible(final By locator) {
        new WebDriverWait(driver, timeout).until(ExpectedConditions.invisibilityOfElementLocated(locator));
    }

    public String getText(By id) {
        return this.waitTillClickable(id).getText();
    }

    public String getTextFromTextarea(By id) {
        return this.getAttribute(id, "value");
    }

    /**
     * isDisplayed is true only if isPresent is true and element is visible
     */
    public boolean isDisplayed(By id) {
        if (!isPresent(id)) {
            return false;
        }
        WebElement el = findElement(id);
        return el.isDisplayed();
    }

    /**
     * isPresent is true if element exists in a page (in DOM), but can be hidden (display: none in css)
     */
    public boolean isPresent(By id) {
        return driver.findElements(id).size() > 0;
    }

    public boolean isPresentInElement(WebElement el, By id) {
        return el.findElements(id).size() > 0;
    }

    public String getAttribute(By id, String attribute) {
        WebElement el = driver.findElement(id);
        return el.getAttribute(attribute);
    }

    public WebElement findElement(By id) {
        waitTillPresentInDom(id);
        return driver.findElement(id);
    }

    public List<WebElement> findElements(By id) {
        waitTillPresentInDom(id);
        return driver.findElements(id);
    }

    public void sendKeys(By id, String content) {
        WebElement el = findElement(id);
        el.sendKeys(content);
    }

    public void sendKeys(WebElement el, String content) {
        el.sendKeys(content);
    }

    public void sendKeys(By id, Keys key) {
        WebElement el = findElement(id);
        el.sendKeys(key);
    }

    public JavascriptExecutor getJavascriptExecutor() {
        driver.manage().timeouts().setScriptTimeout(timeout, TimeUnit.SECONDS);
        JavascriptExecutor js;
        if (driver instanceof JavascriptExecutor) {
            js = (JavascriptExecutor)driver;
        } else {
            throw new IllegalStateException("This driver does not support JavaScript!");
        }
        return js;
    }

    public WebElement getFocussedElement() {
         return driver.switchTo().activeElement();
    }

    public WebDriver.Window getDriverWindow() {
        return driver.manage().window();
    }

    public void refresh() {
        driver.navigate().refresh();
    }

    public void setCssAttribute(WebElement element, String attName, String attValue) {
        JavascriptExecutor js = getJavascriptExecutor();
        js.executeScript("$(arguments[0]).css(arguments[1], arguments[2]);",
                element, attName, attValue);
    }
}
