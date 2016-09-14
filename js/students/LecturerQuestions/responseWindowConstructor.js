define(['jquery', 'popupWindow', 'sliderCSS', 'sliders', 'questionTypes'], function ($, popupWindow, sliderCSS, sliders, questionTypes) {


    function ResponseWindow(question, incomingQuestionManager) {
        var that = this;

        this.incomingQuestionManager = incomingQuestionManager;
        this.winWidth = 600;
        this.winHeight = 500;
        this.contentWidth = this.winWidth - 100;


        /**
         * The currently processed question
         */
        this.currentQuestion = question;

        /**
         * MC Options are displayed in a list. Open questions require a textarea.
         * Only one of them is instantiated at the same time.
         */
        this.currentAnswerFormID = Math.floor(Math.random() * 100000000000);

        var customRows = this.createWindowRows(question.type);

        this.winDow = webix.ui({
            view: "window",
            id: "responseWindow",
            move: true,
            //modal: true,
            height: this.winHeight,
            width: this.winWidth,
            position: "center",

            on: {

                onShow: function () {
                    if (question.type === questionTypes.rating) {
                        var css = sliderCSS.getCssForThisWindow(that);
                        $(css + "#slider").show();
                        that.initSlider(question);
                    }
                },

                onDestruct: function() {
                    setTimeout(function(){
                        that.incomingQuestionManager.onQuestionWindowHasBeenClosed();
                    }, 1000);
                }
            },

            /**
             * Head
             */
            head: {
                cols: [
                    {
                        view: "label",
                        css: "responseWindowHeader",
                        template: "Question from lecturer"
                    },
                    {
                        view: "button", label: "Dismiss", hotkey: "escape", width: 70, click: function () {
                        that.winDow.close();
                    }
                    }
                ]
            },


            /**
             * Body
             */
            body: {
                type: "space",
                rows: [

                    /**
                     * Question
                     */
                    {
                        view: "scrollview",
                        borderless: true,
                        height: 110,
                        scroll: "y",
                        body: {
                            rows: [
                                {
                                    view: "template",
                                    template: question.question,
                                    css: "break-word",
                                    autoheight: true    // required to be scrollable
                                }
                            ]
                        } // scrollview rows
                    },

                    /**
                     * Answer / Answer Options
                     */
                    {
                        view: "scrollview",
                        borderless: true,
                        autoheight: true,
                        body: {
                            rows: customRows    // contains view for mc, scale or open question
                        }
                    },
                    {
                        view: "button",
                        type: "htmlbutton",
                        css: "submitResponseButton",
                        height: 100,
                        label: "<span class='glyphicon glyphicon-ok' style='color:green;'></span> Submit Answer",
                        tooltip: "Click here to submit your answer",
                        on: {
                            onItemClick: function (id, e) {
                                that.submitResponseButtonHandler();
                            }
                        }
                    }
                ] // window body rows
            } // body
        }); // window

        this.winDow.show();

        if (question.type === questionTypes.mc) {
            this.loadMcListData(question);
        }

    }  // EOF class

    ResponseWindow.prototype = {
        constructor: ResponseWindow,

        createWindowRows: function (type) {
            var customRows = [];

            if (type === questionTypes.mc) {

                customRows.push({

                    view: "list",   // MC Options are displayed as list items
                    id: this.currentAnswerFormID,
                    autoheight: true,    // required to be scrollable
                    width: this.contentWidth,
                    css: "break-word",
                    type: {
                        height: 50
                    },
                    datatype: "jsarray",
                    template: "#answer#",
                    tooltip: {
                        template: "#answer#"
                    },

                    select: "multiselect",
                    multiselect:"touch"

                    // scroll: "y" // we already have a scroll bar in the window

                });

            } else if (type === questionTypes.rating) {
                customRows.push({
                    view: "template",
                    template: "html->sliderDiv",
                    height: 150    // required to be scrollable
                });

            } else if (type === questionTypes.open) {
                customRows.push({
                    view: "textarea",
                    autoheight: true,    // required to be scrollable
                    id: this.currentAnswerFormID,
                    width: this.contentWidth,
                    placeholder: "Your answer"

                });
            } else {
                console.log("responseWindow.js createWindowRows() encountered an unknown question type!");
                console.log(type);
            }

            return customRows;
        },

        loadMcListData: function (question) {
            if (question.possibleAnswers) {
                for (var i = 0; i < question.possibleAnswers.length; ++i) {
                    $$(this.currentAnswerFormID).add({num: i + 1, answer: question.possibleAnswers[i]});
                }
            }
        },

        submitResponseButtonHandler: function () {
            var answers = this.getAnswers();
            if (!answers.length && this.currentQuestion.type !== questionTypes.rating) {
                popupWindow(2000, "Error: No answer selected", "Please select answer before clicking on the submit button.");
                return;
            }

            this.winDow.hide();

            var that = this;
            require(['responseLogic'], function (responseLogic) {
                responseLogic(that.currentQuestion, answers, that.winDow);
            });
        },

        getAnswers: function () {
            var answers = [];

            var type = this.currentQuestion.type;

            if (type === questionTypes.mc) {
                var listID = this.currentAnswerFormID;
                var selectedIds = $$(listID).getSelectedId(true);
                selectedIds.forEach(function(id){
                    var item = $$(listID).getItem(id);
                    answers.push(item.answer);
                });

            } else if (type === questionTypes.rating) {
                var css = sliderCSS.getCssForThisWindow(this);
                answers.push(+$(css + " #sliderStatusLabel ").text());

            } else if (type === questionTypes.open) {
                answers.push($$(this.currentAnswerFormID).getValue());

            } else {
                console.log("responseWindow.js getAnswers encountered an unknown question type!");
                console.log(this.currentQuestion);
                return;
            }

            return answers;

        },

        initSlider: function (scaleQ) {
            var that = this;
            var css = sliderCSS.getCssForThisWindow(that);
            $(css + " #labelSliderStart").text(scaleQ.scaleStart);
            $(css + " #labelSliderEnd").text(scaleQ.scaleEnd);
            sliders.Sliders(scaleQ.scaleStart, scaleQ.scaleEnd, scaleQ.scaleStep, css);
        }

    }; // prototype

    return ResponseWindow;
}); // requireJS define