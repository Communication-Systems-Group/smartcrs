package setups;

import org.junit.Before;

/**
 * Created by Pascal on 01.03.2016.
 */
public class OneStudentLogin extends OneStudent {
    public OneStudentLogin() {
        super();
    }

    @Before
    public void login() throws Exception {
        lecturer.createChannel(consts.defaultRoomName, "adminPwd", consts.defaultRoomPwd);
        student1.joinRoomWithNickname(consts.defaultRoomName, consts.defaultRoomPwd);
    }
}
