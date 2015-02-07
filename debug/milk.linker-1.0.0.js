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

	window.milk.define("milk.linker.Entity", [], function() {
			var self = window.milk.ObjectClass.call(this);

			// 观察者
			var observerMap = {};

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

		    self.onPropertyChanged = function(name) {
	            var value = self.getValue(name);

	            var observers = observerMap[name];
	            if (observers) {
	                var item = null;

	                for (var i = 0; i < observers.length; i++) {
	                    item = observers[i];	// item is a milk.linker.DOMAttribute object
	                    item.setAttributeValue(value);
	                };
	            };
		        return true;
		    };

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

		    // notify all observer to change
		    self.notify = function() {
		        for (var key in observerMap) {
		            self.onPropertyChanged(key);
		        };

		        return self;
		    };
		    */

			return self;
	});

	window.milk.define("milk.linker.DOMAttribute", [], function() {
		var self = window.milk.ObjectClass.call(this);

		// DOM Object 的属性名或样式名
		var _attribute = null;
		// DOM Object
		var _DOMObject = null;
		// 转换器
		var _converter = null;
		// subject context
		var _context = null;
		// 子项创造器
		var _childrenCreater = null;

		// 兼容属性表
		var compatibleMap = {
		    "class": "className"
		};

		// 属性变化事件处理函数
		var onChangeEventHandler = (function(event) {
			event = event || window.event;

			var keyPath = event.data.keyPath;
	        var context = event.data.context;
	        var self = event.data.self;

	        var value = self.getValue();

	        var setter = context["set" + keyPath];
	        if (setter) {
	            setter(value);
	        };

	        return false;
		});

		self.initWithDOMObject = function(DOMObject, keyPath) {
			// keyPath 可能的值:
			// style.display
			// innerHTML
			var keyPathParts = keyPath.split('.');

			_DOMObject = DOMObject;
			_attribute = keyPathParts[keyPathParts.length - 1];

			// 针对IE的兼容处理
			if (navigator.userAgent.toLowerCase().indexOf("trident") > 0 && compatibleMap[_attribute])
            	_attribute = compatibleMap[_attribute];
			
			for (var i = 0; i < keyPathParts.length - 1; i++) {
				var part = keyPathParts[i];

				_DOMObject = _DOMObject[part];
			};

			return self;
		};

		self.initWithConverter = function(DOMObject, keyPath, converter) {
			_converter = converter;

			return self.initWithDOMObject(DOMObject, keyPath);
		};

		self.initWithCreater = function(DOMObject, keyPath, creater) {
			_childrenCreater = creater;

			return self.initWithDOMObject(DOMObject, keyPath);
		};

		self.setAttributeValue = function(value) {
			var v = value;

			if (_attribute == "items" && window.milk.isArray(v)) {

				var lastNode = null;
				while(lastNode = _DOMObject.lastChild)
					_DOMObject.removeChild(lastNode);

				for (var i = 0; i < v.length; i++) {
					var item = v[i];
					var childData = item;

					if (_converter && _converter.convert)
						childData = _converter.convert(item);

					if (childData && _childrenCreater && _childrenCreater.build) {
						var childView = _childrenCreater.build(childData);	//Reverse 
						_DOMObject.appendChild(childView);

						if (_childrenCreater.render) {
							_childrenCreater.render(childView);
						};
					};
				};
			} else {
				if (_converter && _converter.convert)
					v = _converter.convert(value);

				_DOMObject[_attribute] = v;
			};

			return self;
		};

		self.getAttributeValue = function() {
			var v = null;

			if (_attribute == "items") {
				v = [];
				var children = _DOMObject.children;
				if (children) {
					for (var i = 0; i < children.length; i++) {
						var childView = children[i];
						var childData = null;

						if (childView && _childrenCreater && _childrenCreater.Reverse)
							childData = _childrenCreater.Reverse(childView);

						if (_converter && _converter.convertBack)
							childData = _converter.convertBack(childData);

						if (childData)
							v.push(childData);
					};
				};
			} else {
				v = _DOMObject[_attribute];

				if (_converter && _converter.convertBack)
					v = _converter.convertBack(v);
			};

			return v;
		};

		self.setConverter = function(c) {
			_converter = c;

			return self;
		};

		self.setCreater = function(c) {
			_childrenCreater = c;

			return self;
		};

		self.linkTo  = function(entity, keyPath, mode) {
			var keyPathParts = keyPath.split('.');
			var path = keyPathParts[keyPathParts.length - 1];

			_context = entity;

			for (var i = 0; i < keyPathParts.length - 1; i++) {
				var part = keyPathParts[i];
				_context = _context.getValue(part);
			};

			_context.addObserver(self, path);

			// mode:
			// 0 单向模式, 仅从主体通知到观察者, 默认值
			// 1 双向模式, 从主体通知到观察者, 也从观察者通知到主体
			if (mode === 1) {
				if (_DOMObject.addEventListener)
					_DOMObject.addEventListener("change", onChangeEventHandler, false);
				else
					_DOMObject.attachEvent("onchange", onChangeEventHandler);
			};

			return self;
		};

		self.breakTo = function(entity, keyPath) {
			_context.removeObserver(self, keyPath);
			_context = null;

			if (_DOMObject.removeEventListener)
				_DOMObject.removeEventListener("change", onChangeEventHandler);
			else
				_DOMObject.detachEvent("onchange", onChangeEventHandler);

			return self;
		};

		return self;
	});
})();