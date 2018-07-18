/*
   Radius by TEMPLATED
   templated.co @templatedco
   Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/
var urls = [];
var select_flag = false;
var index = [];
async function srcToDataURL(srcUrl) {
   console.log(srcUrl);
   if (srcUrl.includes("base64"))
      return srcUrl;
   let blob = await fetch(srcUrl).then(r => r.blob());
   let dataUrl = await new Promise(resolve => {
		let reader = new FileReader();
		reader.onload = () => resolve(reader.result);
		reader.readAsDataURL(blob);
   });
   return dataUrl;
}
var base64_ranks = new Uint8Array([
		  62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1
		, -1, -1,  0, -1, -1, -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9
		, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25
		, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35
		, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
	]);
	
function decode_base64(base64) {
	var
		  len = base64.length
		, buffer = new Uint8Array(len / 4 * 3 | 0)
		, i = 0
		, outptr = 0
		, last = [0, 0]
		, state = 0
		, save = 0
		, rank
		, code
		, undef
	;
	while (len--) {
		code = base64.charCodeAt(i++);
		rank = base64_ranks[code-43];
		if (rank !== 255 && rank !== undef) {
			last[1] = last[0];
			last[0] = code;
			save = (save << 6) | rank;
			state++;
			if (state === 4) {
				buffer[outptr++] = save >>> 16;
				if (last[1] !== 61 /* padding character */) {
					buffer[outptr++] = save >>> 8;
				}
				if (last[0] !== 61 /* padding character */) {
					buffer[outptr++] = save;
				}
				state = 0;
			}
		}
	}
	// 2/3 chance there's going to be some null bytes at the end, but that
	// doesn't really matter with most image formats.
	// If it somehow matters for you, truncate the buffer up outptr.
	return buffer;
}

function selectListener(e) {
	e.preventDefault();
	if(e.target.isSelected == false){
    	e.target.style.filter = "opacity(50%)";
    	e.target.isSelected = true;
    	index.push(e.target.index);
    	console.log(index);
	}
	else {
    	e.target.style.filter = "none";
    	e.target.isSelected = false;
    	var ind = index.indexOf(e.target.index);
    	if (ind>=0) {
    		index.splice(ind, 1);
    	}
    	console.log(index);
	}
}

(function($) {

   skel.breakpoints({
      xlarge:   '(max-width: 1680px)',
      large:   '(max-width: 1280px)',
      medium:   '(max-width: 980px)',
      small:   '(max-width: 736px)',
      xsmall:   '(max-width: 480px)'
   });

   $(function() {

      var   $window = $(window),
         $body = $('body'),
         $header = $('#header'),
         $main = $('#main'),
         $footer = $('#footer');
         
      // Disable animations/transitions until the page has loaded.
         $body.addClass('is-loading');

         $window.on('load', function() {
            window.setTimeout(function() {
               $body.removeClass('is-loading');
            }, 100);
         });

      // Fix: Placeholder polyfill.
         $('form').placeholder();

      // Prioritize "important" elements on medium.
         skel.on('+medium -medium', function() {
            $.prioritize(
               '.important\\28 medium\\29',
               skel.breakpoint('medium').active
            );
         });

      // Header.

         $header.each( function() {
            var load = false;
            var t       = jQuery(this),
               button    = t.find('.button');
               submit = t.find('.game');
            t.zxcv = true;
            button.click(function(e) {
               submit.prop('disabled', true);
               if (t.zxcv == false) {
                  t.toggleClass('hide');
                  t.zxcv = true;
                  submit.prop('disabled', false);
                  return;
               }
               var img = document.createElement("img");
               img.src = "images/searching.gif";
               img.style.position = 'absolute';
               img.style.borderRadius = "100%";
               img.style.width = "600px";
               img.style.height="600px";
               img.style.zIndex = '10005';
               var src = document.getElementById("header");
               src.appendChild(img);

               if ( t.hasClass('preview') ) {
                  return true;
               } else {
                  e.preventDefault();
               }
               var keyword = document.getElementById('input').value;

               var xmlHttp = new XMLHttpRequest();
               xmlHttp.open("GET", "http://qppepdp.koreacentral.cloudapp.azure.com:8080/crawl?keyword=" + keyword, true);
               xmlHttp.setRequestHeader('Access-Control-Allow-Origin', '*');
               xmlHttp.onreadystatechange = function() {
                  if (xmlHttp.readyState == 4 && (xmlHttp.status == 200 || xmlHttp.status == 201)){
                       var myArr = JSON.parse(xmlHttp.responseText);
                       urls = myArr;
                       for (var i in myArr){
                          let _url = myArr[i];
                          let elem = document.querySelector("#main > div > div > div > div:nth-child("+(parseInt(i)+1)+") > img");
                          if(elem === null)
                             break;
                          elem.src = _url;
                       }
                       t.toggleClass('hide');
                       img.style.visibility = "hidden";
                       t.zxcv = false;
                    }
                }
                xmlHttp.send(null);
            });

         });

      // Main.
         $main.each( function() {
            var t     = jQuery(this),
               select = t.find('.select'),
               save = t.find('.save');
			
            select.click(function(e) {
            	if(!select_flag) {
            		for (let i = 0; i < 16; i++) {
		            	let elem = document.querySelector("#main > div > div > div > div:nth-child("+(parseInt(i)+1)+") > img");
		            	elem.isSelected = false;
		            	elem.index = i;
		            	elem.addEventListener("click", selectListener);
            		}
            		select_flag = true;
               }
               else {
            		for (let i = 0; i < 16; i++) {
	                	let elem = document.querySelector("#main > div > div > div > div:nth-child("+(parseInt(i)+1)+") > img");
	                	elem.isSelected = false;
	                	elem.style.filter = "none";
	                	elem.index = i;
	                	elem.removeEventListener("click", selectListener);
	                	index = [];
            		}
            		select_flag = false;
               }
               
            });

            save.click(async function(e) {
               var script = document.createElement('script');
               script.type = 'text/javascript';
               script.src = 'https://unpkg.com/sweetalert/dist/sweetalert.min.js';
               document.body.appendChild(script);
               var final = [];
               final = index;
               console.log(final);
               swal("Saved Photos", "Thank you", "success");

               var script2 = document.createElement('script');
               script2.type = 'text/javascript';
               script2.src = 'js/FileSaver.js';
               document.body.appendChild(script2);


               let bb = self.Blob;
               for (i in final){
	               let src_url = urls[final[i]];
	               let data_url = await srcToDataURL(src_url);
	               console.log("before saving : " + data_url);
	               data_url = data_url.split(',')[1];
	               console.log("after split : " + data_url);
	               
	               saveAs(new bb([decode_base64(data_url)], {type: "image/jpeg"}));
               }
               
               select_flag = false;
            });

         });

      // Footer.
         $footer.each( function() {

            var t       = jQuery(this),
               inner    = t.find('.inner'),
               button    = t.find('.info');

            button.click(function(e) {
               t.toggleClass('show');
               e.preventDefault();
            });

         });

   });

})(jQuery);