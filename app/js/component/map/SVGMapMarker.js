var SVGMapMarker=function(){
	this.element=null;
	this.timestamp=null;
	this.lat=0;
	this.lng=0;
	this.uid = -1;
};
(function()
{
	var _ =SVGMapMarker.prototype;
	
	_.build=function()
	{
		this.element = document.createElement("DIV");
		this.element.setAttribute('data-uid',this.uid);
		
		
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
