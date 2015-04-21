/**
 * jquery.border.js v0.1
 * http://blog.zhangxiaolong.me
 *
 * Copyright 2014, zhangxiaolong
 * http://blog.zhangxiaolong.me
 */
;
(function($, window, undefined) {
	'use strict';

	$.Border = function(options, element) {
		this.$el = element;
		this.init(options);
	};

	$.Border.defaults = {
		speed: "slow",
		width: 3,
		color: "#000"
	};

	$.Border.prototype.init = function(opts) {
		var self = this;
		//init options
		self.options = $.extend({}, $.Border.defaults, opts);

		self.$el.each(function(i, v) {
			var $img = $(v);
			var boxer = "<div class='border_boxer'>" + "<div class='top_border'></div>" + "<div class='left_border'></div>" + "<div class='bottom_border'></div>" + "<div class='right_border'></div>" + "</div>";
			$img.parent().append($(boxer));
			var $borderBoxer = $(v).parent().find(".border_boxer");
			$borderBoxer.append($img);
			$borderBoxer.css({
				"position": "relative",
				"padding": self.options.width,
				"margin": 0,
				"height": $img.height(),
				"width": $img.width()
			});

			(function($img, $boxer) {
				$img.unbind("mouseover").mouseover(function(evt) {
					$boxer.find(".top_border").css({
						"position": "absolute",
						"top": 0,
						"left": 0,
						"width": "1%", //$(v).width() + self.options.width * 2,
						"height": self.options.width,
						"background-color": self.options.color
					});
					$boxer.find(".left_border").css({
						"position": "absolute",
						"bottom": 0,
						"left": 0,
						"height": "1%",
						"width": self.options.width,
						"background-color": self.options.color
					});
					$boxer.find(".bottom_border").css({
						"position": "absolute",
						"bottom": 0,
						"right": 0,
						"width": "1%",
						"height": self.options.width,
						"background-color": self.options.color
					});
					$boxer.find(".right_border").css({
						"position": "absolute",
						"top": 0,
						"right": 0,
						"height": "1%",
						"width": self.options.width,
						"background-color": self.options.color
					}).delay(100).animate({
						"height": "100%"
					}, {
						duration: self.options.speed,
						easing: "swing",
						step: function(per, obj) {
							$boxer.find(".top_border").css({
								"width": per + "%"
							});
							$boxer.find(".left_border").css({
								"height": per + "%"
							});
							$boxer.find(".bottom_border").css({
								"width": per + "%"
							});
						}

					});
					evt.stopPropagation();
				}).unbind("mouseout").mouseout(function(evt) {
					$boxer.find(".top_border, .bottom_border").stop(true).css({
						"width": 0
					});
					$boxer.find(".left_border, .right_border").stop(true).css({
						"height": 0
					});
					evt.stopPropagation();
					return false;
				});
			})($img, $borderBoxer);
		});
	};

	$.fn.border = function(options) {
		return new $.Border(options, this);
	}

})(jQuery, window);


$(function() {
	/* border */
	if ($(".border").length != 0) {
		$("img").border({
			speed: "slow",
			color: "pink",
			width: 10
		});
	}
});