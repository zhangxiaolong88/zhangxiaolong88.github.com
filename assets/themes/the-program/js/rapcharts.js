﻿Raphael.fn.rapcharts = function(params) {
	var paper = this;
	var height = paper.height;
	var width = paper.width;
	var series = params.series.reverse();
	var type = params.chart.type; //表格分类
	var tooltip = params.tooltip; //鼠标覆盖数据展示的格式化公式

	//标题
	paper.title(params.title.text, params.subtitle.text);

	var invoke;

	if (!type) {
		console.error("please input chart type.");
	} else if (type === "pie") {
		//饼图
		var centerAry = params.plotOptions.pie.center; //中心点
		var cx = width * parseInt(centerAry[0]) / 100;
		var cy = height * parseInt(centerAry[1]) / 100 + 50;

		//多饼图
		var per = 0;
		//每一帧所有元素
		var chartItems = [];
		var toolTips = [];
		invoke = function() {
			//每一帧 清除所有元素
			if (!!chartItems) {
				for (var i = 0; i < chartItems.length; i++) {
					chartItems[i].remove();
				}
			}
			if (!!toolTips) {
				for (var i = 0; i < toolTips.length; i++) {
					toolTips[i].remove();
				}
			}
			//每一帧 重置集合
			chartItems = [];
			toolTips = [];
			//动画速度
			per += Math.ceil((100 - per) * .2);
			//画内外饼图
			for (var i = 0; i < series.length; i++) {
				var r = Math.min(width, height) * parseInt(series[i].size) / 200;
				var values = [],
					labels = [],
					colors = [],
					txtcolors = [],
					pids = [],
					data = series[i].data,
					dataLabels = series[i].dataLabels;
				for (var j = 0; j < data.length; j++) {
					values.push(data[j].amount);
					labels.push(data[j].label || data[j].name);
					colors.push(data[j].color);
					txtcolors.push(!!dataLabels.color ? dataLabels.color : data[j].color);
					if (!!data[j].pid) {
						pids.push(data[j].pid);
					}
				}

				var chart = paper.pieChart(per / 100, cx, cy, r * per / 100, values, labels, colors, txtcolors, pids, dataLabels, tooltip, series[i].allowPointSelect, series[i].nightingale, toolTips);

				for (var ii = 0; ii < chart.length; ii++) {
					chartItems.push(chart[ii]);
				}

				if (series[i].gap === true) {
					//带尖的圈
					var gap = document.getElementById("gap");
					var img = paper.image(gap.src, cx - r, cy - r, r * 2, r * 2);
					chartItems.push(img);

					//正中的空心圆
					var hole = paper.circle(cx, cy, r / 4).attr({
						stroke: "none",
						fill: "#ffffff"
					});
					chartItems.push(hole);

					//带尖的圈
					var angle = 0,
						total = 0,
						rad = Math.PI / 180;
					for (var i = 0; i < values.length; i++) {
						total += values[i];
					}
					if (total != 0) {
						for (var k = 0; k < values.length; k++) {
							var obj = {
								value: values[k],
								label: labels[k],
								color: colors[k],
								txtcolor: txtcolors[k],
								pid: pids[k],
								y: (values[k] * 100 / total).toFixed(2) //占比
							};
							var angleplus = 360 * obj.value / total,
								popangle = angle + (angleplus / 2);

							//带尖的圈 里面的文字
							var txt, txt_cx, txt_cy, txt_label, txt_params;
							txt_label = obj.label;
							if (dataLabels.formatter.constructor == Function) {
								var txt_label_ = dataLabels.formatter.apply(obj);
								txt_label = txt_label_ === null ? "" : txt_label;
							}
							txt_params = {
								fill: obj.txtcolor,
								stroke: "none",
								opacity: 1,
								"font-size": 12,
								"font-weight": "bold",
								"font-family": "微软雅黑"
							};
							txt_cx = cx + (r - txt_params["font-size"] + 6) * Math.sin(popangle * rad);
							txt_cy = cy + (r - txt_params["font-size"] + 6) * Math.cos((popangle + 180) * rad);
							txt = paper.text(txt_cx, txt_cy, txt_label).attr(txt_params);

							//带尖的圈 里面的文字 变换角度
							var _popangle = popangle;
							if (popangle >= 0 && popangle < 90) {
								//_popangle += 45;
								txt.transform("r" + _popangle);
							} else if (popangle >= 90 && popangle < 180) {
								_popangle = 180 - _popangle;
								txt.transform("r-" + _popangle);
							} else if (popangle >= 180 && popangle < 270) {
								_popangle = _popangle - 180;
								txt.transform("r" + _popangle);
							} else if (popangle >= 270 && popangle <= 360) {
								_popangle = 360 - _popangle;
								txt.transform("r-" + _popangle);
							}


							//隐形的圆
							var p;
							if (values.length == 1) {
								//如果只有一个就画圆
								p = paper.circle(cx, cy, r).attr({
									fill: obj.color,
									cursor: "pointer",
									opacity: 0
								});
							} else {
								//否则画扇形
								p = paper.sector(cx, cy, r, angle, angle + angleplus, {
									fill: obj.color,
									cursor: "pointer",
									opacity: 0
								});
							}

							//鼠标移上去显示的文字
							var tip, tip_cx, tip_cy, tip_label;
							//文字外框
							var outer, outer_cx, outer_cy;
							var outer_h = 60,
								outer_w = 100;
							(function(obj) {
								p.mouseover(function(evt) {
									//外框
									outer = paper.rect(evt.layerX, evt.layerY, outer_w, outer_h, 5).attr({
										fill: "#ffffff",
										"stroke-width": 1,
										"stroke": "#bbbbbb",
										opacity: 0.8,
									});

									//文字
									tip_label = obj.label;
									if (tooltip.formatter.constructor == Function) {
										tip_label = tooltip.formatter.apply(obj);
										tip_label = tip_label === null ? "" : tip_label;
									}
									tip = paper.text(evt.layerX, evt.layerY, tip_label).attr({
										fill: "#000000",
										"stroke-width": 1,
										"font-size": 12,
										"font-weight": "bold",
										"font-family": "微软雅黑"
									});

									if (!!tip) toolTips.push(tip);
									if (!!outer) toolTips.push(outer);
								}).mouseout(function() {
									tip.remove();
									outer.remove();
								}).mousemove(function(evt) {
									outer.attr({
										"x": evt.layerX - outer_w - 20,
										"y": evt.layerY - outer_h / 2
									});
									tip.attr({
										"x": evt.layerX - outer_w / 2 - 20,
										"y": evt.layerY
									});
								});
							})(obj);

							angle += angleplus;

							chartItems.push(p);
							chartItems.push(txt);
						}
					}
				} //end if gap
			}
			var iv = requestAnimFrame(invoke);
			if (per >= 100) {
				if (window.cancelAnimationFrame) {
					cancelAnimationFrame(iv);
				} else {
					clearTimeout(iv);
				}
			}
		}; //end invoke

		invoke();


	} // end pie


};

