/**
 * This file maps all the required js files and executes start.js
 */


/**
 * For running tests
 */

var karmaBaseURL = '/base/js/';
// TODO change back
var bUrl = '../js';    // default value (no testing) is overridden if Karma is executing

if (isKarmaTestRunner()) {
    var karmaConfig = configureKarmaTestRunner();
    bUrl = karmaConfig.bUrl;
    var cb = karmaConfig.cb;
    var dependecies = karmaConfig.dependecies;
}

// Normal run
    require(['start'], function (start) {});

// there might be a neater way to detect if karma is running
function isKarmaTestRunner(){
    return window.__karma__ ? true:false;
}

function configureKarmaTestRunner() {
    var tests = [];
    // push any files with *Spec.js into array. The files are loaded from the directories defined in karma.conf.js
    for (var file in window.__karma__.files) {
        if (window.__karma__.files.hasOwnProperty(file)) {
            if (/Spec\.js$/.test(file)) {
                tests.push(file);
            }
        }
    }
    console.log("configureKarmaTestRunner: ", tests);

    var bUrl = karmaBaseURL;
    var cb = window.__karma__.start;
    var dependencies = tests;

    return {bUrl: bUrl, cb: cb, dependecies: dependencies};
}

require.config({
    baseUrl: bUrl,
    // ask Require.js to load these files (all our tests)
    deps: dependecies,

    // start test run, once Require.js is done
    callback: cb,

    paths: {
        // external libraries
        "jquery": 'lib/jquery-1.11.0',
        "excelExporter": "lib/ExcelExport/excellentexport",
        "text": 'lib/requireJS-text',
        "jqueryComments": 'lib/jquery-comments-1.1.0/js/jquery-comments_customized',
        "nouislider": "lib/slider/nouislider",
        "webix": "lib/webix-3.2/codebase/webix_debug",
        "bootstrap": "lib/bootstrap/js/bootstrap",
        "bootstrap-toggle": "lib/bootstrap-toggle/bootstrap-toggle",
        "simpleWebRTC": "lib/SimpleWebRTC-2.1/simplewebrtc.bundle_customized",
        "jquery-ui": "lib/jquery-ui-1.11.4/jquery-ui",
        "handlebars": "lib/handlebars-v4.0.5",
        "bootstrap-tour": "lib/bootstrap-tour/bootstrap-tour",

        "start": "common/start",    // used for initialization
        "testLogger": "common/testLogger",  // TODO: Remove?
        "settingsLoader": "../settings",
        "UserIdentifier": "common/UserIdentifier",  // distinguish users (LecturerRun/Student),
        "modalBox": "common/modalBox",

        "handleTourOrder": "lecturer/GUI/guidedTour/handleTourOrder",
        "tourToc": "lecturer/GUI/guidedTour/tourToC",
        "tourOverview": "lecturer/GUI/guidedTour/tourOverview",
        "tourQuestionCreation": "lecturer/GUI/guidedTour/tourQuestionCreation",
        "tourSave": "lecturer/GUI/guidedTour/tourSave",
        "tourQuestionsHandling": "lecturer/GUI/guidedTour/tourQuestionsHandling",
        "tourCommentsFiles": "lecturer/GUI/guidedTour/tourCommentsFiles",
        "tourStudComments": "lecturer/GUI/guidedTour/tourStudComments",
        "tourPeerTableMgr": "lecturer/GUI/guidedTour/tourPeerTableMgr",
        "tourStartingLecture": "lecturer/GUI/guidedTour/tourStartingLecture",

        "questionManager": "lecturer/questionLogic/questionManager",    // handles question creation logic
        "qEditor": "lecturer/questionLogic/editQuestion",   // handles question editing
        "questionTypes": "lecturer/questionLogic/questionTypes",
        "autoSaveManager": "lecturer/fileHandling/AutoSaveManager",
        "FormsValidation": "lecturer/questionLogic/FormsValidation",
        "McQuestion": "lecturer/questionLogic/McQuestion/McQuestion",  // Multiple Choice question class
        "McForms": "lecturer/questionLogic/McQuestion/McForms",
        "McFormsValidator": "lecturer/questionLogic/McQuestion/McFormsValidator",
        "RatingQuestion": "lecturer/questionLogic/RatingQuestion/RatingQuestion", // Rating Question class
        "RatingForms": "lecturer/questionLogic/RatingQuestion/RatingForms",
        "RatingFormsValidator": "lecturer/questionLogic/RatingQuestion/RatingFormsValidator",
        "RatingScaleInputs": "lecturer/questionLogic/RatingQuestion/RatingScaleInputs",
        "OpenQuestion": "lecturer/questionLogic/OpenQuestion/OpenQuestion", // Rating Question class
        "OpenForms": "lecturer/questionLogic/OpenQuestion/OpenForms",
        "OpenFormsValidator": "lecturer/questionLogic/OpenQuestion/OpenFormsValidator",

        "tableHelper": "lecturer/GUI/tables/tableHelper",

        "LoadLecture": "lecturer/fileHandling/LoadLecture",
        "SaveLecture": "lecturer/fileHandling/SaveLecture",
        "SaveLecturePopup": "lecturer/fileHandling/SaveLecturePopup",
        "FieldsLecturerRun": "lecturer/fileHandling/FieldsLecturerRun",
        "ExcelFormatting": "lecturer/fileHandling/ExcelFormatting",
        "buttonHandlers": "lecturer/buttonHandlers",    // handlers for lecturer

        "fs": "common/fs",   // Class for creating a downloadable link from array
        "sliders": "common/sliders",    // slider is used for scale questions
        "popupWindow": "common/popupWindow", // highly customizable popupWindow

        "webRTCHandlersCommon": "common/connectivity/webRTCHandlersCommon",
        "webRTCLecturer": "lecturer/connectivity/webRTCLecturer",
        "webRTCHandlersLecturer": "lecturer/connectivity/webRTCHandlersLecturer",
        "webRTCLecturerPeer": "common/connectivity/webRTCLecturerPeer",
        "webRTCStudents": "students/connectivity/webRTCStudents",
        "webRTCHandlersStudentsConstructor": "students/connectivity/webRTCHandlersStudents",
        "webRTCFactory": "common/connectivity/webRTCFactory",
        "roomCredentials": "lecturer/roomCredentials",
        "messageTypes": "common/connectivity/messageTypes",
        "commentsCommon": "common/comments/commentsCommon",
        "commentsStudentsConstructor": "common/comments/commentsStudents",
        "commentsLecturer": "common/comments/commentsLecturer",

        "stats": "lecturer/stats/stats",    // stats DB
        "statsDataFormat": "lecturer/stats/statsDataFormat", // format of stats entries
        "charts": "lecturer/GUI/charts",  // display of statistical charts
        "ChartWindow": "lecturer/GUI/ChartWindow",

        "questionsControlTable": "lecturer/GUI/tables/questionsControlTable",
        "qTableRow": "lecturer/GUI/tables/qTableRow",
        "questionsStorage": "lecturer/GUI/tables/questionsStorage",
        "numStudentVotes": "lecturer/GUI/tables/buttons/numStudentVotes",
        "ShareButtonHandler": "lecturer/GUI/tables/buttons/ShareQuestionButton",
        'StatsButtonHandler': "lecturer/GUI/tables/buttons/StatsButton",
        'DeleteButtonHandler': "lecturer/GUI/tables/buttons/DeleteButton",
        "upVotesController": "common/comments/UpVotesController",
        "peerTableMgr": "lecturer/GUI/tables/peerTableMgr",    // table that shows connected peers
        "connectedPeers": "lecturer/connectedPeers",
        "lecturerNicknames": "lecturer/lecturerNicknames",
        "notification": "lecturer/notificationLogic/notification",    // handles notifications
        "AudioNotification": "lecturer/notificationLogic/NotificationTypes/AudioNotification",   // plays sound on notification
        "VisualNotification": "lecturer/notificationLogic/NotificationTypes/VisualNotification",  // notification API popup on new msg
        "channelSetupWindow": "lecturer/GUI/channelSetupWindow",
        "shareQuestion": "lecturer/questionLogic/shareQuestion",

        // SmartCRS classes for students
        "studentHandlers": "students/studentHandlers",
        "StudentQuestion": "students/studentQuestion",  // defines the student question format
        "messageResponse": "students/LecturerQuestions/messageResponse",    // defines response message format for students
        "responseLogic": "students/LecturerQuestions/responseLogic",       // sends response to lecturer question
        "responseWindowConstructor": "students/LecturerQuestions/responseWindowConstructor",  // popup window that appears on incoming lecturer question
        "connectionManager": "students/connectivity/connectionManager",
        "heartBeat": "students/connectivity/heartBeat",
        "studentNickname": "students/studentNickname",
        "sliderCSS": "students/SliderCSS",
        "selectRoomWindow": "students/selectRoomWindow",
        "saveStudentData": "students/saveData",
        "localStorage": "students/localStorage",
        "questionQueue": "students/LecturerQuestions/questionQueue",
        "incomingQuestionManager": "students/LecturerQuestions/incomingQuestionsManager",
        "PrettyPrinter": "students/LecturerQuestions/PrettyPrinter/PrettyPrinter",
        "saveQuestionsTemplate": "students/HTMLTemplates/savedQuestionsTemplate.txt",
        "saveQuestionsTemplateCore": "students/HTMLTemplates/savedQuestionsTemplateCore.txt",
        "answerAcknowledger": "students/LecturerQuestions/answerAcknowledger",

        // Tests
        "TestData": "Tests/AcceptanceTests/Utilities/TestData",
        "TestHTMLConverter": "Tests/UnitTests/Utilities/TestHTMLConverter"
    },

    shim: {
        'webix': {
            exports: 'webix'
        },
        'excelExporter': {
            exports: 'ExcellentExport'
        }
    }
});
