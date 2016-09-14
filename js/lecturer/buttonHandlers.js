/**
 * All button handlers for the lecturer side
 */

define(["jquery"], function ($) {

    $("body").on('click', '.tourStep', function () {
        var text = $(this).text();
        require(['tourToc'], function(guide){
            guide.goToToCEntry(text);
       });
    });

    $(".startTour").click(function () {
        require(['tourToc'], function(tourToc) {
            tourToc.startTourToC();
        });
    });
    // Add button click handler
    $("#qMcInputsForm")
        .on('focus', '.inactive-mcOption', function () {
            var $this = $(this);
            require(['McForms'], function (mcForms) {
                mcForms.focusOnInactiveMcOption($this);
            });
        })
        // Remove button click handler
        .on('click', '.removeMcOptionButton', function () {
            var $this = $(this);
            require(['McForms'], function (mcForms) {
                mcForms.removeMcOptionButtonHandler($this);
            });
        });

    $(".radio_qType").on("click", function () {
        $(".radio_qType").removeClass("btn-primary");
        $(this).addClass("btn-primary");

        $("#questionAddedAlert").hide();

        var qConstructor = $(this).data("question-constructor");
        require(["questionManager"], function (qMgr) {
            var qInstance = qMgr.getQuestionInstanceFromDataProperty(qConstructor);
            qInstance.forms.showForm();
        });
    });

    $("#connectButton").on("click", function () {
        require(['webRTCLecturer'], function (webRTCLecturer) {
            webRTCLecturer.connectButtonLogic();
        });
    });

    $("#disconnectButton").click(function () {
        require(['webRTCLecturer'], function (webRTCLecturer) {
            webRTCLecturer.disconnectButtonLogic();
        });
    });

    $("#connectedPeers").on("click", function () {
        require(['peerTableMgr'], function (peerTable) {
            peerTable.showPeerTable();
        });
    });

    $("#buttonAddQuestionToMainTable").on("click", function () {
        require(['questionManager'], function (qMgr) {
            qMgr.addQuestionToTable();
        });
    });

    $(".buttonCloseModal").on("click", function () {
        require(['questionManager'], function (qMgr) {
            qMgr.closeModalHandler();
        });
    });

    $("#buttonModalApplyChanges").on("click", function () {
        require(['qEditor'], function (qEditor) {
            qEditor.applyChangesButtonHandler();
        });
    });

    $("#buttonAddNewQuestion").on("click", function () {
        require(['qEditor'], function (qEditor) {
            qEditor.startQuestionManager(qEditor.modes.create);
        });
    });

    $('#filesLoadLecture').change(function () {
        require(['LoadLecture'], function (loader) {
            loader.loadLecture("#filesLoadLecture");
        });
    });

    $("#loadButton").on("click", function () {
        $("#filesLoadLecture").trigger('click');
        return false; // prevents <a> jump to top of page
    });

    $(".myKeyUp").change(function () {
        require(['sliders'], function (sliders) {
            sliders.Sliders();
        });
    });

    $("#saveButtonLecturerRun").click(function () {
        require(["SaveLecturePopup"], function (savePopup) {
            savePopup.showSaveLecturePopup();
        });
        return false;
    });

    $("#buttonNotification").change(function () {
        if ($(this).val().indexOf("Show Popup") !== -1) {
            require(['VisualNotification'], function (Notification) {
                Notification.prototype.requestPermissionIfNecessary();
            });
        }
    });

    $('.modal').on('click', '.mcTrueFalseToggle', function () {
        $(this).find('.btn').toggleClass('active');
        $(this).find('.btn').toggleClass('btn-primary');
    });

    $("#infoNotConnected, #questionAddedAlert").on('showInfo', function () {
        $(this).fadeTo(10000, 500).slideUp(500, function () {
            $(this).hide();
        });
    }).click(function () {
        $(this).hide();
    });


    require(['jquery-ui', 'qTableRow'], function (jqueryUI, qTableRow) {

        $("#qTableBody").sortable({
            helper: qTableRow.fixHelperModified,
            stop: function () {
                qTableRow.renumber_table()
            }
        }).disableSelection();

        $("#questionsControlTable").on('click', '.deleteQuestionBtn', function () {
            var $this = $(this);
            require(['DeleteButtonHandler'], function (delButton) {
                delButton.deleteRow($this);
            });
        })

            .on('click', '.statsButton', function () {
                var $this = $(this);
                require(['StatsButtonHandler'], function (statsButton) {
                    statsButton.statsButtonHandler($this)
                });
            })

            .on('click', '.shareButtonFunc', function () {
                var $this = $(this);
                require(['ShareButtonHandler'], function (shareButton) {
                    shareButton.startSharing($this);
                });
            })

            .on('dblclick', '.ui-sortable-handle', function () {
                var $this = $(this);
                require(['questionsControlTable'], function(qTable) {
                    qTable.onDblClick($this);
                });
            });
    });
});