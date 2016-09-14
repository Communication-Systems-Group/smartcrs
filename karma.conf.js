// Karma configuration
// Generated on Sun Oct 20 2013 07:28:56 GMT+0200 (CEST)

module.exports = function (config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '',


        // frameworks to use
        frameworks: ['requirejs', 'jasmine-jquery', 'jasmine'],

        // list of files / patterns to load in the browser
        // 'included: false' means that these files will be loaded by requirejs

        files: [
            {pattern: 'js/**/*.js', included: false},
            {pattern: 'js/**/*.css', included: true},
            {pattern: 'css/**/*.css', served: true},
            {pattern: 'js/**/*.woff', included: false},
            {pattern: 'js/**/*.ttf', included: false},
            {pattern: '*.html', served: true, included: false},
            {pattern: 'settings.json', served: true, included: false},
            {pattern: 'js/Tests/TestData/*.json', served: true, included: false},

            'js/main.js'
        ],


        // list of files to exclude
        exclude: [
            'js/Tests/AcceptanceTests/**/*.js', // selenium tests
            'js/lib/**/*[sS]pec.js' // unit tests of 3rd party libraries
        ],


        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['Chrome'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 20000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
