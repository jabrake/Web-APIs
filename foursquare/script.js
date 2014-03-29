var map;
var initialLocation;
var myLat, myLong, radius;
var eventsArray = [];
var markersArray = [];
var tips = [];
var latitudes = [];
var longitudes = [];
var infowindow = null;
var defaultOff = false;

var siberia = new google.maps.LatLng(60, 105);
var newyork = new google.maps.LatLng(40.729481987333855, -73.99361746883392);
var browserSupportFlag = new Boolean();

function foursquareTip(lat, lon, tipText, venueName) {
    this.lat = lat;
    this.lon = lon;
    this.tipText = tipText;
    this.venueName = venueName;
}

function getFoursquareData() {

    deleteMarkers();

    var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();

    var todayDate = d.getFullYear() + ((''+month).length<2 ? '0' : '') + month + ((''+day).length<2 ? '0' : '') + day;

    console.log(myLat);
    console.log(myLong);

    var clientID = "J1LZV0KEVDQYOG2UGNZUAOMBE3GZBSTMB5JXX0AYCSRUUCBY";
    var clientSecret = "1EY1CMKOWSAUD2DKK1QLP2UF4SV1GHY2W1S0JGUFI5CBFUO4";

    var FoursquareURL = "https://api.foursquare.com/v2/venues/explore?";
    var FoursquareKey = "&client_id=" + clientID + "&client_secret=" + clientSecret;
    var APIversion = "&v=" + todayDate;
    var latLong = "ll=" + myLat + "," + myLong;
    // var latLong = "ll=40.720385,-73.954597";
    var parameters = "&radius=100";

    console.log(FoursquareURL + latLong + FoursquareKey + APIversion);

    $.ajax({
        url: FoursquareURL + latLong + FoursquareKey + APIversion,
        type: 'GET',
        dataType: 'json',
        error: function(msg){
            console.log("we got problems!");
        },
        success: function(data){
            console.log(data);

            // console.log(data.response.groups[0].items[0].tips[0].text);

            var foursquareTips = data.response.groups[0].items;
            // deleteMarkers();
            tips = [];

            for (var i = 0; i < foursquareTips.length; i++) {
                var tipLat = foursquareTips[i].venue.location.lat;
                var tipLon = foursquareTips[i].venue.location.lng;
                var tipDescription = foursquareTips[i].tips[0].text;
                var tipVenue = foursquareTips[i].venue.name;

                var tempObject = new foursquareTip(tipLat, tipLon, tipDescription, tipVenue);

                tips.push(tempObject);
            }

            console.log(tips);

            // for (var i = 0; i < tips.length; i++) {
            //     $("#tips").append(tips[i]);
            // }

            addMarkers(map, tips);

        }
    });
}

function addMarkers(map, markers) {
    for (var i = 0; i < markers.length; i++) {

        var markerInfo = markers[i];

        var content = "<h1>" + markerInfo.venueName + "</h1>" + "<p>" + markerInfo.tipText + "</p>";

        var eventMarker = new google.maps.Marker({
            position: new google.maps.LatLng(markerInfo.lat, markerInfo.lon),
            map: map,
            //title: markerInfo.evname,
            html: content,
            animation: google.maps.Animation.DROP
        });

        google.maps.event.addListener(eventMarker, 'click', function() {
            infowindow.setContent(this.html);
            infowindow.open(map, this);
        });

        markersArray.push(eventMarker);
    }

    //autoCenter();
}

function setAllMap(map) {
    for (var i = 0; i < markersArray.length; i++) {
        markersArray[i].setMap(map);
    }
}

function deleteMarkers() {
    setAllMap(null);
    markersArray = [];
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
