document.onready = function() {
	/*
	var supported = $.browser.webkit;
	if (!supported)
		alert("It appears that your browser doesn't support CSS3 3D transforms yet. " + 
		"To maximize your viewing experience (and see a working resume cube!), try using either Google Chrome or Safari. " + 
		"A modified version of my cube is in the works which will run on all other browsers.");
	*/
		
	animateCube();

	$("#cube").click(function() {
		$(this).unbind('click');
		clearTimeout(window.timeoutHandle);
		explodeCube();
		setTimeout("displayFaces()", 500);
		setTimeout("registerClick()", 1200);
	});
}

var deg = 0;
var animateCube = function() {
	if (deg === 165) {
		deg = 179.9;
		$("#cube").css("transition", "transform 400ms linear");
		$("#cube").css("transform","translateZ(-100px) rotate3d(1,0,1,-55deg) rotate3d(1,-1,-1,179.9deg)");
		window.timeoutHandle = setTimeout("animateCube()", 400);
	} else if (deg === 179.9) {
		$("#cube").css("transition", "");
		$("#cube").css("transform","translateZ(-100px) rotate3d(1,0,1,-55deg) rotate3d(1,-1,-1,180.1deg)");
		deg = 180.1;
		window.timeoutHandle = setTimeout("animateCube()", 20);
	} else if (deg === 180.1) {
		deg = 195;
		$("#cube").css("transition", "transform 400ms linear");
		$("#cube").css("transform","translateZ(-100px) rotate3d(1,0,1,-55deg) rotate3d(1,-1,-1,195deg)");
		window.timeoutHandle = setTimeout("animateCube()", 400);
	} else if (deg === 360) {
		$("#cube").css("transition", "");
		$("#cube").css("transform","translateZ(-100px) rotate3d(1,0,1,-55deg) rotate3d(1,-1,-1,0deg)");
		deg = 0;
		window.timeoutHandle = setTimeout("animateCube()", 20);
	} else {
		deg += 15;
		$("#cube").css("transition", "transform 400ms linear");
		$("#cube").css("transform","translateZ(-100px) rotate3d(1,0,1,-55deg) rotate3d(1,-1,-1," + deg + "deg)");
		window.timeoutHandle = setTimeout("animateCube()", 400);
	}
}

var explodeCube = function() {
	var faces = $("#cube figure");
	var transform, transition;
	
	// Querying the css transform property always returns a matrix3d string. If any rotations
	// were performed on the face, the string will contain numbers in scientific notation, which
	// apparently are considered invalid values.
	for (var i=0; i<faces.length; i++) {
		switch (i) {
			case 0:
				transform = 'rotateY(0deg) translateZ(100px)'; 
				break;
			case 1:
				transform = 'rotateY(180deg) translateZ(100px)'; 
				break;
			case 2:
				transform = 'rotateY(90deg) translateZ(100px)'; 
				break;
			case 3:
				transform = 'rotateY(-90deg) translateZ(100px)';
				break;
			case 4:
				transform = 'rotateX(90deg) translateZ(100px)'; 
				break;
			case 5:
				transform = 'rotateX(-90deg) translateZ(100px)';
				break;
		}
		//transform = $(faces[i]).css("-webkit-transform");
		transition  = $(faces[i]).css("transition");

		//transformMatrix[i] = multiply(transformMatrix[i], [[1,0,0,0],[0,1,0,0],[0,0,1,200],[0,0,0,1]]);
	
		$(faces[i]).css("transition", "transform 500ms cubic-bezier(0.1,1,1,1)");
		$(faces[i]).css("transform", transform + " translateZ(200px)");
		//$(faces[i]).css("-webkit-transform", toString(transformMatrix[i]));
	}
}

