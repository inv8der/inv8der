document.onready = function() {
	var supported = $.browser.webkit;
	if (!supported)
		alert("It appears that your browser doesn't support CSS3 3D transforms yet. " + 
		"To maximize your viewing experience (and see a working resume cube!), try using either Google Chrome or Safari. " + 
		"A modified version of my cube is in the works which will run on all other browsers.");
		
	animateCube();

	$("#cube").click(function() {
		$(this).unbind('click');
		clearTimeout(window.timeoutHandle);
		explodeCube();
		setTimeout("displayFaces()", 500);
		setTimeout("registerClick()", 1200);
	});
}

var deg = 15;
var animateCube = function() {
	$("#cube").css("-webkit-transition", "-webkit-transform 400ms linear");
	$("#cube").css("-webkit-transform","translateZ(-100px) rotate3d(1,0,1,-55deg) rotate3d(1,-1,-1," + deg + "deg)");
	deg = (deg+15) % 360;
	window.timeoutHandle = setTimeout("animateCube()", 400);
}

var explodeCube = function() {
	var faces = $("#cube figure");
	var transform, transition;
	
	for (var i=0; i<faces.length; i++) {
		transform = $(faces[i]).css("-webkit-transform");
		transition  = $(faces[i]).css("-webkit-transition");
	
		$(faces[i]).css("-webkit-transition", "-webkit-transform 500ms cubic-bezier(0.1,1,1,1)");
		$(faces[i]).css("-webkit-transform", transform + " translateZ(200px)");
	}
}

var displayFaces = function() {
	var faces = $("#cube figure");
	var transform, transition;
	
	$("#cube").css("-webkit-transition", "-webkit-transform 1200ms cubic-bezier(0.2,0.5,0.7,0.8)");
	$("#cube").css("-webkit-transform", "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1) translateZ(-100px)");
	for (var i=0; i<faces.length; i++) {
		transition  = $(faces[i]).css("-webkit-transition");
		switch (i) {
			case 0:
				// Front face
				transform = "translateX(-220px) translateY(-110px) rotateY(15deg)";
				break;
			case 1:
				// Back face
				transform = "translateY(-110px) translateZ(-30px)";
				break;
			case 2:
				// Right face
				transform = "translateX(220px) translateY(-110px) rotateY(-15deg)";
				break;
			case 3:
				// Left face
				transform = "translateX(-220px) translateY(110px) rotateY(15deg)";
				break;
			case 4:
				// Top face
				transform = "translateY(110px) translateZ(-30px)";
				break;
			case 5:
				// Bottom face
				transform = "translateX(220px) translateY(110px) rotateY(-15deg)";
				break;
		}
		$(faces[i]).css("-webkit-transition", "-webkit-transform 1200ms cubic-bezier(0.2,0.5,0.7,0.8)");
		$(faces[i]).css("-webkit-transform", "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1) " + transform);
	}
}

var registerClick = function() {
	var faces = $("#cube figure");
	
	var numExpanded = 0;
	var expand = function(el) {
		el = el.currentTarget;
		$(el).unbind('click');
		$(el).css("-webkit-transition", "-webkit-transform 1s ease");
		$(el).css("-webkit-transform", "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1) translateZ("+ (100+numExpanded) +"px)");
		numExpanded++;
			
		var bgcolor = $(el).css("background-color");
		var rgba = bgcolor.match(/\d{1,3}(?:\.\d{0,}){0,1}/g);
			
		var statement = '$(".' + el.className + '").css("-webkit-transition-property", "height,width,margin-top,margin-left,background-color,line-height"); ';
		statement += '$(".' + el.className + '").css("-webkit-transition-duration", "1000ms"); ';
		statement += '$(".' + el.className + '").css("width", "700px"); ';
		statement += '$(".' + el.className + '").css("height", "500px"); ';
		statement += '$(".' + el.className + '").css("margin-left", "-250px"); ';
		statement += '$(".' + el.className + '").css("margin-top", "-150px"); ';
		statement += '$(".' + el.className + '").css("background-color", "rgba('+rgba[0]+','+rgba[1]+','+rgba[2]+',1)"); ';
		statement += '$(".' + el.className + ' header").css("-webkit-transition", "line-height 1s ease"); ';
		statement += '$(".' + el.className + ' header").css("line-height", "100%"); ';
			
		setTimeout(statement, 1000);
		
		statement = '$(".' + el.className + ' article").css("display", "block"); ';
		statement += '$(".' + el.className + '").css("overflow", "auto"); ';
		
		setTimeout(statement, 2000);
		setTimeout(function() {$(el).click(collapse)}, 2000);
	}
	
	var collapse = function(el) {
		el = el.currentTarget;
		$(el).unbind('click');
		
		switch (el.className) {
			case "front":
				transform = "translateX(-220px) translateY(-110px) rotateY(15deg)";
				break;
			case "back":
				transform = "translateY(-110px) translateZ(-30px)";
				break;
			case "right":
				transform = "translateX(220px) translateY(-110px) rotateY(-15deg)";
				break;
			case "left":
				transform = "translateX(-220px) translateY(110px) rotateY(15deg)";
				break;
			case "top":
				transform = "translateY(110px) translateZ(-30px)";
				break;
			case "bottom":
				transform = "translateX(220px) translateY(110px) rotateY(-15deg)";
				break;
		}
			
		var bgcolor = $(el).css("background-color");
		var rgba = bgcolor.match(/\d{1,3}(?:\.\d{0,}){0,1}/g);
		
		var statement = '$(".' + el.className + '").css("-webkit-transition", "-webkit-transform 1s ease"); ';
		statement += '$(".' + el.className + '").css("-webkit-transform", "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1) '+ transform +'"); ';
		setTimeout(statement, 1000);
			
		$(el).css("-webkit-transition-property", "height,width,margin-top,margin-left,background-color,line-height");
		$(el).css("-webkit-transition-duration", "1000ms");
		$(el).css("width", "196px");
		$(el).css("height", "196px");
		$(el).css("margin-left", "0");
		$(el).css("margin-top", "0");
		$(el).css("overflow", "hidden");
		$("." + el.className + " article").css("display", "none");
		$(el).css("background-color", "rgba("+rgba[0]+","+rgba[1]+","+rgba[2]+",0.8)");
		$("." + el.className + " header").css("-webkit-transition", "line-height 1s ease");
		$("." + el.className + " header").css("line-height", "500%");
		
		setTimeout(function() {$(el).click(expand)}, 2000);
		numExpanded--;
	}
	
	for (var i=0; i<faces.length; i++) {
		$(faces[i]).click(expand);
	}
}
