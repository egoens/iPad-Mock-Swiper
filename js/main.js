
$(document).ready(function() {
	
	curr_li = 1;
	view_w = 0;
	view_h = 0;
	view_w = ''
	ul_w = '';
	li_count = '';
	data_source = '';
	page_links = '';
	loading_content = "<section class='loading'><div class='loading_icon'><h1>Loading...</h1></div></section>";
	// set adjacent img distance (# of images left & right of current li to load while swiping)
	adj = 2;
	//var myScroll;
	
	$.getJSON("images.json",

	  function(data) {
		if(data.pages) {
			data_source = 'pages';
			buildButtons(data);
			buildPages(data);
		}

	});
	
	
	
	function iScrollInit() {
		
		if(typeof(myScroll) !== 'undefined'){
			myScroll.refresh();
			//onCompletion();
		}else{
			myScroll = new iScroll('ipad-views-wrapper', { 
				snap: "li",
				momentum: false,
				hScrollbar: false,
				vScrollbar: false,
				vScroll: false
			});
		}
		
	}
	
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
		
		$("body").addClass("images");
		
		if(data_source=='pages') {
			var ds = eval("data.pages['" + pagename + "'].images");
		} else {
			var ds = data.images;
		}
		
		//Sets the orientation settings for the application
		$.orientation({
			initLandscape: function(){
				view_w = 1024;
				//var di = ds["1"];
			},
			initPortrait: function(){
				view_w = 768;
			},
			onLandscape: function(){
				// change image to horizontal call
				view_w = 1024;
				var this_li = curr_li-1;
				resize(view_w);
			},
			onPortrait: function(){
				// change image to portrait call
				view_w = 768;
				var this_li = curr_li-1;
				resize(view_w);
			},
		})
		
		$("#ipad-views-wrapper").append(loading_content);

		$.each(ds, function(key,value) {
			(view_w==1024) ? value = value.replace(/([.])/,"-horiz$1") : value = value;
			$("<li class='image'><img src='"+value+"' /></li>").appendTo("#ipad-views");
	    });

		$("<li id='back'><a class='button'>back to menu</a></li>").appendTo("#ipad-views");

		// swipe movement functionality
		var liw = $("#ipad-views li.image:first-child").width();
		li_count = $("#ipad-views li").length;
		$("#ipad-views").width(li_count*liw);
		ul_w = $("#ipad-views").width(li_count*liw);
				
		if((li_count)>adj+1) {
			$("li.image:eq("+adj+") img").load(function() {
				$(".loading").remove();
			});
		} else {
			$("li.image:eq(0) img").load(function() {
				$(".loading").remove();
			});
		}
		
		iScrollInit();
		
		$("#back a").click(function() {
			$("body").removeClass("images");
			myScroll.destroy();
			location.reload();
		});
		
	}

	function resize(d) {
		
		// hack in laoding animation to fake call back
		$("#ipad-views-wrapper").append(loading_content);

		$("#ipad-views li.image img").each(function() {
			var img = $(this).attr("src");

			if(d==1024) {
				var img_name = img.replace(/([.])/,"-horiz$1");
			} else {
				var img_name = img.replace("-horiz.",".");
			}

			$(this).attr({src:img_name});

		});
		
		var liw = $("#ipad-views li.image:first-child").width();
		ul_w = $("#ipad-views").width(li_count*liw);

		setTimeout(function () {
			
			myScroll.scrollToPage(myScroll.currPageX, 0, 0);
			$(".loading").remove();
		}, 1000);
		
		myScroll.refresh();

	}
	
	window.addEventListener('load', iScrollInit, false);
	
});