import framework.comments.Comment;
import framework.comments.CommentsAsserter;
import org.junit.Test;
import setups.OneStudentLogin;

import static junit.framework.TestCase.assertTrue;

/**
 * Created by Pascal on 17.04.2016.
 */
public class AutoReconnect extends OneStudentLogin {

    @Test
    public void studentReceivesHisMsgAfterReconnectAndCanSendAnother() {
        final String beforeMsg = "Before refresh";
        Comment studComment = new Comment().createMessageComment(student1.getNickname(), beforeMsg, "c1", 0);
        student1.commenting.sendComment(studComment.content);
        CommentsAsserter asserter = new CommentsAsserter();
        asserter.assertStudentMsg(student1, lecturer, studComment);
        assertTrue(student1.refreshPageAndWaitForCommentToAppear("c1", beforeMsg));

        student1.commenting.sendComment("After refresh");
        assertTrue(student1.waitForCommentToAppear("c1", beforeMsg));
    }

    @Test
    public void autoreconnectDoesntWorkIfLastConnectionIsOutdated() {
        student1.setLocalStorageDate1DayBack();
        student1.refreshPage();
        assertTrue(student1.roomWindow.windowIsShown());
        final String newNickname = "newNickname";
        student1.roomWindow.joinRoomAndWaitWithNick(consts.defaultRoomName, consts.defaultRoomPwd, newNickname);

        Comment studComment = new Comment().createMessageComment(newNickname, "manual reconnect worked", "c1", 0);
        student1.commenting.sendComment(studComment.content);
        CommentsAsserter asserter = new CommentsAsserter();
        asserter.assertStudentMsg(student1, lecturer, studComment);
    }

    @Test
    public void questionsInLocalStorageAreRemovedIfLastConnectionOutdated() {
        lecturer.loadLectureFromResourceFolder("LoadLectureFile.json");
        lecturer.questions.shareAllQuestions();
        student1.lecturerQuestions.answerAllQuestions(3.0, "openAnswerFirstTime", 0, 3);
        student1.setLocalStorageDate1DayBack();
        student1.refreshPage();
        assertTrue(student1.roomWindow.windowIsShown());
        final String newNickname = "newNickname";
        student1.roomWindow.joinRoomAndWaitWithNick(consts.defaultRoomName, consts.defaultRoomPwd, newNickname);

        Comment studComment = new Comment().createMessageComment(newNickname, "manual reconnect worked", "c1", 0);
        student1.commenting.sendComment(studComment.content);
        CommentsAsserter asserter = new CommentsAsserter();
        asserter.assertStudentMsg(student1, lecturer, studComment);

        student1.lecturerQuestions.answerAllQuestions(4.0, "openAnswerSecondTime", 1, 3);
    }
}
