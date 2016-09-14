package framework.comments;

import framework.lecturer.Lecturer;
import framework.students.Student;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * Created by Pascal on 02.03.2016.
 */
public class CommentsAsserter {

    public void assertLecturerMsg(Lecturer lecturer, Student student, Comment origComment) {
        Comment studentDOM = student.commenting.getCommentDOMInformation(origComment.id);
        Comment lecturerDOM = lecturer.getCommentDOMInformation(origComment.id);

        assertTrue(origComment.equalsWithoutDate(studentDOM));
        assertTrue(studentDOM.equals(lecturerDOM));
    }


    public void assertStudentMsg(Student student, Lecturer lecturer, Comment origComment) {
        Comment studentDOM = student.commenting.getCommentDOMInformation(origComment.id);
        Comment lecturerDOM = lecturer.getCommentDOMInformation(origComment.id);

        assertEquals(lecturerDOM.author, origComment.author);
        assertEquals(studentDOM.author, "You");
        assertTrue(studentDOM.equalsWithoutAuthor(lecturerDOM));
    }
}
