var MAPINDEX=0;
/**
 * @constructor
 */
var SVGMap = function() {
	this.element = null;
	this.markerHolder = null;
	this.overlayHolder = null;
	this.src = null;
	 /** @property {number} scale This is the current scale value. */
	this.scale = 1;
	 /** @property {number} scaleMax This is the max scale value. */
	this.scaleMax = 3;
	 /** @property {number} scaleMin  This is the min scale value. */
	this.scaleMin = 1;
	this.startX = 1;
	this.startY = 1;
	this.scaleIncrement = 0.1;
	this.initialWidth = 0;
	this.initialHeight = 0;
	this.startZoom = 0;
	this.svgHeight = 551;
	this.svgWidth = 322;
	this.handlers = [];
	 /** @property {Array} markers  This is an array of markers on the map. */
	this.markers = [];
	 /** @property {Object} markerItem  This is a reference to the marker object */
	this.markerItem = SVGMapMarker;
	this.currentX=0;
	this.endX=0;
	this.endY=0;
	this.currentY=0;
	this.x = 0;
	this.y = 0;
	this.uid=0;
	this.muid=0;
};
(function() {
	var _ = SVGMap.prototype;

	/**
	 build the SVGMap. You need to call this method after creating an instance.
	 @public
	 @alias SVGMap.build
	 @memberOf SVGMap
	 */
	_.build = function() {
		
		this.uid = MAPINDEX++;
		this.element = document.createElement("SVG-MAP");
		this.img = document.createElement("IMG");
		this.img.src = this.src;

		this.markerHolder = document.createElement("DIV");
		this.overlayHolder = document.createElement("DIV");
		
		this.element.appendChild(this.img);
		this.element.appendChild(this.overlayHolder);
		this.element.appendChild(this.markerHolder);
		this.setStyle();
		this.setListeners();
	};
	_.setListeners = function() {
		
		this.element.addEventListener("mousewheel", this.getHandler("onMouseWheel"));
		this.element.addEventListener("touchstart", this.getHandler("onTouchStart"));
		this.element.addEventListener("touchend", this.getHandler("onTouchEnd"));
		this.element.addEventListener("touchmove", this.getHandler("onTouchMove"));
		if ('ontouchstart' in document.documentElement) {
		} else {
			this.element.addEventListener("mousedown", this.getHandler("onMouseDown"));
		}
		this.img.addEventListener("load", this.getHandler("onImgLoaded"));
	};
	_.setStyle = function() {
		this.element.style.display = "block";
		this.element.style.position = "relative";
		this.element.style.width = "100%";
		this.element.style.height = "100%";
		this.element.style.overflow = "hidden";

		this.img.style.position = "absolute";

		this.markerHolder.style.position = "absolute";
		this.overlayHolder.style.position = "absolute";
		this.img.ondragstart = function() {
			return false;
		};
	};
	/**
	This arranges all the child elements and its self. X,Y,width, height etc..
	 @public
	 @alias SVGMap.arrange
	 @memberOf SVGMap
	 */
	_.arrange = function() {
		this.img.style.width = (this.scale * this.element.clientWidth) + "px";

		this.markerHolder.style.width = (this.scale * this.element.clientWidth) + "px";
		this.markerHolder.style.height = this.img.clientHeight + "px";
		
		this.overlayHolder.style.width = (this.scale * this.element.clientWidth) + "px";
		this.overlayHolder.style.height = this.img.clientHeight + "px";
		
		this.setXY();
		this.positionMarkers();
	};
	/**
	You can add DOM elements to the overlay layer.
	 @public
	 @alias SVGMap.addOverlay
	 @memberOf SVGMap
	 @param {DOMElement} element The element you wish to add
	 @param {String} id (optional)provide a unique id for reference.
	 */
	_.addOverlay=function(element,id)
	{
		element.id=id?id:element.id;
		this.overlayHolder.appendChild(element);
	};
	/**
	You can remove DOM elements to the overlay layer.
	 @public
	 @alias SVGMap.removeOverlay
	 @memberOf SVGMap
	 @param {DOMElement} element The element you wish to remove
	 */
	_.removeOverlay=function(element)
	{
		this.overlayHolder.removeChild(element);
	};
	/**
	You can add a marker to the map.
	 @public
	 @alias SVGMap.addMarker
	 @memberOf SVGMap
	 @param {Number} lat provide the latittude
	 @param {Number} lng provide the longitude
	 */
	_.addMarker = function(lat, lng) {
		var marker = new this.markerItem();
		marker.timestamp = new Date().getTime();
		marker.uid = this.muid++;
		marker.build();
		marker.setStyle();
		marker.lat = lat;
		marker.lng = lng;
		marker.element.setAttribute("data-lat", lat);
		marker.element.setAttribute("data-lng", lng);
		this.setMarkerXY(marker);

		this.markerHolder.appendChild(marker.element);
		this.markers.push(marker);

		return marker;
	};
	/**
	You can remove a marker from the map.
	 @public
	 @alias SVGMap.removeMarker
	 @memberOf SVGMap
	 @param {Number} lat provide the latittude
	 @param {Number} lng provide the longitude
	 */
	_.removeMarker = function(lat, lng) {
		for (var a = 0; a < this.markers.length; a++) {
			var mlat = this.markers[a].lat;
			var mlng = this.markers[a].lng;
			if (lat == mlat && lng == mlng) {
				this.markerHolder.removeChild(this.markers[a].element);
				delete this.markers[a];
				this.markers.splice(a, 1);
				return;
			}
		}
	};
	_.removeMarkerByUID=function(uid)
	{
		
		for (var a = 0; a < this.markers.length; a++) {
			if (this.markers[a].uid==uid) {
				this.markerHolder.removeChild(this.markers[a].element);
				delete this.markers[a];
				this.markers.splice(a, 1);
				return true;
			}
		}
		return false;
	};
	/**
	You can get a marker.
	 @public
	 @alias SVGMap.getMarker
	 @memberOf SVGMap
	 @param {Number} lat provide the latittude
	 @param {Number} lng provide the longitude
	 */
	_.getMarker=function(lat, lng)
	{
		for (var a = 0; a < this.markers.length; a++) {
			var mlat = this.markers[a].lat;
			var mlng = this.markers[a].lng;
			if (lat == mlat && lng == mlng) {
				return this.markers[a];
			}
		}
		return null;
	};
	_.setMarkerXY = function(marker) {
		var lat = marker.lat;
		var lng = marker.lng;

		var points = this.latLngToPoint(lat, lng, this.img.clientWidth, this.img.clientHeight, this.img.clientWidth * 0.478, this.img.clientHeight * 0.64);

		marker.position(points.X, points.Y);

	};
	_.latLngToPoint = function(lat, lng, elementWidth, elementHeight, primeMeridian_X, equator_Y) {
		xFactor = lng / -180;
		yFactor = lat / 90;
		mapCenter = {
			X : elementWidth / 2,
			Y : elementHeight / 2
		};
		mapCenterOffset = {
			X : primeMeridian_X - mapCenter.X,
			Y : equator_Y - mapCenter.Y
		};
		var xPos = ((mapCenter.X + mapCenterOffset.X) - mapCenter.X * xFactor) / elementWidth * 100;
		var yPos = ((mapCenter.Y + mapCenterOffset.Y) - mapCenter.Y * yFactor) / elementHeight * 100;
		xPos = xPos < 0 ? 100 + xPos : xPos > 100 ? xPos - 100 : xPos;
		yPos = yPos < 0 ? 100 + yPos : yPos > 100 ? yPos - 100 : yPos;
		return {
			X : xPos + '%',
			Y : yPos + '%'
		};
	};
	_.positionMarkers = function() {
		for (var a = 0; a < this.markers.length; a++) {
			var child = this.markers[a];

			this.setMarkerXY(child);

		}
	};
	_.onImgLoaded = function(event) {

		if(!this.img)return;
		this.initialWidth = this.img.clientWidth;
		this.initialHeight = this.svgHeight;

		this.startZoom = this.element.clientWidth / this.initialWidth;
		this.lineY = this.lineY * this.startZoom;
		this.img.style.width = this.element.clientWidth + "px";
		
		this.arrange();
		this.positionMarkers();
	};
	_.onMouseWheel = function(event) {

		var x = this.mouseX(this.img, event)- this.getOffset(this.element).x;
		var y = this.mouseY(this.img, event)- this.getOffset(this.element).y;
		var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
		if (delta < 0) {
			this.scale -= this.scaleIncrement;

		} else {
			this.scale += this.scaleIncrement;

		}
		//get previous values
		var px = this.x;
		var py = this.y;
		var pw = this.img.clientWidth;
		var ph = this.img.clientHeight;
		this.setScale();
		this.centerAroundMouse(x, y, px, py, pw, ph);

		this.setXY();
		event.preventDefault();
		event.stopPropagation();
	};
	_.getOffset = function(el) {
		var _x = 0;
		var _y = 0;
		while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
			_x += el.offsetLeft - el.scrollLeft;
			_y += el.offsetTop - el.scrollTop;
			el = el.offsetParent;
		}
		return {
			y : _y,
			x : _x
		};
	};
	_.centerAroundMouse = function(x, y, px, py, pw, ph) {
		//work out the increase
		var widthScale = this.img.clientWidth / pw;
		var heightScale = this.img.clientHeight / ph;

		var toX =(this.x+x);
		var toY =(this.y+y);
		this.x =-((x * widthScale)-toX);
		this.y =-((y * heightScale)-toY);
		
	};
	/**
	provide a scale value for the map.
	 @public
	 @alias SVGMap.setScale
	 @memberOf SVGMap
	 @param {Number} value 
	 */
	_.setScale = function(value) {
		if (value != undefined)
			this.scale = value;
		if (this.scale < this.scaleMin)
			this.scale = this.scaleMin;
		if (this.scale > this.scaleMax)
			this.scale = this.scaleMax;
			
		this.setXY();

		this.arrange();
	};
	_.onMouseDown = function(event) {
		
		clearInterval(this.anim_interval);
		var root=this;
		this.anim_interval = setInterval(function() {
			root.startX=root.currentX ;
			root.startY=root.currentY ;
		},200);
		this.currentX = this.startX = this.mouseX(this.element, event);
		this.currentY = this.startY = this.mouseY(this.element, event);

		window.addEventListener("mousemove", this.getHandler("onMouseMove"));
		window.addEventListener("mouseup", this.getHandler("onMouseUp"));

	};
	_.onMouseUp = function(event) {
		this.endX = this.mouseX(this.element, event);
		this.endY = this.mouseY(this.element, event);
		window.removeEventListener("mousemove", this.getHandler("onMouseMove"));
		window.removeEventListener("mouseup", this.getHandler("onMouseUp"));
		this.animateTouch();

	};
	_.onMouseMove = function(event) {
		var x = this.mouseX(this.element, event);
		var y = this.mouseY(this.element, event);
		this.x -= this.currentX - x;
		this.y -= this.currentY - y;

		this.setXY();

		
		this.positionMarkers();
		this.currentX = x;
		this.currentY = y;
	};
	_.onTouchStart = function(event) {

		this.startX = event.touches[0].pageX;
		this.startY = event.touches[0].pageY;

	};
	_.onTouchMove = function(event) {

		this.onMouseMove(event);

	};
	_.onTouchEnd = function(event) {

		//this.element.removeEventListener("touchmove", this.getHandler("onTouchMove"));
	};
	_.getHandler = function(funcName, target) {
		var root = this;
		
		if (!this.handlers[funcName]) {
			this.handlers[funcName] = function(event) {
				if (target)
					event.target = target;
				root[funcName](event);
			};
		}

		return this.handlers[funcName];
	};
	/**
	set the x and y of the map and its elements
	 @public
	 @alias SVGMap.setXY
	 @memberOf SVGMap
	 */
	_.setXY = function() {
		if (this.x > 0)
			this.x = 0;
		if (this.y > 0)
			this.y = 0;
		var yDiff = this.element.clientHeight - this.img.clientHeight;
		if (this.y < yDiff)
			this.y = yDiff;
		var xDiff = this.element.clientWidth - this.img.clientWidth;
		if (this.x < xDiff)
			this.x = xDiff;

		if (this.img.clientWidth <= this.element.clientWidth) {
			this.x = (this.element.clientWidth - this.img.clientWidth) * 0.5;
		}
		if (this.img.clientHeight < this.element.clientHeight) {
			this.y = (this.element.clientHeight - this.img.clientHeight) * 0.5;
		}

		this.img.style.left = this.x + "px";
		this.img.style.top = this.y + "px";
		this.markerHolder.style.left = this.x + "px";
		this.markerHolder.style.top = this.y + "px";
		this.overlayHolder.style.left = this.x + "px";
		this.overlayHolder.style.top = this.y + "px";
		

	};
	/**
	center the map
	 @public
	 @alias SVGMap.centerMap
	 @memberOf SVGMap
	 */
	_.centerMap = function() {
		var x = (this.element.clientWidth - this.img.clientWidth) * 0.5;
		var y = (this.element.clientHeight - this.img.clientHeight) * 0.5;
		this.img.style.left = x + "px";
		this.img.style.top = y + "px";
		this.markerHolder.style.left = x + "px";
		this.markerHolder.style.top = y + "px";
		this.overlayHolder.style.left = x + "px";
		this.overlayHolder.style.top= y + "px";
		this.x = x;
		this.y = y;
	};
	_.animateTouch = function() {
		
		clearInterval(this.anim_interval);
		
		var frame = 0;
		var root = this;
		// Animate
		
		this.anim_interval = setInterval(function() {
			frame++;
			var dX = root.startX - root.endX, dY = root.startY - root.endY;
			var dist = (Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2)) * root.scale) / 20;
			var deg = Math.atan(dY / dX) * 180 / Math.PI + (root.startX < root.endX ? 0 : 180);
			deg = deg ? deg : 0;
			root.x = (root.x + Math.cos(deg * Math.PI / 180) * dist * (1 - frame / 20));
			root.y = (root.y + Math.sin(deg * Math.PI / 180) * dist * (1 - frame / 20));
			root.setXY();
			
			if (frame == 20 || dist == 0)
			{
				clearInterval(root.anim_interval);
							
			}
	
			
				
		}, 1000 / 60);

	};
	_.mouseX = function(elem, e) {
		if (event.touches)
			return event.touches[0].pageX;
		var x;
		if (e.pageX) {
			x = e.pageX;
		} else {
			x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;

		}
		x -= elem.offsetLeft;
		return x;
	};
	_.mouseY = function(elem, e) {
		if (event.touches)
			return event.touches[0].pageY;
		var y;
		if (e.pageY) {
			y = e.pageY;
		} else {
			y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;

		}
		y -= elem.offsetTop;
		return y;
	};
	/**
	detroy and remove everything in the map.
	 @public
	 @alias SVGMap.purge
	 @memberOf SVGMap
	 */
	_.purge=function()
	{
		
		//remove listeners
		this.element.removeEventListener("mousewheel", this.getHandler("onMouseWheel"));
		this.element.removeEventListener("touchstart", this.getHandler("onTouchStart"));
		this.element.removeEventListener("touchend", this.getHandler("onTouchEnd"));
		this.element.removeEventListener("touchmove", this.getHandler("onTouchMove"));
		if ('ontouchstart' in document.documentElement) {
		} else {
			this.element.removeEventListener("mousedown", this.getHandler("onMouseDown"));
		}
		this.img.removeEventListener("load", this.getHandler("onImgLoaded"));
		
		//remove elements
		this.element.removeChild(this.img);
		this.element.removeChild(this.markerHolder);
		this.element.removeChild(this.overlayHolder);

		this.img.onload = null;
		this.img = null;
		this.markerHolder = null;
		this.overlayHolder = null;
		
	};
})();
