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
		
		
		var overlay = document.createElement("DIV");
		overlay.style.width="20%";
		overlay.style.height="20%";
		overlay.style.position="absolute";
		overlay.style.backgroundColor="#00f";
		overlay.style.left="10%";
		overlay.style.top="10%";
		
		svgMap.addOverlay(overlay);
	}
	
	Main();
} )(window); 
