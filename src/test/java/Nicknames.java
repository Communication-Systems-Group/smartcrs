import framework.comments.Comment;
import framework.comments.CommentsAsserter;
import org.junit.Test;
import setups.TwoStudents;

import static junit.framework.TestCase.assertTrue;

/**
 * Created by Pascal on 17.04.2016.
 */
public class Nicknames extends TwoStudents {

    @Test
    public void nicknameCantBeStolen(){
        final String studentNick = "myNick";
        lecturer.createChannel(consts.defaultRoomName, consts.defaultRoomPwd, consts.defaultRoomPwd);
        student1.roomWindow.joinRoomAndWaitWithNick(consts.defaultRoomName, consts.defaultRoomPwd, studentNick);
        student2.roomWindow.joinRoomWithNick(consts.defaultRoomName, consts.defaultRoomPwd, studentNick);
        assertTrue(student2.roomWindow.waitTillNicknameInputRed());
    }

    @Test
    public void only1ConnectionPerNickname() {
        final String studentNick = "myNick";
        lecturer.createChannel(consts.defaultRoomName, consts.defaultRoomPwd, consts.defaultRoomPwd);
        student1.roomWindow.joinRoomAndWaitWithNick(consts.defaultRoomName, consts.defaultRoomPwd, studentNick);
        student1.cloneLocalStorage(student2);
        student1.refreshPage(); // relogin would result in failed test
        student2.roomWindow.joinRoomAndWaitWithNick(consts.defaultRoomName, consts.defaultRoomPwd, studentNick);
        Comment studCommentNew = new Comment().createMessageComment(studentNick, "I'm the new one", "c1", 0);
        Comment studCommentOld = new Comment().createMessageComment(studentNick, "I'm the old one", "c1", 0);

        student1.commenting.sendComment(studCommentOld.content);    // should not work
        student2.commenting.sendComment(studCommentNew.content);

        CommentsAsserter asserter = new CommentsAsserter();
        asserter.assertStudentMsg(student2, lecturer, studCommentNew);  // lecturer only receives new student's msg

        Comment undeliveredComment = student1.commenting.getCommentDOMInformation("c1");
        assertTrue(undeliveredComment.content.equals("...Your comment is being processed..."));
    }
}
