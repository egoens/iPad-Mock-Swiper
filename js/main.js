$(document).ready(function() {
	
	curr_li = 1;
	view_w = 0;
	view_h = 0;
	data_source = '';
	page_links = '';
	loading_content = "<section id='loading'><div id='loading_icon'><h1>Loading...</h1></div></section>";
	
	$.getJSON("images.json",

	  function(data) {
		if(data.pages) {
			data_source = 'pages';
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
				resize(view_w,this_li);
			},
			onPortrait: function(){
				// change image to portrait call
				view_w = 768;
				var this_li = curr_li-1;
				resize(view_w,this_li);
			},
		});
		
		$("#ipad-views-wrapper").append(loading_content);

		$.each(ds, function(key,value) {
			(view_w==1024) ? value = value.replace(/([.])/,"-horiz$1") : value = value;
			if(key<=5){
				$("<li class='image'><img src='"+value+"' /></li>").appendTo("#ipad-views");
			} else {
				$("<li class='image'><img src='' /></li>").appendTo("#ipad-views");
			}
	    });
		
		$("li.image:first-child").html("<img src='" + ds[1] + "' />");
		
		$("li.image:first-child img").load(function() {
			$("#loading").remove();
		})

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
					
					//if(curr_li != (li_count-1)){
					//	$("#ipad-views li.image:eq("+(curr_li)+")").prepend(loading_content);
					//}
				
					$("#ipad-views").animate({
						left:'-='+view_w
					}, 200, function() {
						
						// popluate next item image
						try {
							if((curr_li+4)<li_count) {
								var i = ds[curr_li+4];

								if(view_w==1024) {
									var img_name = i.replace(/([.])/,"-horiz$1");
								} else {
									var img_name = i.replace("-horiz.",".");
								}
								
								//alert("curr_li: "+(curr_li+4)+"img: "+img_name);
							
						
								$("#ipad-views li.image:eq("+(curr_li+3)+") img").attr({src:img_name});
								//alert($("#ipad-views li.image:eq("+(curr_li+4)+")").html());
								//alert($("#ipad-views").html());
							}
							
							if((curr_li-4)>0) {
								var img_prev = $("#ipad-views li.image:eq("+(curr_li-5)+")").prev();
								$("img",img_prev).attr({src:""});
								//alert($("#ipad-views").html());
							}
							
						} catch(err) {
							return true;
						}
				
					});
					curr_li++;
					//if(curr_li==li_count){ alert($("#ipad-views").html());}
				}
				
			 },
		     swipeRight: function() {
			    if (curr_li > 1) {
				
					//alert($("#ipad-views").html());

					//if(curr_li != 1) {
					//	$("#ipad-views li.image:eq("+(curr_li-2)+")").prepend(loading_content);
					//}
					
					
					$("#ipad-views").animate({
						left:'+='+view_w
					}, 200, function() {
						// Animation complete.
						try {
							var i = ds[curr_li-4];
							//alert(i);

							if(view_w==1024) {
								var img_name = i.replace(/([.])/,"-horiz$1");
							} else {
								var img_name = i.replace("-horiz.",".");
							}
					
							//$("#ipad-views li.image:eq("+(curr_li-1)+") img").attr({src:img_name}).load(function() {
							//	$("#loading").remove();
							//});
							//var img_next = $("#ipad-views li.image:eq("+(curr_li-1)+")").next();
							//$("img",img_next).attr({src:""});
							
							$("#ipad-views li.image:eq("+(curr_li-5)+") img").attr({src:img_name});
						
							if((curr_li-4)>0) {
								//alert("image_range_l: "+image_range_l+",image_range_r: "+image_range_r);
								//alert(image_range_l);
								//alert($("#ipad-views li.image:eq("+(image_range_l)+") img").attr("src"));

								
								
							}
						
							if((curr_li+4)<li_count) {
								var img_right = $("#ipad-views li.image:eq("+(curr_li+4)+")");
								$("img",img_right).attr({src:""});
								//alert($("#ipad-views").html());
							}
						} catch(err) {
							return true;
						}
				
					});
					curr_li -= 1;
					//alert("cu: "+curr_li+",swipe_l: "+swipe_l);
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