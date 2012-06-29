/**
 * @author akira miki
 */
/* --------------------------------------------------------------------------
 * updateImages
 * 
 * 画像をシャッフル
 * 
 * -------------------------------------------------------------------------- */
function updateImages(option){
	console.log("##### function : updateImages");
	
	lat = option.lat;
	lng = option.lng;
	if (option.genre){
		genre = option.genre;		
	}else{
		genre = "";
	}
	if (option.keyword){
		keyword = option.keyword;		
	}else{
		keyword = "";
	}
	
	// loading dialog表示
	$.mobile.showPageLoadingMsg();
	
	console.log("lat : " + lat + ", lng : " + lng + " / genre : " + genre + " / keyword : " + keyword);

  $dragImg = $("img.dragImage");
  $dragDiv = $("div.dragImage");
	console.log("$dragImg");
  console.log($dragImg);
	console.log("$dragImg.size() : " + $dragImg.size());
  
  $page = $("#imageSelectView");
  
  // for hotpepper
  $.ajax({
		type: 'GET',
	  url : 'http://webservice.recruit.co.jp/hotpepper/gourmet/v1/',
	  data : {
			'key' : "848c3a1d45fc7d9c",
			"lat" : lat,
			"lng" : lng,
			"genre" : genre,
			"keyword" : keyword,
			"range" : "3", //半径1km
			"count" : "100",
			"format" : "jsonp"
	  },
	  dataType : "jsonp",
	  //jsonpに sync通信は対応していない。
	  success : function(jsonp){
	  	// success ajax
	  	console.log("success ajax");
	  	
	  	console.log("jsonp : ");
	  	console.log(jsonp);
	  	console.log("jsonp.results.shop.length : " + jsonp.results.shop.length);
	  	// for counter
	  	counter = 0;
	  	console.log("for counter : " + counter);
	  	
	  	if(jsonp.results.shop.length != 0){
	  			  	
			  // 表示画像のIDをランダムに生成
			  randomIdArray = new Array(9);
			  for(i=0; i < randomIdArray.length; i++) {
			  	randomIdArray[i] = Math.floor(Math.random()*jsonp.results.shop.length);
			  }
	  		
				// setup images
				// cloneされたimgもカウントされてしまうので、$dragImage.size()をベースに作成している
				for( var i = 0; i < $dragImg.size() ; i++){
					
					// store shop ID
					id = randomIdArray[i];
					console.log("i :" + i + " / id : " + id);
					
					// replace image
					src = jsonp.results.shop[id].photo.pc.s;
					$("<img />").data("id", id).attr("src", src).load(function(){
						// $.mobilehidePageLoadingMsg()を正しく稼働させるために上記方法を利用
						//ココの段階で指定のデータをぶっこみたい。idを上記のdataに持たせる事も有りか・・・
						console.log("[loaded ajax image]")				
						console.log("target img : " + this.src );
						console.log("natural width x height : " + this.naturalWidth + " x " + this.naturalHeight);
						
						// drag eventをliveで指定できない？
						$dragImg.eq(counter).attr("src",this.src).resizeImg(this.naturalWidth, this.naturalHeight);
						
						// store shop data
						id = $(this).data("id");
						console.log("id : " + id);
						$dragImg.eq(counter).data("currentShop", {
							"name" : jsonp.results.shop[id].name ,
							"imageL" : jsonp.results.shop[id].photo.pc.l,
							"imageM" : jsonp.results.shop[id].photo.pc.m,
							"imageS" : jsonp.results.shop[id].photo.pc.s,
							"address" : jsonp.results.shop[id].address ,
							"lat" : jsonp.results.shop[id].lat ,
							"lng" : jsonp.results.shop[id].lng ,
							"url" : jsonp.results.shop[id].urls.pc,
							"genre" : jsonp.results.shop[id].genre.code,
							"id" : jsonp.results.shop[id].id
						});
						
						// hide loading dialog
						console.log("load image counter : " + counter);
						counter++;
						if (counter == $dragImg.size()){
							// hide loading dialog表示
							console.log("$.mobile.hidePageLoadingMsg()")
							$.mobile.hidePageLoadingMsg();
						}
						
					})
				}
	  	}else{
	  		// shop.length = 0
				$.mobile.hidePageLoadingMsg();
	  	}

			
	  },error : function(){
				console.log("ajax error");
				// hide loading dialog表示
				console.log("$.mobile.hidePageLoadingMsg()")
				$.mobile.hidePageLoadingMsg();
		}
	});
	
	
};


