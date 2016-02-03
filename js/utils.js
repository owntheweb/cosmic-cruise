//old browser notify
var $buoop = {} 
$buoop.ol = window.onload; 
window.onload=function(){ 
	try {if ($buoop.ol) $buoop.ol();}catch (e) {} 
	var e = document.createElement("script"); 
	e.setAttribute("type", "text/javascript"); 
	e.setAttribute("src", "http://browser-update.org/update.js"); 
	document.body.appendChild(e); 
}

//make window.requestAnimationFrame cross-browser
//used when telling browser that JavaScript is being used
//specifically for animation, gives higher priority, smoother performance
if(!window.requestAnimationFrame) {
	window.requestAnimationFrame = (window.webkitRequestAnimationFrame ||
									window.mozRequestAnimationFrame ||
									window.oRequestAnimationFrame ||
									window.msRequestAnimationFrame ||
									function(callback) {
										return window.setTimeout(callback, 1000/60);
									});
}