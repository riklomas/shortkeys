(function($) {
	var specialKeys = {
		'.': 190,
		',': 188,
		';': 59,
		'Space': 32,
		'Left': 37,
		'Up': 38,
		'Right': 39,
		'Down': 40
	};
	var convertToNumber = function(inp, keys) {
		if(keys && typeof keys[inp] !== 'undefined') {
			return keys[inp];
		}

		return inp.toUpperCase().charCodeAt(0);
	};

	$.fn.shortkeys = $.fn.keys = function(obj, settings) {
		var ele = this;
		var onFormElement = false;
		var keys = [];
		var keyEvents = [];
		var keysDown = [];

		var keyAdd = function(keyCode) {
			keysDown.push(keyCode);
			keysDown.sort();
		};

		var keyRemove = function(keyCode) {
			for(var i = 0; i < keysDown.length; i++) {
				if(keysDown[i] == keyCode) {
					keysDown.splice(i, 1);
					keysDown.sort();

					break;
				}
			}
		};

		var keyMatch = function() {
			var isSame;

			for(var i = 0; i < keys.length; i++) {
				if(keysDown.length != keys[i].length) {
					continue;
				}

				isSame = true;

				for(var j = 0; j < keysDown.length; j++) {
					if(keysDown[j] != keys[i][j]) {
						isSame = false;
						
						break;
					}
				}

				if(isSame) {
					keyEvents[i]();

					return false
				}
			}

			return true;
		};

		settings = $.extend(true, {
			split: '+',
			moreKeys: specialKeys
		}, settings || {});

		// Convert the object definitions into key code arrays
		for(x in obj) {
			var exploded = x.split(settings.split);

			for(var i = 0; i < exploded.length; i++) {
				exploded[i] = convertToNumber(exploded[i], settings.moreKeys);
			}

			exploded.sort();

			keys.push(exploded);
			keyEvents.push(obj[x]);
		}

		// Ignore key presses when using form inputs
		$(':input', this).on({
			focus: function() { onFormElement = true; },
			blur: function() { onFormElement = false; }
		});

		// Bind to the keydown event
		this.on('keydown', function(e) {
			if(onFormElement) {
				return;
			}

			keyAdd(e.keyCode);

			return keyMatch();
		});

		// Bind to the keyup event
		this.on('keyup', function(e) {
			if(onFormElement) {
				return;
			}

			keyRemove(e.keyCode);
		});

		// Bind to the focus event
		this.on('focus', function(e) {
			keysDown = [];
		});

		return this;
	};
}(jQuery));
