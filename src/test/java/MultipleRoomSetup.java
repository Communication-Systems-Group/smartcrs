import framework.lecturer.Lecturer;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.openqa.selenium.firefox.FirefoxDriver;
import setups.TwoStudents;

import static org.junit.Assert.assertEquals;

/**
 * Created by Pascal on 07.03.2016.
 */
public class MultipleRoomSetup extends TwoStudents {
    private Lecturer lecturer2;
    private final String roomName2 = consts.defaultRoomName + "2";

    @Before
    public void setupActors() {
        lecturer2 = new Lecturer(new FirefoxDriver());
        lecturer2.launchWebsite();

        lecturer.createChannel(consts.defaultRoomName, consts.defaultRoomPwd, consts.defaultRoomPwd);
        lecturer2.createChannel(roomName2, consts.defaultRoomPwd, consts.defaultRoomPwd);

        student1.joinRoomWithNickname(consts.defaultRoomName, consts.defaultRoomPwd);
        student2.joinRoomWithNickname(roomName2, consts.defaultRoomPwd);
    }

    @After
    public void removeActors() {
        lecturer2.quit();
    }

    @Rule public ExpectedException thrown=ExpectedException.none();
    @Test
    public void twoRoomsMsgsStayInRoom() {
        final String room1Msg = "Room1";
        lecturer.sendComment(room1Msg);

        assertEquals(room1Msg, student1.commenting.getCommentDOMInformation("c1").content);
        thrown.expect( org.openqa.selenium.TimeoutException.class );
        student2.commenting.getCommentDOMInformation("c1");

        final String room2Msg = "Room2";
        lecturer2.sendComment(room2Msg);
        assertEquals(room2Msg, student2.commenting.getCommentDOMInformation("c1").content);
        thrown.expect( org.openqa.selenium.TimeoutException.class );
        student1.commenting.getCommentDOMInformation("c2");
    }
}