import framework.Settings;
import framework.comments.Comment;
import framework.comments.CommentsAsserter;
import framework.lecturer.Lecturer;
import org.junit.Test;
import setups.OneStudent;

import static org.junit.Assert.*;

/**
 * Created by Pascal on 07.03.2016.
 */
public class RoomSetup extends OneStudent{
    @Test
    public void studentJoinsObsoleteRoom() {
        lecturer.createChannel(consts.defaultRoomName, "adminPwd", consts.defaultRoomPwd);
        student1.roomWindow.refreshRoomList();
        lecturer.leaveChannel();
        student1.roomWindow.joinNotExistingRoom(consts.defaultRoomName, consts.defaultRoomPwd);
        assertTrue(student1.roomWindow.noRoomsShown());
    }

    @Test
    public void wrongRoomPwdLeadsToRedFieldAndCorrectLoginStillPossible() {
        lecturer.createChannel(consts.defaultRoomName, "adminPwd", consts.defaultRoomPwd);

        student1.roomWindow.refreshRoomList();
        student1.roomWindow.joinRoom(consts.defaultRoomName, "wrongPwd");

        boolean isRed = student1.roomWindow.waitTillPwdInputRed();
        assertTrue(isRed);

        student1.roomWindow.joinRoom(consts.defaultRoomName, consts.defaultRoomPwd);
        Comment msgComment = new Comment().createMessageComment(consts.lecturerName, "lecMessage1", "c1", 0);
        lecturer.sendComment(msgComment.content);
        new CommentsAsserter().assertLecturerMsg(lecturer, student1, msgComment);
    }

    @Test
    public void wrongNicknameLeadsToRedFieldAndCorrectLoginStillPossible() {
        lecturer.createChannel(consts.defaultRoomName, "adminPwd", consts.defaultRoomPwd);

        student1.roomWindow.refreshRoomList();
        student1.roomWindow.joinRoomWithNick(consts.defaultRoomName, consts.defaultRoomPwd, consts.lecturerName);

        boolean isRed = student1.roomWindow.waitTillNicknameInputRed();
        assertTrue(isRed);

        student1.roomWindow.joinRoomWithNick(consts.defaultRoomName, consts.defaultRoomPwd, "LegitimateNick");

        Comment msgComment = new Comment().createMessageComment(consts.lecturerName, "lecMessage1", "c1", 0);
        lecturer.sendComment(msgComment.content);
        new CommentsAsserter().assertLecturerMsg(lecturer, student1, msgComment);
    }


    @Test
    public void joinButtonState() {
        lecturer.createChannel(consts.defaultRoomName, consts.defaultRoomPwd, consts.defaultRoomPwd);
        student1.roomWindow.refreshTillItemInList();
        assertTrue(student1.roomWindow.isJoinButtonEnabled());
        student1.roomWindow.selectRoom(consts.defaultRoomName);
        assertTrue(student1.roomWindow.isJoinButtonEnabled());

        lecturer.leaveChannel();
        student1.roomWindow.refreshTillListEmpty();
        assertFalse(student1.roomWindow.isJoinButtonEnabled());

        final String newRoomName = consts.defaultRoomName + 2;
        lecturer.createChannel(newRoomName, consts.defaultRoomPwd, consts.defaultRoomPwd);
        student1.roomWindow.refreshTillItemInList();
        assertTrue(student1.roomWindow.isJoinButtonEnabled());
        student1.roomWindow.selectRoom(newRoomName);
        assertTrue(student1.roomWindow.isJoinButtonEnabled());

        int numChannels = student1.roomWindow.getNumRooms();
        assertEquals(1, numChannels);
    }

    @Test
    public void studentEntersNicknameOfLecturer() {
        lecturer.createChannel(consts.defaultRoomName, consts.defaultRoomPwd, consts.defaultRoomPwd);
        student1.roomWindow.joinRoomWithNick(consts.defaultRoomName, consts.defaultRoomPwd, consts.lecturerName);
        assertTrue(student1.roomWindow.waitTillNicknameInputRed());
    }

    @Test
    public void roomPwdTogglesRoomPwdInputState() {
        Lecturer lecWithRoomPwd = new Lecturer(Settings.getLecturerDriver());
        try {
        lecWithRoomPwd.launchWebsite();
        lecturer.createChannel(consts.defaultRoomName, consts.defaultRoomPwd, "");
        final String roomNameWithPwd = "RoomWithPwd";
        lecWithRoomPwd.createChannel(roomNameWithPwd, consts.defaultRoomPwd, consts.defaultRoomPwd);
        student1.roomWindow.refreshTillItemInList();

        student1.roomWindow.selectRoom(consts.defaultRoomName);
        assertFalse(student1.roomWindow.isRoomPwdInputEnabled());
        student1.roomWindow.selectRoom(roomNameWithPwd);
        assertTrue(student1.roomWindow.isRoomPwdInputEnabled());
        } finally {
            lecWithRoomPwd.quit();
        }
    }

    @Test
    public void joiningByEnterWithoutSelectingARoom() {
        student1.roomWindow.joinByEnterHotkey();
        assertTrue(student1.roomWindow.windowIsShown());
    }
}