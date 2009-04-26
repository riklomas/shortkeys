jQuery(function ($) {
	$.shortkeys = function(obj, opt){
		$(document).shortkeys(obj, opt);
	};
	
	$.fn.shortkeys = function (obj, opt) {
		var options = $.extend({ 
			split: "+",
			moreKeys: {},
			wackyKeys: { '.': 190, ',': 188, ';': 59, 'Space': 32 },
			formElements: "input,select,textarea,button",
			onFormElement: false,
			actions: { },
			keysDown: []
		}, opt);
		
		$.fn.extend({
			action: {
				add: function (key) {
					var inarr = false;
					for (d in options.keysDown)
					{
						if (options.keysDown[d] == key)
						{
							inarr = true;
						}
					}
					if (!inarr)
					{
						options.keysDown.push(key);
						options.keysDown.sort();
					}
				},
				remove: function (key) {
					for(i in options.keysDown) {
						if(options.keysDown[i] == key) {
							options.keysDown.splice(i,1);
						}
					};	
					options.keysDown.sort();
				},
				test: function () {
					var o = options.actions[options.keysDown.join(',')];
					if (typeof o !== "undefined" && !options.onFormElement)
					{
						options.actions[options.keysDown.join(',')]();
						$(this).notFormElements();
						$(this).ajaxComplete(function () {
							$(this).notFormElements();
						})
						return false;
					}
				}
			},
			key: {
				add: function (obj) {
					var arr = new Array();
					if (typeof obj == "object") {
						arr = obj;
					} else if (typeof obj == "string") {
						arr.append(obj);
					} else {
						return false;
					}
					var quickArr = new Array();
					for(j in arr) {
						quickArr.push($(this).to_i(options.keys[i][j].toUpperCase()));
					}
					return quickArr;
				}
			},
			notFormElements: function() {
				$(options.formElements).focus(function(){
					options.onFormElement = true;
				});
				$(options.formElements).blur(function(){ 
					options.onFormElement = false; 
				});
			},
			to_i: function (inp) {
				if (typeof options.wackyKeys[inp] !== "undefined") {
					return options.wackyKeys[inp];
				}
				return inp.toUpperCase().charCodeAt(0);
			},
			add: function (obj) {
				for(x in obj) {
					var a = x.split(options.split);
					var b = [];
					for (k in a)
					{
						if (/^[\dA-Za-z]{1}$/.test(a[k]))
						{
							b.push(a[k].toUpperCase().charCodeAt(0));
						}
						else if (typeof options.wackyKeys[a[k]] !== "undefined")
						{
							b.push(options.wackyKeys[a[k]]);
						}
						else if (typeof options.moreKeys[a[k]] !== "undefined")
						{
							b.push(options.moreKeys[a[k]]);
						}
					}
					var c = b.sort().join(',');
					if (typeof c !== "string" || c !== '')
					{
						options.actions[c] = obj[x];
					}
				}
			}
		});
		
		return this.each(function () {
			var e = this;
			
			for(x in options.wackyKeys) {
				options.wackyKeys[x.toUpperCase()] = options.wackyKeys[x];
			}
			
			$(this).add(obj);
			$(this).notFormElements();
			
			$(this).keydown(function(ev) {
				$(e).action.add(ev.keyCode);
				return $(e).action.test();
			});
		
			$(this).keyup(function (ev) {
				$(e).action.remove(ev.keyCode);
			});
		});
	}
});