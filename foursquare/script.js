var map;
var initialLocation;
var myLat, myLong, radius;
var eventsArray = [];
var markersArray = [];
var tips = [];
var infowindow = null;
var defaultOff = false;

var siberia = new google.maps.LatLng(60, 105);
var newyork = new google.maps.LatLng(40.729481987333855, -73.99361746883392);
var browserSupportFlag = new Boolean();


function getFoursquareData() {

    var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();

    var todayDate = d.getFullYear() + ((''+month).length<2 ? '0' : '') + month + ((''+day).length<2 ? '0' : '') + day;

    // var todayDate = $.datepicker.formatDate('yyyymmdd', new Date());
    // console.log(todayDate)

    console.log(myLat);
    console.log(myLong);

    var clientID = "J1LZV0KEVDQYOG2UGNZUAOMBE3GZBSTMB5JXX0AYCSRUUCBY";
    var clientSecret = "1EY1CMKOWSAUD2DKK1QLP2UF4SV1GHY2W1S0JGUFI5CBFUO4";

    var FoursquareURL = "https://api.foursquare.com/v2/venues/explore?";
    var FoursquareKey = "&client_id=" + clientID + "&client_secret=" + clientSecret;
    var APIversion = "&v=" + todayDate;
    var latLong = "ll=" + myLat + "," + myLong;
    var parameters = "&radius=800";

    $.ajax({
        url: FoursquareURL + latLong + FoursquareKey + APIversion,
        type: 'GET',
        dataType: 'json',
        error: function(msg){
            console.log("we got problems!");
        },
        success: function(data){
            // console.log(data);

            // console.log(data.response.groups[0].items[0].tips[0].text);

            for (var i = 0; i < data.response.groups[0].items.length; i++) {
                tips.push("<li>" + data.response.groups[0].items[i].tips[0].text + "</li>");
            }

            for (var i = 0; i < tips.length; i++) {
                $("#tips").append(tips[i]);
            }

            console.log(tips);

            // var tip = data.response.groups[0].items[0].tips[0].text;
            // $("#tips").html(tip);

        }
    });
}

function initializeMap() {
    var mapOptions = {
        center: new google.maps.LatLng(40.729, -73.993),
        zoom: 3,
        // center: newyork,
        // zoom: 13,
        disableDefaultUI: true
    };

    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    infowindow = new google.maps.InfoWindow({
        content: "content goes here"
    });
}

// Try W3C Geolocation (Preferred)
if(navigator.geolocation) {

    browserSupportFlag = true;

    navigator.geolocation.getCurrentPosition(function(position) {

        initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        map.setCenter(initialLocation);
        map.setZoom(15);

        myLat = initialLocation.k;
        myLong = initialLocation.A;

        // console.log(initialLocation);

        // console.log(myLat);
        // console.log(myLong);
    },

    function() {
        handleNoGeolocation(browserSupportFlag);
    });
}

// Browser doesn't support Geolocation
else {
    browserSupportFlag = false;
    handleNoGeolocation(browserSupportFlag);
}

function handleNoGeolocation(errorFlag) {
    if (errorFlag === true) {
        alert("Geolocation service failed.");
        initialLocation = newyork;
    } else {
        alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
        initialLocation = siberia;
    }

    map.setCenter(initialLocation);
}

$(document).ready(function() {

    initializeMap();

    $("#button").click(function() {
        getFoursquareData();
    });

});
