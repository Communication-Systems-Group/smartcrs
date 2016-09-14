package setups;

import org.junit.Before;

/**
 * Created by Pascal on 01.03.2016.
 */
public class TwoStudentsLogin extends TwoStudents {

    @Before
    public void login() throws Exception {
        lecturer.createChannel(consts.defaultRoomName, "adminPwd", consts.defaultRoomPwd);
        student1.joinRoomWithNickname(consts.defaultRoomName, consts.defaultRoomPwd);
        student2.joinRoomWithNickname(consts.defaultRoomName, consts.defaultRoomPwd);
    }
}