/* --------------------------------------------------------------------------
 * funikiSettingView : drapFMap()
 * -------------------------------------------------------------------------- */
function drawFMap(){
  var map = $('#fmap');

  var ctx = map[0].getContext('2d');
  var Y_MAX = map.height();
  var X_MAX = map.width();
  
  var img = new Image();
  img.src = "assets/img/chart.gif";
  img.onload = function(){
    ctx.drawImage(img, 0, 0, X_MAX, Y_MAX);      	
  }
  
};

/* --------------------------------------------------------------------------
 * funikiSettingView : drawFMarker()
 * -------------------------------------------------------------------------- */
function drawFMarker(x,y){
  var map = $('#fmap');
  var ctx = map[0].getContext('2d');
  
  // clear map&marker
  ctx.clearRect(0,0, map.width(), map.height());
  
  var img = new Image();
  img.src = "./assets/img/chart.gif";
  img.onload = function(){
  	// draw map
    ctx.drawImage(img, 0, 0, map.width(), map.height());
    
    // put marker
    ctx.beginPath();
    ctx.fillStyle = 'rgba(150, 150, 150, 0.7)';
    ctx.arc(x, y, 10, Math.PI*2.0, false);

    ctx.fill();
  };
  
};

/* --------------------------------------------------------------------------
 * uploadPhoto
 * -------------------------------------------------------------------------- */
function uploadPhoto(imageURI) {
  var options = new FileUploadOptions();
  options.fileKey  = "image[image]";
  options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
  options.mimeType = "image/jpeg";

  var params = new Object();
  params["image[shop_id]"] = "....";
  options.params = params;

  var ft = new FileTransfer();
  console.log(imageURI);
  ft.upload(
      imageURI,
      APP_URL + "/api/update_photo",
      function(r) { setStatus("写真のアップロード完了") },
      function(r) { setStatus("写真のアップロード失敗") },
      options);
  setStatus("写真をアップロード中...");
};

/* --------------------------------------------------------------------------
 * showPhoto
 * -------------------------------------------------------------------------- */
function favShow(shopData){
	console.log("##### function : favShow");
	var $me = $("#me");
	
	var imgUrl = "";
	var desc = "";
	var str = "";
	
	$me.empty();
	console.log("length : " + shopData.length)
	for (i = 0; i < shopData.length ; i++){
		
		imgUrl = shopData[i].shop.imageL;
		desc = shopData[i].shop.name + "<br />" + shopData[i].shop.address +  "<br /><a href='" + shopData[i].shop.url + "'>hotpepper URL</a>";
		str = "<div class='meBox'><div class='meImg'><img src='" + imgUrl + "' /></div><div class='meDesc'>" + desc + "</div></div>";
		console.log("i : " + i + " / str : " + str);
		
		// add html & store data
		$me.append(str);
		$("#meView img").last().data("currentShop", shopData[i].shop);
		console.log("store currentShop : ");
		console.log($("#meView img").last().data("currentShop"));
		
	};
	
};
/* --------------------------------------------------------------------------
 * change ImageView
 * -------------------------------------------------------------------------- */
function changeImageView(option){

	// loading dialog表示
	$.mobile.showPageLoadingMsg();
  
	// store data
	$("#imageView #shopName").empty().append(option.name);
	$("#imageView #shopAddress").empty().append(option.address);
	$("#imageView #shopUrl").attr("href",option.url);
	
	// 画像ロード処理
	$("<img />").attr("src", option.imageUrl).load(function(){
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
		
		$.mobile.hidePageLoadingMsg();
		
		// move page
		$.mobile.changePage("#imageView", { transition: "slideup"});
		
	});
	
}

