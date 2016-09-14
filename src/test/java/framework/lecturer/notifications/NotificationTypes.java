package framework.lecturer.notifications;

/**
 * Created by Pascal on 15.05.2016.
 */
public enum NotificationTypes {
    PLAY_SOUND("Play Sound"), POPUP("Show Popup"), SOUND_AND_POPUP("Play Sound & Show Popup"), NO_NOTIFICATION("Don't notify me");

    String type;

    NotificationTypes(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return type;
    }
}
