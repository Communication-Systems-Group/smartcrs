import framework.lecturer.notifications.NotificationTypes;
import framework.lecturer.notifications.ThresholdTypes;
import org.junit.Test;
import setups.TwoStudentsLogin;

import static org.junit.Assert.assertEquals;

/**
 * Created by Pascal on 17.05.2016.
 */
public class Notifications extends TwoStudentsLogin {
    @Test
    public void Threshold0ShouldBeTriggeredOnSingleUnvotedComment() {
        lecturer.initTestDiv();
        lecturer.notificationSettings.setNotification(NotificationTypes.PLAY_SOUND);
        lecturer.notificationSettings.setThreshold(0, ThresholdTypes.ABSOLUTE);
        student1.commenting.sendComment("This should trigger a notification");
        String notificationAlert = lecturer.getTestDivText();
        final String expected = "Notification Type: 'Play Sound' Comment: 'This should trigger a notification'";
        assertEquals(expected, notificationAlert);
    }

    @Test
    public void Threshold1ShouldNotTriggerOnSingleUnvotedComment() {
        lecturer.initTestDiv();
        lecturer.notificationSettings.setNotification(NotificationTypes.NO_NOTIFICATION);
        lecturer.notificationSettings.setThreshold(1, ThresholdTypes.ABSOLUTE);
        student1.commenting.sendComment("This should not trigger a notification");
        String notificationAlert = lecturer.getTestDivText();
        final String expected = "";
        assertEquals(expected, notificationAlert);
    }

    @Test
    public void Threshold50PercentTriggers() {
        lecturer.initTestDiv();
        lecturer.notificationSettings.setNotification(NotificationTypes.SOUND_AND_POPUP);
        lecturer.notificationSettings.setThreshold(50, ThresholdTypes.PERCENT);
        student1.commenting.sendComment("This should trigger after upvote");
        String notificationAlert1 = lecturer.getTestDivText();
        String expectNoAlert = "";
        assertEquals(expectNoAlert, notificationAlert1);

        student2.commenting.upVote("c1");
        String notificationAlert2 = lecturer.getTestDivText();
        final String expected = "Notification Type: 'Play Sound & Show Popup' Comment: 'This should trigger after upvote'";
        assertEquals(expected, notificationAlert2);
    }
}