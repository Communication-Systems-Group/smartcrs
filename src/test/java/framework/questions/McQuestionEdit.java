package framework.questions;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Henriette on 01.04.2016.
 */
public class McQuestionEdit {

    private final McQuestion mcPage;
    private final ModalWindow modalPage;
    private String optionsName;
    private List<Integer> trueOptions;
    private String newQuestion;
    private String oldQuestion;
    private int numOptions;

    public McQuestionEdit(McQuestion mcPage, ModalWindow modalPage) {
        this.mcPage = mcPage;
        this.modalPage = modalPage;

        this.numOptions = 0;
        this.oldQuestion = "";
        this.newQuestion = "";
        this.optionsName = "";
        this.trueOptions = new ArrayList<>();
    }

    public void start() {

            modalPage.openEditQuestionEditorFor(oldQuestion);
                if (newQuestion.length() > 0) {
                    mcPage.setQuestion(newQuestion);
                }

                if (optionsName.length() > 1) {
                    mcPage.removeAllAnswerOptions();
                    mcPage.setAnswerOptions(optionsName, numOptions);
                }

                if (trueOptions.size() > 0) {
                    for (int item : trueOptions) {
                        mcPage.setNthOptionTrue(item);
                    }
                }

                modalPage.closeEditModalWithSave();
        }

        public McQuestionEdit changeQuestion(String oldQ, String newQ) {
            this.oldQuestion = oldQ;
            this.newQuestion = newQ;
            return this;
        }

        public McQuestionEdit changeOptionsNameAndNumber(String name, int number) {
            this.optionsName = name;
            this.numOptions = number;
            return this;
        }

        public McQuestionEdit changeToTrue(int... varQuestionNumbers) {
            for (int item: varQuestionNumbers) {
                trueOptions.add(item);
            }
            return this;
        }
}
