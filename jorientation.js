/*

orientationInit()
This plugin is used to set the state of elements specific to the tablet's initial orienation.

Info:
window.orientation = current orientation in degrees
orientation is Portrait if window.orientation == 0 or 180
orientation is Landscape if window.orientation == 90 or -90 

Usage:
//ELEMENT is the object that will be affected by an orientation change:
$(ELEMENT).orientationChange({
	orientationLandscape: function(k){ k.doSomething(); }, //if landscape do this
	orientationPortrait: function(k){ k.doSomething(); } //if portrait do this
});
//Note: k is used to carry the ELEMENT variable to each callout. You do not need to use k, but you must consistently use the same variable.

*/	
(function($) {

  // plugin definition
  $.fn.orientationInit = function(options) {

    // Defaults
	var defaults = {
		orientationLandscape: function(k) { alert('orientation landscape') },
		orientationPortrait: function(k) { alert('orientation portrait') },
	};
	var options = $.extend(defaults, options);
	var me = $(this);
	

	if (!this) return false;

    //Iterate through each matched element
    return this.each(function() {
				//console.log(me);
				function testThis(){console.log(this);}
				testThis();
			switch(window.orientation) {
		    		//Portrait
					case 0:
		    		case 180:
						//portrait callback

						defaults.orientationPortrait(me);
					break;

					//Landscape
		    		case 90:
		    		case -90:
						//landscape callback
						defaults.orientationLandscape(me);
					break;
				}
			return me;

  		});

  };
// end of closure
})(jQuery);
/*

orientationChange()
This plugin allows you to assign callback functions to DOM objects when the orientation switches.

Info:
onorientationchange = a tablet event that declares that the orientation has completed its transition.
window.orientation = current orientation in degrees
orientation is Portrait if window.orientation == 0 or 180
orientation is Landscape if window.orientation == 90 or -90 

Note: 
iPad does not send the browser varying degrees of tilt. 
window.orientation is updated right before onorientationchange is triggered.

Usage:
//ELEMENT is the object that will be affected by an orientation change:
$(ELEMENT).orientationChange({
	orientationLandscape: function(k){ k.doSomething(); }, //if landscape do this
	orientationPortrait: function(k){ k.doSomething(); } //if portrait do this
});
//Note: k is used to carry the ELEMENT variable to each callout. You do not need to use k, but you must consistently use the same variable.

*/	
(function($) {

  // plugin definition
  $.fn.orientationChange = function(options) {

    // Defaults
	var defaults = {
		orientationLandscape: function(k) { alert('orientation landscape') },
		orientationPortrait: function(k) { alert('orientation portrait') },
	};
	var options = $.extend(defaults, options);
	var me = $(this);
	
	if (!this) return false;

    //Iterate through each matched element
    return this.each(function() {
		function itChanged(){	
			switch(window.orientation) {
		    		//if portrait
					case 0:
		    		case 180:
						//portrait callback
						defaults.orientationPortrait(me);
					break;

					//if landscape
		    		case 90:
		    		case -90:
						//landscape callback
						defaults.orientationLandscape(me);
					break;
				}
		}
		//Event listener
		window.addEventListener('orientationchange', itChanged, false);
  		});

  };
// end of closure
})(jQuery);
/*
orientation()

Info:
onorientationchange = a tablet event that declares that the orientation has completed its transition.
window.orientation = current orientation in degrees
orientation is Portrait if window.orientation == 0 or 180
orientation is Landscape if window.orientation == 90 or -90 

Note: 
iPad does not send the browser varying degrees of tilt. 
window.orientation is updated right before onorientationchange is triggered.

Usage:
$.orientation({
	initLandscape: function(){ doSomething(); }, //if orientation starts on landscape do this
	initPortrait: function(){ doSomething(); } //if orientation starts on portrait do this
	onLandscape: function(){ doSomething(); }, //if orientation changes to landscape do this
	onPortrait: function(){ doSomething(); } //if orientation changes to portrait do this
});
*/
(function($) {

  // plugin definition
  $.orientation = function(options) {

	    // Defaults
		var defaults = {
			initLandscape: function() {},
			initPortrait: function() {},
			onLandscape: function() {},
			onPortrait: function() {}
		};
		var options = $.extend(defaults, options);
	
		if (!this) return false;

	    //Initialize
	    function orientationInitialize() {
			switch(window.orientation) {
	    		//Portrait
				case 0:
	    		case 180:
					//portrait callback
					$('body').removeClass('landscape').addClass('portrait');
					defaults.initPortrait();
				break;
				//Landscape
	    		case 90:
	    		case -90:
					//landscape callback
					$('body').removeClass('portrait').addClass('landscape');
					defaults.initLandscape();
				break;
			}
		}
		orientationInitialize();
				
    	//On Change
		function orientationChange(){	
			switch(window.orientation) {
		    		//if portrait
					case 0:
		    		case 180:
						//portrait callback
						$('body').removeClass('landscape').addClass('portrait');
						defaults.onPortrait();
					break;

					//if landscape
		    		case 90:
		    		case -90:
						//landscape callback
						$('body').removeClass('portrait').addClass('landscape');
						defaults.onLandscape();
					break;
				}
		}
		//Event listener
		window.addEventListener('orientationchange', orientationChange, false);

  };
// end of closure
})(jQuery);

function getOrientationName(){
	switch(window.orientation) {
		//Portrait
		case 0:
		case 180:
			return 'Portrait';
		break;
		//Landscape
		case 90:
		case -90:
			//landscape callback
			return 'Landscape';
		break;
	}
}

function isLandscape(){
	switch(window.orientation) {
		//Portrait
		case 0:
		case 180:
			return false;
		break;
		//Landscape
		case 90:
		case -90:
			//landscape callback
			return true;
		break;
	}	
}

function isPortrait(){
	switch(window.orientation) {
		//Portrait
		case 0:
		case 180:
			return true;
		break;
		//Landscape
		case 90:
		case -90:
			//landscape callback
			return false;
		break;
	}	
}