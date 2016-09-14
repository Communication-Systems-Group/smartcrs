package framework.questions;

/**
 * Created by Pascal on 16.05.2016.
 */
public enum QuestionRadioTypes {
    rating("qScale"), mc("qMc"), open("qOpen");

    private final String type;

    QuestionRadioTypes(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return type;
    }
}
