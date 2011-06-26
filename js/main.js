$(document).ready(function() {
	
	curr_li = 1;
	view_w = 0;
	view_h = 0;
	data_source = '';
	page_links = '';
	
	$.getJSON("images.json",

	  function(data) {
		if(data.pages) {
			data_source = 'pages';
			console.log("one call")
			buildButtons(data);
			buildPages(data);
		}

	});
	
	function buildButtons(data) {
		$("<li><h1>"+data.project["title"]+"</h1></li>").appendTo("#ipad-views");
		$("<li id='pages'></li>").appendTo("#ipad-views");
		
		$.each(data.pages, function(key,value){
			page_links += "<a class='button' id='" + key + "'>" + key + "</a>";
	    });
	
		$(page_links).appendTo("#ipad-views li#pages");
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
			var ds = eval("data.pages." + pagename + ".images");
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
				resize(view_w,this_li);
			},
			onPortrait: function(){
				// change image to portrait call
				view_w = 768;
				var this_li = curr_li-1;
				resize(view_w,this_li);
			},
		});
		
		$("#loading").show();

		$.each(ds, function(key,value) {
			(view_w==1024) ? value = value.replace(/([.])/,"-horiz$1") : value = value;
			$("<li class='image'><img src='" + value + "' /></li>").appendTo("#ipad-views");
			$("#ipad-views li.image:last img").load(function() {
				$("#loading").hide();
			});
	    });

		$("<li id='back'><a class='button'>back to menu</a></li>").appendTo("#ipad-views");

		// swipe movement functionality
		var liw = $("#ipad-views li.image:first-child").width();
		var li_count = $("#ipad-views li").length;
		$("#ipad-views").width(li_count*liw);
		
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
						// popluate next item image
						
						try {
							var i = ds[curr_li];

							if(view_w==1024) {
								var img_name = i.replace(/([.])/,"-horiz$1");
							} else {
								var img_name = i.replace("-horiz.",".");
							}
					
							if($("#ipad-views li.image:eq("+(curr_li-1)+")").html()=='') {
								$("#loading").show();
						    	$("<img src='"+img_name+"' />").appendTo("#ipad-views li.image:eq("+(curr_li-1)+")").load(function() {
									$("#loading").hide();
								});
							} else {
								$("#ipad-views li.image:eq("+(curr_li-1)+") img").attr({src:img_name});
								$("#loading").hide();
							}
						} catch(err) {
							return true;
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
						// Animation complete.
						var i = ds[curr_li];

						if(view_w==1024) {
							var img_name = i.replace(/([.])/,"-horiz$1");
						} else {
							var img_name = i.replace("-horiz.",".");
						}
					
						$("#ipad-views li.image:eq("+(curr_li-1)+") img").attr({src:img_name});
				
					});
					curr_li -= 1;
				}

			 }
		
		});
		
		$("#back a").click(function() {
			location.reload();
		});
		
	}
	
	function resize(d,t) {
		
		var li_count = $("#ipad-views li").length;
		$("#ipad-views").width((li_count*d)+"px");
		
		$("#ipad-views").css({left:"-"+(d*t)+"px"});
		
		try {
		var i = $("#ipad-views li.image:eq("+(t)+") img").attr("src");
		
		if(d==1024) {
			var img_name = i.replace(/([.])/,"-horiz$1");
		} else {
			var img_name = i.replace("-horiz.",".");
		}
		
		$("#ipad-views li.image:eq("+(t)+") img").attr({src:img_name});
		} catch(err) {
			return true;
		}
		
	}
	
});