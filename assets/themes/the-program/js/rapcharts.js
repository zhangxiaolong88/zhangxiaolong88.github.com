Raphael.fn.rapcharts = function(params) {
	var R = this;
	var height = R.height;
	var width = R.width;
	var series = params.series.reverse();
	var type = params.chart.type;
	var tooltip = params.tooltip;
	if (!type) {
		console.error("please input chart type.");
	} else if (type === "pie") {
		//饼图
		var centerAry = params.plotOptions.pie.center
		if (centerAry.constructor === Array) {
			var cx = width * parseInt(centerAry[0]) / 100;
			var cy = height * parseInt(centerAry[1]) / 100;
			//多饼图
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
					values.push(data[j].y);
					labels.push(data[j].label);
					colors.push(data[j].color);
					txtcolors.push(!!dataLabels.color ? dataLabels.color : data[j].color);
					if (!!data[j].pid) {
						pids.push(data[j].pid);
					}
				}

				/*var ser = series[i];
				var n = 1;
				var pieFun = function() {
					clearTimeout(clock);
					if (n >= 10) {
						return;
					} else {
						R.pieChart(10-n, cx, cy, r, values, labels, colors, txtcolors, pids, dataLabels, tooltip, ser.allowPointSelect, ser.nightingale);
						clock = setTimeout(pieFun, 10+n*100);
					}
					console.log(n);
					n++;
				}
				var clock = setTimeout(pieFun, 10);*/
				R.pieChart(cx, cy, r, values, labels, colors, txtcolors, pids, dataLabels, tooltip, series[i].allowPointSelect, series[i].nightingale);
				
				if (series[i].gap === true) {
					//带尖的圈
					var gap = document.getElementById("gap");
					var img = R.image(gap.src, cx - r, cy - r, r * 2, r * 2);

					//正中的空心圆
					R.circle(cx, cy, r / 4).attr({
						stroke: "none",
						fill: "#ffffff"
					});

					//带尖的圈
					var angle = 0,
						total = 0,
						rad = Math.PI / 180;
					for (var i = 0; i < values.length; i++) {
						total += values[i];
					}
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
							"font-weight": "bold"
						};
						txt_cx = cx + (r - txt_params["font-size"]) * Math.sin(popangle * rad);
						txt_cy = cy + (r - txt_params["font-size"]) * Math.cos((popangle + 180) * rad);
						txt = R.text(txt_cx, txt_cy, txt_label).attr(txt_params);

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
						var p = R.sector(cx, cy, r, angle, angle + angleplus, {
							fill: obj.color,
							cursor: "pointer",
							opacity: 0
						});
						var tip, tip_cx, tip_cy, tip_label; //鼠标移上去显示的文字
						var outer, outer_cx, outer_cy; //文字外框
						var outer_h = 60,
							outer_w = 100;
						(function(obj) {
							p.mouseover(function(evt) {
								//外框
								outer = R.rect(evt.clientX, evt.clientY, outer_w, outer_h, 5).attr({
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
								tip = R.text(evt.clientX, evt.clientY, tip_label).attr({
									fill: "#000000",
									"stroke-width": 1,
									"font-size": 12,
									"font-weight": "bold"
								});
							}).mouseout(function() {

								tip.remove();
								outer.remove();
							}).mousemove(function(evt) {
								outer.attr({
									"x": evt.clientX - outer_w - 20,
									"y": evt.clientY - outer_h / 2
								});
								tip.attr({
									"x": evt.clientX - outer_w / 2 - 20,
									"y": evt.clientY
								});
							});
						})(obj);

						angle += angleplus;
					}

				}
			}
		}
	}
};

/** 
 * 饼图
 * 中心cx,cy 半径r 值values 显示文字labels 扇形颜色colors 文字颜色txtcolors 父节点pids 鼠标划过效果
 */
Raphael.fn.pieChart = function(cx, cy, r, values, labels, colors, txtcolors, pids, dataLabels, tooltip, allowSelect, nightingale) {
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
					pr = r * ((7 - index) / 6);
				}
			} else {
				//如果是普通饼图
				tr = r;
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
					"font-size": 12
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
			var p = paper.sector(cx, cy, pr, angle, (angle + angleplus), {
				fill: color,
				stroke: "#ffffff",
				"stroke-width": 1,
				cursor: "pointer"
			});

			//如果是普通的饼图
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
					"font-weight": "bold"
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
				if (allowSelect === true) {
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
				outer = paper.rect(evt.clientX, evt.clientY, outer_w, outer_h, 5).attr({
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
				tip = paper.text(evt.clientX, evt.clientY, tip_label).attr({
					fill: "#000000",
					"stroke-width": 1,
					"font-size": 12,
					"font-weight": "bold"
				});
			}).mouseout(function() {
				//如果允许鼠标划过效果
				if (allowSelect === true) {
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
					"x": evt.clientX - outer_w - 20,
					"y": evt.clientY - outer_h / 2
				});
				tip.attr({
					"x": evt.clientX - outer_w / 2 - 20,
					"y": evt.clientY
				});
			});

			angle += angleplus;
			chart.push(p);
			chart.push(txt);
		};
	for (var i = 0, ii = values.length; i < ii; i++) {
		total += values[i];
	}
	for (i = 0; i < ii; i++) {
		process(i);
	}
	/*var i = 0;
	var lock = setInterval(function() {
		if (i >= ii) {
			clearInterval(lock);
		} else {
			process(i);
		}
		i++;
	}, 1000);*/
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
}