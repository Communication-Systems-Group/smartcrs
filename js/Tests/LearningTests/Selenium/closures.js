var closureFunc = closure();

console.log(closureFunc);
setTimeout(function () {
    console.log(closureFunc);
    //  done();
}, 500);


function closure() {
    var date = new Date();

    return function () {
        return date.getMilliseconds();
    };
}