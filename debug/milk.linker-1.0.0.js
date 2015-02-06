/*
 * Linker.js
 * MVVM kit
 * 
 * v1.0.0
 * created by Weller Qu
 * 2015-02-04
 */

(function() {
	if (!window.milk) 
		throw new Error("requires milk.base.js file");

	window.milk.define("milk.linker.Entity", 
		["milk.controller.ArrayController"], function(ArrayController) {
			var self = window.milk.ObjectClass.call(this);

			// 观察者集合
			var observers = new ArrayController();

			self.property = function(name, value) {
				Object.defineProperty(self, name, {
				    set: function (value) {
				        this["_" + name] = value;
				        //do something
				    },
				    get: function () {
				        return this["_" + name];
				    },
				    enumerable: true,
				    configurable: true
				});

				self[name] = value;
			};

			self.property("property1111", "1");

			/*
		    // decode from json
		    self.initWithJson = function(jsonObject, map) {
		        for (var key in jsonObject) {
		            var setter = self["set" + key];
		            if (setter && typeof setter == "function") {
		                setter(jsonObject[key]);
		            };
		        };

		        return self;
		    };

			// code to json
		    self.toJson = function(map) {
		        var jsonObject = {};
		        for (var key in self) {
		            if (key.indexOf("get") > -1) {
		                var getter = self[key];
		                if (getter && typeof getter == "function") {
		                    jsonObject[key.replace("get", "")] = getter();
		                };
		            };
		        };

		        return jsonObject;
		    };

			self.addObserver = function(attributeClass, keyPath) {
		        var observers = observerMap[keyPath];
		        if (!observers) {
		            observers = observerMap[keyPath] = [];
		        };
		        observers.push(attributeClass);

		        return self;
		    };

		    self.removeObserver = function(attributeClass, keyPath) {
		        var observers = observerMap[keyPath];
		        if (observers) {
		            for (var i = 0; i < observers.length; i++) {
		                var item = observers[i];
		                if (item == attributeClass) {
		                    observers.splice(i, 1);
		                    break;
		                };
		            };
		        };

		        return self;
		    };

		    self.onPropertyChanged = function(keyPath) {

		        var getter = self["get" + keyPath]; // getName
		        if (getter) {
		            var value = getter();

		            var observers = observerMap[keyPath];
		            if (observers) {
		                var item = null;
		                for (var i = 0; i < observers.length; i++) {
		                    item = observers[i];
		                    item.setValue(value);
		                };
		            };
		        };

		        return true;
		    };

		    // notify all observer to change
		    self.notify = function() {
		        for (var key in observerMap) {
		            self.propertyChange(key);
		        };

		        return self;
		    };
		    */

			return self;
	});
})();