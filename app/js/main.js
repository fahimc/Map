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
		svgMap.addMarker(52.766667,-1.2);
		svgMap.addMarker(42.500048,21.562500);
		svgMap.markerItem=FancyMarker;
		svgMap.addMarker(42.500048,-101.562500);
		svgMap.addMarker(22.500048,51.562500);
		svgMap.setScale(3);
		
		svgMap.purge();
		document.getElementsByClassName("mapHolder")[0].removeChild(svgMap.element);
		svgMap=null;
// 		
// 		
		svgMap = new SVGMap();
		svgMap.src = "img/world_map.svg";
// 		
		svgMap.build();
		
		document.getElementsByClassName("mapHolder")[0].appendChild(svgMap.element);
		svgMap.arrange();
		svgMap.addMarker(52.766667,-1.2);
		svgMap.addMarker(42.500048,21.562500);
		svgMap.markerItem=FancyMarker;
		svgMap.addMarker(42.500048,-101.562500);
		svgMap.addMarker(22.500048,51.562500);
		svgMap.setScale(3);
		
	}
	
	Main();
} )(window); 
