define(function () {
    function TestHTMLConverter() {}

    TestHTMLConverter.prototype = {
        constructor: TestHTMLConverter,

        prepareAndLoadStrippedPageForTest: function (page) {
            var html = readFixtures(page);
            extractBody();
            removeRequireJsInclude();
            jasmine.getFixtures().appendSet(html);

            function extractBody() {
                var bodyPortion = /<body>(\n.*)*<\/body>/g;
                html = bodyPortion.exec(html)[0];
            }

            function removeRequireJsInclude() {
                var requireJS = /<script data-main=.*><\/script>/;
                html = html.replace(requireJS, '');
            }
        }
    }; // prototype

    return new TestHTMLConverter();
});
