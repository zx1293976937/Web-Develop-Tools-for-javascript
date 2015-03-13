/*
 * jquery.milk 插件
 * 用于与jquery同时使用
 *
 * v1.0.0
 * created by Weller Qu
 * 2015-02-09
 */

(function() {
	if (!window.jQuery) 
		throw new Error("requires jquery.js file");

	if (!window.milk)
		throw new Error("requires milk.base.js file");

	//* Linker 需要的函数
	if (window.milk.MILK_LINKER_DEFINE) {
		window.jQuery.fn.extend({
			// 选择DOM对象的属性
			property: function(attrName, converter, creater) {
				var self = this;
				var attrs = [];

				for (var i = 0; i < self.length; i++) {
					var item = self.get(i);

					var attr = window.milk.alloc("milk.linker.DOMAttribute").initWithDOMObject(item, attrName);
					attr.setConverter(converter);
					attr.setCreater(creater);

					attrs.push(attr);
				};
				
				return {
					// 绑定到视图模型上
					linkTo: function(entity, keyPath, mode) {
						for (var i = 0; i < attrs.length; i++) {
							var item = attrs[i];
							item.linkTo(entity, keyPath, mode);
						};

						return self;
					}
				};
			},
			// 获取最后一个Link的视图模型对象
			subject: function() {
				var key = this.attr(window.milk.LINKER_IDENTIFIER_KEY);
				return window.milk.getObject(key);
			}
		});
	};
	//*/

	//* Mouse 需要的函数
	if (window.milk.MILK_MOUSE_DEFINE) {
		window.jQuery.fn.extend({
			smartMouse: function() {
				var self = this;

				var panel = self.get(0);
				var mouseObject = window.milk.alloc("milk.util.Mouse").initWithPanel(panel);

				return {
					onLeftToRight: function(handler) { 
						mouseObject.onLeftToRight(handler);
						return self;
					},
					onRightToLeft: function(handler) {
						mouseObject.onRightToLeft(handler);
						return self;
					},
					onTopToBottom: function(handler) {
						mouseObject.onTopToBottom(handler);
						return self;
					},
					onBottomToTop: function(handler) {
						mouseObject.onBottomToTop(handler);
						return self;
					},
					onWheel: function(handler) {
						mouseObject.onWheel(handler);
						return self;
					},
					onMove: function(handler) {
						mouseObject.onMove(handler);
						return self;
					},
					onClickUp: function(handler) {
						mouseObject.onClickUp(handler);
						return self;
					}
				};
			}
		});
	};
	//*/

	//* Validater 需要的函数
	if (window.milk.MILK_VALIDATER_DEFINE) {
		var elementObjectsMap = {};
		var formObjectsMap = { "default": window.milk.alloc("milk.validater.FormObject").initWithName("default") };

		window.jQuery.fn.extend({
			isRequired: function(errMsg) {
				var arr = this.__regsiter();
				for (var i = 0; i < arr.length; i++) {
					var item = arr[i];
					item.config.isRequired.on = true;
				};
				
				return this;
			},
			regExp: function(regexp, errMsg) {
				var arr = this.__regsiter();
				for (var i = 0; i < arr.length; i++) {
					var item = arr[i];
					item.config.regExp.on = regexp;
				};
				
				return this;
			},
			IP: function(errMsg) {
				var arr = this.__regsiter();
				for (var i = 0; i < arr.length; i++) {
					var item = arr[i];
					item.config.regExp.on = window.milk.regExps.IP;
				};
				
				return this;
			},
			digits: function(errMsg) {
				var arr = this.__regsiter();
				for (var i = 0; i < arr.length; i++) {
					var item = arr[i];
					item.config.regExp.on = window.milk.regExps.digits;
				};
				
				return this;
			},
			maxLength: function(len, errMsg) {
				var arr = this.__regsiter();
				for (var i = 0; i < arr.length; i++) {
					var item = arr[i];
					item.config.maxLength.on = len;
				};
				
				return this;
			},
			max: function(max, errMsg) {
				var arr = this.__regsiter();
				for (var i = 0; i < arr.length; i++) {
					var item = arr[i];
					item.config.max.on = max;
				};
				
				return this;
			},
			min: function(min, errMsg) {
				var arr = this.__regsiter();
				for (var i = 0; i < arr.length; i++) {
					var item = arr[i];
					item.config.min.on = min;
				};
				
				return this;
			},
			range: function(min, max, errMsg) {
				var arr = this.__regsiter();
				for (var i = 0; i < arr.length; i++) {
					var item = arr[i];
					item.config.min.on = min;
					item.config.max.on = max;
				};
				
				return this;
			},	
			equals: function(id, errMsg) {
				var arr = this.__regsiter();
				for (var i = 0; i < arr.length; i++) {
					var item = arr[i];
					item.config.equals.on = id;
				};

				return this;
			},
			group: function(name) {
				var arr = this.__regsiter();
				var formObject = formObjectsMap[name];

				if (!formObject)
					formObjectsMap[name] = formObject = window.milk.alloc("milk.validater.FormObject").initWithName(name);

				for (var i = 0; i < arr.length; i++) {
					var item = arr[i];
					formObject.addElementObject(item);
				};

				return this;
			},
			onError: function(handler) {
				var arr = this.__regsiter();
				for (var i = 0; i < arr.length; i++) {
					var item = arr[i];
					item.onError(handler);
				};

				return this;
			},
			__regsiter: function() {
				var selector = this.selector;
				var arr = elementObjectsMap[selector];

				if (arr && arr.length != this.length) {
					arr = [];
				};

				if (!arr || arr.length == 0) {
					elementObjectsMap[selector] = arr = [];

					for (var i = 0; i < this.length; i++) {
						var dom = this.get(i);
						var elementObject = window.milk.alloc("milk.validater.ElementObject")
							.initWithDOMObject(dom, formObjectsMap["default"]);

						arr.push(elementObject);
					};
				};

				return arr;
			}
		});
		
		window.jQuery.extend({
			validate: function(formName, onErrorHandler) {
				formName = formName ? formName : "default";

				var formObject = formObjectsMap[formName];
				if (formObject) {
					if (onErrorHandler !== undefined)
						formObject.onError(onErrorHandler);
					
					return formObject.validate();
				};

				return false;
			}
		});
	};
	//*/

	//* Console 需要的函数
	if (window.milk.MILK_CONSOLE_DEFINE) {
		var consoleObject = window.milk.alloc("milk.util.Console").initWithWelcome();
		window.jQuery.extend({
			log: function(message, tag, color) {
				consoleObject.log(message, tag, color);
				return this;
			}
		});
	};
	//*/
})();