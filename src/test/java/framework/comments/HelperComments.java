package framework.comments;

import framework.SeleniumHelper;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

/**
 * Created by Pascal on 23.02.2016.
 */
public class HelperComments {

    private SeleniumHelper sh;

    public HelperComments(SeleniumHelper sh) {
        this.sh = sh;
    }

    public void sendComment(String content) {
        WebElement textArea = sh.waitTillClickable(By.cssSelector(".textarea-wrapper .textarea"));
        textArea.sendKeys(content);
        textArea.click();   // activates send button
        sh.click(By.cssSelector(".send.save"));
    }

    public void upVote(String commentId) {
        String cssId = "li[data-id='" + commentId + "']";
        sh.click(By.cssSelector(cssId + " .upvote"));
    }

    public int getUpvotes(Comment comment) {
        final By upvoteCss = By.cssSelector("li[data-id='" + comment.id + "'] .upvote-count");
        int numUpvotes = Integer.parseInt(sh.getText(upvoteCss));
        return numUpvotes;
    }


    public Comment getDOMInformation(String commentId) {
        String cssId = "li[data-id='" + commentId + "']";
        Comment info = new Comment();

        info.id = commentId;
        info.author = sh.getText(By.cssSelector(cssId + " .comment-wrapper > .name"));
        info.content = sh.getText(By.cssSelector(cssId + " .comment-wrapper > .wrapper > .content"));
        info.date = sh.getText(By.cssSelector(cssId + " time[data-original]"));
        info.numUpvotes = Integer.parseInt(sh.getText(By.cssSelector(cssId + " .upvote")));

        if (sh.isPresent(By.cssSelector(cssId + " .content > .attachment"))) {
            info.filename = sh.getText(By.cssSelector(cssId + " .content > .attachment"));
            info.url = sh.getAttribute(By.cssSelector(cssId + " .content > .attachment"), "href");
        }

        return info;
    }

    public void sendFile(String absFilePath) {
        sh.click(By.cssSelector(".commenting-field.main .textarea"));
        sh.sendKeys(By.cssSelector(".enabled.upload input[type='file']"), absFilePath);
    }

    public void downloadComment(String commentId) {
        sh.click(By.cssSelector("li[data-id='" + commentId + "'] a"));
    }


}
