function instaTimesArticle(headline) {
	this.title = headline;
	this.img = '';
}

var instaTimesArray = [];

function getNYTimesData() {

	var NYTimesURL = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=new+york+times&page=1&sort=newest&api-key=';
	var NYTimesKey = '0DFDAB8DD26B1A457CC913DC6905AE3A:1:57964809';

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

			var nyTimesArticles = data.response.docs;

			for (var i = 0; i < nyTimesArticles.length; i++) {
				var tempObject = new instaTimesArticle(nyTimesArticles[i].headline.main);
				//console.log(tempObject.title);

				instaTimesArray.push(tempObject);
			}

			getInstagramData();
		}
	});
}

function getInstagramData() {
	var instagramURL = 'https://api.instagram.com/v1/tags/losangeles/media/recent?client_id=';
	var instagramKey = '069d427a43254e8ebc1dc2351cf36e64';

	$.ajax({
		url: instagramURL + instagramKey,
		type: 'GET',
		dataType: 'jsonp',
		error: function(msg) {
			console.log("Uh oh!");
		},
		success: function(data) {
			//console.log(data);

			var instagramPosts = data.data;

			for (var i = 0; i < instaTimesArray.length; i++) {
				instaTimesArray[i].img = instagramPosts[i].images.low_resolution.url;

				$("#articles").append("<div class='articleBox'>");
				$("#articles").append("<h3>" + instaTimesArray[i].title + "</h3>");
				$("#articles").append("<img src='" + instaTimesArray[i].img + "'>");
				$("#articles").append("</div>");

			}

			console.log(instaTimesArray);
		}
	});
}

$(document).ready(function() {
	//console.log("loaded!");

	$("#update").click(function() {
		//console.log("clicked!");

		getNYTimesData();

		//Create the object
		// var tempArticle = new instaTimesArticle();
		// $("#articles").append("<div class='articleBox'>");

		// $("#articles").append("<h3>" + tempArticle.title + "</h3>");
		// $("#articles").append("<img src='" + tempArticle.image + "'>");

		// $("#articles").append("</div>");
	});
});