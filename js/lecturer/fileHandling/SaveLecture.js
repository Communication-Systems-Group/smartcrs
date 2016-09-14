define(['jquery', 'fs', 'FieldsLecturerRun', 'ExcelFormatting'], function ($, fs, fieldsRun, ExcelFormatting) {

    function SaveLecture() {
    }

    SaveLecture.prototype = {
        constructor: SaveLecture,

        /**
         *
         * @param filename
         * @param wants {{questions: boolean,
                    questionsWithStats: boolean
                    notificationSettings: boolean,
                    comments: boolean }}
         */
        saveSettings: function (filename, wants) {
            fieldsRun.getFieldsAsync(wants).then(function(data){
                fs.convertObjectToURLAsync(data).then(function (result) {
                    fs.saveToDisk(result, filename);
                    if (wants.questionsWithStats) {
                        ExcelFormatting.exportToExcelAsync(filename).then(function (excelBase64) {
                            fs.saveToDisk(excelBase64, filename, ".xls");
                        });
                    }
                });
            });
        }
    }; // prototype

    return new SaveLecture();
}); // requireJS define