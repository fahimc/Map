var SVGMapMarker=function(){};
(function()
{
	var _ =SVGMapMarker.prototype;
	_.element=null;
	_.timestamp=null;
	_.lat=0;
	_.lng=0;
	_.build=function()
	{
		this.element = document.createElement("DIV");
		
		
		
	};
	_.setStyle=function()
	{
		this.element.style.position = "absolute";
		this.element.style.width = "10px";
		this.element.style.height = "10px";
		this.element.style.backgroundColor = "#f00";
		this.element.style.borderRadius = "5px";
	};
	_.position=function(x,y)
	{
		this.element.style.left =x;
		this.element.style.top = y;
	};
})();
