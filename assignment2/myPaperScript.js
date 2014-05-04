var location;
var readyToAnimate = false;
console.log(readyToAnimate);

function drawCircles(objectsArray){
	console.log("drawing circles!");
	console.log(objectsArray);

	for (var i = 0; i < objectsArray.length; i++) {

		location = Point.random() * view.size;

		var group = new Group({
			children: null
		});

		var circObj = new Path.Circle({
			center: [location.x, location.y],
			radius: objectsArray[i].categoryCount,
			strokeColor: '#1abc9c',
			strokeWidth: 1,
			fillColor: 'black'
		});

		if (location.y + circObj.radius > view.size.height) {
			location.y = view.size.height - circObj.radius;
		}

		textX = location.x + objectsArray[i].categoryCount + 10;

		var textObj = new PointText({
			point: [textX, location.y],
			content: objectsArray[i].categoryName,
			fillColor: '#7f8c8d',
			fontFamily: 'Helvetica',
			fontWeight: 'bold',
			fontSize: 25,
			className: 'circleText',
			visible: false
		});

		group.addChild(circObj);
		group.addChild(textObj);

		group.onMouseEnter = function(event) {
			this.children[0].fillColor = '#1abc9c';
			this.children[0].strokeColor = 'black';
			this.children[0].strokeWidth = 5;
			this.children[1].visible = true;
			this.bringToFront();
			readyToAnimate = false;
		}

		group.onMouseLeave = function(event) {
			this.children[0].fillColor = 'black';
			this.children[0].strokeColor = '#1abc9c';
			this.children[0].strokeWidth = 1;
			this.children[1].visible = false;
			readyToAnimate = true;
		}

		group.onMouseDown = function(event) {
			this.remove();
			readyToAnimate = true;
		}
	}

	readyToAnimate = true;
	console.log(readyToAnimate);
}

function onFrame(){

	if (readyToDraw) {
		drawCircles(sortedObjs);
		readyToDraw = false;
	}

	if (readyToAnimate) {

		var totalCircles = project.activeLayer.children.length;

		for (var i = 0; i < totalCircles; i++) {
			var currentCircle = project.activeLayer.children[i];
			currentCircle.position.x += currentCircle.bounds.width / 20;

			if (currentCircle.position.x - currentCircle.bounds.width/2 > view.size.width) {
				currentCircle.position.x = -currentCircle.bounds.width;
			}
		}
	}
}