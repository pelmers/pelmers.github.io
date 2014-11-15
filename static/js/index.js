(function() {
    "use strict";
    var barChart, barWidth, barHeight, barScale = 1.0;
    // for some reason the last image is a bit smaller than the others
    function enlargeLastImages() {
        var containers = document.querySelectorAll(".content_images");
        for (var i = 0; i < containers.length; i++) {
            var first_image = containers[i].querySelector("img"),
                last_image = containers[i].querySelector("img:last-child");
            if (first_image && last_image)
                last_image.style.width = first_image.width + 'px';
        }
    }

    function setUpChart() {
        var example = document.querySelector(".content_images > img"),
            data = generateRandomData(2, 8, 3, 6);
        // set the bar width and height to be the same as the other pictures
        // if we already have a chart, remove it
        if (barChart)
            barChart.removeChart();
        barWidth = parseFloat(example.width);
        barHeight = parseFloat(example.height);
        barChart = BarChart(document.getElementById("barContainer"), barWidth, barHeight);
        barChart.setTitle("Demo");
        barChart.setLabels("x", "y");
        for (var i = 0; i < data.colors.length; i++) {
            barChart.setBarColor(data.colors[i].color, data.colors[i].opacity, i);
        }
        barChart.update(data.values);
    }

    function onLoad() {
        enlargeLastImages();
        setUpChart();
    }

    function onResize() {
        setUpChart();
        enlargeLastImages();
    }
    window.addEventListener('load', onLoad);
    window.addEventListener('resize', onResize);
})();
