import framework.Settings;
import framework.lecturer.Lecturer;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import setups.LecturerOnly;

import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.assertFalse;

/**
 * Created by Pascal on 23.04.2016.
 */
public class AdminPwd extends LecturerOnly {
    private Lecturer lecturer2;

    @Before
    public void setupActors() {
        lecturer2 = new Lecturer(Settings.getLecturerDriver());
        lecturer2.launchWebsite();
    }

    @After
    public void removeActors() {
        lecturer2.quit();
    }

    @Test
    public void roomCantBeStolenWithWrongAdminPwd(){
        lecturer.createChannel(consts.defaultRoomName, consts.defaultRoomPwd, consts.defaultRoomPwd);
        lecturer2.createChannel(consts.defaultRoomName, "wrongAdminPwd", consts.defaultRoomPwd);
        assertFalse(lecturer.isChannelSetupWindowVisible());    // used to give lecturer2 time to close window
        assertTrue(lecturer2.isChannelSetupWindowVisible());
    }
}
