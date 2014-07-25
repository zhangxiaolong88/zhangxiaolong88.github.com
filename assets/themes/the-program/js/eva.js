(function($, undefined) {
	$(function() {
		// 全局变量
		var w = $(window).width(),
			h = $(window).height();

		// 背景图片比例
		var BGIMAGE = {
			width: 1920,
			height: 1200
		};

		// 手电筒的边框宽度
		var glassBorder = 6;

		// 初始化 手电筒 位置
		var point = {
			x: w / 2,
			y: h / 2
		};

		// 加载百分比
		var imgsLoadPer = 0;

		//需要加载的图片
		var imgs = [{
			url: "assets/images/eva/bg.jpg",
			isLoaded: false
		}, {
			url: "assets/images/eva/nerv.png",
			isLoaded: false
		}, {
			url: "assets/images/eva/eva_1.jpg",
			isLoaded: false
		}, {
			url: "assets/images/eva/eva_2.jpg",
			isLoaded: false
		}, {
			url: "assets/images/eva/eva_3.jpg",
			isLoaded: false
		}, {
			url: "assets/images/eva/eva_4.jpg",
			isLoaded: false
		}, {
			url: "assets/images/eva/eva_5.jpg",
			isLoaded: false
		}, {
			url: "assets/images/eva/Shinji.jpg",
			isLoaded: false
		}, {
			url: "assets/images/eva/Rei.jpg",
			isLoaded: false
		}, {
			url: "assets/images/eva/Asuka.jpg",
			isLoaded: false
		}, {
			url: "assets/images/eva/Kaworu.jpg",
			isLoaded: false
		}, {
			url: "assets/images/eva/Mari.jpg",
			isLoaded: false
		}];

		// 图片预加载
		$(imgs).each(function(i, v) {
			var img = new Image();
			img.onload = function() {
				v.isLoaded = true;

				// 判断是否全部加载完成
				(function() {
					var isLoadedNo = 0;
					$(imgs).each(function(i, v) {
						if (v.isLoaded === true) {
							isLoadedNo++;
						}
					});
					imgsLoadPer = Math.floor(isLoadedNo * 100 / imgs.length);
					$(".progress .progress-bar")
						.attr("aria-valuenow", imgsLoadPer)
						.css({
							"width": imgsLoadPer + "%"
						})
						.text(imgsLoadPer + "%");
					// 如果加载完毕
					if (imgsLoadPer == 100) {
						$(".progress").hide().remove();
						init();
					}
				})();

			};
			img.onerror = function() {
				console.log("加载图片失败" + v.url);
			};
			img.src = "http://localhost:8887/" + v.url;
		});


		var init = function() {
			initImages();
			initWrapper();
			initGlass();
			paint();
		};

		var initImages = function(){
			$("img").each(function(i,v){
				var $this = $(this);
				$this.attr({
					"src": $this.attr("data-src")
				});
			});
		};

		// 初始化 画布 
		var initWrapper = function() {
			$("#wrapper, #cover").css({
				"width": w,
				"height": h
			});
			$("#wrapper").css({
				"backgroundPosition": "50% 0"
			});
			// 初始化进度条
			$(".load-bar").css({
				"top": h / 2 - $(".progress").height() / 2,
				"left": w / 2 - $(".progress").width() / 2
			});

			// 手电筒 跟随 鼠标 滑动
			$("#wrapper").mousemove(function(e) {
				point.x = e.pageX;
				point.y = e.pageY;
			});
		};

		// 初始化手电筒
		var initGlass = function() {
			$("<div id='glass'><img src='assets/images/eva/bg.jpg' /></div>").appendTo($("#cover"));
			$("#glass").css({
				"width": w / 10,
				"height": w / 10,
				"border-radius": w * 2,
				"border": glassBorder + "px solid #84cbc5"
			});
			// 初始化 手电筒中图
			$("#glass img").css({
				"width": w,
				"height": w * 1600 / 2560
			});

			// 点击手电筒后 开启墙动画
			$("#glass").click(function() {
				$("#wrapper").unbind("mousemove");
				clicked = true;
			});
		};

		// 是否点击手电筒 标识
		var clicked = false;
		// 重绘函数
		var paint = function() {
			var p = requestAnimFrame(paint);
			if (clicked === false) {
				setTimeout(function() {
					$("#glass").css({
						"top": point.y - $("#glass").height() / 2,
						"left": point.x - $("#glass").width() / 2
					});
					$("#glass img").css({
						"top": -point.y + $("#glass").height() / 2 - glassBorder,
						"left": -point.x + $("#glass").width() / 2 - glassBorder
					});
				}, 50);
			} else {
				// 停止重绘
				cancelAnimFrame(p);

				// 初始化
				$("#siteWrapper").show(function() {
					siteInit();

					// eva图片容器的位置初始化
					$(".image-container").css({
						"top": "-9000px",
						"left": "0px"
					}).eq(0).show().css({
						"top": "0px"
					});
					// eva图片的位置初始化
					$(".image-container").show().find("img").css({
						"top": 0
					});

					// 监听滚动事件
					listenScroll();
				});

				$(document).scrollTop(0);

				// 手电筒变大
				$("#glass").animate({
					"top": point.y - w,
					"left": point.x - w,
					"width": w * 2,
					"height": w * 2,
				}, 1000);
				// 手电筒图像位置
				$("#glass img").animate({
					"top": -point.y + w - glassBorder,
					"left": -point.x + w - glassBorder
				}, 1000, function() {
					// 墙左右打开的效果
					$("<div id='topWall'></div><div id='bottomWall'></div>").appendTo($("body"));
					// 初始化墙的大小
					$("#topWall, #bottomWall").css({
						"width": w,
						"height": h / 2
					});
					// 墙的位置
					$("#bottomWall").css({
						"backgroundPosition": "50% -" + (h / 2 + 1) + "px"
					});

					// 移除遮罩
					$("#wrapper").hide().remove();

					// 蜂巢效果
					combInit();

					// 墙动画
					$("#topWall").animate({
						"left": "-100%"
					}, 800, function() {
						$(this).hide().remove();
					});
					$("#bottomWall").animate({
						"left": "100%"
					}, 800, function() {
						$(this).hide().remove();
					});
				});
			}
		};



		// 核心函数
		var siteInit = function() {
			// 背景图片部分：滚动效果
			$(".image-container").css({
				"width": w,
				"height": h
			}).eq(4).css({
				"height": h + h
			});

			$(".image-container").show().find("img").css({
				"width": w,
				"height": BGIMAGE.height * w / BGIMAGE.width
			});

			// 内容部分
			$(".item-over-image-wrapper").eq(0).css({
				"height": h - $("#header").height()
			});

			$(".item-over-image-wrapper:gt(0)").css({
				"height": h * 2 / 3
			});

			// 滚动提示箭头
			$("#scrollTip").css({
				"top": (h - $("#header").height()) * 9 / 10,
				"left": (w / 2 - $("#scrollTip").width() / 2) + "px"
			}).mouseover(function() {
				$(this).removeClass().css({
					"font-size": 20
				}).text("SCROLL DOWN");
			}).mouseout(function() {
				$(this).css({
					"font-size": 28
				}).text("").addClass("icon-angle-down");
			});

			// 设置底部高度
			$("#footer").css({
				"height": ($(window).height() - 500) / 2
			});
		};

		var listenScroll = function() {
			// 监听下拉函数
			$(document).scroll(function() {
				setTimeout(function() {
					var scrollTop = $(document).scrollTop(),
						section = 500 + h * 2 / 3;
					// reset
					if (scrollTop == 0) {
						$(".image-container").css({
							"top": "-9000px",
							"left": "0px"
						}).eq(0).show().css({
							"top": "0px"
						});

						$(".image-container").show().find("img").css({
							"top": 0
						});
					}
					// eva_1: shinji
					var shinjiTop = $("#shinji").offset().top;
					if (scrollTop > 0) {
						// 初号机背景图片
						$("#shinjiImg").css({
							"top": -scrollTop
						});
						$("#shinjiImg img").css({
							"top": scrollTop * 2 / 3 + "px"
						});

						// 碇真嗣的信息动画
						var scrollTop_ = scrollTop > 0 && scrollTop < 500 ? scrollTop : 500;
						$("#shinji .roleImg").show().css({
							"left": (w * scrollTop_ / 500) / 2 - $("#shinji .roleImg").width(),
							"opacity": scrollTop_ / 500
						});
						$("#shinji .roleInfo").show().css({
							"right": (w * scrollTop_ / 500) / 2 - $("#shinji .roleInfo").width(),
							"opacity": scrollTop_ / 500
						});

						// 蜂窝颜色变化
						if (scrollTop > 0 && scrollTop < 500) {
							var color = d3.scale.linear()
								.domain([0, 20])
								.range(["#FFFFFF", "#9932CC"])
								.interpolate(d3.interpolateLab);
							d3.selectAll(".hexagon").style("fill", function(d) {
								return color(d.length);
							});
						}
					}
					// eva_2: rei
					var reiTop = $("#rei").offset().top;
					if (scrollTop > reiTop - h) {
						// 零号机背景图片
						$("#reiImg").css({
							"top": reiTop - scrollTop
						});
						$("#reiImg img").css({
							"top": (scrollTop - reiTop) * 2 / 3 + "px"
						});

						// 凌波丽的信息动画
						var scrollTop_ = scrollTop > section && scrollTop < 500 + section ? scrollTop - section : 500;
						$("#rei .roleImg").show().css({
							"left": (w * scrollTop_ / 500) / 2 - $("#rei .roleImg").width(),
							"opacity": scrollTop_ / 500
						});
						$("#rei .roleInfo").show().css({
							"right": (w * scrollTop_ / 500) / 2 - $("#rei .roleInfo").width(),
							"opacity": scrollTop_ / 500
						});

						// 蜂窝颜色变化
						if (scrollTop > section && scrollTop < section + 500) {
							var color = d3.scale.linear()
								.domain([0, 20])
								.range(["#FFFFFF", "#87CEFA"])
								.interpolate(d3.interpolateLab);
							d3.selectAll(".hexagon").style("fill", function(d) {
								return color(d.length);
							});
						}
					} else {
						$("#reiImg").css({
							"top": "-9000px"
						});
					}
					// eva_3: 
					var asukaTop = $("#asuka").offset().top;
					if (scrollTop > asukaTop - h) {
						$("#asukaImg").css({
							"top": asukaTop - scrollTop
						});
						$("#asukaImg img").css({
							"top": (scrollTop - asukaTop) * 2 / 3 + "px"
						});

						// 明日香的信息动画
						var scrollTop_ = scrollTop > section * 2 && scrollTop < 500 + section * 2 ? scrollTop - section * 2 : 500;
						$("#asuka .roleImg").show().css({
							"left": (w * scrollTop_ / 500) / 2 - $("#asuka .roleImg").width(),
							"opacity": scrollTop_ / 500
						});
						$("#asuka .roleInfo").show().css({
							"right": (w * scrollTop_ / 500) / 2 - $("#asuka .roleInfo").width(),
							"opacity": scrollTop_ / 500
						});

						// 蜂窝颜色变化
						if (scrollTop > section * 2 && scrollTop < section * 2 + 500) {
							var color = d3.scale.linear()
								.domain([0, 20])
								.range(["#FFFFFF", "#ea1221"])
								.interpolate(d3.interpolateLab);
							d3.selectAll(".hexagon").style("fill", function(d) {
								return color(d.length);
							});
						}
					} else {
						$("#asukaImg").css({
							"top": "-9000px"
						});
					}
					// eva_4
					var kaworuTop = $("#kaworu").offset().top;
					if (scrollTop > kaworuTop - h) {
						$("#kaworuImg").css({
							"top": kaworuTop - scrollTop
						});
						$("#kaworuImg img").css({
							"top": (scrollTop - kaworuTop) * 2 / 3 + "px"
						});

						// 渚熏的信息动画
						var scrollTop_ = scrollTop > section * 3 && scrollTop < 500 + section * 3 ? scrollTop - section * 3 : 500;
						$("#kaworu .roleImg").show().css({
							"left": (w * scrollTop_ / 500) / 2 - $("#kaworu .roleImg").width(),
							"opacity": scrollTop_ / 500
						});
						$("#kaworu .roleInfo").show().css({
							"right": (w * scrollTop_ / 500) / 2 - $("#kaworu .roleInfo").width(),
							"opacity": scrollTop_ / 500
						});

						// 蜂窝颜色变化
						if (scrollTop > section * 3 && scrollTop < section * 3 + 500) {
							var color = d3.scale.linear()
								.domain([0, 20])
								.range(["#FFFFFF", "#C0C0C0"])
								.interpolate(d3.interpolateLab);
							d3.selectAll(".hexagon").style("fill", function(d) {
								return color(d.length);
							});
						}
					} else {
						$("#kaworuImg").css({
							"top": "-9000px"
						});
					}
					// eva_5
					var mariTop = $("#mari").offset().top;
					if (scrollTop > mariTop - h) {
						$("#mariImg").css({
							"top": mariTop - scrollTop
						});
						$("#mariImg img").css({
							top: (scrollTop - mariTop) * 2 / 3 + "px"
						});

						// 真希波的信息动画
						var scrollTop_ = scrollTop > section * 4 && scrollTop < 500 + section * 4 ? scrollTop - section * 4 : 500;
						$("#mari .roleImg").show().css({
							"left": (w * scrollTop_ / 500) / 2 - $("#mari .roleImg").width(),
							"opacity": scrollTop_ / 500
						});
						$("#mari .roleInfo").show().css({
							"right": (w * scrollTop_ / 500) / 2 - $("#mari .roleInfo").width(),
							"opacity": scrollTop_ / 500
						});

						// 蜂窝颜色变化
						if (scrollTop > section * 4 && scrollTop < section * 4 + 500) {
							var color = d3.scale.linear()
								.domain([0, 20])
								.range(["#FFFFFF", "#dc7fa3"])
								.interpolate(d3.interpolateLab);
							d3.selectAll(".hexagon").style("fill", function(d) {
								return color(d.length);
							});
						}
					} else {
						$("#mariImg").css({
							"top": "-9000px"
						});
					}
				}, 50);
			});
		};

		// 蜂巢初加载
		var combInit = function() {
			if ($("#comb").length > 0) {
				$("#comb").remove();
			}
			$("<div id='comb'></div>").prependTo($("#contentWrapper"));
			$("#comb").css({
				"width": w,
				"height": h,
				"top": 0,
				"left": 0
			});

			var randomX = d3.random.normal(0, h / 9),
				randomY = d3.random.normal(0, w / 9),
				points = d3.range(2000).map(function() {
					return [randomX(), randomY()];
				});
			var randomX_ = d3.random.normal(w, h / 9),
				andomY_ = d3.random.normal(h, w / 9),
				points_ = d3.range(2000).map(function() {
					return [randomX_(), andomY_()];
				});
			var color = d3.scale.linear()
				.domain([0, 20])
				.range(["#FFFFFF", "#9932CC"])
				.interpolate(d3.interpolateLab);

			var hexbin = d3.hexbin()
				.size([w, h])
				.radius(w / 40);

			var svg = d3.select("#comb").append("svg")
				.attr("width", w)
				.attr("height", h);

			svg.append("g")
				.attr("id", "paper")
				.selectAll(".hexagon")
				.data(hexbin(points))
				.enter().append("path")
				.attr("class", "hexagon")
				.attr("d", hexbin.hexagon())
				.attr("transform", function(d) {
					return "translate(" + d.x + "," + d.y + ")";
				})
				.style("fill", function(d) {
					return color(d.length);
				});

			svg.append("g")
				.attr("id", "paper_")
				.selectAll(".hexagon")
				.data(hexbin(points_))
				.enter().append("path")
				.attr("class", "hexagon")
				.attr("d", hexbin.hexagon())
				.attr("transform", function(d) {
					return "translate(" + d.x + "," + d.y + ")";
				})
				.style("fill", function(d) {
					return color(d.length);
				});

			d3.select("#paper").attr("transform", "rotate(90)");
			d3.select("#paper_").attr("transform", "rotate(90 " + w + "," + h + ")");
		};

		// 浏览器拉伸
		$(window).resize(function() {
			// 重算页面宽度、高度
			w = $(window).width();
			h = $(window).height();
			if ($("#wrapper").length > 0) {
				// 手电筒的画布样式重算
				initWrapper();
				// 手电筒初始位置重算
				point = {
					x: w / 2,
					y: h / 2
				};
			} else {
				// 滚动部分样式重算
				siteInit();
				// 蜂巢样式重算
				combInit();
			}
		});
	});
})(jQuery, undefined);

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