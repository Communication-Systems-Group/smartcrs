/**
 * Created by Pascal on 11.01.2016.
 */

define(['SaveLecture', 'autoSaveManager', 'webix'], function (saveLecture, autoSaver, webix) {

    function SaveLecturePopup() {
        this.windowId = "saveLectureWindow";
        this.filenameFormId = "savePopupFilename";
        this.formId = "savePopupForm";
        this.saveButtonId = "submitButton";
    } // EOF class

    SaveLecturePopup.prototype = {
        constructor: SaveLecturePopup,

        saveButtonLogic: function () {
            if ($$(this.formId).validate()) {
                var filename = $$(this.filenameFormId).getValue();
                var wants = {
                    questions: !!$$("checkboxQuestions").getValue(),
                    questionsWithStats: !!$$("checkboxStats").getValue(),
                    notificationSettings: !!$$("checkboxNotificationSettings").getValue(),
                    comments: !!$$("checkboxComments").getValue()
                };
                $$(this.windowId).close();
                saveLecture.saveSettings(filename, wants);
                autoSaver.dataHasBeenSaved(wants);
            }
            else {
                webix.message({type: "error", text: "Please enter a filename"});
            }
        },
        
        __createForm: function () {
            var that = this;
            return {
                view: "form",
                id: that.formId,
                borderless: true,
                elements: [
                    {view: "text", id: that.filenameFormId, label: 'Filename', name: "filename"},
                    {
                        view: "fieldset",
                        label: "What would you like to save?",
                        body: {
                            rows: [
                                {
                                    cols: [{
                                        view: "checkbox",
                                        id: "checkboxQuestions",
                                        labelRight: "Questions",
                                        value: 1
                                    },
                                        {
                                            view: "checkbox",
                                            id: "checkboxStats",
                                            labelRight: "Stats",
                                            value: 1
                                        }]
                                },
                                {
                                    cols: [{
                                        view: "checkbox",
                                        id: "checkboxNotificationSettings",
                                        labelRight: "Notification Settings",
                                        value: 1
                                    },
                                        {
                                            view: "checkbox",
                                            id: "checkboxComments",
                                            labelRight: "Comments & Files",
                                            value: 1
                                        }]
                                }
                            ]
                        }
                    },

                    {
                        cols: [
                            {
                                view: "button", value: "Save", id: that.saveButtonId, hotkey: "enter", click: function () {
                                that.saveButtonLogic();
                            }
                            },
                            {
                                view: "button", value: "Cancel", hotkey: "esc", click: function () {
                                $$(that.windowId).close();
                            }
                            }

                        ]
                    }
                ],
                rules: {
                    "filename": webix.rules.isNotEmpty
                },
                elementsConfig: {
                    labelPosition: "top"
                }
            };
        },

        __createWindow: function (form) {
            webix.ui({
                view: "window",
                id: this.windowId,
                width: 500,
                position: "center",
                modal: true,
                head: "Save Lecture",
                body: webix.copy(form)
            });
        },

        __cleanForm: function () {
            var that = this;
            $$(that.windowId).getBody().clear();
            $$(that.windowId).show();
            $$(that.windowId).getBody().focus();
        },

        showSaveLecturePopup: function () {
            var form = this.__createForm();
            this.__createWindow(form);
            this.__cleanForm();
        }
    }; // prototype


    return new SaveLecturePopup();
}); // requireJS define