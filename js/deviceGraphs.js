var resolution = 250;

function makeGraph(selector, dataNames, range) {
    var arrayOfZeros = Array.apply(null, Array(resolution)).map(Number.prototype.valueOf,0);

    var graphData = {};
    for (var i = 0; i < dataNames.length; i++) {
        graphData[dataNames[i]] = arrayOfZeros.slice(0);
    }

    var formatFlotData = function(){
        return Object.keys(graphData).map(function(axis){
            return {
                data : graphData[axis].map(function(val, index){
                    return [index, val]
                })
            }
        });
    }
    
    var graph = $(selector).plot(formatFlotData(), {
        colors: [ '#04fbec', '#ebf1be', '#c14b2a', '#8aceb5'],
        xaxis: {
            show: false,
            min : 0,
            max : resolution
        },
        yaxis : {
            show: false,
            min : -range,
            max : range,
        },
        grid : {
            borderColor : "#427F78",
            borderWidth : 1,
        }
    }).data("plot");
    
    return function(orientationData){
        Object.keys(orientationData).map(function(axis){
            graphData[axis] = graphData[axis].slice(1);
            graphData[axis].push(orientationData[axis]);
        });

        graph.setData(formatFlotData());
        graph.draw();
    }
}

$(function() {
    Myo.connect();

    Myo.on("connected", function() {
        var updateGyro = makeGraph('.gyroscopeGraph', ['x', 'y', 'z'], 500);
        var updateOrientation = makeGraph('.orientationGraph', ['x', 'y', 'z', 'w'], 1);
        var updateAcceleration = makeGraph('.accelerometerGraph', ['x', 'y', 'z'], 2);

        Myo.on('imu', function(data) {
            updateGyro(data.gyroscope);
            updateOrientation(data.orientation);
            updateAcceleration(data.accelerometer);
        });
    });
});