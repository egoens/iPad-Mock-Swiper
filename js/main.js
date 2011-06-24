$(document).ready(function() {
	
	curr_li = 1;
	view_w = 0;
	view_h = 0;
	
	$.getJSON("images.json",

	  function(data) {
		$.each(data.images, function(){
			$("<li></li>").appendTo("#ipad-views");
	    });

		// Set scrollable area width based on count and first child size
		var liw = $("#ipad-views li:first-child").width();
		var li_count = $("#ipad-views li").length;
		$("#ipad-views").width(li_count*liw);
		
		// Creates the orientation settings for the application
		$.orientation({
			initLandscape: function(){
				view_w = 1024;
				var di = data.images["1"];
				var img_name = di.replace(/([.])/,"-horiz$1");
				$("<img src='"+img_name+"' />").appendTo("#ipad-views li:first-child");
			},
			initPortrait: function(){
				view_w = 768;
				$("<img src='"+data.images["1"]+"' />").appendTo("#ipad-views li:first-child");
			},
			onLandscape: function(){
				// change image to horizontal call
				view_w = 1024;
				var this_li = curr_li-1;
				resize(view_w,this_li);
			},
			onPortrait: function(){
				// change image to portrait call
				view_w = 768;
				var this_li = curr_li-1;
				resize(view_w,this_li);
			},
		});
	
		// Handles directional swiping
		$('.swipe').swipe({
			
			// Sets boundaries on directional horizontal swiping (see jswipe for more info)
			threshold: {
				x: 30,
				y: 100
			},
		     swipeLeft: function() {
				if (curr_li < li_count) {
					$("#ipad-views").animate({
						left:'-='+view_w
					}, 200, function() {
						// get next image path
						var i = data.images[curr_li];

						// test for orientation and adjust image "-horiz." is necessary for landscape image for the moment
						if(view_w==1024) {
							var img_name = i.replace(/([.])/,"-horiz$1");
						} else {
							var img_name = i.replace("-horiz.",".");
						}
						
						// Append images to li if non-existent otherwise change path
						if($("#ipad-views li:eq("+(curr_li-1)+")").html()=='') {
							$("#loading").show();
					    	$("<img src='"+img_name+"' />").appendTo("#ipad-views li:eq("+(curr_li-1)+")").load(function() {
								$("#loading").hide();
							});
						} else {
							$("#ipad-views li:eq("+(curr_li-1)+") img").attr({src:img_name});
							$("#loading").hide();
						}
					
					});
					curr_li += 1;
					
				}
			 },
		     swipeRight: function() {
			    if (curr_li > 1) {
					$("#ipad-views").animate({
						left:'+='+view_w
					}, 200, function() {
						var i = data.images[curr_li];

						if(view_w==1024) {
							var img_name = i.replace(/([.])/,"-horiz$1");
						} else {
							var img_name = i.replace("-horiz.",".");
						}
						
						// Image exists so just need to change src
						$("#ipad-views li:eq("+(curr_li-1)+") img").attr({src:img_name});
					
					});
					curr_li -= 1;
				}
    
			 }
		});
		
	});
	
	function resize(d,t) {
		
		// Resizes list width and adjusts viewable area accordingly
		var li_count = $("#ipad-views li").length;
		$("#ipad-views").width((li_count*d)+"px");
		$("#ipad-views").css({left:"-"+(d*t)+"px"});
		
		var i = $("#ipad-views li:eq("+(t)+") img").attr("src");
		
		if(d==1024) {
			var img_name = i.replace(/([.])/,"-horiz$1");
		} else {
			var img_name = i.replace("-horiz.",".");
		}
		
		$("#ipad-views li:eq("+(t)+") img").attr({src:img_name});
		
	}
	
});