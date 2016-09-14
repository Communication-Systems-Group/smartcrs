import framework.students.Student;
import org.junit.Test;
import org.openqa.selenium.chrome.ChromeDriver;
import setups.OneStudentLogin;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * Created by Pascal on 04.03.2016.
 */
public class Connectivity extends OneStudentLogin {

    @Test
    public void testConnectionStatusDisplays() {
        assertTrue(student1.connIcon.isConnectionStatusGreen());
        assertEquals(1, lecturer.getNumPeersConnected());

        Student student2 = new Student(new ChromeDriver(), "chromeStud2");
        student2.launchAndJoin(consts.defaultRoomName, consts.defaultRoomPwd);
        assertTrue(student1.connIcon.isConnectionStatusGreen());
        assertEquals(2, lecturer.getNumPeersConnected());

        student2.quit();
        assertTrue(student1.connIcon.isConnectionStatusGreen());
        assertEquals(1, lecturer.getNumPeersConnected());

        Student student3 = new Student(new ChromeDriver(), "chromeStud3");
        student3.launchAndJoin(consts.defaultRoomName, consts.defaultRoomPwd);
        assertTrue(student1.connIcon.isConnectionStatusGreen());
        assertEquals(2, lecturer.getNumPeersConnected());

        lecturer.quit();
        assertTrue(student1.connIcon.isConnectionStatusRed());
        assertTrue(student3.connIcon.isConnectionStatusRed());
        student3.quit();
    }

    @Test
    public void kickFunctionallity() {
        assertEquals(1, lecturer.getNumPeersConnected());
        lecturer.kick(student1.getNickname());
        assertEquals(0, lecturer.getNumPeersConnected());
    }
}