/** 
 * 标题
 *
 */
Raphael.fn.title = function(title, subtitle) {
	var paper = this;
	paper.text(paper.width / 2, 50, title).attr({
		"font-size": 16,
		"font-weight": "bold",
		"font-family": "微软雅黑"
	});
	paper.text(paper.width / 2, 80, subtitle).attr({
		"font-size": 12,
		"font-weight": "bold",
		"font-family": "微软雅黑"
	});
}

/** 
 * 饼图
 * 中心cx,cy 半径r 值values 显示文字labels 扇形颜色colors 文字颜色txtcolors 父节点pids 鼠标划过效果
 */
Raphael.fn.pieChart = function(n, cx, cy, r, values, labels, colors, txtcolors, pids, dataLabels, tooltip, allowSelect, nightingale, toolTips) {
	var paper = this,
		rad = Math.PI / 180,
		chart = this.set(),
		pvs = [];

	var index = 1,
		oldPid = null;


	var angle = 0,
		total = 0,
		process = function(j) {
			//对象
			var obj = {
				value: values[j],
				label: labels[j],
				color: colors[j],
				txtcolor: txtcolors[j],
				pid: pids[j],
				y: (values[j] * 100 / total).toFixed(2) //占比
			};

			//圈半径
			var pr = r;
			//文字半径
			var tr = r;

			//判断是否在同个父节点下
			if (pids.length != 0) {
				//如果是父子关系的外圈（双层饼图的外层）
				if (obj.pid === oldPid) {
					index++;
				} else {
					index = 1;
					oldPid = obj.pid;
				}
				if (nightingale === true) {
					pr = r * ((11 - index) / 10);
				}
			}

			var angleplus = 360 * obj.value / total,
				popangle = angle + (angleplus / 2),
				ms = 500,
				delta = 30,
				color = obj.color,
				txtcolor = obj.txtcolor;

			//如果是有父子关系的外圈（即双层饼图的外层）
			var txt, txt_cx, txt_cy, txt_label;
			var line, line_x1, line_y1, line_x2, line_y2, line_params;
			if (pids.length != 0) {
				//画 文字
				txt_cx = cx + (pr + delta + 45) * Math.sin(popangle * rad);
				txt_cy = cy + (pr + delta + 45) * Math.cos((popangle + 180) * rad);

				txt_label = obj.label;
				if (dataLabels.formatter.constructor == Function) {
					txt_label = dataLabels.formatter.apply(obj);
					txt_label = txt_label === null ? "" : txt_label;
				}
				txt = paper.text(txt_cx, txt_cy, txt_label).attr({
					fill: obj.txtcolor,
					stroke: "none",
					opacity: 1,
					"font-size": 12,
					"font-family": "微软雅黑"
				});

				//文字 角度变换
				var _popangle = popangle;
				if (popangle >= 0 && popangle < 90) {
					_popangle = 90 - popangle;
					txt.transform("r-" + _popangle);
				} else if (popangle >= 90 && popangle < 180) {
					_popangle = popangle - 90;
					txt.transform("r" + _popangle);
				} else if (popangle >= 180 && popangle < 270) {
					_popangle = 270 - popangle;
					txt.transform("r-" + _popangle);
				} else if (popangle >= 270 && popangle <= 360) {
					_popangle = popangle - 270;
					txt.transform("r" + _popangle);
				}

				//画 连线
				if (txt_label != "") {
					line_x1 = cx + pr * Math.sin(popangle * rad);
					line_y1 = cy + pr * Math.cos((popangle + 180) * rad);
					line_x2 = cx + (pr + 45) * Math.sin(popangle * rad);
					line_y2 = cy + (pr + 45) * Math.cos((popangle + 180) * rad);
					line = paper.path("M" + line_x1 + "," + line_y1 + "L" + line_x2 + "," + line_y2).attr({
						stroke: obj.txtcolor,
						"stroke-dasharray": "-",
						"stroke-width": 2
					});
				}
			}

			//画 扇形
			var p;
			if (values.length == 1) {
				//如果只有一个就画圆
				p = paper.circle(cx, cy, r).attr({
					fill: color,
					stroke: "#ffffff",
					"stroke-width": 1,
					cursor: "pointer"
				});
			} else {
				//否则画扇形
				p = paper.sector(cx, cy, pr, angle * n, (angle + angleplus) * n, {
					fill: color,
					stroke: "#ffffff",
					"stroke-width": 1,
					cursor: "pointer"
				});
			}



			//如果是普通的饼图（内层的饼图）
			var txt2, txt2_cx, txt2_cy, txt2_label;
			if (pids.length == 0) {
				//画 文字
				txt2_cx = cx + tr / 2 * Math.sin(popangle * rad);
				txt2_cy = cy + tr / 2 * Math.cos((popangle + 180) * rad);

				txt2_label = obj.label;
				if (dataLabels.formatter.constructor == Function) {
					txt2_label = dataLabels.formatter.apply(obj);
					txt2_label = txt2_label === null ? "" : txt2_label;
				}
				txt2 = paper.text(txt2_cx, txt2_cy, txt2_label).attr({
					fill: "#ffffff",
					stroke: "none",
					opacity: 1,
					"font-size": 12,
					"font-weight": "bold",
					"font-family": "微软雅黑"
				});

				//文字 角度变换
				var _popangle2 = popangle;
				if (popangle >= 0 && popangle < 90) {
					_popangle2 = 90 - popangle;
					txt2.transform("r-" + _popangle2);
				} else if (popangle >= 90 && popangle < 180) {
					_popangle2 = popangle - 90;
					txt2.transform("r" + _popangle2);
				} else if (popangle >= 180 && popangle < 270) {
					_popangle2 = 270 - popangle;
					txt2.transform("r-" + _popangle2);
				} else if (popangle >= 270 && popangle <= 360) {
					_popangle2 = popangle - 270;
					txt2.transform("r" + _popangle2);
				}
			}

			var tip, tip_cx, tip_cy, tip_label; //鼠标移上去显示的文字
			var outer, outer_cx, outer_cy; //文字外框
			var outer_h = 60,
				outer_w = 100;
			p.mouseover(function(evt) {
				//如果允许鼠标划过效果
				if (allowSelect === true && values.length != 1) {
					var ox = (pr / 10) * Math.sin(popangle * rad);
					var oy = (pr / 10) * Math.cos((popangle + 180) * rad);
					p.animate({
						transform: "t" + ox + " " + oy
					}, ms, "elastic");
					txt.animate({
						"font-size": 18
					});
				}

				//外框
				outer = paper.rect(evt.layerX, evt.layerY, outer_w, outer_h, 5).attr({
					fill: "#ffffff",
					"stroke-width": 1,
					"stroke": "#bbbbbb",
					opacity: 0.8,
				});

				//文字
				tip_label = obj.label;
				if (tooltip.formatter.constructor == Function) {
					tip_label = tooltip.formatter.apply(obj);
					tip_label = tip_label === null ? "" : tip_label;
				}
				tip = paper.text(evt.layerX, evt.layerY, tip_label).attr({
					fill: "#000000",
					"stroke-width": 1,
					"font-size": 12,
					"font-weight": "bold",
					"font-family": "微软雅黑"
				});

				if (!!tip) toolTips.push(tip);
				if (!!outer) toolTips.push(outer);
			}).mouseout(function() {
				//如果允许鼠标划过效果
				if (allowSelect === true && values.length != 1) {
					p.stop().animate({
						transform: ""
					}, ms, "elastic");
					txt.stop().animate({
						"font-size": 12
					});
				}
				tip.remove();
				outer.remove();
			}).mousemove(function(evt) {
				outer.attr({
					"x": evt.layerX - outer_w - 20,
					"y": evt.layerY - outer_h / 2
				});
				tip.attr({
					"x": evt.layerX - outer_w / 2 - 20,
					"y": evt.layerY
				});
			});

			angle += angleplus;

			if (!!p) chart.push(p);
			if (!!txt) chart.push(txt);
			if (!!txt2) chart.push(txt2);
			if (!!line) chart.push(line);
		};
	for (var i = 0, ii = values.length; i < ii; i++) {
		total += values[i];
	}
	if (total != 0) {
		for (i = 0; i < ii; i++) {
			process(i);
		}
	}
	return chart;
};

