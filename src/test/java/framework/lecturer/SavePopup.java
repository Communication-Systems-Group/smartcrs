package framework.lecturer;

import framework.SeleniumHelper;
import framework.utils.FileSystem;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import setups.LecturerOnly;

import java.nio.file.Paths;

/**
 * Created by Pascal on 23.04.2016.
 */
public class SavePopup extends LecturerOnly {

    private final SeleniumHelper sh;
    private String openPopupButtonId = "saveButtonLecturerRun";
    private String saveLectureWindowCSS = ".webix_window[view_id='saveLectureWindow']";
    private String inputFilenameCSS = ".webix_el_text[view_id='savePopupFilename'] input";
    private String saveButtonCSS = ".webix_el_button[view_id='submitButton']";
    public enum CheckboxNames {
        QsWithoutStats(".webix_el_checkbox[view_id='checkboxQuestions'] input"),
        QsWithStats(".webix_el_checkbox[view_id='checkboxStats'] input"),
        NotificationSettings(".webix_el_checkbox[view_id='checkboxNotificationSettings'] input"),
        CommentsAndFiles(".webix_el_checkbox[view_id='checkboxComments'] input");

        private String css;
        CheckboxNames(String css) {
            this.css = css;
        }

        public String getCSS(){
            return css;
        }
    }

    public SavePopup(SeleniumHelper sh) {
        this.sh = sh;
    }

    public SavePopup openPopup() {
        sh.click(By.id(this.openPopupButtonId));
        return this;
    }

    public SavePopup deselectAllCheckBoxes(){
        deselectCheckboxes(CheckboxNames.class.getEnumConstants());
        return this;
    }

    public SavePopup selectAllCheckBoxes(){
        selectCheckboxes(CheckboxNames.class.getEnumConstants());
        return this;
    }

    public SavePopup selectCheckboxes(CheckboxNames... checkboxNames) {
        for (CheckboxNames checkboxName : checkboxNames) {
            WebElement checkbox = sh.findElement(By.cssSelector(checkboxName.getCSS()));
            if (isCheckboxDisabled(checkbox)){
                sh.click(checkbox);
            }
        }
        return this;
    }

    public void deselectCheckboxes(CheckboxNames... checkboxNames) {
        for (CheckboxNames checkboxName : checkboxNames) {
            WebElement checkbox = sh.findElement(By.cssSelector(checkboxName.getCSS()));
            if (!isCheckboxDisabled(checkbox)){
                sh.click(checkbox);
            }
        }
    }

    public SavedFiles saveAsAndClose(String folder, String filename) {
        sh.sendKeys(By.cssSelector(inputFilenameCSS), filename);
        return saveAndClose(folder, filename);
    }

    public SavedFiles saveAllAsAndClose(String folder, String filename) {
        selectAllCheckBoxes();
        sh.sendKeys(By.cssSelector(inputFilenameCSS), filename);
        return saveAndClose(folder, filename);
    }

    private SavedFiles saveAndClose(String folder, String filename) {
        sh.click(By.cssSelector(saveButtonCSS));
        sh.waitTillNotVisible(By.cssSelector(saveLectureWindowCSS));

        final String savedTxtPath = Paths.get(folder, filename + ".txt").toString();
        final String savedXlsPath = Paths.get(folder, filename + ".xls").toString();
        FileSystem.waitTillFileExists(savedTxtPath);

        return new SavedFiles(savedTxtPath, savedXlsPath);
    }

    private boolean isCheckboxDisabled(WebElement checkbox) {
        return !checkbox.isSelected();
    }

    public class SavedFiles {
        public final String txtFilePath;
        public final String xlsFilePath;

        public SavedFiles(String txtFilePath, String xlsFilePath) {
            this.txtFilePath = txtFilePath;
            this.xlsFilePath = xlsFilePath;
        }
    }
}
