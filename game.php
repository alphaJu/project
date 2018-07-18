<!DOCTYPE html>
<html lang="ko">
	<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta charset="utf-8" />
	<title>CS496</title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<style>
		div#memory_board{
			background: #FFF;
			border: #FFF 1px solid;
			width: 800px;
			height: 540px;
			padding: 24px;
			margin: 25px auto;
			text-align: center;
			border-radius:50px;
		}
		div#memory_board > div{
			background: url(images/card.jpg);
			background-size: 110px 110px;
			border: brown 1px solid;
			width: 110px;
			height: 110px;
			float: left;
			margin: 10px;
			font-size: 64px;
			cursor: pointer;
			text-align: center;
		}
		#home {
			border:none;
			margin: 25px;
			height:100px;
			width:100px;
			background: url(images/homeicon.png);
			background-size: 100px 100px;
			font-size: 1em;
			font-family: 'Pattaya', sans-serif;
			margin: 0 0 .25em 0;
			color: #fff;
		}
	</style>
	
</head>
<body>
	<script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
	<form action="index.html">
		<center><input type="submit" id="home" value="HOME"></center>
	</form>
	<div id="memory_board"></div>
	
	<script>
		<?
		if(array_key_exists("keyword", $_POST)) {
			$keyword = $_POST["keyword"];
		}
		if(array_key_exists("keyword", $_GET)) {
			$keyword = $_GET["keyword"];
		}
		?>
	//	var memory_array = ['A','A','B','B','C','C','D','D','E','E','F','F','G','G','H','H','I','I','J','J','K','K','L','L'];
		var memory_array = [];
		var keyword = '<?echo $keyword;?>'
		
		var loading = document.createElement("img");
        loading.src = "images/searching2.gif";
        loading.style.position = 'relative';
        loading.style.borderRadius = "100%";
        loading.style.width = "600px";
        loading.style.height="600px";
        loading.style.zIndex = '10005';
        var src = document.getElementById("memory_board");
        src.appendChild(loading);
		
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", "http://qppepdp.koreacentral.cloudapp.azure.com:8080/crawl?keyword=" + keyword, true);
		xmlHttp.setRequestHeader('Access-Control-Allow-Origin', '*');
		xmlHttp.onreadystatechange = function() { 
			if (xmlHttp.readyState == 4 && (xmlHttp.status == 200 || xmlHttp.status == 201)){
        		var myArr = JSON.parse(xmlHttp.responseText);
        		console.log(myArr.length);
        		for (var i = 0; i < 12; i++){
        		//	let _url = '<img class="resize" src=&quot;' + myArr[i] + '&quot; width=&quot;71px&quot; height=&quot;71px&quot;>';
        			var img = document.createElement("img");
        			var img2 = document.createElement("img");
        			img.loaded = false;
        			img2.loaded = false;
        			img.onload = function ()  {
        				if (this.loaded)
        					return;
        				this.loaded = true;
	        			var cv = document.createElement('canvas');
						cv.width = 110;
						cv.height = 110;
						var ctx = cv.getContext("2d");
						ctx.drawImage(this, 0, 0, this.width, this.height, 0, 0, cv.width, cv.height);
						this.src = cv.toDataURL();
        			}
        			img2.onload = function ()  {
        				if (this.loaded)
        					return;
        				this.loaded = true;
	        			var cv = document.createElement('canvas');
						cv.width = 110;
						cv.height = 110;
						var ctx = cv.getContext("2d");
						ctx.drawImage(this, 0, 0, this.width, this.height, 0, 0, cv.width, cv.height);
						this.src = cv.toDataURL();
        			}
        			img.crossOrigin="anonymous";
        			img2.crossOrigin = "anonymous";
        			img.src = myArr[i];
        			img.qwer = i;
        			img2.src = myArr[i];
        			img2.qwer = i;
        			//console.log(_url);
        			//memory_array.push(_url);
        			//memory_array.push(_url);
        			memory_array.push(img);
        			memory_array.push(img2);
        		}
        		loading.style.visibility = "hidden";
        		document.getElementById("memory_board").style.background = "#e74c3c";
        		newBoard();
        	}
    	}
    	xmlHttp.send(null);
    	
    	
		var memory_values = [];
		var memory_tile_ids = [];
		var tiles_flipped = 0;
		Array.prototype.memory_tile_shuffle = function() {
			var i = this.length, j, temp;
			while(--i > 0) {
				j = Math.floor(Math.random() * (i + 1));
				temp = this[j];
				this[j] = this[i];
				this[i] = temp;
			}
		}
		
		function newBoard() {
			tiles_flipped = 0;
			var output = '';
			memory_array.memory_tile_shuffle();
			for(var i = 0; i < memory_array.length; i++) {
				output += '<div id="tile_' + i + '" onclick="memoryFlipTile(this,\'' + i + '\')"></div>';
			}
			document.getElementById('memory_board').innerHTML = output;
		}
		
		function memoryFlipTile(tile, idx) {
			if(tile.innerHTML == "" && memory_values.length < 2) {
				tile.style.background = 'url(images/card.jpg)';
				tile.style.backgroundSize = "110px 110px";
				//tile.innerHTML = val;
				img = memory_array[idx];
				tile.appendChild(img);
				if(memory_values.length == 0) {
					//memory_values.push(val);
					memory_values.push(img);
					memory_tile_ids.push(tile.id);
				}
				else if(memory_values.length == 1) {
					//memory_values.push(val);
					memory_values.push(img);
					memory_tile_ids.push(tile.id);
					if(memory_values[0].qwer == memory_values[1].qwer) {
						tiles_flipped += 2;
						//Clear both arrays
						memory_values = [];
						memory_tile_ids = [];
						//Check to see if the whole board is cleared
						if(tiles_flipped == memory_array.length) {
							swal("Board cleared!", "Generating new board", "success");
							document.getElementById('memory_board').innerHTML = "";
							newBoard();
						}
					}
					else {
						function flip2Back() {
							// Flip the 2 tiles back over
							var tile_1 = document.getElementById(memory_tile_ids[0]);
							var tile_2 = document.getElementById(memory_tile_ids[1]);
							tile_1.style.background = 'url(images/card.jpg)';
							tile_1.style.backgroundSize = "110px 110px";
							tile_1.innerHTML = "";
							tile_2.style.background = 'url(images/card.jpg)';
							tile_2.style.backgroundSize = "110px 110px";
							tile_2.innerHTML ="";
							// Clear both arrays
							memory_values = [];
							memory_tile_ids = [];
						}
						setTimeout(flip2Back, 700);
					}
				}
			}
		}
	</script>
</body>
</html>