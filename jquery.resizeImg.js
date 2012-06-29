/* --------------------------------------------------------------------------
 * resizeImage()
 * 
 * description
 *  anything size images to square or rectanglar.
 *  keep organic images rasio.
 * 
 *  you have to setup image parent block width and height.
 * 
 * -------------------------------------------------------------------------- */
(function(jQuery){
	jQuery.fn.resizeImg = function(w,h){
			console.log("##### function : resizeImg()");
		
			$parentObj = jQuery(this).parent();
			X = String($parentObj.css("width")).replace("px","");
			Y = String($parentObj.css("height")).replace("px","");
			console.log("parents block size : " + X + " x " + Y);	
			
			// 親要素にoverflow属性追加
			jQuery(this).parent().css("overflow", "hidden");
			
			// 画像サイズ
			// ロードされていないとnaturalWidthが取得できない。（前画像の物を取得してしまう）
			if ( !w && !h ) {
				w = jQuery(this)[0].naturalWidth;
				h = jQuery(this)[0].naturalHeight;				
			}
			console.log("organic image size : " +  w + " x " + h);
			
			if ( X > Y ) {
			 	//rect (X>Y)
			 	console.log("rect X>Y");
			 
			 	// 拡大
			 	console.log("拡大");
			 	
				if ( w/h > X/Y ){
					console.log("w/h > X/Y");
					// reflesh width&height
					jQuery(this).removeAttr("width").removeAttr("height").css("width", "").css("height","").css("left", "0").css("top", "0");
					// set width&height
					jQuery(this).css("height", Y + "px").css("position", "relative");
					jQuery(this).css("left", -(w*Y/h-X)/2 + "px");
				}else if ( w/h < X/Y ) { 
					console.log("w/h < X/Y");
					// reflesh width&height
					jQuery(this).removeAttr("width").removeAttr("height").css("width", "").css("height","").css("left", "0").css("top", "0");
					// set width&height
					jQuery(this).css("width", X + "px");
					jQuery(this).css("position", "relative").css("top", -(h*X/w-Y)/2 + "px");	
				}else{
					// Y/X = h/w
					console.log("Y/X = h/w");
					// reflesh width&height
					jQuery(this).removeAttr("width").removeAttr("height").css("width", "").css("height","").css("left", "0").css("top", "0");
					// set width&height
					jQuery(this).css("width", X + "px");
					jQuery(this).css("height", Y + "px");
				}
			 
			}else if (X = Y) {
				
				console.log("squre (X = Y)");
				// 表示が総サイズ合わせ
				if (w < h) {
					console.log("w < h : " + w +"x" + h);	
					// reflesh width&height
					jQuery(this).removeAttr("width").removeAttr("height").css("width", "").css("height","").css("left", "0").css("top", "0");
					// set width&height
					jQuery(this).css("width", X + "px");
					jQuery(this).css("position", "relative").css("top", String(-(h*X/w-Y)/2+"px"));
					console.log("shift top : " +  -(h*X/w-Y)/2);
		
				}else if(w > h){
					console.log("w > h : " + w +"x" + h);
					// reflesh width&height
					jQuery(this).removeAttr("width").removeAttr("height").css("width", "").css("height","").css("left", "0").css("top", "0");
					// set width&height
					jQuery(this).css("height", Y + "px");
					jQuery(this).css("position", "relative").css("left", String(-(w*Y/h-X)/2)+"px");
					console.log("shift left : " + -(w*Y/h-X)/2);
					
				}else if(w=h){
					console.log("w = h : no shift");
					// reflesh width&height
					// reflesh width&height
					jQuery(this).removeAttr("width").removeAttr("height").css("width", "").css("height","").css("left", "0").css("top", "0");
					// set width&height
					jQuery(this).css("width", X + "px").css("height", Y + "px");
				}else{
					console.log("w ? h : " + w +"x" + h)
					
				}
			}	
		}

})( jQuery);