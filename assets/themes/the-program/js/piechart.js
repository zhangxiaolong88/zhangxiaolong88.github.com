$(function() {
	var paper = Raphael("container", 1000, 800, function() {
		var R = this;
		var el = R.rect(0, 0, 1000, 800).attr({
			stroke: "1px",
			fill: "#dddddd",
			r: 25
		});
		var rad = Math.PI / 180;
		//el.mousedown(function(evt) {
		/*console.log(evt.layerX + "," + evt.layerY);
			var cx = evt.layerX;
			var cy = evt.layerY;*/

		var colors = [
				/*"#2f7ed8",
				"#8bbc21",
				"#910000",
				"#1aadce",
				"#492970",
				"#f28f43",
				"#77a1e5",
				"#c42525",
				"#a6c96a"*/
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
				y: 55.11,
				color: colors[0],
				drilldown: {
					name: 'MSIE versions',
					categories: ['MSIE 6.0', 'MSIE 7.0', 'MSIE 8.0', 'MSIE 9.0'],
					data: [33.06, 10.85, 7.35, 2.81],
					color: colors[0]
				}
			}, {
				y: 21.63,
				color: colors[1],
				drilldown: {
					name: 'Firefox versions',
					categories: ['Firefox 2.0', 'Firefox 3.0', 'Firefox 3.5', 'Firefox 3.6', 'Firefox 4.0'],
					data: [13.12, 5.43, 1.58, 0.83, 0.20],
					color: colors[1]
				}
			}, {
				y: 11.94,
				color: colors[2],
				drilldown: {
					name: 'Chrome versions',
					categories: ['Chrome 5.0', 'Chrome 6.0', 'Chrome 7.0', 'Chrome 8.0', 'Chrome 9.0',
						'Chrome 10.0', 'Chrome 11.0', 'Chrome 12.0'
					],
					data: [9.91, 0.70, 0.36, 0.32, 0.22, 0.19, 0.12, 0.12],
					color: colors[2]
				}
			}, {
				y: 7.15,
				color: colors[3],
				drilldown: {
					name: 'Safari versions',
					categories: ['Safari 5.0', 'Safari 4.0', 'Safari Win 5.0', 'Safari 4.1', 'Safari/Maxthon',
						'Safari 3.1', 'Safari 4.1'
					],
					data: [4.55, 1.42, 0.23, 0.21, 0.20, 0.19, 0.14],
					color: colors[3]
				}
			}, {
				y: 2.14,
				color: colors[4],
				drilldown: {
					name: 'Opera versions',
					categories: ['Opera 9.x', 'Opera 10.x', 'Opera 11.x'],
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
				y: data[i].y,
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
				//var brightness = 0.2 - (j / data[i].drilldown.data.length) / 5;
				versionsData.push({
					id: data[i].drilldown.categories[j],
					label: data[i].drilldown.categories[j],
					y: data[i].drilldown.data[j],
					//color: Highcharts.Color(data[i].color).brighten(brightness).get(),
					color: "rgb(" + colors[j].join(",") + ")",
					pid: categories[i]
				});
			}
		}
		/*console.log(browserData);
		console.log(versionsData);*/
		R.rapcharts({
			chart: {
				type: "pie"
			},
			title: {
				text: 'Browser market share, April, 2011'
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
						return this.y > 5 ? this.y : null;
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
						// display only if larger than 1
						return this.y > 1 ? this.label + '\n' + this.y + '%' : null;
					},
					color: '#948a54'
				}
			}]
		});
		//rap.simplePieChart(cx, cy, 15, [10, 10], ["main", "other"], ["#ef536d", "#a3ceff"], "#fff"); //["#fff54b", "#f45f41"], "#fff");
		/*var startAngle = 0,
				endAngle1 = 0,
				endAngle2 = 0,
				endAngle3 = 0,
				width1 = 5,
				width2 = 5,
				width3 = 5;
			var p1 = null,
				p2 = null,
				p3 = null;

			(function() {
				width1 -= 0.1;
				width2 -= 0.12;
				width3 -= 0.12;
				endAngle1 += 10;
				endAngle2 += 10;
				endAngle3 += 10;
				if (endAngle1 < 360) {
					if (p1) {
						p1.remove();
					}
					var r1 = 50;
					var r2 = 45;
					var x1 = cx + r1 * Math.cos(-startAngle * rad),
						x2 = cx + r1 * Math.cos(-endAngle1 * rad),
						y1 = cy + r1 * Math.sin(-startAngle * rad),
						y2 = cy + r1 * Math.sin(-endAngle1 * rad);
					var x1_ = cx + r2 * Math.cos(-startAngle * rad),
						x2_ = cx + r2 * Math.cos(-endAngle1 * rad),
						y1_ = cy + r2 * Math.sin(-startAngle * rad),
						y2_ = cy + r2 * Math.sin(-endAngle1 * rad);
					p1 = rap.path(["M", x1, y1, "A", r1, r1, 0, +(endAngle1 - startAngle > 180), 0, x2, y2, "L", x2_, y2_, "A", r2, r2, 0, +(endAngle1 - startAngle > 180), 1, x1_, y1_, "z"]).attr({
						'stroke': '#9111c0',
						"fill": "90-#3f0b3f-#ff66ff"
					});
				} else {
					p1.remove("50");
				}
				if (endAngle2 < 360) {
					if (p2) {
						p2.remove();
					}
					var r = 42;
					var x1 = cx + r * Math.cos(-startAngle * rad),
						x2 = cx + r * Math.cos(-endAngle2 * rad),
						y1 = cy + r * Math.sin(-startAngle * rad),
						y2 = cy - r * Math.sin(-endAngle2 * rad);
					p2 = rap.path(["M", x1, y1, "A", r, r, 0, +(endAngle2 - startAngle > 180), 1, x2, y2]).attr({
						'stroke': '#9111c0',
						"stroke-width": width2,
					});
				} else {
					p2.remove("50");
				}
				if (endAngle3 < 360) {
					if (p3) {
						p3.remove();
					}
					var r = 35;
					var x1 = cx + r * Math.cos(-startAngle * rad),
						x2 = cx + r * Math.cos(-endAngle3 * rad),
						y1 = cy + r * Math.sin(-startAngle * rad),
						y2 = cy + r * Math.sin(-endAngle3 * rad);
					p3 = rap.path(["M", x1, y1, "A", r, r, 0, +(endAngle3 - startAngle > 180), 0, x2, y2]).attr({
						'stroke': '#9111c0',
						"stroke-width": width3,
					});
				} else {
					p3.remove("50");
				}
				setTimeout(arguments.callee, 10);
			})();*/

		//});
	});

	/* pieChart */
	Raphael.fn.simplePieChart = function(cx, cy, r, values, labels, colors, stroke) {
		var paper = this,
			rad = Math.PI / 180,
			chart = this.set(),
			pvs = [];

		function sector(cx, cy, r, startAngle, endAngle, params) {
			var x1 = cx + r * Math.cos(-startAngle * rad),
				x2 = cx + r * Math.cos(-endAngle * rad),
				y1 = cy + r * Math.sin(-startAngle * rad),
				y2 = cy + r * Math.sin(-endAngle * rad);
			return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
		}
		var angle = 0,
			total = 0,
			process = function(j) {
				var value = values[j];
				pvs[j] = (value * 100 / total).toFixed(2);

				var angleplus = 360 * value / total,
					popangle = angle + (angleplus / 2),
					ms = 500,
					delta = 30,
					color = colors[j],
					p = sector(cx, cy, r, angle, angle + angleplus, {
						fill: color,
						stroke: stroke,
						"stroke-width": 1,
						cursor: "pointer"
					}),
					txt = paper.text(cx + (r + delta + 25) * Math.cos(-popangle * rad), cy + (r + delta + 25) * Math.sin(-popangle * rad), labels[j] + values[j] + "(" + pvs[j] + "%)").attr({
						fill: color,
						stroke: "none",
						opacity: 1,
						"font-size": 12
					});

				p.click(function() {
					chart.stop().animate({
						transform: "",
						"font-size": 12
					});

					p.animate({
						transform: "s1.1 1.1 " + cx + " " + cy
					}, ms, "elastic");
					txt.animate({
						"font-size": 16
					});

					var datas = [];
					for (var i = 0, ii = UAgames.data.names.length; i < ii; i++) {
						if (labels[j] === UAgames.data.names[i]) {
							for (var d = 0, dd = UAgames.data.dates.length; d < dd; d++) {
								datas[d] = UAgames.data.datas[d].amounts[i];
							}
						}
					}
					if (!!window.dg) {
						dg.remove();
					}
					window.dg = paper.drawGrid(100, 400, 800, 200, UAgames.data.dates, datas, color);

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
		return chart;
	};
});