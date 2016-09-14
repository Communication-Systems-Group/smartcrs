/**
 * Created by Pascal on 19.08.2015.
 */

module.exports = {
    run: function () {
        // change working directory to folder of this file
        // required for loadConfigFile()
        var path = require("path");
        process.chdir(path.basename(__dirname));

        var Jasmine = require('jasmine');
        var jasmine = new Jasmine();
        jasmine.loadConfig({
            spec_dir: "../",
            spec_files: [
                "Lecturer/CreateQuestionsSpec.js",
                "Lecturer/EditQuestionsSpec.js",
                "Lecturer/BasicInteractionSpec.js",
                "Lecturer/StudentQuestionsSpec.js",
                "Lecturer/WebRTCSpec.js"
            ]
        });

        require("../../../../runServer");

        jasmine.execute();
    }
};
