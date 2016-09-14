package framework.questions;

/**
 * Created by Henriette on 01.04.2016.
 */
public class RatingQuestionScalePoints {

    public final float start;
    public final float end;
    public final float step;

    public RatingQuestionScalePoints(float start, float end, float step){
        this.start = start;
        this.end = end;
        this.step = step;
    }
}
