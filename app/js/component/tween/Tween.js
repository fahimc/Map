var Tween=
{
	to:function(obj,duration,options)
	{
		if(options.onComplete)obj.addEventListener( 'webkitTransitionEnd',  function( event ) { options.onComplete();}, false );
		obj.style.webkitTransitionDuration = duration+"s";
        obj.style.webkitTransitionTimingFunction = options.ease?options.ease:"ease-out";
        
        if(options.left||options.top)
       // obj.style.webkitTransform = "translate(" + (options.left?options.left:0) + "px, "+(options.top?options.top:0)+")";
        
        var trans="";
        for(var name in options)
        {
        	trans+=options[name]+" ";
        }
        
        obj.style.setProperty("-webkit-transition", trans);
        for(var name in options)
        {
        	obj.style.setProperty(name,options[name]);
        }
	}
};
