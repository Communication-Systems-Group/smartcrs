import framework.FileAsserter;
import framework.Resources;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import setups.OneStudentLogin;

import java.nio.file.Path;
import java.util.List;

import static junit.framework.TestCase.assertEquals;

public class LecturerQuestionsInteraction extends OneStudentLogin {
    @Rule
    public ExpectedException exception = ExpectedException.none();


    @Test
    public void shareAndAnswerAll3QuestionTypes() throws Exception {
        lecturer.loadLectureFromResourceFolder("QuestionCreation.json");

        lecturer.questions.shareAllQuestions();
        student1.lecturerQuestions.answerAllQuestions(5.00, "answer from student", 1, 3);

        String statsData = (String) lecturer.getStatsData();
        String noPeerIds = statsData.replaceAll("\"peerIDsVoted\":\\[\".+?\"\\],", "");
        String origPath = Resources.getFilepathFromResourceFolder("QuestionInteraction.json");
        Path tempFile = FileAsserter.generateTempFile(noPeerIds, tempFolder, "tempFile.json");
        FileAsserter.JSONequals(origPath, tempFile.toString());
    }

    @Test
    public void studentDeclinesToAnswerQuestion(){
        lecturer.loadLectureFromResourceFolder("QuestionCreation.json");
        lecturer.questions.shareAllQuestions();
        student1.lecturerQuestions.dismissAllQuestions(3);
        List<String> votes = lecturer.questions.getCurrentVotesOfAllQuestions();
        assertEquals("0/1", votes.get(0));
    }
}
