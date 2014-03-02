var map;
var initialLocation;
var myLat, myLong, radius;
var eventsArray = [];
var markersArray = [];
var infowindow = null;
var defaultOff = false;

var siberia = new google.maps.LatLng(60, 105);
var newyork = new google.maps.LatLng(40.729481987333855, -73.99361746883392);
var browserSupportFlag = new Boolean();

function nyTimesEvent(lat, lon, url, evname, desc) {
    this.lat = lat;
    this.lon = lon;
    this.url = url;
    this.evname = evname;
    this.desc = desc;
}

function getNYTimesData(categoryFilter, radiusValue) {

    category = categoryFilter;
    radius = radiusValue;

    //var NYTimesURL = 'http://api.nytimes.com/svc/events/v2/listings.jsonp?&ll=' + myLat + ',' + myLong + '&radius=' + radius + '&filters=category:' + category + '&api-key=';
    var NYTimesURL = 'http://api.nytimes.com/svc/events/v2/listings.jsonp?&ll=40.729481987333855,-73.99361746883392&radius=' + radius + '&filters=category:' + category + '&api-key=';
    var NYTimesKey = '80E7A1E53C3E2AF9768C755B5CC48307:13:57964809';
    var callback = '&callback=svc_search_v2_listings';

    $.ajax({
        url: NYTimesURL + NYTimesKey + callback,
        type: 'GET',
        dataType: 'jsonp',
        error: function(msg){
            console.log("we got problems!");
        },
        success: function(data){

            var nyTimesEvents = data.results;
            eventsArray = [];

            for (var i = 0; i < nyTimesEvents.length; i++) {
                var eventLat = nyTimesEvents[i].geocode_latitude;
                var eventLong = nyTimesEvents[i].geocode_longitude;
                var eventURL = nyTimesEvents[i].event_detail_url;
                var eventName = nyTimesEvents[i].event_name;
                var eventDescription = nyTimesEvents[i].web_description;

                var tempObject = new nyTimesEvent(eventLat, eventLong, eventURL, eventName, eventDescription);

                eventsArray.push(tempObject);
            }

            addMarkers(map, eventsArray);
        }
    });
}

function addMarkers(map, markers) {
    for (var i = 0; i < markers.length; i++) {

        var markerInfo = markers[i];

        var content = "<h1><a href='" + markerInfo.url + "' target='_blank'>" + markerInfo.evname + "</a></h1>"
            + "<p>" + markerInfo.desc + "</p>";

        var eventMarker = new google.maps.Marker({
            position: new google.maps.LatLng(markerInfo.lat, markerInfo.lon),
            map: map,
            title: markerInfo.evname,
            html: content,
            animation: google.maps.Animation.DROP
        });

        google.maps.event.addListener(eventMarker, 'click', function() {
            infowindow.setContent(this.html);
            infowindow.open(map, this);
        });

        markersArray.push(eventMarker);
    }

    autoCenter();
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

function autoCenter() {
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < eventsArray.length; i++) {
        bounds.extend(eventsArray[i]);
    }

    map.fitBounds(bounds);
}

function initializeMap() {
    var mapOptions = {
        // center: new google.maps.LatLng(40.729, -73.993),
        // zoom: 3,
        center: newyork,
        zoom: 13,
        disableDefaultUI: true
    };

    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    infowindow = new google.maps.InfoWindow({
        content: "content goes here"
    });
}

// Try W3C Geolocation (Preferred)
// if(navigator.geolocation) {

//     browserSupportFlag = true;

//     navigator.geolocation.getCurrentPosition(function(position) {

//         initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
//         map.setCenter(initialLocation);
//         map.setZoom(13);

//         myLat = initialLocation.d;
//         myLong = initialLocation.e;
//     },

//     function() {
//         handleNoGeolocation(browserSupportFlag);
//     });
// }

// // Browser doesn't support Geolocation
// else {
//     browserSupportFlag = false;
//     handleNoGeolocation(browserSupportFlag);
// }

// function handleNoGeolocation(errorFlag) {
//     if (errorFlag === true) {
//         alert("Geolocation service failed.");
//         initialLocation = newyork;
//     } else {
//         alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
//         initialLocation = siberia;
//     }

//     map.setCenter(initialLocation);
// }

// google.maps.event.addDomListener(window, 'load', initializeMap);

$(document).ready(function() {

    initializeMap();

    $(".categoryButton").click(function() {
        if (!defaultOff) {
            category = $(this).attr("value");
            radius = 800;
            defaultOff = true;
        }

        else if (defaultOff) {
            category = $(this).attr("value");
        }

        deleteMarkers();
        getNYTimesData(category, radius);
        console.log(defaultOff);
    });

    $(".radiusButton").click(function() {
        radius = $(this).attr("value");
        deleteMarkers();
        getNYTimesData(category, radius);
    });

    $(".categories li").on('click', function() {
        $(this).addClass("clicked").siblings().removeClass("clicked");
    });

    $(".radiusCategories li").on('click', function() {
        $(this).addClass("clicked").siblings().removeClass("clicked");
    });

});
