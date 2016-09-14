import framework.comments.Comment;
import org.junit.Test;
import setups.TwoStudentsLogin;

import static org.junit.Assert.assertEquals;

public class UpVoting extends TwoStudentsLogin {
    @Test
    public void testUpAndDownVote() throws Exception {
        Comment comment1 = new Comment().createMessageComment(consts.lecturerName, "Chat message", "c1", 0);
        student1.commenting.sendComment(comment1.content);

        student2.commenting.upVote(comment1.id);
        int numUpvoted = lecturer.getUpvotes(comment1);
        assertEquals(1, numUpvoted);

        student2.commenting.upVote(comment1.id);
        int numDownvoted = lecturer.getUpvotes(comment1);
        assertEquals(0, numDownvoted);
    }
}