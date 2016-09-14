package framework.lecturer.notifications;

/**
 * Created by Pascal on 15.05.2016.
 */
public enum ThresholdTypes {
    ABSOLUTE("Absolute"), PERCENT("Percent");

    String type;

    ThresholdTypes(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return type;
    }
}
