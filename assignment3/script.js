//MIN DISTANCE = 11,212,867.748258118
//MAX DISTANCE = 12,588,898.473025825
var w = $(window).width()/2;
var h = $(window).height();
var DCLat = 38.897876;
var DCLon = -77.036492;
var DCLatLon = new google.maps.LatLng(DCLat, DCLon);
var droneData = [];
var flag = null;

function getDronestreamData() {

    // var URL = "http://api.dronestre.am/data";
    var URL = "data.json";

    $.ajax({
        url: URL,
        type: 'GET',
        dataType: 'json',
        error: function(msg){
            console.log("we got problems!");
        },

        success: function(data){

            droneData = data.strike;
        }

    }).then(function() {

        calculateDistances();
    });
}

function calculateDistances() {

    for (var i = 0; i < droneData.length; i++) {

        var strikeLat = droneData[i].lat;
        var strikeLon = droneData[i].lon;

        var strikeLatLon = new google.maps.LatLng(strikeLat, strikeLon);

        var calcDistance = google.maps.geometry.spherical.computeDistanceBetween(DCLatLon, strikeLatLon);

        droneData[i].distance = calcDistance;
        droneData[i].hoverCounter = 0;
    }

    var sortedDrones = _.sortBy(droneData, 'distance');

    console.log(sortedDrones);

    var adding = 0;

    var cScale = d3.scale.linear()
        .domain([0, 526])
        .range([0, 2 * Math.PI]);

    var dataScale = d3.scale.linear()
        .domain([11212867, 12588898])
        .range([50, 400]);

    var vis = d3.select("body")
        .append("svg")
        .attr('width', w)
        .attr('height', h)
        .attr('id', 'chart');

    var circleContainer = d3.select("body")
        .append("svg")
        .attr("width", w*2)
        .attr("height", h)
        .attr("id", "circle");

    var circle = circleContainer.append("circle")
        .attr("cx", w*1.47)
        .attr("cy", h/2)
        .attr("r", 49);

    var arc = d3.svg.arc()
        .innerRadius(50)
        .outerRadius(function (d) {
            return dataScale(d.distance);
        })
        .startAngle(function (d) {
            return cScale(adding);
        })
        .endAngle(function (d) {
            adding ++;
            return cScale(adding);
        });

    vis.selectAll("path")
    .data(droneData)
    .enter()
    .append("path")
    .on("mouseover", function (d) {

        $("#infoDisplay").html(function () {

            var country = d.country;
            var location = d.lat + "°, " + d.lon + "°";
            var deaths = d.deaths;
            var distance = Math.ceil(d.distance);
            var display = "<h2>Distance: " + distance + " meters from strike command" + "<br>Location: " + location + "<br>Casualties: " + deaths + "</h2><br><img class='flag' src=" + flag + "></img>";

            if (d.country == "Pakistan") {
                flag = "pakistan.png";
            } else if (d.country == "Somalia") {
                flag = "somalia.png";
            } else if (d.country == "Yemen") {
                flag = "yemen.png";
            }

            console.log(flag);

            return display;
        }).hide().fadeIn("fast");

        d.hoverCounter++;

        d3.select(this)
        .transition()
        .duration(250)
        .style("fill", function (d) {
            if (d.hoverCounter < 2) {
                return "black";
            } else if (d.hoverCounter >= 2) {
                return "red";
            }
        });
    })
    .on("mouseout", function (d) {
        d3.select(this)
        .transition()
        .duration(500)
        .style("fill", "black");
    })
    .attr("d", arc)
    .style("fill", "#eee")
    .attr("transform", "translate(" + w*0.5 + ", " + h*0.5 + ")");

}

$(document).ready(function() {
    getDronestreamData();

});