define(['jquery', 'webix'], function ($) {

    function ChartWindow(charts) {
        this.charts = charts;
        this.winWidth = 650;
        this.winHeight = 250;
        this.showSolution = false;
        this.openAnswersListId = "openQuestionAnswerList";
        this.setupWindow();
    } // EOF class

    // returns coordinates to align window in the center of the screen
    function getCenterWindowPos() {
        return {
            left: ($(window).width() / 2) - (this.winWidth / 2),
            top: ($(window).height() / 2) - (this.winHeight / 2)
        };
    }

    function switchChartsType(newType) {
        var chartsView = this.winDow.getBody();
        chartsView.define({type: newType});
        chartsView.refresh();
    }

    function closeWindow() {
        this.winDow.close();
    }

    ChartWindow.prototype = {
        constructor: ChartWindow,

        setupWindow: function () {
            var that = this;
            var centerPos = getCenterWindowPos.call(that);
            var bodyContent;
            if (that.charts.isOpenQuestion) {
                bodyContent = that.__getScrollView();
            } else {
                bodyContent = that.__getStatsBody();
            }

            that.winDow = webix.ui({
                view: "window",
                id: "chartsWindow",
                move: true,
                height: that.winHeight,
                width: that.winWidth,

                // align window in the center of the browser screen
                left: centerPos.left,
                top: centerPos.top,


                on: {
                    // ESC hides window
                    onHide: function () {
                        that.charts.removeListenerOnDataUpdate();
                    },
                    onDestruct: function () {
                        that.charts.removeListenerOnDataUpdate();
                    }
                },

                head: that.getHead(),
                body: bodyContent
            });
        },

        showWindow: function () {
            this.winDow.show();
        },

        refreshWindow: function () {
            var winBody = this.winDow.getBody();
            if (winBody.config.view === "scrollview") {
                winBody = $$(this.openAnswersListId);
            }
            if (!winBody || !winBody.data) {
                return; // stats update has been called & there's now window
            }

            winBody.data.clearAll();
            winBody.define({data: this.charts.getQuestion()});
            winBody.refresh();
        },

        handleStatsLabel: function (obj) {
            var text = obj.answer;
            if (this.showSolution) {
                if (obj.color === "green") {
                    text = "<div class='textColorCorrectCharts'>" + obj.answer + "</div>";
                }
            }
            return "<div class='statsLabel'>" + text + "</div>"
        },

        handleBarColor: function (obj) {
            if (this.showSolution) {
                obj.colorShown = obj.color;
            } else {
                obj.colorShown = "#00008b";
            }
            return obj.colorShown;
        },

        /**
         * Used to display mc & rating questions in a stats window
         */
        __getStatsBody: function () {
            var that = this;
            return {
                "view": "chart",
                "type": "bar",
                "value": "#votes#",
                "tooltip": function (obj) {
                    return obj.answer;
                },
                "label": function (obj) {
                    return that.handleStatsLabel(obj);
                },

                "pieInnerText": "#votes#",

                "color": function (obj) {
                    return that.handleBarColor(obj);
                },

                "shadow": false,
                yAxis: {
                    start: 0
                },
                "data": that.charts.getQuestion()
            }
        },


        __getScrollView: function () {
            var list = this.__getOpenQuestionList();
            return {
                view: "scrollview",
                borderless: true,
                autoheight: true,
                body: list
            }
        },

        __getOpenQuestionList: function () {
            var that = this;
            return {
                id: that.openAnswersListId,
                view: "list",   // MC Options are displayed as list items
                autoheight: true,    // required to be scrollable
                width: that.winWidth - 100,
                css: "break-word",
                select: true,
                type: {
                    height: 50
                },
                data: "",
                template: function (item) {
                    if (item.color === "green") {
                        return '<div style="font-weight: bold;">' + item.answer + '</div>';
                    }
                    return item.answer;
                },
                tooltip: {
                    template: "#answer#"
                }
            }
        },

        getHead: function () {
            var that = this;
            var customCols = [
                {view: "label", label: that.charts.getQuestionID()}
            ];

            if (!that.charts.isOpenQuestion) {
                customCols.push({
                        view: "checkbox",
                        label: "Show Solution",
                        labelWidth: 105,
                        value: 0,
                        on: {
                            "onChange": function (newv, oldv) {
                                that.showSolution = newv;
                                that.charts.updateData();
                            }
                        }
                    },
                    {
                        view: "select", label: "Chart", width: 180, value: "bar", options: [
                        {value: "bar"}, // the initially selected value
                        {value: "pie"},
                        {value: "pie3D"},
                        {value: "donut"},
                        {value: "line"},
                        {value: "spline"},
                        {value: "area"}
                        // { value: "scatter"}

                    ],
                        labelAlign: 'right',
                        // change handler for chart select
                        on: {
                            "onChange": function (newv, oldv) {

                                switchChartsType.call(that, newv);
                            }
                        }
                    } // select view
                );
            } // if (!that.charts.isOpenQuestion) {

            customCols.push({
                view: "button", label: 'Close', width: 100, align: 'right', click: function () {
                    closeWindow.call(that);
                }
            });


            return {
                view: "toolbar",
                cols: customCols
            }
        }
    }; // prototype


    return ChartWindow;
}); // requireJS define