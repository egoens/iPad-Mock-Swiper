
$(document).ready(function() {
	
	curr_li = 1;
	view_w = 0;
	view_h = 0;
	data_source = '';
	page_links = '';
	loading_content = "<section class='loading'><div class='loading_icon'><h1>Loading...</h1></div></section>";
	// set adjacent img distance (# of images left & right of current li to load while swiping)
	adj = 2;
	
	$.getJSON("images.json",

	  function(data) {
		if(data.pages) {
			data_source = 'pages';
			buildButtons(data);
			buildPages(data);
		}

	});
	
	function buildButtons(data) {
		$("#ipad-views-wrapper").append(loading_content);
		$("<li><h1>"+data.project["title"]+"</h1></li>").appendTo("#ipad-views");
		$("<li id='pages'></li>").appendTo("#ipad-views");
		
		$.each(data.pages, function(key,value){
			page_links += "<a class='button' id='" + key + "'>" + key + "</a>";
	    });
	
		$(page_links).appendTo("#ipad-views li#pages");
		$(".loading").remove();
	}
	
	function buildPages(data) {
		setupLinks(data);
	}
	
	function setupLinks(data) {
		$("#ipad-views li#pages a").click(function() {
			$("#ipad-views").empty();
			buildImages(data,$(this).html());
		})
	}
	
	function buildImages(data,pagename) {
				
		if(data_source=='pages') {
			var ds = eval("data.pages['" + pagename + "'].images");
		} else {
			var ds = data.images;
		}
		
		//Sets the orientation settings for the application
		$.orientation({
			initLandscape: function(){
				view_w = 1024;
				var di = ds["1"];
			},
			initPortrait: function(){
				view_w = 768;
			},
			onLandscape: function(){
				// change image to horizontal call
				view_w = 1024;
				var this_li = curr_li-1;
				resize(view_w,this_li,ds);
			},
			onPortrait: function(){
				// change image to portrait call
				view_w = 768;
				var this_li = curr_li-1;
				resize(view_w,this_li,ds);
			},
		});
		
		$("#ipad-views-wrapper").append(loading_content);

		$.each(ds, function(key,value) {
			(view_w==1024) ? value = value.replace(/([.])/,"-horiz$1") : value = value;
			if(key<4) {
				$("<li class='image'><img src='"+value+"' /></li>").appendTo("#ipad-views");
			} else {
				$("<li class='image'><img src='' /></li>").appendTo("#ipad-views");
			}
	    });

		$("<li id='back'><a class='button'>back to menu</a></li>").appendTo("#ipad-views");

		// swipe movement functionality
		var liw = $("#ipad-views li.image:first-child").width();
		var li_count = $("#ipad-views li").length;
		$("#ipad-views").width(li_count*liw);
				
		if((li_count)>adj+1) {
			$("li.image:eq("+adj+") img").load(function() {
				$(".loading").remove();
			});
		} else {
			$("li.image:eq(0) img").load(function() {
				$(".loading").remove();
			});
		}
		
		//var curr_li = 1;
		$('.swipe').swipe({
			threshold: {
				x: 30,
				y: 100
			},
		     swipeLeft: function() {
				if (curr_li < li_count) {
				
					$("#ipad-views").animate({
						left:'-='+view_w
					}, 200, function() {
						
						getAdjacentImages(ds,curr_li,"left",view_w);
				
					});
					curr_li += 1;
				}
				
			 },
		     swipeRight: function() {
			    if (curr_li > 1) {

					$("#ipad-views").animate({
						left:'+='+view_w
					}, 200, function() {

						getAdjacentImages(ds,curr_li,"right",view_w);
				
					});
					curr_li -= 1;
				}
			 }
		
		});
		
		$("#back a").click(function() {
			location.reload();
		});
		
	}
	
	function getAdjacentImages(ds,curr_li,dir,view_w) {
		var bi = curr_li-adj;
		var fi = curr_li+adj;
		var ni = fi-1;
		var pi = bi+1;
		$("#ipad-views li.image:lt("+bi+") img").attr({src:""});
		$("#ipad-views li.image:gt("+fi+") img").attr({src:""});
		
		if(dir=="left"){
			try {
				var img= ds[ni];
			
				if(view_w==1024) {
					var img_name = img.replace(/([.])/,"-horiz$1");
				} else {
					var img_name = img.replace("-horiz.",".");
				}
				
				$("#ipad-views li.image:eq("+(ni-1)+")").prepend(loading_content);
				$("#ipad-views li.image:eq("+(ni-1)+") img").attr({src:img_name});
				$("#ipad-views li.image:eq("+(ni-1)+") img").load(function() {
					$(".loading").remove();
				});

				
			} catch(err) {
				return true;
			}
		} else {
			try{
				var img= ds[pi];
			
				if(view_w==1024) {
					var img_name = img.replace(/([.])/,"-horiz$1");
				} else {
					var img_name = img.replace("-horiz.",".");
				}
				
				$("#ipad-views li.image:eq("+(pi-1)+")").prepend(loading_content);
				$("#ipad-views li.image:eq("+(pi-1)+") img").attr({src:img_name});
				$("#ipad-views li.image:eq("+(pi-1)+") img").load(function() {
					$(".loading").remove();
				});
				
			} catch(err) {
				return true;
			}
			
		}
		
	}
	
	function resize(d,t,ds) {
		
		var li_count = $("#ipad-views li").length;
		$("#ipad-views").width((li_count*d)+"px");
		
		$("#ipad-views").css({left:"-"+(d*t)+"px"});

		try {	
			var img = $("#ipad-views li.image:eq("+(t)+") img").attr("src");
	
			if(d==1024) {
				var img_name = img.replace(/([.])/,"-horiz$1");
			} else {
				var img_name = img.replace("-horiz.",".");
			}
	
			$("#ipad-views li.image:eq("+(t)+") img").attr({src:img_name});
		} catch(err) {
			return true;
		}
		
	}
	
});