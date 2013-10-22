var SVGMap = function() {
};
(function() {
	var _ = SVGMap.prototype;

	_.element = null;
	_.markerHolder = null;
	_.img = null;
	_.src = null;
	_.scale = 1;
	_.scaleMax = 3;
	_.scaleMin = 1;
	_.startX = 1;
	_.startY = 1;
	_.scaleIncrement = 0.1;
	_.initialWidth = 0;
	_.initialHeight = 0;
	_.startZoom = 0;
	_.svgHeight = 551;
	_.svgWidth = 322;
	_.handlers = [];
	_.markers = [];
	_.markerItem = SVGMapMarker;
	_.x = 0;
	_.y = 0;
	_.build = function() {
		this.element = document.createElement("SVG-MAP");
		this.img = document.createElement("IMG");
		this.img.src = this.src;

		this.markerHolder = document.createElement("DIV");
		this.element.appendChild(this.img);
		this.element.appendChild(this.markerHolder);
		this.setStyle();
		this.setListeners();
	};
	_.setListeners = function() {
		this.element.addEventListener("mousewheel", this.getHandler("onMouseWheel"));
		this.element.addEventListener("mousedown", this.getHandler("onMouseDown"));
		this.img.addEventListener("load", this.getHandler("onImgLoaded"));
	};
	_.setStyle = function() {
		this.element.style.display = "block";
		this.element.style.position = "relative";
		this.element.style.width = "100%";
		this.element.style.height = "100%";
		this.element.style.overflow = "hidden";

		this.img.style.position = "absolute";
		//this.img.style.height = "100%";
		//this.img.style.width = "100%";
		this.markerHolder.style.position = "relative";
		this.img.ondragstart = function() {
			return false;
		};
	};
	_.arrange = function() {
		this.img.style.width = (this.scale * this.element.clientWidth) + "px";
		//this.img.style.height = ((this.scale) * this.initialHeight) + "px";

		this.markerHolder.style.width = (this.scale * this.element.clientWidth) + "px";
		this.markerHolder.style.height = this.img.clientHeight + "px";
		//this.markerHolder.style.width = (this.scale * 100) + "%";
		//this.markerHolder.style.height = (this.scale * 100) + "%";
		this.setXY();
		this.positionMarkers();
	};

	_.addMarker = function(lat, lng) {
		//var y = Math.round(((-1 * lat) + 90) * (this.img.clientHeight / 180));
		// var x = Math.round((lng + 180) * (this.img.clientHeight / 360));
		// var x = (lng + 180) * (this.img.clientWidth / 360);
		//
		// lat += 90;
		// var calculatedHeight = ((lat * this.img.clientHeight) / 180);
		// var y = this.y + (this.img.clientHeight - calculatedHeight);

		var marker = new this.markerItem();
		marker.build();
		marker.setStyle();
		marker.lat = lat;
		marker.lng = lng;
		marker.element.setAttribute("data-lat", lat);
		marker.element.setAttribute("data-lng", lng);
		this.setMarkerXY(marker);

		this.markerHolder.appendChild(marker.element);
		this.markers.push(marker);
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
		this.initialWidth = this.img.clientWidth;
		this.initialHeight = this.svgHeight;

		this.startZoom = this.element.clientWidth / this.initialWidth;
		this.lineY = this.lineY * this.startZoom;
		this.img.style.width = this.element.clientWidth + "px";
		//this.img.style.height = this.initialHeight * this.startZoom + "px";
		this.arrange();
		this.positionMarkers();
	};
	_.onMouseWheel = function(event) {
		var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
		if (delta < 0) {
			this.scale -= this.scaleIncrement;
			
		} else {
			this.scale += this.scaleIncrement;
			
		}
		this.setScale();
		
	};

	_.setScale = function(value) {
		if(value!=undefined)this.scale=value;
		if (this.scale < this.scaleMin)
				this.scale = this.scaleMin;
		// this.x = this.x * this.scale;
		// this.y = this.y * this.scale;
		this.setXY();
		this.arrange();
	};
	_.onMouseDown = function(event) {
		this.startX = this.mouseX(this.element, event);
		this.startY = this.mouseY(this.element, event);

		window.addEventListener("mousemove", this.getHandler("onMouseMove"));
		window.addEventListener("mouseup", this.getHandler("onMouseUp"));
	};
	_.onMouseUp = function(event) {

		window.removeEventListener("mousemove", this.getHandler("onMouseMove"));
		window.removeEventListener("mouseup", this.getHandler("onMouseUp"));
	};
	_.onMouseMove = function(event) {
		var x = this.mouseX(this.element, event);
		var y = this.mouseY(this.element, event);
		this.x -= this.startX - x;
		this.y -= this.startY - y;
		// Tween.to(this.element, 0.2, {
		// left : this.x + "px",
		// top : this.y + "px"
		// });
		//	console.log(x, y);
		this.setXY();
		this.startX = x;
		this.startY = y;
		this.positionMarkers();
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

		if (this.scale == this.scaleMin) {
			var x = (this.element.clientWidth - this.img.clientWidth) * 0.5;
			var y = (this.element.clientHeight - this.img.clientHeight) * 0.5;
			this.img.style.left = x + "px";
			this.img.style.top = y + "px";
			this.markerHolder.style.marginLeft = x + "px";
			this.markerHolder.style.marginTop = y + "px";
			this.x = x;
			this.y = y;
		} else {
			this.img.style.left = this.x + "px";
			this.img.style.top = this.y + "px";
			this.markerHolder.style.marginLeft = this.x + "px";
			this.markerHolder.style.marginTop = this.y + "px";
		}

	};
	_.mouseX = function(elem, e) {
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
		var y;
		if (e.pageY) {
			y = e.pageY;
		} else {
			y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;

		}
		y -= elem.offsetTop;
		return y;
	};
})();