/** 
 * 画扇形
 */
Raphael.fn.sector = function(cx, cy, r, startAngle, endAngle, params) {
	var paper = this;
	var rad = Math.PI / 180;
	var x1 = cx + r * Math.sin(startAngle * rad),
		x2 = cx + r * Math.sin(endAngle * rad),
		y1 = cy + r * Math.cos((startAngle + 180) * rad),
		y2 = cy + r * Math.cos((endAngle + 180) * rad);
	return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 1, +(endAngle - startAngle > 180), 1, x2, y2, "z"]).attr(params);
};


$(function() {
	/* pie charts */
	if ($("#container").length != 0) {
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
		var h = document.body.clientWidth * 81 / 100 - 420 - 104;
		var w = document.body.clientWidth * 81 / 100 - 420 - 104;
		var paper = Raphael("container", w, h, function() {
			var R = this;
			var rad = Math.PI / 180;

			var colors = [
					"#c158b2",
					"#eeae3c",
					"#638bcb",
					"#adcd6d",
					"#f5c6c5",
					"#cccccc"
				],
				categories = ['MSIE', 'Firefox', 'Chrome', 'Safari', 'Opera'],
				name = 'Browser brands',
				data = [{
					y: 51.95,
					color: colors[0],
					drilldown: {
						name: 'MSIE versions',
						categories: ['MSIE 6.0', 'MSIE 7.0', 'MSIE 8.0', 'MSIE 9.0', 'MSIE 10.0', 'other'],
						data: [8.72, 6.02, 4.56, 4.32, 4.17, 24.16],
						color: colors[0]
					}
				}, {
					y: 19.99,
					color: colors[1],
					drilldown: {
						name: 'Firefox versions',
						categories: ['Firefox 1.0', 'Firefox 2.0', 'Firefox 3.0', 'Firefox 3.5', 'Firefox 3.6', 'other'],
						data: [9.24, 4.19, 1.65, 1.4, 0.80, 3.57],
						color: colors[1]
					}
				}, {
					y: 15.94,
					color: colors[2],
					drilldown: {
						name: 'Chrome versions',
						categories: ['Chrome 7.0', 'Chrome 8.0', 'Chrome 9.0',
							'Chrome 10.0', 'Chrome 11.0', 'other'
						],
						data: [2.91, 1.70, 1.36, 0.32, 0.22, 9.12],
						color: colors[2]
					}
				}, {
					y: 14.15,
					color: colors[3],
					drilldown: {
						name: 'Safari versions',
						categories: ['Safari 5.0', 'Safari 4.0', 'Safari Win 5.0', 'Safari 4.1',
							'Safari 3.1', 'other'
						],
						data: [4.55, 2.42, 1.23, 1.21, 0.20, 6.14],
						color: colors[3]
					}
				}, {
					y: 2.14,
					color: colors[4],
					drilldown: {
						name: 'Opera versions',
						categories: ['Opera 9.x', 'Opera 10.x', 'other'],
						data: [1.65, 0.37, 0.12],
						color: colors[4]
					}
				}];


			// Build the data arrays
			var browserData = [];
			var versionsData = [];
			for (var i = 0; i < data.length; i++) {

				// add browser data
				browserData.push({
					id: categories[i],
					label: categories[i],
					amount: data[i].y,
					color: data[i].color,
					subNumber: data[i].drilldown.data.length
				});

				// add version data
				for (var j = 0; j < data[i].drilldown.data.length; j++) {
					var colors = new ColorGrads({
						StartColor: data[i].color,
						EndColor: "#ffffff",
						Step: data[i].drilldown.data.length + 1
					}).Create();
					versionsData.push({
						id: data[i].drilldown.categories[j],
						label: data[i].drilldown.categories[j],
						amount: data[i].drilldown.data[j],
						color: "rgb(" + colors[j].join(",") + ")",
						pid: categories[i]
					});
				}
			}
			R.rapcharts({
				chart: {
					type: "pie"
				},
				title: {
					text: 'Browser market share, April, 2011'
				},
				subtitle: {
					text: "raphael charts"
				},
				plotOptions: {
					pie: {
						center: ['50%', '50%']
					}
				},
				tooltip: {
					enabled: true,
					formatter: function() {
						return this.label + '\n' + this.y + "%";
					}
				},
				series: [{
					name: 'Browsers',
					data: browserData,
					size: '25%',
					gap: true,
					dataLabels: {
						formatter: function() {
							return this.y > 5 ? this.y + '%' : null;
						}
					}
				}, {
					name: 'Versions',
					data: versionsData,
					size: '70%',
					allowPointSelect: true,
					nightingale: true,
					dataLabels: {
						formatter: function() {
							return this.y > 2 ? this.label + '\n' + this.y + '%' : null;
						},
						color: '#948a54'
					}
				}]
			});
		});
	}
});