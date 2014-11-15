(function() {
    "use strict";
    var barChart, barWidth, barHeight, barUpdater, barScale = 1.0;
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
        var example = document.querySelector(".content_images > img");
        // set the bar width and height to be the same as the other pictures
        // if we already have a chart, remove it
        if (barChart)
            barChart.removeChart();
        // if we already have an updater callback, stop it
        if (barUpdater)
            window.clearInterval(barUpdater);
        barWidth = parseFloat(example.width);
        barHeight = parseFloat(example.height);
        barChart = BarChart(document.getElementById("barContainer"), barWidth, barHeight);
        barChart.setTitle("Demo");
        barChart.setLabels("x", "y");
        barChart.setAnimTime(500);
        updateBarsFromRandomData(generateRandomData(2, 8, 5, 6));
        // update the values every few seconds
        barUpdater = window.setInterval(function() {
            updateBarsFromRandomData(generateRandomData(0, 8, 5, 6));
        }, 1500);
    }
    
    function updateBarsFromRandomData(data) {
        for (var i = 0; i < data.colors.length; i++) {
            barChart.setBarColor(data.colors[i].color, data.colors[i].opacity, i);
        }
        barChart.update(data.values);
    }

    function toggleImages() {
        var containers = document.querySelectorAll(".content_images");
        for (var i = 0; i < containers.length; i++) {
            // random interval in [4000, 5000)
            var interval = 4000+Math.floor(Math.random()*1000);
            toggleClassAmongChildren(containers[i], "img", "shown", interval);
        }
    }
    
    function repositionInfo() {
        // slide out the info box from the bottom
        var containers = document.querySelectorAll(".col-sm-6");
        for (var i = 0; i < containers.length; i++) {
            var first_image = containers[i].querySelector("img"),
                info = containers[i].querySelector(".info"),
                bar = containers[i].querySelector("#barContainer > svg");
            if (first_image && info) {
                info.style.top = parseFloat(first_image.height) + 'px';
            } else if (bar && info) {
                info.style.top = parseFloat(bar.getAttribute('height')) + 20 + 'px';
                console.log(info.style.top);
            }
        }
    }

    function onResize() {
        setUpChart();
        enlargeLastImages();
        repositionInfo();
    }

    function onLoad() {
        onResize();
        toggleImages();
    }

    window.addEventListener('load', onLoad);
    window.addEventListener('resize', onResize);
})();
