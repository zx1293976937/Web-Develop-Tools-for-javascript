/*
 * storage.js
 * milk 框架的本地存储管理器
 * 
 * v1.0.0
 * created by Weller Qu
 * 2015-02-04
 */

(function() {
	if (!typeof window.milk) 
		throw new Error("requires milk.base.js file");

	window.milk.define("milk.storage.LocalDataManager", [], function() {
		var self = window.milk.ObjectClass.call(this);

		var storage = null; 

		self.initWithStorage = function(storage) {
			storage = storage;
		};

		self.setData = function(key, value) {
			if (storage) {
				storage.setItem(key, value);
			};

			return self;
		};

		self.getData = function(key) {
			var t = null;

			if (storage) {
				t = storage.getItem(key);
			};

			return t;
		};

		self.removeData = function(key) {
			if (storage) {
				storage.removeItem(key);
			};

			return self;
		};

		self.clear = function() {
			if (storage) {
				for (var key in storage) {
					storage.removeItem(key);
				};
			};

			return self;
		};

		return self;
	});
})();