var displayFaces = function() {
	var faces = $("#cube figure");
	var transform, transition;
	
	$("#cube").css("transition", "transform 1200ms cubic-bezier(0.2,0.5,0.7,0.8)");
	$("#cube").css("transform", "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1) translateZ(-100px)");
	for (var i=0; i<faces.length; i++) {
		transition  = $(faces[i]).css("transition");
		switch (i) {
			case 0:
				// Front face
				transform = "translateX(-220px) translateY(-110px) rotateY(15deg)";
				//transformMatrix[i] = multiply(transformMatrix[i], [[1,0,0,-220],[0,1,0,-110],[0,0,1,0],[0,0,0,1]]);
				//transformMatrix[i] = multiply(transformMatrix[i], [[Math.cos(15),0,Math.sin(15),0],[0,1,0,0],[-Math.sin(15),0,Math.cos(15),0],[0,0,0,1]]);
				break;
			case 1:
				// Back face
				transform = "translateY(-110px) translateZ(-30px)";
				//transformMatrix[i] = multiply(transformMatrix[i], [[1,0,0,0],[0,1,0,-110],[0,0,1,-30],[0,0,0,1]]);
				break;
			case 2:
				// Right face
				transform = "translateX(220px) translateY(-110px) rotateY(-15deg)";
				//transformMatrix[i] = multiply(transformMatrix[i], [[1,0,0,220],[0,1,0,-110],[0,0,1,0],[0,0,0,1]]);
				//transformMatrix[i] = multiply(transformMatrix[i], [[Math.cos(-15),0,Math.sin(-15),0],[0,1,0,0],[-Math.sin(-15),0,Math.cos(-15),0],[0,0,0,1]]);
				break;
			case 3:
				// Left face
				transform = "translateX(-220px) translateY(110px) rotateY(15deg)";
				//transformMatrix[i] = multiply(transformMatrix[i], [[1,0,0,-220],[0,1,0,110],[0,0,1,0],[0,0,0,1]]);
				//transformMatrix[i] = multiply(transformMatrix[i], [[Math.cos(15),0,Math.sin(15),0],[0,1,0,0],[-Math.sin(15),0,Math.cos(15),0],[0,0,0,1]]);
				break;
			case 4:
				// Top face
				transform = "translateY(110px) translateZ(-30px)";
				//transformMatrix[i] = multiply(transformMatrix[i], [[1,0,0,0],[0,1,0,110],[0,0,1,-30],[0,0,0,1]]);
				break;
			case 5:
				// Bottom face
				transform = "translateX(220px) translateY(110px) rotateY(-15deg)";
				//transformMatrix[i] = multiply(transformMatrix[i], [[1,0,0,220],[0,1,0,-110],[0,0,1,0],[0,0,0,1]]);
				//transformMatrix[i] = multiply(transformMatrix[i], [[Math.cos(-15),0,Math.sin(-15),0],[0,1,0,0],[-Math.sin(-15),0,Math.cos(-15),0],[0,0,0,1]]);
				break;
		}
		$(faces[i]).css("transition", "transform 1200ms cubic-bezier(0.2,0.5,0.7,0.8)");
		$(faces[i]).css("transform", "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1) " + transform);
		//$(faces[i]).css("-webkit-transform", toString(transformMatrix[i]));
	}
}

var registerClick = function() {
	var faces = $("#cube figure");
	
	var numExpanded = 0;
	var expand = function(el) {
		el = el.currentTarget;
		$(el).unbind('click');
		$(el).css("transition", "transform 1s ease");
		$(el).css("transform", "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1) translateZ("+ (100+numExpanded) +"px)");
		numExpanded++;
			
		var bgcolor = $(el).css("background-color");
		var rgba = bgcolor.match(/\d{1,3}(?:\.\d{0,}){0,1}/g);
			
		var statement = '$(".' + el.className + '").css("transition-property", "height,width,margin-top,margin-left,background-color,line-height"); ';
		statement += '$(".' + el.className + '").css("transition-duration", "1000ms"); ';
		statement += '$(".' + el.className + '").css("width", "700px"); ';
		statement += '$(".' + el.className + '").css("height", "500px"); ';
		statement += '$(".' + el.className + '").css("margin-left", "-250px"); ';
		statement += '$(".' + el.className + '").css("margin-top", "-150px"); ';
		statement += '$(".' + el.className + '").css("background-color", "rgba('+rgba[0]+','+rgba[1]+','+rgba[2]+',1)"); ';
		statement += '$(".' + el.className + ' header").css("transition", "line-height 1s ease"); ';
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
		
		var statement = '$(".' + el.className + '").css("transition", "transform 1s ease"); ';
		statement += '$(".' + el.className + '").css("transform", "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1) '+ transform +'"); ';
		setTimeout(statement, 1000);
			
		$(el).css("transition-property", "height,width,margin-top,margin-left,background-color,line-height");
		$(el).css("transition-duration", "1000ms");
		$(el).css("width", "196px");
		$(el).css("height", "196px");
		$(el).css("margin-left", "0");
		$(el).css("margin-top", "0");
		$(el).css("overflow", "hidden");
		$("." + el.className + " article").css("display", "none");
		$(el).css("background-color", "rgba("+rgba[0]+","+rgba[1]+","+rgba[2]+",0.8)");
		$("." + el.className + " header").css("transition", "line-height 1s ease");
		$("." + el.className + " header").css("line-height", "500%");
		
		setTimeout(function() {$(el).click(expand)}, 2000);
		numExpanded--;
	}
	
	for (var i=0; i<faces.length; i++) {
		$(faces[i]).click(expand);
	}
}

var transformMatrix = Array.apply(null, Array(6)).map(function() {
	return [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
});

var multiply = function(a, b) {
	if (a[0].length !== b.length) {
		return undefined;
	}

	var M = Array.apply(null, Array(a.length)).map(function() { return Array(b[0].length); });

	for (var i=0; i<M.length; i++) {
		for (var j=0; j<M[i].length; j++) {
			M[i][j] = a[i].reduce(function(currentValue, elem, index) {
				return currentValue + elem*b[index][j]
			}, 0);
		}
	}

	return M
};

var toString = function(a) {
	var cssString = 'matrix3d(';

	var arr = a.reduce(function(val, elem, i) {
		val.push(elem.reduce(function(val, elem) {
			val.push(elem);
			return val;
		}, []));
		return val;
	}, []);

	cssString += arr.join(',') + ')';
    console.log(cssString);
	return cssString;
};


