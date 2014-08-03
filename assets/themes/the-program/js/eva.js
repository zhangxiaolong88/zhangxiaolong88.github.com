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

		//需要加载的图片
		//需要加载的图片
		var imgs = [{
			url: "assets/images/eva/bg.jpg"
		}, {
			url: "assets/images/eva/eva_1.jpg"
		}, {
			url: "assets/images/eva/eva_2.jpg"
		}, {
			url: "assets/images/eva/eva_3.jpg"
		}, {
			url: "assets/images/eva/eva_4.jpg"
		}, {
			url: "assets/images/eva/eva_5.jpg"
		}, {
			url: "assets/images/eva/Shinji.jpg"
		}, {
			url: "assets/images/eva/Rei.jpg"
		}, {
			url: "assets/images/eva/Asuka.jpg"
		}, {
			url: "assets/images/eva/Kaworu.jpg"
		}, {
			url: "assets/images/eva/Mari.jpg"
		}, {
			url: "assets/images/eva/eva.jpg"
		}, {
			url: "assets/images/eva/rebuild.jpg"
		}, {
			url: "assets/images/eva/plate.jpg"
		}, {
			url: "assets/images/eva/role_1.jpg"
		}, {
			url: "assets/images/eva/role_2.jpg"
		}, {
			url: "assets/images/eva/role_3.jpg"
		}, {
			url: "assets/images/eva/sketch_1.jpg"
		}, {
			url: "assets/images/eva/sketch_2.jpg"
		}, {
			url: "assets/images/eva/sketch_3.jpg"
		}, {
			url: "assets/images/eva/slide_1.jpg"
		}, {
			url: "assets/images/eva/slide_2.jpg"
		}, {
			url: "assets/images/eva/slide_3.jpg"
		}, {
			url: "assets/images/eva/slide_4.jpg"
		}, {
			url: "assets/images/eva/slide_5.jpg"
		}];

		/**
		 * @desc:获取浏览器信息
		 * @returns {Array}
		 * 【1】版本【2】版本号
		 */
		var checkUserAgent = function() {
			var version = navigator.userAgent.toLowerCase();
			var versionInfos = [];
			var vIndex = 0;
			if ((vIndex = version.indexOf("msie")) != -1) {
				//alert("ie" + version.substring(vIndex + 5, version.indexOf(";", vIndex)));
				versionInfos = ["ie", version.substring(vIndex + 5, version.indexOf(".", vIndex))];
			} else if ((vIndex = version.indexOf("chrome")) != -1) {
				//alert("chrome" + version.substring(vIndex + 7, version.indexOf(".", vIndex)));
				versionInfos = ["chrome", version.substring(vIndex + 7, version.indexOf(".", vIndex))];
			} else if ((vIndex = version.indexOf("firefox")) != -1) {
				//alert("ff" + version.substring(vIndex + 8, version.indexOf(".", vIndex)));
				versionInfos = ["ff", version.substring(vIndex + 8, version.indexOf(".", vIndex))];
			} else if ((vIndex = version.indexOf("safari")) != -1) {
				//alert("safari" + version.substring(vIndex + 7, version.indexOf(".", vIndex)));
				versionInfos = ["safari", version.substring(vIndex + 7, version.indexOf(".", vIndex))];
			} else if ((vIndex = version.indexOf("opera")) != -1) {
				//alert("opera" + version.substring(vIndex + 6, version.indexOf(".", vIndex)));
				versionInfos = ["opera", version.substring(vIndex + 6, version.indexOf(".", vIndex))];
			}
			versionInfos[1] = parseInt(versionInfos[1]);
			return versionInfos;
		}

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
			$("#load-bar").css({
				"width": w / 8,
				"height": w / 8
			}).css({
				"top": h / 2 - $("#load-bar").height() / 2,
				"left": w / 2 - $("#load-bar").width() / 2
			});

			// 手电筒 跟随 鼠标 滑动
			$("#wrapper").mousemove(function(e) {
				point.x = e.pageX;
				point.y = e.pageY;
			});
		};

		// 预加载图片
		var loadImages = function(imgs) {
			if (typeof(index) === "undefined") {
				index = 0;
			} else {
				index++;
			}
			var img = new Image();
			img.onload = function() {
				var per = (index + 1) / imgs.length;
				/*$(".progress .progress-bar")
					.attr("aria-valuenow", per)
					.css({
						"width": per + "%"
					})
					.text(per + "%");*/

				$("#load-bar .glogopre").stop().animate({
					"width": per * $("#load-bar").width()
				}, "slow", function() {
					if (index == imgs.length - 1) {
						initImages();
					}
				})
				if (index != imgs.length - 1) {
					loadImages(imgs);
				}
			};
			img.onerror = function() {
				if (index == imgs.length - 1) {
					initImages();
				} else {
					imgs.splice(index, 1);
					loadImages(imgs);
				}
			};
			img.src = imgs[index].url;
		};

		// 显示图片
		var initImages = function() {
			// 隐藏加载条
			$("#load-bar").hide().remove();

			// 显示缓存的图片
			$("img").each(function(i, v) {
				var $this = $(this);
				$this.attr({
					"src": $this.attr("data-src")
				});
			});
			$("#wrapper").css({
				"backgroundImage": "url('assets/images/eva/bg.jpg')"
			});

			// 加载图片阶段结束 初始化手电筒
			initGlass();
		};

		// 总入口
		var browserInfo = checkUserAgent();
		var brw = browserInfo[0],
			ver = browserInfo[1];
		if (brw == "ff" || brw == "chrome" || (brw == "ie" && ver >= 9)) {
			initWrapper();
			loadImages(imgs);
		} else {
			$("#wrapper").remove();
			var download = '<div id="download"><img src="assets/images/eva/chlogo.png">' +
				'<br><br>您的浏览器需要升级了<br><br>' +
				'<a target="_blank" href="http://www.google.com/chrome" class="btn">Download Google Chrome</a>' +
				'</div>';
			$("body").css({
				"background": "#3a0256"
			}).append(download);
			$("#download").css({
				"top": h / 2 - $("#download").height() / 2,
				"left": w / 2 - $("#download").width() / 2
			});
		}
		
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

				// 停止重绘
				cancelAnimFrame(p);

				// 初始化
				siteStart();
			});

			// 监听鼠标
			paint();
		};

		// 重绘函数
		var p;
		var paint = function() {
			var p = requestAnimFrame(paint);
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
		};

		// 初始化
		var siteStart = function() {
			$("#siteWrapper").show(function() {
				sizeInit();

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
					"height": h / 2,
					"backgroundImage": "url('assets/images/eva/bg.jpg')"
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

			// 人类补全计划 启动
			
		};

		// 计算容器位置与大小
		var sizeInit = function() {
			// 背景图片部分：滚动效果
			$(".image-container").css({
				"width": w,
				"height": h
			});

			$(".image-container").show();

			// 根据不同的比例 改变背景图片的大小
			if (w / h < BGIMAGE.width / BGIMAGE.height) {
				$(".image-container").find("img").css({
					"width": BGIMAGE.width * h / BGIMAGE.height,
					"height": h,
					"left": w / 2 - BGIMAGE.width * h / (2 * BGIMAGE.height)
				});
			} else {
				$(".image-container").find("img").css({
					"width": w,
					"height": BGIMAGE.height * w / BGIMAGE.width
				});
			}

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

		};

		var listenScroll = function() {
			// 监听下拉函数
			$(document).scroll(function() {
				setTimeout(function() {
					// 滑动高度
					var scrollTop = $(document).scrollTop();
					// 人物信息部分的高度
					var sHeight = getSecHgt("shinji"),
						rHeight = getSecHgt("rei"),
						aHeight = getSecHgt("asuka"),
						kHeight = getSecHgt("kaworu"),
						mHeight = getSecHgt("mari");

					// 每个部分距离页面顶部的高度
					var shinjiTop = $("#shinji").offset().top,
						reiTop = $("#rei").offset().top,
						asukaTop = $("#asuka").offset().top,
						kaworuTop = $("#kaworu").offset().top,
						mariTop = $("#mari").offset().top;

					// 充值背景图片及其容器的位置
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
					if (scrollTop > 0) {
						// 初号机背景图片
						$("#shinjiImg").css({
							"top": -scrollTop
						});
						$("#shinjiImg img").css({
							"top": scrollTop * 2 / 3 + "px"
						});

						// 滚动到人物信息部分出现 持续到人物信息部分完全出现
						var scrollTop_ = scrollTop;
						// roleInfoAction("#shinji", "#9932CC", Math.min(scrollTop_, sHeight));
						if (scrollTop_ > 0 && scrollTop_ < sHeight) {
							combAction("#9932CC");
						}
					}
					// eva_2: rei
					if (scrollTop > reiTop - h) {
						// 零号机背景图片
						$("#reiImg").css({
							"top": reiTop - scrollTop
						});
						$("#reiImg img").css({
							"top": (scrollTop - reiTop) * 2 / 3 + "px"
						});

						// 滚动到人物信息部分出现 持续到人物信息部分完全出现
						var scrollTop_ = scrollTop - sHeight - h * 2 / 3;
						// roleInfoAction("#rei", "#87CEFA", Math.min(scrollTop_, rHeight));
						if (scrollTop_ > 0 && scrollTop_ < rHeight) {
							combAction("#87CEFA");
						}
					} else {
						$("#reiImg").css({
							"top": "-9000px"
						});
					}
					// eva_3: 
					if (scrollTop > asukaTop - h) {
						$("#asukaImg").css({
							"top": asukaTop - scrollTop
						});
						$("#asukaImg img").css({
							"top": (scrollTop - asukaTop) * 2 / 3 + "px"
						});

						// 滚动到人物信息部分出现 持续到人物信息部分完全出现
						var scrollTop_ = scrollTop - sHeight - rHeight - (h * 2 / 3) * 2;
						// roleInfoAction("#asuka", "#ea1221", Math.min(scrollTop_, aHeight));
						if (scrollTop_ > 0 && scrollTop_ < aHeight) {
							combAction("#ea1221");
						}
					} else {
						$("#asukaImg").css({
							"top": "-9000px"
						});
					}
					// eva_4
					if (scrollTop > kaworuTop - h) {
						$("#kaworuImg").css({
							"top": kaworuTop - scrollTop
						});
						$("#kaworuImg img").css({
							"top": (scrollTop - kaworuTop) * 2 / 3 + "px"
						});

						// 滚动到人物信息部分出现 持续到人物信息部分完全出现
						var scrollTop_ = scrollTop - sHeight - rHeight - aHeight - (h * 2 / 3) * 3;
						// roleInfoAction("#kaworu", "#C0C0C0", Math.min(scrollTop_, kHeight));
						if (scrollTop_ > 0 && scrollTop_ < kHeight) {
							combAction("#C0C0C0");
						}
					} else {
						$("#kaworuImg").css({
							"top": "-9000px"
						});
					}
					// eva_5
					if (scrollTop > mariTop - h) {
						$("#mariImg").css({
							"top": mariTop - scrollTop
						});
						$("#mariImg img").css({
							top: (scrollTop - mariTop) * 2 / 3 + "px"
						});

						// 滚动到人物信息部分出现 持续到人物信息部分完全出现
						var scrollTop_ = scrollTop - sHeight - rHeight - aHeight - kHeight - (h * 2 / 3) * 4;
						// roleInfoAction("#mari", "#dc7fa3", Math.min(scrollTop_, mHeight));
						if (scrollTop_ > 0 && scrollTop_ < 500) {
							combAction("#dc7fa3");
						}
					} else {
						$("#mariImg").css({
							"top": "-9000px"
						});
					}
				}, 50);
			});
		};

		var getSecHgt = function(id) {
			return $("#" + id + " .item-content").height() + parseInt($("#" + id + " .item-content").css("paddingTop")) + parseInt($("#" + id + " .item-content").css("paddingBottom"));
		};

		var roleInfoAction = function(id, color, st) {
			var color = d3.scale.linear()
				.domain([0, 20])
				.range(["#FFFFFF", color])
				.interpolate(d3.interpolateLab);
			// 人物信息动画
			$(id + " .roleImg").show().css({
				"left": (w * st / 500) / 2 - $(id + " .roleImg").width(),
				"opacity": st / 500
			});
			$(id + " .roleInfo").show().css({
				"right": (w * st / 500) / 2 - $(id + " .roleInfo").width(),
				"color": color(Math.floor(st * 20 / 500))
			});
		};

		var combAction = function(color) {
			// 蜂巢效果
			combInit();

			// 蜂窝颜色变化
			var color = d3.scale.linear()
				.domain([0, 20])
				.range(["#FFFFFF", color])
				.interpolate(d3.interpolateLab);
			d3.selectAll(".hexagon").style("fill", function(d) {
				return color(d.length);
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
				sizeInit();
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