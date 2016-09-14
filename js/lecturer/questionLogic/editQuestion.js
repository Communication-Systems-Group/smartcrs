/**
 * This class takes care of the question edit logic.
 * Lecturer.html has two different classes for elements:
 * ".modeCreateQuestion" and ".modeEditQuestion"
 */

define(['jquery', 'questionManager', 'questionsControlTable', 'autoSaveManager'], function ($, qMgr, qControlTable, autoSaver) {

    function QuestionEditor() {
    }

    QuestionEditor.prototype = {
        constructor: QuestionEditor,

        modes: {
          create: "create",
            edit: "edit"
        },

        // determines whether create or edit view is displayed
        startQuestionManager: function (mode, editQuestion) {
            var $modeCreateQuestion = $(".modeCreateQuestion");
            var $modeEditQuestion = $(".modeEditQuestion");

            switch (mode) {
                case this.modes.create:
                    $modeCreateQuestion.show();
                    $modeEditQuestion.hide();
                    break;
                case this.modes.edit:
                    $modeCreateQuestion.hide();
                    $modeEditQuestion.show();
                    this.__showEditModal(editQuestion);  // loads fields for editing
                    break;
                default:
                    console.error("startQuestionManager() encountered invalid mode");
            }
        },

        applyChangesButtonHandler: function () {
            var qInstance = qMgr.getQuestionInstanceFromModal();
            var newQuestion = qInstance.createFromForms();

            var valid = qInstance.forms.validate();
            if (!valid) {
                return;
            }
            
            qControlTable.updateLastEditedItem(newQuestion);
            qInstance.forms.resetForms();
            autoSaver.setUnsavedQuestionsState();
            qMgr.closeModalHandler();
        },

        __showEditModal: function (question) {
            $("#modalCreateQuestion").modal('show');
            var qInstance = qMgr.getQuestionInstanceFromQuestionType(question.type);
            qInstance.forms.showForm();
            qInstance.forms.setFields(question);
        }

    }; // prototype

    return new QuestionEditor();
}); // requirejs define