(function(window) {
	function Main() {
		if (window.addEventListener) {
			window.addEventListener("load", onLoad);
		} else {
			window.attachEvent("onload", onLoad);
		}
	}

	function onLoad() {
		var svgMap = new SVGMap();
		svgMap.src = "img/world_map.svg";
		svgMap.build();
		document.getElementsByClassName("mapHolder")[0].appendChild(svgMap.element);
		svgMap.arrange();
		svgMap.addMarker(52.500048,-1.562500);
	}
	
	Main();
} )(window); 
