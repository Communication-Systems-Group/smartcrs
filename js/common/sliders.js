/**
 * The slider used in scale questions
 */

define(['jquery', 'nouislider'], function ($, nouislider) {


    function Sliders() {
    }

    Sliders.prototype = {
        constructor: Sliders,

        /**
         * Lecturer side get's values from html. Only student side passes arguments.
         * @param start
         * @param end
         * @param step
         */

        Sliders: function (start, end, step, cssWindow) {
            cssWindow = cssWindow || "";

            var slider = $(cssWindow + " #slider")[0];

            // update existing slider if it already exists
            if (slider.noUiSlider) {
                slider.noUiSlider.destroy();
            }

            var startPoint = start || +$(cssWindow + ' #inputSliderStart').val() || 0;
            var endPoint = end || +$(cssWindow + ' #inputSliderEnd').val() || 10;
            var stepSize = step || +$(cssWindow + ' #inputSliderStep').val() || 1;


            nouislider.create(slider, {
                start: startPoint,
                step: stepSize,
                range: {
                    'min': startPoint,
                    'max': endPoint
                }
            });


            slider.noUiSlider.on('update', function (values, handle) {
                $(cssWindow + " #sliderStatusLabel").text(values[handle]);
            });

            // Listen to keydown events on the label
            $(cssWindow + " #sliderStatusLabel").keydown(function (e) {

                // Convert the string to a number.
                var value = Number(slider.noUiSlider.get());
                var sliderStep = slider.noUiSlider.steps();

                // Select the stepping for the first handle.
                sliderStep = sliderStep[0];

                // 38 is key up,
                // 40 is key down.
                switch (e.which) {
                    case 38:
                        slider.noUiSlider.set(value + sliderStep[1]);
                        break;
                    case 40:
                        slider.noUiSlider.set(value - sliderStep[0]);
                        break;
                }
            });
        }
    };

    return new Sliders();

}); // requireJS define