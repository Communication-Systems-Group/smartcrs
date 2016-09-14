import framework.Resources;
import framework.utils.FileSystem;
import org.junit.Test;
import setups.OneStudentLogin;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static org.junit.Assert.assertEquals;

/**
 * Created by Pascal on 21.05.2016.
 */
public class StudentsSaveQuestions extends OneStudentLogin {

    @Test
    public void correctFileContent() throws IOException {
        lecturer.loadLectureFromResourceFolder("RealQuestions.json");
        String t = Resources.getFilepathFromResourceFolder("StudentsSavedQuestions.html");
        lecturer.questions.shareAllQuestions();
        student1.lecturerQuestions.answerAllQuestions(5d, "openAnswer", 1, 3);
        Path filename = student1.save(student1Folder);
        FileSystem.waitTillFileExists(filename.toString());

        byte[] file1Bytes = Files.readAllBytes(Paths.get(t));
        byte[] file2Bytes = Files.readAllBytes(filename);

        String file1 = new String(file1Bytes, StandardCharsets.UTF_8);
        String file2 = new String(file2Bytes, StandardCharsets.UTF_8);

        assertEquals("The content in the strings should match", file1, file2);
    }
}
