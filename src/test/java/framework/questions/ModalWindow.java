package framework.questions;

import com.google.common.base.Function;
import framework.SeleniumHelper;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

/**
 * Created by Pascal on 31.03.2016.
 */
public class ModalWindow {

    private final SeleniumHelper sh;

    public ModalWindow(SeleniumHelper sh) {
        this.sh = sh;
    }

    public void openNewQuestionEditorFor(QuestionRadioTypes type) {
        sh.click(By.id("buttonAddNewQuestion"));
        this.waitTillModalLoaded();
        sh.click(By.id(type.toString()));
    }

    public void openNewModal() {
        sh.click(By.id("buttonAddNewQuestion"));
        this.waitTillModalLoaded();
    }

    private void waitTillModalLoaded() {
        WebElement modalWindow = sh.findElement(By.cssSelector("#modalCreateQuestion"));
        sh.waitTillConditionIsTrue(new Function<WebDriver, Boolean>() {
            @Override
            public Boolean apply(WebDriver driver) {
                return modalWindow.getCssValue("opacity").equals("1");
            }
        });
    }

    public void saveQuestion() {
        sh.click(By.id("buttonAddQuestionToMainTable"));
    }

    public void closeModalWithWait() {
        closeModalWithWait(By.className("buttonCloseModal"));
    }

    public void closeModeNoWait() {
        sh.click(By.className("buttonCloseModal"));
    }

    public void closeEditModalWithSave() {
        closeModalWithWait(By.id("buttonModalApplyChanges"));
    }

    private void closeModalWithWait(By buttonId) {
        sh.click(buttonId);
        sh.waitTillNotVisible(By.cssSelector(".modal"));
    }

    public void openEditQuestionEditorFor(String questionText) {
        WebElement qTextCell = __findRowByQuestionText(questionText);
        sh.doubleClick(qTextCell);
        waitTillModalLoaded();
    }

    private WebElement __findRowByQuestionText(String questionText) {
        final List<WebElement> qTextCells = sh.findElements(By.className("qTextColumn"));
        for (WebElement cell : qTextCells) {
            if (cell.getText().equals(questionText)) {
                return cell;
            }
        }
        assert false;
        return null;
    }

    public boolean isModalVisible() {
        List<WebElement> modals = sh.findElements(By.className("modal"));
        for (WebElement modal : modals) {
            if (modal.isDisplayed()) {
                return true;
            }
        }
        return false;
    }

    public boolean isDirtyFormsErrorShown() {
        return sh.isPresent(By.cssSelector(".webix_modal_box.webix_alert"));
    }

    public void dirtyFormsErrorCloseModal() {
        sh.click(By.cssSelector(".webix_popup_button[result='0']"));
    }

    public void dirtyFormsErrorStayOnModal() {
        sh.click(By.cssSelector(".webix_popup_button[result='1']"));
    }
}
