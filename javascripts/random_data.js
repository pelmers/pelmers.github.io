// Generate random integer in [min, max)
function randRange(min, max) {
    return Math.floor(min+Math.random()*(max-min));
}

// generate data for bar graphing
function generateRandomData(minVal, maxVal, minBars, maxBars) {
    function randColor() {
        var red = randRange(0, 255),
            green = randRange(0, 255),
            blue = randRange(0, 255);
        return "#"+red.toString(16)+green.toString(16)+blue.toString(16);
    }
    function randOpacity() {
        return 0.8+0.2*Math.random();
    }
    var numBars = randRange(minBars, maxBars),
        colors = [],
        values = [];
    for (var i = 0; i < numBars; i++) {
        values[i] = randRange(minVal, maxVal);
        colors[i] = {color: randColor(), opacity: randOpacity()};
    }
    return {
        values: values,
        colors: colors
    };
}

