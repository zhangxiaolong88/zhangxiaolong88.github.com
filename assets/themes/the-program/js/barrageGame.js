$(function(){
	$.fn.center = function(i){
		var top = ($(window).height() - this.height())/2;
		var left = ($(window).width() - this.width())/2;
		var scrollTop = $(document).scrollTop();
		var scrollLeft = $(document).scrollLeft();
		return this.css({ 
			"z-index": i || 1000,
			'position' : 'absolute',
			'left' : left + scrollLeft,
			'top' : top + scrollTop
		});
	}

	$("<i class='icon-play'></i>").prependTo($("#start"));
	$("<i class='icon-stop'></i>").prependTo($("#end"));
	$("<i class='icon-cog'></i>").prependTo($("#cfg"));

	var myCanvas = $("#myCanvas")[0];
	var ctx = myCanvas.getContext("2d");
	
	var width = myCanvas.width;
	var height = myCanvas.height;
	
	var tt = [
		"你已经死了！",
		"byebye!",
		"笨蛋，你又挂了！",
		"OY,你又挂了！",
		"敢不敢好好玩！",
		"要小心哦！",
		"叫你小心点！",
		"上点心吧，孩子。",
		"唉，看不下去了。",
		"你到底有没有认真在玩！",
		"再努力一点！",
		"加油哦，少年！",
		"要加油哦！",
		"过了请你吃糖哦！",
		"你的智商...嗯嗯，我懂了！",
		"何弃疗！",
		"你无法超越我哈哈哈！",			
	];
	
	function basicObject(x,y,w,h,c,s){
		this.X = x; //width
		this.Y = y; //height
		this.W = w; //width
		this.H = h; //height
		this.C = c; //color
		this.S = s; //speed
		this.direction = {
			up: false, 
			left: false, 
			down: false, 
			right: false
		};
		
		this.draw = function(){
			this.locatePosition();
			
			ctx.beginPath();
			ctx.fillStyle = this.C;
			ctx.fillRect(this.X,this.Y,this.W,this.H);
		};
		
		this.keyPressed = function(e){
			if(e.keyCode == 39) { //right
				this.direction.right = true;
			} 
			if(e.keyCode == 37) { //left
				this.direction.left = true;
			}
			if(e.keyCode == 38) { //up
				this.direction.up = true;
			}
			if(e.keyCode == 40) { //down
				this.direction.down = true;
			}
		};
		
		this.keyReleased = function(e){
			if(e.keyCode == 39) { //right
				this.direction.right = false;
			} 
			if(e.keyCode == 37) { //left
				this.direction.left = false;
			}
			if(e.keyCode == 38) { //up
				this.direction.up = false;
			}
			if(e.keyCode == 40) { //down
				this.direction.down = false;
			}
		};
		
		this.locatePosition = function(){
			var speed = parseInt(this.S);
			if(this.direction.up === true) this.Y -= speed;
			if(this.direction.right === true) this.X += speed;
			if(this.direction.down === true) this.Y += speed;
			if(this.direction.left === true) this.X -= speed;
			if(this.X < 0) this.X = 0;
			if(this.Y < 0) this.Y = 0;
			if(this.X > width - this.W) this.X = width - this.W;
			if(this.Y > height - this.H) this.Y = height - this.H;
		};
		
		this.collide = function(os){
			for(var i=0;i<os.length; i++){
				var o = os[i];
				if( this.X >= o.X && this.X <= o.X + o.W && this.Y >= o.Y && this.Y <= o.Y + o.H || //left up: X Y
					this.X + this.W >= o.X && this.X + this.W <= o.X + o.W && this.Y >= o.Y && this.Y <= o.Y + o.H || //up right: X+W Y
					this.X + this.W >= o.X && this.X + this.W <= o.X + o.W && this.Y + this.H >= o.Y && this.Y + this.H <= o.Y + o.H || //right down: X+W Y+H
					this.X >= o.X && this.X <= o.X + o.W && this.Y + this.H >= o.Y && this.Y + this.H <= o.Y + o.H){ //left down: X Y+H
					clearInterval(paint);
					clearInterval(gt);
					var resart = confirm(tt[Math.floor(Math.random()*tt.length+1)-1] + "，重新开始？");
					if(resart === true) {
						window.location.reload();
					}
				}
			}
		};
	}
	
	//keyboard listen	
	document.onkeydown = function(e){
		var e = window.event? event : e; 
		me.keyPressed(e);

		if(e.keyCode == 38 || e.keyCode == 40) { //up
			e.preventDefault();
		}
	};
	document.onkeyup = function(e){
		var e = window.event? event : e;
		me.keyReleased(e);

		if(e.keyCode == 38 || e.keyCode == 40) { //up
			e.preventDefault();
		}
	};

	//init 
	var ownConfig = {
		color: "red",
		speed: 5
	};
	var enemyConfig = {
		color: "black",
		speed: 5
	};
	
	var me = new basicObject(width/2, height/2, 10, 10, ownConfig.color, ownConfig.speed);
	var objs = new Array();
	
	var gameTime = 0;
	
	function drawLine(m){
		var o = m.origin;
		var s = m.speed;
		var l = m.length
		var Xo = o.x, Yo = o.y;
		var space = {
			x: 0,
			y: 0
		};
		var positiveX = s.x > 0? s.x : -s.x;
		var positiveY = s.y > 0? s.y : -s.y;
		if(positiveX > positiveY) {
			space.x = 10;
			space.y = (10/positiveX) * positiveY;
		} else if(positiveY > positiveX) {
			space.y = 10;
			space.x = (10/positiveY) * positiveX;
		} else {
			space.x = space.y = 10;
		}
		
		for(var i=0;i<l;i++){
			Xo = s.x > 0? Xo - space.x : Xo + space.x;
			Yo = s.y > 0? Yo - space.y : Yo + space.y;
			if(Xo > 0 && Xo < width && Yo > 0 && Yo < height){
				var missile = new basicObject(Xo, Yo, 10, 10, enemyConfig.color, enemyConfig.speed);
				objs.push(missile);
			}
		}
	}
	
	var missiles = [];
	function initMissiles(){
		missiles.push({	type: "line", length: 20, origin: {x: 0, y: 0},	speed: {x: 5, y: 5}, time: 1000, isLive: 0 });
		missiles.push({	type: "line", length: 20, origin: {x: width, y: 0},	speed: {x: -5, y: 5}, time: 1500, isLive: 0 });
		missiles.push({	type: "line", length: 20, origin: {x: 0, y: height},	speed: {x: 5, y: -5}, time: 2000, isLive: 0 });
		missiles.push({	type: "line", length: 20, origin: {x: width, y: height},	speed: {x: -5, y: -5}, time: 2500, isLive: 0 });
		
		for(var i=0; i<5; i++){
			missiles.push({	type: "line", length: 10, origin: {x: width-i*100, y: 0}, speed: {x: -5, y: 5},	time: 5000,	isLive: 0 });
		}
		for(i=0; i<5; i++){
			missiles.push({	type: "line", length: 10, origin: {x: width, y: height-i*100}, speed: {x: -5, y: 5}, time: 5000, isLive: 0 });
		}
		
		for(i=0; i<5; i++){
			missiles.push({	type: "line", length: 10, origin: {x: 0, y: height-i*100}, speed: {x: 5, y: 5},	time: 6*1000, isLive: 0 });
		}
		for(i=0; i<5; i++){
			missiles.push({	type: "line", length: 10, origin: {x: i*100, y: 0}, speed: {x: 5, y: 5}, time: 6*1000, isLive: 0 });
		}
		
		for(i=0; i<5; i++){
			missiles.push({	type: "line", length: 50, origin: {x: -200+i*100, y: 300+i*100}, speed: {x: 6, y: -6}, time: 9*1000, isLive: 0 });
		}
		for(i=0; i<5; i++){
			missiles.push({	type: "line", length: 50, origin: {x: 300+i*100, y: 700-i*100}, speed: {x: -6, y: -6}, time: 9*1000, isLive: 0 });
		}
		
		for(i=0; i<10; i++){
			missiles.push({	type: "line", length: 50, origin: {x: -200+i*50, y: 300+i*50}, speed: {x: 7, y: -7}, time: 14*1000,	isLive: 0 });
		}
		for(i=0; i<10; i++){
			missiles.push({	type: "line", length: 50, origin: {x: 300+i*50, y: 700-i*50}, speed: {x: -7, y: -7}, time: 14*1000, isLive: 0 });
		}
		
		//straight
		for(i=1; i<10; i++){
			missiles.push({	type: "line", length: 70, origin: {x: 0, y: height-i*100}, speed: {x: 8, y: 0},	time: 18*1000, isLive: 0 });
		}
		for(i=1; i<10; i++){
			missiles.push({ type: "line", length: 70, origin: {x: width-i*100, y: 0}, speed: {x: 0, y: 8}, time: 18*1000, isLive: 0 });
		}
		
		for(i=1; i<10; i++){
			missiles.push({	type: "line", length: 50, origin: {x: 0, y: height-i*50}, speed: {x: 8, y: 0},	time: 23*1000, isLive: 0 });
		}
		for(i=1; i<10; i++){
			missiles.push({ type: "line", length: 50, origin: {x: width-i*50, y: 0}, speed: {x: 0, y: 8}, time: 23*1000, isLive: 0 });
		}
		
		//arc
		//missiles
	}
	initMissiles();
			
	function setMissile(){
		for(var i = 0; i < missiles.length; i++){
			var line = missiles[i];
			if(line.type == "line") {
				setMissileByTime(line);
			}
		}
	}
	
	function setMissileByTime(line){
		if(parseInt(line.time) > gameTime){
			line.startTimer = setTimeout(function(){
				line.isLive = 1;
			},parseInt(line.time) - gameTime);
			line.endTimer = setTimeout(function(){
				line.isLive = 0;
			},parseInt(line.time) + 60*1000  - gameTime);
		} else {
			line.startTimer = null;
			line.endTimer = null;
		}
	}
	
	var paint;
	function start(){
		setMissile();
		return setInterval(function(){
			clear();
			me.draw();
			for(var i = 0; i < missiles.length; i++){
				var line = missiles[i];
				if(line.type == "line" && line.isLive == 1) {
					drawLine(line);
					line.origin.x += parseInt(line.speed.x);
					line.origin.y += parseInt(line.speed.y);
				}
			}
			for(var i=0;i<objs.length;i++){
				objs[i].draw();
			}
			me.collide(objs);
		},30);
	}
	
	var gt;
	function setGameTime(){
		return setInterval(function(){
			gameTime += 1000;
			$("#gametime").text(gameTime/1000 + " s");
			if(gameTime == 30*1000){
				$("#start")[0].click();
				alert("Congratulations ,you finished the 30 seconds real man test!!!");
			}
		},1000);
	}
	
	//start
	$("#start").click(function(){
		if($(this).attr("name") === "start"){
			$(this).attr("name","pause");
			$(this).removeClass("button-flat-primary");
			$(this).addClass("button-flat-highlight");
			$(this).text("暂停").prepend("<i class='icon-pause'></i>&nbsp;&nbsp;");
			paint = start();
			gt = setGameTime();
		} else if($(this).attr("name") === "pause"){
			$(this).attr("name","start");
			$(this).removeClass("button-flat-highlight");
			$(this).addClass("button-flat-primary");
			$(this).text("开始").prepend("<i class='icon-play'></i>&nbsp;&nbsp;");;
			clearInterval(paint);
			clearInterval(gt);
			for(var i = 0; i < missiles.length; i++){
				var line = missiles[i];
				var st = line.startTimer;
				var et = line.endTimer;
				if(st) clearTimeout(st);
				if(et) clearTimeout(et);
			}
		}
	});
	
	//end
	$("#end").click(function(){
		window.location.reload();
	});
	
	//config
	$("#cfg").click(function(){
		var $cfgDiv = $("#configDiv");
		$cfgDiv.center(10000);
		$(window).scroll(function(){
			$cfgDiv.center(10000);
		});

		if($cfgDiv.css("display") == "none") {
			$cfgDiv.show("slow");
		} else {
			$cfgDiv.hide("slow");
		}
		
	});
	
	$("#speed").blur(function(){
		if(/^[0-9]{1}$/.test(this.value) != true){
			alert("填0-9的数字");
			this.value = 5;
		} 
	});
	
	$("#confirm").click(function(){
		// own
		me.S = $("#ownSpeed").val();
		me.C = $("#ownColor").val();
		
		$("#configDiv").hide("slow");
	});
	
	$("#reset").click(function(){
		$("#ownSpeed").val(5);
		$("#ownColor")[0].options[0].selected = true;
	});

	$("#cancel").click(function(){
		$("#configDiv").hide("slow");
	});
	
	function clear(){
		ctx.clearRect(0,0,width,height);
		objs.splice(0,objs.length);
	}
	
	//console.log("copyright @ 张小龙");
});