//Global variables
var foursquareData = {};

var d = new Date();
var month = d.getMonth()+1;
var day = d.getDate();
var todayDate = d.getFullYear() + ((''+month).length<2 ? '0' : '') + month + ((''+day).length<2 ? '0' : '') + day;

var categoriesList = [];
var categoryNames = [];
var categoryObjects = [];
var sortedObjs;
var counter = -1;
var readyToDraw = false;

function categoryCounts(categoryName, categoryCount) {
	this.categoryName = categoryName;
	this.categoryCount = categoryCount;
}

//Function to make AJAX call
function getFoursquareData() {
	var myURL = "https://api.foursquare.com/v2/users/self/venuehistory";
	var oauth = "?oauth_token=OML2OAUE21KTOUP5YYU2Z2AZDXL0CJ21XNLK25YQQEI4H0JQ";
	var version = "&v=" + todayDate;

	var JSONurl = "data.json";

	$.ajax({
		url: JSONurl,
		// url: myURL + oauth + version,
		type: 'GET',
		dataType: 'json',
		error: function(data){
			console.log("We got problems");
			console.log(data.status);
		},
		success: function(data){
			console.log("WooHoo!");

			var myFoursquareData = data.response.venues.items;

			//Parse through returned data, skip the object that has missing category and causes loop to break
			for (var i = 0; i < myFoursquareData.length; i++) {
				categoriesList[i] = myFoursquareData[i].venue.categories[0].name;
			}

			//Get unique category names
			var categories = _.uniq(categoriesList);

			//Create array of category name objects
			for (var i = 0; i < categories.length; i++) {
				var tempObject = new categoryCounts(categories[i], 0);

				categoryNames.push(tempObject);
			}

			//Create objects to parse later with Underscore - also skipping object without category
			for (var i = 0; i < myFoursquareData.length; i++) {
				categoryObjects[i] = myFoursquareData[i].venue.categories[0];
			}

			for (var i = 0; i < categoryObjects.length; i++) {
				parseData(categoryObjects[i]);
			}

			sortData(categoryNames);
		}
	});
}

function parseData(catObj) {
	var nameCheck = catObj.name;

	for (var i = 0; i < categoryNames.length; i++) {
		var nameName = categoryNames[i].categoryName;

		if (nameCheck === nameName) {
			categoryNames[i]['categoryCount'] += 1;
		}
	}
}

function sortData(objectsArray) {
	sortedObjs = _.sortBy(objectsArray, 'categoryCount');
	readyToDraw = true;
	console.log(readyToDraw);
	console.log(sortedObjs);
}

$('document').ready(function(){
	getFoursquareData();
});