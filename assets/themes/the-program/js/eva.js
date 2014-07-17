(function($, undefined) {
	$(function() {
		// 初始化 画布 手电筒 手电筒中图 大小
		$("#wrapper, #cover").css({
			"width": $(window).width(),
			"height": $(window).height()
		});

		var glassBorder = 6;

		$("#wrapper").css({
			"backgroundPosition": "50% 0"
		});

		$("#glass").css({
			"width": $(window).width() / 10,
			"height": $(window).width() / 10,
			"border-radius": $(window).width(),
			"border": glassBorder + "px solid #84cbc5"
		});
		$("#glass img").css({
			"width": $(window).width(),
			"height": $(window).width() * 1600 / 2560
		});

		// 初始化 手电筒 位置
		var point = {
			x: $(window).width() / 2,
			y: $(window).height() / 2
		};

		// 手电筒 跟随 鼠标 滑动
		$("#wrapper").mousemove(function(e) {
			point.x = e.pageX;
			point.y = e.pageY;
		});

		// requestAnimFrame兼容 用作动画
		window.requestAnimFrame = (function() {
			return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function( /* function */ callback, /* DOMElement */ element) {
					window.setTimeout(callback, 1000 / 60);
				};
		})();
		window.cancelAnimFrame = function(fn) {
			if (window.cancelAnimationFrame) {
				cancelAnimationFrame(fn);
			} else {
				clearTimeout(fn);
			}
		};
		var p;
		var clicked = false;
		var xspeed = 10,
			yspeed = 10;
		// 重绘函数
		var paint = function() {
			if (clicked === false) {
				$("#glass").animate({
					"top": point.y - $("#glass").height() / 2,
					"left": point.x - $("#glass").width() / 2
				}, 10);
				$("#glass img").animate({
					"top": -point.y + $("#glass").height() / 2 - glassBorder,
					"left": -point.x + $("#glass").width() / 2 - glassBorder
				}, 10);
			} else {
				if ($("#glass").width() < $(window).width() * 2 + xspeed) {
					xspeed += 5;
					yspeed += 5;
					$("#glass").css({
						"top": point.y - $("#glass").height() / 2,
						"left": point.x - $("#glass").width() / 2,
						"width": $("#glass").width() + xspeed,
						"height": $("#glass").height() + yspeed
					});

					$("#glass img").css({
						"top": -point.y + $("#glass").height() / 2 - glassBorder - xspeed / 2,
						"left": -point.x + $("#glass").width() / 2 - glassBorder - yspeed / 2
					});
				} else {
					
				}
			}
			p = requestAnimFrame(paint);
		};
		paint();
		/*(function() {
			$("#glass").animate({
				"top": point.y - $("#glass").height() / 2,
				"left": point.x - $("#glass").width() / 2
			}, 50);
			$("#glass img").animate({
				"top": -point.y + $("#glass").height() / 2 - 6 - 60,
				"left": -point.x + $("#glass").width() / 2 - 6
			}, 50);
			setTimeout(arguments.callee, 55);
		})();*/

		// 点击后 正式开启画面
		$("#glass").click(function() {
			$("#wrapper").unbind("mousemove");
			clicked = true;
		});
	});
})(jQuery, undefined);