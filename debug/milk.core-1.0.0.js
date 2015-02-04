/*
 * core.js
 * 
 *
 * v1.0.0
 * created by Weller Qu
 * 2015-02-04
 */

 (function() {
	if (!window.milk) 
		throw new Error("requires milk.base.js file");

	window.milk.define("milk.core.ArrayController",
		[],
		function() {
		var self = this;

		var _arrangedObjects = [];

		self.initWithArray = function(array) {
			if (array) {
				for (var i = 0; i < array.length; i++) {
					var item = array[i];
					_arrangedObjects.push(item);
				};
			};

			return self;
		};

		self.arrangedObjects = function() {
			return _arrangedObjects;
		};

		self.size = function() {
			return _arrangedObjects.length;
		};

		self.append = function(object) {
	        _arrangedObjects.push(object);
	        return self;
	    };

	    self.remove = function(object) {
	        for (var i = 0; i < _arrangedObjects.length; i++) {
	            var item = _arrangedObjects[i];
	            if (item === object) {
	                _arrangedObjects.splice(i, 1);
	                break;
	            };
	        };

	        return self;
	    };

	    self.clear = function() {
	        _arrangedObjects = [];
	        return self;
	    };

	    self.insertAtIndex = function(object, index) {
	        _arrangedObjects.splice(index, 0, object);
	        return self;
	    };

	    self.removeAtIndex = function(index) {
	        _arrangedObjects.splice(index, 1);
	        return self;
	    };

	    self.find = function(is) {
	        if (!is) return null;

	        var t = null;

	        for (var i = 0; i < _arrangedObjects.length; i++) {
	            var item = _arrangedObjects[i];

	            if (is(i, item)) {
	                t = item;
	                break;
	            };
	        };

	        return t;
	    };

	    // v1.0.1 add code
	    self.findMore = function(is) {
	        if (!is) return null;

	        var t = [];

	        for (var i = 0; i < _arrangedObjects.length; i++) {
	            var item = _arrangedObjects[i];

	            if (is(i, item)) {
	                t.push(item);
	            };
	        };

	        return t;
	    };

		return self;
	});
 })();