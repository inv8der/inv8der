<!DOCTYPE html>
<html>
	<head>
		<title>Invasion of the Cube!</title>
		<link rel="stylesheet" type="text/css" href="resume_cube.css"/>
		<script type="text/javascript" src="jquery.js"></script>
		<script type="text/javascript" src="resume_cube.js"></script>
		<script type="text/javascript">
			function resetClass() {
				clearTimeout(window.timeoutHandle);
				$("#cube").css("-webkit-transform","");
				$("#cube").removeClass("show-front");
				$("#cube").removeClass("show-back");
				$("#cube").removeClass("show-left");
				$("#cube").removeClass("show-right");
				$("#cube").removeClass("show-top");
				$("#cube").removeClass("show-bottom");
			}
			function showFront() {
				resetClass();
				$("#cube").addClass("show-front");
			}
			function showBack() {
				resetClass();
				$("#cube").addClass("show-back");
			}
			function showLeft() {
				resetClass();
				$("#cube").addClass("show-left");
			}
			function showRight() {
				resetClass();
				$("#cube").addClass("show-right");
			}
			function showTop() {
				resetClass();
				$("#cube").addClass("show-top");
			}
			function showBottom() {
				resetClass();
				$("#cube").addClass("show-bottom");
			}
		</script>
	</head>
	<body>
	
	<?php
	function getBrowser() {
		$u_agent = $_SERVER['HTTP_USER_AGENT'];
		$bname = 'Unknown';
		$platform = 'Unknown';
		$version= "";

		//First get the platform?
		if (preg_match('/linux/i', $u_agent)) {
			$platform = 'linux';
		}
		elseif (preg_match('/macintosh|mac os x/i', $u_agent)) {
			$platform = 'mac';
		}
		elseif (preg_match('/windows|win32/i', $u_agent)) {
			$platform = 'windows';
		}
   
		// Next get the name of the useragent yes seperately and for good reason
		if(preg_match('/MSIE/i',$u_agent) && !preg_match('/Opera/i',$u_agent)) {
			$bname = 'Internet Explorer';
			$ub = "MSIE";
		}
		elseif(preg_match('/Firefox/i',$u_agent)) {
			$bname = 'Mozilla Firefox';
			$ub = "Firefox";
		}
		elseif(preg_match('/Chrome/i',$u_agent)) {
			$bname = 'Google Chrome';
			$ub = "Chrome";
		}
		elseif(preg_match('/Safari/i',$u_agent)) {
			$bname = 'Apple Safari';
			$ub = "Safari";
		}
		elseif(preg_match('/Opera/i',$u_agent))	{
			$bname = 'Opera';
			$ub = "Opera";
		}
		elseif(preg_match('/Netscape/i',$u_agent)) {
			$bname = 'Netscape';
			$ub = "Netscape";
		}
   
		// finally get the correct version number
		$known = array('Version', $ub, 'other');
		$pattern = '#(?<browser>' . join('|', $known) . ')[/ ]+(?<version>[0-9.|a-zA-Z.]*)#';
		if (!preg_match_all($pattern, $u_agent, $matches)) {
			// we have no matching number just continue
		}
		
		// see how many we have
		$i = count($matches['browser']);
		if ($i != 1) {
			//we will have two since we are not using 'other' argument yet
			//see if version is before or after the name
			if (strripos($u_agent,"Version") < strripos($u_agent,$ub)) {
				$version= $matches['version'][0];
			} else {
				$version= $matches['version'][1];
			}
		} else {
			$version= $matches['version'][0];
		}
   
		// check if we have a number
		if ($version==null || $version=="") {$version="?";}  
		return array(
			'userAgent' => $u_agent,
			'name'      => $bname,
			'version'   => $version,
			'platform'  => $platform,
			'pattern'    => $pattern
		);
	}

	// now try it
	$ua=getBrowser();
	$yourbrowser= "Your browser: " . $ua['name'] . " " . $ua['version'] . " on " .$ua['platform'] . " reports: <br >" . $ua['userAgent'];
	print_r($yourbrowser);
	?>

	<nav id="controls">
		<ul>
		<li><input type="button" value="Show Front" onclick="showFront()"/></li>
		<li><input type="button" value="Show Back" onclick="showBack()"/></li>
		<li><input type="button" value="Show Left" onclick="showLeft()"/></li>
		<li><input type="button" value="Show Right" onclick="showRight()"/></li>
		<li><input type="button" value="Show Top" onclick="showTop()"/></li>
		<li><input type="button" value="Show Bottom" onclick="showBottom()"/></li>
		</ul>
	</nav>
	<section class="container">
		<div id="cube">
			<figure class="front">
				<header>Marc Ryan</header>
				<article id="marc">
					<img src="photo.jpg"/>
					<p>Hello World! My name is Marc Ryan and I'm a 23 year old Computer Scientest currently
					looking to kickstart my career as a web developer. It's been tough convincing companies
					to hire me with virtually no professional experience under my belt. So that's why I
					decided to begin work on some of my own projects. This resum&eacute; cube is just 
					the beginning.</p>
					<h2>Contact Info</h2>
					<ul>
						<li>2324 Richard Drive - Henderson,NV - 89014</li>
						<li>ryanmq87@gmail.com</li>
						<li>(702) 496-0372</li>
					</ul>
				</article>
			</figure>
			<figure class="back">
				<header>Summary</header>
				<article>
				<h2>Objective</h2>
				<p>To secure a position as junior web developer where my programming experience, computer skills, and 
				passion for technology can help strengthen the industry.<p>
				<h2>Skills</h2>
				<ul>
					<li>2-3 years of experience with Java and C/C++, and about a year's experience with PHP, JavaScript/jQuery, CSS, and HTML</li>
					<li>Familiarity with the Zend Framework for front-end web development</li>
					<li>Good understanding of Agile software development and the MVC design pattern</li>
					<li>Decent knowledge of MySQL, including database access and table creation using phpMyAdmin</li>
					<li>Experience with Git and GitHub as method of software version control</li>
				</ul>
				</article>
			</figure>
			<figure class="right">
				<header>Education</header>
				<article>
					<h2>University of Nevada - Las Vegas</h2>
					<h4>Computer Science<br />August 2010 - December 2010</h4>
					<ul>
						<li>Enrolled in two graduate courses - Digital Image Processing and Computer Graphics</li>
					</ul>
				</article>
				<article>
					<h2>University of North Carolina at Chapel Hill</h2>
					<h4>Bachelor of Science - Computer Science<br />May 2010</h3>
					<ul>
						<li>Graduated with a GPA of 3.33</li>
						<li>Member of the Computer Science Club</li>
					</ul>
				</article>
				<article>
					<h2>University of Nevada - Reno</h2>
					<h4>Computer Science<br />August 2006 - May 2007</h4>
					<ul>
						<li>Before transferring to UNC-CH, achieved a GPA of 4.0</li>
					</ul>
					
				</article>
			</figure>
			<figure class="left">
				<header>Experience</header>
				<article>
					<h2>Code-Foo Intern</h2>
					<h4>IGN Entertainment<br />July 2011 - August 2011</h4>
					<p>Studied various languages and techniques for both front and back end web development, while 
					assisting the IGN engineering team in different tasks. I also helped the Tech 
					age team in designing the new IGN Tech Channel. Using IGN's Oyster Framework and coding 
					primarily in PHP, HTML, and JavaScript, I created and stylized three new widgets, two of which 
					will deployed sometime in the future with the new channel.</p>
				</article>
				<article>
					<h2>Bar Porter</h2>
					<h4>Station Casinos<br />June 2010 - June 2011</h4>
					<p>Helped to provide an excellent customer experience by maintaining sufficient stocks of liquor, 
					beverages, ice, fruits and other necessary items at the multiple bars located in GVR. Organizational 
					and communication skills were key in creating a fun and efficient environment for both the guests 
					and fellow co-workers.</p>
				</article>
				<article>
					<h2>Programmer</h2>
					<h4>University of North Carolina at Chapel Hill<br />August 2009 - May 2010</h4>
					<p>Assisted Dr. Kenneth Lohmann of the Biology Department in his research on sea turtles by developing 
					software to record their navigational patterns. Using C++ and the Win32 API, I was responsible for 
					designing the UI and coding the underlying layer which provided the user with the ability to record 
					and save custom trials.</p>
				</article>
				<article>
					<h2>Research Assitant</h2>
					<h4>University of North Carolina at Chapel Hill<br />August 2008 - May 2009</h4>
					<p>Employed by Professor Prasun Dewan to explore a possible implementation of his Distributed 
					Reflection project. The goal was to develop an application that could reflect upon a remote object, 
					and using only the primitive data types sent back to the client, reconstruct the object as it was 
					on the remote machine. Using Java Web Services to perform the remote procedure calls and Glassfish 
					as the application server, I attempted to realize this goal. Although unsuccessful, my research 
					provided invaluable insight into the nature of the project.</p>
				</article>
			</figure>
			<figure class="top">
				<header>Interests</header>
				<article id="interests">
				<ul>
					<li>Gamer since the SNES days</li>
					<li>Swimming, Ultimate Frisbee, shooting hoops</li>
					<li>Although my artistic abilities aren't top notch, I really like graphic design and being creative</li>
					<li>Learning about new technologies</li>
				</ul>
				</article>
			</figure>
			<figure class="bottom">
				<header>???</header>
				<article id="hypnotoad">
					<p class="encode">And here's Hypnotoad for your viewing pleasure! You know, just in case you thought
					this resume wasn't awesome enough...<p>
					<img src="hypnotoad.gif"/>
					<p>(Can you decode the message?)</p>
				</article>
			</figure>
		</div>
	</section>
	</body>
</html>