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

	window.milk.readonly("MILK_LINKER_DEFINE", true);

	// Linker标识, 使用类的唯一标识Identifier的值
	window.milk.readonly("LINKER_IDENTIFIER_KEY", "linker-vm-id");

	// 通知模式
	window.milk.readonly("LINK_MODE_ONEWAY", 0);
	window.milk.readonly("LINK_MODE_TWOWAY", 1);

	// 视图模型实体类
	window.milk.define("milk.linker.Entity", [], function() {
		var self = this;

		// 观察者
		var observerMap = {};
		// 属性列表
		var properties = self.getProperties();

		// @Override
		self.declareProperty = function(name, value, canJson) {
	    	properties[name] = { 
	    		name: name, 
	    		value: value, 
	    		canJson: canJson === false ? canJson : true,
	    		setter: (function(newValue) {
	    			properties[name].value = newValue;
	    			self.onPropertyChanged(properties[name].name);

		    		if (window.console)
		    			window.console.log(self.className() +"'s setAccessor was called: " + properties[name].value);

	    			return self;
	    		}), 
	    		getter: (function() {
	    			if (window.console)
		    			window.console.log(self.className() +"'s getAccessor was called: " + properties[name].value);

	    			return properties[name].value;
	    		}) 
	    	};

	    	var setAccessor = self["set" + name];
	    	if (setAccessor) {
		    	properties[name].setter = setAccessor;
		    };

		    var getAccessor = self["get" + name];
		    if (getAccessor) {
		    	properties[name].getter = getAccessor;
		    };

		    Object.defineProperty(self, name, {
		    	set: properties[name].setter,
		    	get: properties[name].getter,
		    	enumerable: true,
		    	configurable: true
		    });

		    return self;
	    };

		// decode from json
	    self.initWithJson = function(jsonObject, map) {
	    	map = map || {};

	        for (var key in properties) {
	        	var mapKey = map[key];

	        	if (mapKey) 
	        		self.setValue(jsonObject[mapKey], key);
	        	else
	        		self.setValue(jsonObject[key], key);
	        };

	        return self;
	    };

	    // code to json
	    self.toJson = function(map) {
	    	map = map || {};

	        var jsonObject = {};

	        for (var key in properties) {
	        	if (!properties[key].canJson)
	        		continue;

	        	var mapKey = map[key];
	        	var value = self.getValue(key);

	        	if (mapKey)
	        		jsonObject[mapKey] = value
	        	else
	        		jsonObject[key] = value;
	        };

	        return jsonObject;
	    };

	    // 添加一个观察者
		self.addObserver = function(attributeClass, keyPath) {
	        var observers = observerMap[keyPath];
	        if (!observers) {
	            observers = observerMap[keyPath] = [];
	        };
	        observers.push(attributeClass);

	        return self;
	    };

	    // 移除一个观察者
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

	    // 属性变化通知
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

	    // notify all observer to change
	    self.notify = function() {
	        for (var key in observerMap) {
	            self.onPropertyChanged(key);
	        };

	        return self;
	    };

		return self;
	});

	// 可以链接到视图模型实体类对象的属性类
	window.milk.define("milk.linker.DOMAttribute", [], function() {
		var self = this;

		// DOM Object 的属性名
		var _attribute = null;
		// DOM Object
		var _DOMObject = null;
		// 转换器
		var _converter = null;
		// subject context
		var _context = null;
		// subject keyPath
		var _keyPath = null;
		// 子项创造器
		var _childrenCreater = null;

		// 兼容属性表
		var compatibleMap = {
		    "class": "className"
		};

		// 属性变化事件处理函数
		var onChangeEventHandler = (function(event) {
			// event = event || window.event;
			// var sender = event.srcElement || event.target;
			var value = self.getAttributeValue();

			var keyPathParts = _keyPath.split('.');
			var path = keyPathParts[keyPathParts.length - 1];

			if (window.console)
				window.console.log("onchange shot: " + value);

			_context.setValue(value, path);

	        return true;
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

			// debug code
			onChangeEventHandler.key = keyPath;

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

				if (_DOMObject[_attribute] === undefined)
					_DOMObject.setAttribute(_attribute, v);
				else
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
				if (_DOMObject[_attribute] !== undefined)
					v = _DOMObject[_attribute];
				else
					v = _DOMObject.getAttribute(_attribute);

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

		// 链接到视图模型实体类实例
		// mode:
		// 0 单向模式, 仅从主体通知到观察者, 默认值
		// 1 双向模式, 从主体通知到观察者, 也从观察者通知到主体
		// 请使用window.milk.LinkMode来获取值
		self.linkTo  = function(entity, keyPath, mode) {
			if (_keyPath)
				throw new Error("have linked a subject with " + _keyPath);

			_keyPath = keyPath;

			var keyPathParts = _keyPath.split('.');
			var path = keyPathParts[keyPathParts.length - 1];

			_context = entity;

			for (var i = 0; i < keyPathParts.length - 1; i++) {
				var part = keyPathParts[i];
				_context = _context.getValue(part);
			};

			_context.addObserver(self, path);

			if (_DOMObject.setAttribute)
				_DOMObject.setAttribute(window.milk.LINKER_IDENTIFIER_KEY, _context.getIdentifier());
			else
				_DOMObject[window.milk.LINKER_IDENTIFIER_KEY] = _context.getIdentifier();

			if (mode === 1) {
				if (_DOMObject.addEventListener)
					_DOMObject.addEventListener("change", onChangeEventHandler, false);
				else
					_DOMObject.attachEvent("onchange", onChangeEventHandler);

				if (!_DOMObject.fire) {
					_DOMObject.fire = function(key) {
						var evt = this.events[key];

						if (evt) {
							evt();
						};

						return this;
					};

					_DOMObject.events = {};
				};

				_DOMObject.events[onChangeEventHandler.key] = onChangeEventHandler;
			};

			return self;
		};

		// 从链接的视图模型实体类实例断开指定链接
		self.breakTo = function(keyPath) {
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

	// 事件管理
	window.milk.define("milk.linker.Events", [], function() {

	});
})();