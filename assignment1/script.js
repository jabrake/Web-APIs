var map;
var initialLocation;
var siberia = new google.maps.LatLng(60, 105);
var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
var browserSupportFlag = new Boolean();

function getNYTimesData() {

    var NYTimesURL = 'http://api.nytimes.com/svc/events/v2/listings.json?&ll=40.756146,-73.99021&api-key=';
    var NYTimesKey = '80E7A1E53C3E2AF9768C755B5CC48307:13:57964809';

    $.ajax({
        url: NYTimesURL + NYTimesKey,
        type: 'GET',
        dataType: 'json',
        error: function(msg){
            console.log("we got problems!");
        },
        success: function(data){
            //console.log(data);
            console.log(data.response.docs);

            // var nyTimesArticles = data.response.docs;

            // for (var i = 0; i < nyTimesArticles.length; i++) {
            //     var tempObject = new instaTimesArticle(nyTimesArticles[i].headline.main);
            //     //console.log(tempObject.title);

            //     instaTimesArray.push(tempObject);
            // }
        }
    });
}

function initializeMap() {
    var mapOptions = {
        center: new google.maps.LatLng(40.729, -73.993),
        zoom: 3
    };

    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}

// Try W3C Geolocation (Preferred)
if(navigator.geolocation) {

    browserSupportFlag = true;

    navigator.geolocation.getCurrentPosition(function(position) {

        initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        map.setCenter(initialLocation);
        map.setZoom(17);
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

// google.maps.event.addDomListener(window, 'load', initializeMap);

$(document).ready(function() {
    // console.log("doc ready");

    initializeMap();

    $("#update").click(function() {

        // console.log("clicked!");
        getNYTimesData();
    });

});


