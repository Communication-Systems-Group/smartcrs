import org.junit.Test;
import setups.TwoStudentsLogin;

import java.util.List;

import static junit.framework.TestCase.assertTrue;

/**
 * Created by Pascal on 17.04.2016.
 */
public class NumAnsweredQuestions extends TwoStudentsLogin {

    @Test
    public void testDisplay() {
        lecturer.loadLectureFromResourceFolder("LoadLectureFile.json");
        lecturer.questions.shareAllQuestions();
        List<String> votes = lecturer.questions.getCurrentVotesOfAllQuestions();
        assertTrue(allVotesAre(votes, "0/2"));

        student1.lecturerQuestions.answerAllQuestions(1.0, "openAnswer", 0, 3);
        votes = lecturer.questions.getCurrentVotesOfAllQuestions();
        assertTrue(allVotesAre(votes, "1/2"));

        student2.lecturerQuestions.answerAllQuestions(2.0, "openAnswer2", 1, 3);
        votes = lecturer.questions.getCurrentVotesOfAllQuestions();
        assertTrue(allVotesAre(votes, "2/2"));
    }

    private boolean allVotesAre(List<String> list, String result) {
        for (String item : list){
            if (!item.equals(result)){
                return false;
            }
        }
        return true;
    }
}
