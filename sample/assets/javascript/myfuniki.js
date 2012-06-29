/**
 * @author akira miki
 */
/* --------------------------------------------------------------------------
 * 課題
 * -------------------------------------------------------------------------- */


/* --------------------------------------------------------------------------
 * アドレスバー消す
 * 
 * jquery mobileだとonload時にscrollしてくれる模様
 * -------------------------------------------------------------------------- */			
// iPhoneを回転させた場合にもステータスバーを消す  
window.onorientationchange = function() {  
setTimeout(doScroll, 100);  
};

function doScroll() {  
	if (window.pageYOffset === 0) {  
  	window.scrollTo(0, 1);  
	}  
}


$(function() {
	
	var initPage = {
		/* --------------------------------------------------------------------------
		 * initialize myfunikiView
		 * 
		 * -------------------------------------------------------------------------- */
		initMyFunikiView : function(){
			console.log("##### initialize : myfunikiView");
			
			var $datapage = $("#imageSelectView");
			// default val
			$datapage.data("lat", 35.658517);
			$datapage.data("lng", 139.701334);
			$datapage.data("distination", 500);
			$datapage.data("genre", "");
			$datapage.data("currentShop", {
				"name" : "",
				"imageL" : "assets/img/load_s.png",
				"imageS" : "assets/img/load_L.png",
				"address" : "" ,
				"lat" : "35.658517",
				"lng" : "139.701334",
				"url" : "#",
				"genre" : "",
				"id" : ""
			});
			
		},
		/* --------------------------------------------------------------------------
		 * initialize myfunikiView
		 * 
		 * -------------------------------------------------------------------------- */
		initSetsumeiView : function() {
			console.log("##### initialize : initSetsumeiView");
			var $page = $("#setsumeiView");
			var $img = $("#setsumeiView img");
			
			console.log($img);
			$img.css("display", "none");
			i = 0;
			$img.eq(i).css("display", "inline");
			
			
			$img.live("click", function(){
				
				console.log("setsumei : " + i);
				// $img.eq(i).unlive("click");
				i++;
				if(i>2){
					console.log(i)
					$.mobile.changePage("#imageSelectConditionView", { transition: "fade"});
				}else{
					console.log($img.eq(i));
					$img.eq(i).css("display", "block");
					$("html,body").animate({"scrollTop" :$img.eq(i).offset().top}, 1000);
				}
			});
			
			
			
			
		},
		/* --------------------------------------------------------------------------
		 * initialize imageSelectConditionView
		 * 
		 * 検討メモ：
		 * map search オートコンプリートしてあげるべきなのだろうか？
		 * http://code.google.com/intl/ja/apis/maps/documentation/places/autocomplete.html
		 * 
		 * -------------------------------------------------------------------------- */
		initImageSelectConditionView : function(){
			console.log("##### initialize : imageSelectConditionView");
			var $page = $("#imageSelectConditionView");
			var $datapage = $("#imageSelectView");
			
			// flag
			$page.data("chengeAddress" , false);
			
			// resize generalMenu
			$("nav img").width($(window).width()/3*0.2);
			// resize iconMenu
			// for imageSelectView / imageSelectConditionView
			$("div.iconMenuBox").width($(window).width()*0.92);
			$("div.iconMenu").width($("div.iconMenuBox").width()/4);
			
			
			
			// search place
			$("#address").live('keypress', function(event){
				if( event.which == 13 ){
					console.log("##### user action : input address in imageSelectConditionView");
					// keypress 'enter'
					
					// geocoding address to latlng
					var geocoder = new google.maps.Geocoder();
					geocoder.geocode({
						'address' : $("#address").attr('value')
					}, function(result, status){
						
						if (status == google.maps.GeocoderStatus.OK){
							// success
							
							// set data
							$datapage.data("lat", result[0].geometry.location.lat());
							$datapage.data("lng", result[0].geometry.location.lng());
							$datapage.data("boolUpdate", true);
							$page.data("changeAddress", true);
							
							console.log("lat : " + $datapage.data("lat") + ", lng : " + $datapage.data("lng") )
							$("#address").css("border", "");
							
																		
						} else {
							// error : search value is not found
							console.log("imageSelectConditionView : search value is not found.");
							$page.data("changeAddress", false);
							$("#address").css("border", "groove 5px #FF0000");
							
							
						};
					});
				}
			});

			// push situation ------------------------------------------
			$("img.situation").unbind("click").bind("click", function(event){
				console.log("##### user action : click situation in imageSelectConditionView");
				console.log($page.data("chengeAddress"));
				//アドレス未指定時に現在地を取得する
				if (!$page.data("changeAddress")){
					// get current position
					// memo: navigator method is html5's method
					if ( navigator.geolocation ){
						navigator.geolocation.getCurrentPosition(function(position){
							// success
							
							// set data
							$datapage.data("lat", position.coords.latitude);
							$datapage.data("lng", position.coords.longitude);
							$datapage.data("boolUpdate", true);
							
							console.log("")
							
	
						}, function(){
							// error : cannot get current position
							// task : error dialog 
							console.log('imageSelectConditionView : cannot get current position');
							$datapage.data("boolUpdate", false);
						});
						
					} else {
						// error : html5に対応していないブラウザー
						// task : error dialog
						console.log("imageSelectConditionView : this blowser is not adopted html5.");
						$datapage.data("boolUpdate", false);
					};
					
				}
				
				// positionをしゅとくしているときのみpage遷移
				if($datapage.data("boolUpdate")){
					// storage situation keyword
					$datapage.data("keyword", $(event.currentTarget).attr("alt"));
					console.log(
						"lat : " + $datapage.data("lat") + ' , ' + $datapage.data("lng")
						 + " / genre : " + $datapage.data("genre") + " / keyword : " + $datapage.data("keyword"));
					$.mobile.changePage("#imageSelectView", { transition: "slideup"});
					
				}
			
			});
			
		},
		/* --------------------------------------------------------------------------
		 * initialize imageSelectView
		 * 
		 * 
		 * -------------------------------------------------------------------------- */
		initImageSelectView : function(){
			console.log("##### initialize : imageSelectView");
			
			var $page = $("#imageSelectView");
			// ajast image size
			selectImageSize = $(window).width()/3*0.8  + "px";
			console.log("selectImageSize : " + selectImageSize);
			// dropImageのdivにはdragImage classがセットしてある。
			$("div.dragImage, div.dropImage").css("width", selectImageSize).css("height", selectImageSize);
			$("<img />").attr("src", "assets/img/load_S.png").load(function(){
				$("img.dragImage , img.dropImage").resizeImg();
			});
			
			// update or no-update
			$page.data("boolUpdate", false);
			
			
			// drag&drop
			$('img.dragImage').draggable({
				opacity: 0.8,
				deley : 500,
				revert : 'invalid',
				revertDuration : 250,
				helper: 'clone',
				start : function(){
						// 初期画像はcurrentShopのdataを持っていない場合の対策
						// drop先にどの画像か情報を渡せないため、一時的に格納
						if ( $(this).data("currentShop") ){
							$page.data("currentShop", $(this).data("currentShop"));
							$(this).data("currentShop");
						}
						$("div.dropImage").addClass("droppingImage");
					},
				stop : function(){
						$("div.dropImage").removeClass("droppingImage");
					}
				
			});
			$('img.dropImage').droppable({
				drop: function(event,ui){
					console.log("##### user action : drag&drop image in imageSelectView");
					
          // replace image preload
          $("<img />").attr("src", ui.draggable.context.src).load(function(){
         		console.log("[loaded dropped image]")
         		// replace & resize image
          	$('img.dropImage').attr("src", this.src).resize();
	          // replace data
	          // default画像時のdrag&drop対策で$page.dataに避難させたデータを取得
	          $('img.dropImage').data("currentShop", $page.data("currentShop"));
						$page.data("genre", $page.data("currentShop").genre );
		    		console.log( $page.data("currentShop")); //check currentShop
          	
	          // select history
	          $sh = $("div.selectHistory");
	          if ($sh.children().length > 5) {
	          	$sh.children().eq(0).remove();
		        };
		        $sh.append("<img src='" + this.src + "' class='selectHistory'/>").children().last().data("currentShop",$page.data("currentShop") );
	        	console.log("[add select Histroy]");
	        	console.log($sh.children().last().data("currentShop"));
	        	
						//update image
						updateImages({
							"lat" : $page.data("lat"),
							"lng" : $page.data("lng"),
							"genre" : $page.data("genre")
							});
        	});
	        
	          
	          
        }
      });
      
      // history click
      $("img.selectHistory").live("click", function(event){
				console.log("##### user action : click history image in imageSelectView");
      	$("img.dropImage").attr("src", this.src);
      	$("img.dropImage").data("currentShop", $(this).data("currentShop"));
      	console.log($("img.dropImage").data("currentShop"));
      	updateImages({
      		"lat" : $(this).data("currentShop").lat,
      		"lng" : $(this).data("currentShop").lng,
      		"genre" : $(this).data("currentShop").genre
      		});
      });
      
            
			// imageRefresh ( button )
			$('div.imageRefresh').bind('click', function(){
				//update image
				updateImages({
					"lat" : $page.data("lat"),
					"lng" : $page.data("lng")
					});
				// refresh button non-active
				$(this).removeClass('ui-btn-active');
			});
			// imageRefresh ( shake )
			$page.gShake(function(){
				//update image
				updateImages({
					"lat" : $page.data("lat"),
					"lng" : $page.data("lng")
					});
			});
			

			// click image
			$("#imageSelectView img.dragImage, #imageSelectView img.dropImage").bind('click',function(event){
				console.log("##### user action : click image in imageSelectView");
				// loading dialog表示
				$.mobile.showPageLoadingMsg();
        
				// reg imagedata
				$page.data("selectedImage",$(this).attr('src'));
				
				// store data
				if ($(this).data("currentShop")){
					// replace selected imageの中に組み込まないのは、thisが聞かなくなるため。
					$("#imageView #shopName").empty().append($(this).data("currentShop").name);
					$("#imageView #shopAddress").empty().append($(this).data("currentShop").address);
					$("#imageView #shopAddress").attr("href", "http://maps.google.com/maps?" + $(this).data("currentShop").lat + "," + $(this).data("currentShop").lng);
					$("#imageView #shopUrl").attr("href",$(this).data("currentShop").url);
				}
				
				
				// replace selected image
				if ($(this).data("currentShop")) {
					
					// storage currentShop
					$("#selectedImage").data('currentShop' , $(this).data("currentShop"));

					// 初期画像以外の時の処理
					$("<img />").data("id", id).attr("src", $(this).data("currentShop").imageL).load(function(){
						$("#selectedImage").attr('src', this.src);
						
						
						// selectedImageの現在サイズを推定
						imgHeight = $(this)[0].naturalHeight * $(window).width()/$(this)[0].naturalWidth;
						console.log(imgHeight);
						// 移動量確定（headerサイズ等は未設定のため取得できず）
						moveHeight =  ($(window).height()*0.8 - imgHeight )/2;
						// centering
						if (moveHeight > 0) {
							$("#selectedImage").css("margin-top", moveHeight + "px");	
						} else {
							$("#selectedImage").css("margin-top",  "0px");
						}
						
						// move page
						$.mobile.changePage("#imageView", { transition: "slideup"});
					});
					
				}else { 
					// 初期画像のままの処理
					$("#selectedImage").attr('src', $(this).attr("src"));
					
					// selectedImageの現在サイズを推定
					imgHeight = $(this)[0].naturalHeight * $(window).width()/$(this)[0].naturalWidth;
					console.log(imgHeight);
					// 移動量確定（headerサイズ等は未設定のため取得できず）
					moveHeight =  ($(window).height()*0.8 - imgHeight )/2;
					// centering
					if (moveHeight > 0) {
						$("#selectedImage").css("margin-top", moveHeight + "px");	
					} else {
						$("#selectedImage").css("margin-top",  "0px");
					}
					
					// move page
					$.mobile.changePage("#imageView", { transition: "slideup"});
				}
				
			});
			
			
			
			// click history
			$("#selectHistory img").live("click", function(event){
				console.log("##### user action : click selectHistory image in imageSelectView");
				console.log(event.target.attributes.src)
				console.log(event.target.src)
				
				$("#imageSelectView img.dropImage").attr("src", event.target.src);
				// 履歴に格納されたデータを転記する処理追加
				
			})
			
			
					
			//every time you show this page you need check to see if you need to update
			$page.bind("pageshow", function(event, ui){
				

				// // resize img
				// resizeImage(str, selectImageSize, selectImageSize);
				
				if( $page.data("boolUpdate") ){
					updateImages({
						"lat" : $page.data("lat"),
						"lng" : $page.data("lng"),
						"genre" : $page.data("genre"),
						"keyword" : $page.data("keyword")
						});
					// change center image
					if ( $('#dropImage').attr("src") != $page.data("selectedImage") ){
						$('#dropImage').attr("src", $page.data("selectedImage") );
					};
					$page.data("boolUpdate", false);
				};
			});
			
		},
		/* --------------------------------------------------------------------------
		 * initialize funikiSettingView
		 * 
		 * 
		 * -------------------------------------------------------------------------- */
		initFunikiSettingView : function(){
			console.log("##### initialize : funikiSettingView");
			
			// deafult setting
			var $page = $("#funikiSettingView");
      $page.data("boolRefresh", true)
      var $fmap = $("#fmap");
      var $datapage = $("#imageSelectView");
      
      
      // canvasサイズ変更
      var width = Math.floor($(document).width() * 0.7);
      var height = Math.floor($(document).height() * 0.7);
      var size = (width < height) ? height=width : height=width;
      $fmap.attr("width", width);
      $fmap.attr("height", height);
     	
  		// initialized draw
			drawFMap();
  		// memo: DOM要素を全て読み込んだ後でないと描写が出来ない。
      $page.bind("pageshow", function(){
      	// markerをputするとrefleshをoff
      	if($page.data("boolRefresh")){
      		console.log("funikiSettingView : redraw")
					drawFMap();
      	}
      });
      
      // get position
      $fmap.bind('click', function(event){
      	//put marker
      	drawFMarker(event.pageX - $(this).position().left, event.pageY - $(this).position().top);
        $page.data("boolRefresh", false);
        
        // store f value
        $datapage.data("fx", Math.floor((event.pageX - $(this).position().left) / $fmap.width() *200 - 100));
        $datapage.data("fy", Math.floor(100 - (event.pageY - $(this).position().top) / $fmap.height() *200));
        $datapage.data("boolUpdate", true);
        
        console.log("funikiSettingView : " + "fx: " + $datapage.data("fx") + ' , ' + "fy : " + $datapage.data("fy"));
      });
      
      
      
		},
		/* --------------------------------------------------------------------------
		 * initialize initImageView
		 * 
		 * 
		 * -------------------------------------------------------------------------- */
		initImageView : function(){
			console.log("##### initialize : imageView");
			$meView = $("#meView");
			$fav = $("span#fav");
			$fav.data("active", false);
			$img = $("img#selectedImage");
			
			// add faverite
			// どっかにaddfavoriteクラスがあってゴリゴリしてるっぽいためか２回実行される。
			$("span#fav").unbind("click").bind("click", function(event){
				console.log("##### user action : add faverite");
				$img = $("img#selectedImage");
				
				if(!$img.data("currentShop")){
					console.log("currentShop not found");
					return false;
				}
				
				if($img.data("active")){
					// お気に入りから削除	
					$(favShops).removeLocalStorage($img.data("key"));
					loadLocalStorage();
					$img.data("active", false);
					$fav.css("color", "#ffffff");
					
					$meView.data("favUpdate", true);
					
				}else{
					// お気に入りに追加	
					
					// make storage id
					lsLength = localStorage.length;
					id = "favShop" + lsLength + 1;
					console.log("id : " + id)
					localStorage.setItem(id, JSON.stringify($("#selectedImage").data("currentShop")));
					console.log("added : " + localStorage.getItem(id));
					
					$img.data("active", true);
					$fav.css("color", "#ffea00");
					// reload
					loadLocalStorage();
					
					$meView.data("favUpdate", true);
					
					
				}
				
			});
			
			//なぜか２回bindされる。
			$("#imageView").unbind("pageshow").bind("pageshow", function(){	
				$img = $("img#selectedImage");
				
				// 初期画像 対策
				if($img.data("currentShop")){
					// test用ロード
					favShops = loadLocalStorage();

					console.log("currentShop id : " + $img.data("currentShop").id);
					
					key = $(favShops).findLocalStorageKeyValue($img.data("currentShop").id);
					console.log(key);
					if (key){
						$img.data("active", true);
						$img.data("key", key);
						$fav.css("color", "#ffea00");
						console.log("active : " + $img.data("active") + " / " + "key : " + $img.data("key"));
					}else{
						$img.data("key", key);
						$img.data("active", false);
						$fav.css("color", "#ffffff");
						console.log("active : " + $img.data("active") + " / " + "key : " + $img.data("key"));
					}					
				}else{
					console.log("currentShop not found")
				}
			});
			
			
		},
		/* --------------------------------------------------------------------------
		 * initialize shopView
		 * -------------------------------------------------------------------------- */
		initShopView : function(){
			console.log("##### initialize : shopView");
			var $page = $("#imageSelectView");
			
			// to move imageView Page
			$("#shopView div.ui-grid-c img").bind('click',function(event){
				// set value
				$page.data("selectedImage", $(this).attr('src'));
				$page.data("boolUpdate", true);
				
				$(".selectedImage").attr('src', $(this).attr('src'));
				
				location.href = "#imageView";
			});
		},
		initFunikiMapView : function(){
			
		},
		/* --------------------------------------------------------------------------
		 * initialize meView
		 * 
		 * 
		 * 
 		 * -------------------------------------------------------------------------- */
		initMeView : function(){
			console.log("##### initialize : meView");
			var $page = $("#meView");
			
			favShops = loadLocalStorage();
			favShow(favShops);
			$page.data("favUpdate", false);
			
			
			$("#meView").bind("pageShow", function(){
				console.log($(".img").css("width"));			
			});
			
			$("span.clearFav").unbind("click").bind("click", function(){
				clearLocalStorage();
			});
			
			$("span.loadFav").unbind("click").bind("click", function(){
				favShops = loadLocalStorage();
				favShow(favShops);
			});
			
			$("#meView img").live("click", function(){
				console.log("##### user action : click image in meView")
				var shop = $(this).data("currentShop");
				console.log(shop);
				
				changeImageView({
					"name" : shop.name ,
					"address" : shop.address,
					"imageUrl" : shop.imageL,
					"Url" : shop.url
				});
				
			});
			
			
			$page.bind("pageshow", function(){
				if ($page.data("favUpdate")) {
					
					favShops = loadLocalStorage();
					favShow(favShops);
					$page.data("favUpdate", false);
					
				}
				
			});
		},
		/* --------------------------------------------------------------------------
		 * 
 		 * -------------------------------------------------------------------------- */
		initFriendSettingView : function(){
			
		},
		initImageUploadView : function(){
			
		},
		/* --------------------------------------------------------------------------
		 * initialize
 		 * -------------------------------------------------------------------------- */
		initAll : function(){
		  $().initApp("initMyFunikiView");
		  $().initApp("initSetsumeiView");
		  $().initApp("initImageSelectView");
		  $().initApp("initImageSelectConditionView");
		  $().initApp("initFunikiSettingView");
		  $().initApp("initImageView");
		  $().initApp("initMeView");
		  // $().initApp("initPersonView");
		  // $().initApp("initShopView");
		}
		
	};
	
  $.fn.initApp = function(method) {
	  // Method calling logic
    if ( initPage[method] ) {
      return initPage[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return initPage.initAll.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist' );
    }
  };
  
	
	// jquery mobile では、後ろにあるpage要素を表示していると勘違いしてactive になり、色を変えられない
	$('.mvSetsumeiView').bind("click", function(event){
		$.mobile.changePage("#setsumeiView", { transition: "fade"});
	});
	$('.mvFunikiSettingView').bind("click", function(event){
		$.mobile.changePage("#funikiSettingView", { transition: "slidedown"});
	});
	$('.mvImageSelectConditionView').bind("click", function(event){
		$.mobile.changePage("#imageSelectConditionView", { transition: "slidedown"});
	});
	$('.mvImageSelectView').bind("click", function(event){
		$.mobile.changePage("#imageSelectView", { transition: "slidedown"});
	});
	$('.mvShopView').bind("click", function(event){
		$.mobile.changePage("#shopView", { transition: "slideup"});
	});
	$('.mvMeView').bind("click", function(event){
		$.mobile.changePage("#meView", { transition: "fade"});
	});
	
});

// 
$(document).ready(function() {
	$().initApp();
});

$(window).load(function(){
	$().initApp("initImageView");
});
