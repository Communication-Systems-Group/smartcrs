import org.junit.Test;
import setups.OneStudentLogin;

import static org.junit.Assert.assertEquals;

/**
 * Created by Pascal on 17.05.2016.
 */
public class QuestionQueue extends OneStudentLogin {

    @Test
    public void orderIsPreservedAndOnly1QuestionShownAtOnce() {
        lecturer.loadLectureFromResourceFolder("QuestionCreation.json");
        lecturer.questions.shareNthQuestion(1); // Mc
        lecturer.questions.shareNthQuestion(3); // Rating
        lecturer.questions.shareNthQuestion(2); // Open

        int numResponseWindows = student1.lecturerQuestions.getNumResponseWindowPresent();
        assertEquals(1, numResponseWindows);
        student1.lecturerQuestions.answerMcQuestion(0, student1.lecturerQuestions.findResponseWindow());
        student1.lecturerQuestions.answerRatingQuestion(2d, student1.lecturerQuestions.findResponseWindow());
        student1.lecturerQuestions.answerOpenQuestion("answer", student1.lecturerQuestions.findResponseWindow());
    }
}
