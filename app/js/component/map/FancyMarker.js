var FancyMarker=function(){};

(function()
{
	var _ =FancyMarker.prototype =new SVGMapMarker();
	
	_.setStyle=function()
	{
		this.element.className = "marker";
	};
	_.position=function(x,y)
	{
		this.element.style.left =x;
		this.element.style.top = y;
	};
})();