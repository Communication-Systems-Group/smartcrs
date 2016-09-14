package framework.questions;

/**
 * Created by Henriette on 01.04.2016.
 */

public class RatingQuestionEdit {

    private final RatingQuestion ratingPage;
    private final ModalWindow modalPage;
    private String oldQuestion;
    private String newQuestion;
    private RatingQuestionScalePoints newScalePoints;

    public RatingQuestionEdit(RatingQuestion ratingPage, ModalWindow modalPage) {
        this.ratingPage = ratingPage;
        this.modalPage = modalPage;
    }


    public void start() {

        modalPage.openEditQuestionEditorFor(oldQuestion);
        if (newQuestion.length() > 0) {
            ratingPage.setQuestion(newQuestion);
        }

        if (newScalePoints != null) {
            ratingPage.setScalePoints(newScalePoints.start, newScalePoints.end, newScalePoints.step);
        }

        modalPage.closeEditModalWithSave();
    }

    public RatingQuestionEdit changeQuestion(String oldQ, String newQ) {
        oldQuestion = oldQ;
        newQuestion = newQ;
        return this;
    }

    public RatingQuestionEdit changeScalePoints(int start, int end, int step) {
        this.newScalePoints = new RatingQuestionScalePoints(start, end, step);
        return this;
    }
}
