import framework.Resources;
import framework.comments.Comment;
import framework.comments.CommentsAsserter;
import org.junit.Test;
import org.openqa.selenium.By;
import setups.OneStudent;

/**
 * Created by Pascal on 23.04.2016.
 */
public class MessagingBeforeLecture extends OneStudent {

    @Test
    public void lecturerCanPutUpFileCommentsBeforeTheLecture() {
        String filename = "10kb.txt";
        final String commentId = "c1";
        Comment fileComment = new Comment().createFileComment(consts.lecturerName, filename, commentId, 0);
        String file10kb = Resources.getFilepathFromResourceFolder(filename);
        lecturer.sendFile(file10kb);
        lecturer.sh.waitTillPresentInDom(By.id("infoNotConnected"));   // wait for 'lecturer not connected' popup
        lecturer.createChannel(consts.defaultRoomName, consts.defaultRoomPwd, consts.defaultRoomPwd);
        student1.joinRoomWithNickname(consts.defaultRoomName, consts.defaultRoomPwd);
        student1.commenting.getCommentDOMInformation(commentId); // wait for comment to arrive
        new CommentsAsserter().assertLecturerMsg(lecturer, student1, fileComment);
    }

    @Test
    public void lecturerCanPutUpMsgCommentsBeforeTheLecture() {
        final String commentId = "c1";
        Comment msgComment = new Comment().createMessageComment(consts.lecturerName, "lecMessage1", commentId, 0);
        lecturer.sendComment(msgComment.content);
        lecturer.sh.waitTillNotVisible(By.className("webix_modal"));    // wait for 'lecturer not connected' popup to disappear
        lecturer.createChannel(consts.defaultRoomName, consts.defaultRoomPwd, consts.defaultRoomPwd);
        student1.joinRoomWithNickname(consts.defaultRoomName, consts.defaultRoomPwd);
        student1.commenting.getCommentDOMInformation(commentId); // wait for comment to arrive
        new CommentsAsserter().assertLecturerMsg(lecturer, student1, msgComment);
    }
}
