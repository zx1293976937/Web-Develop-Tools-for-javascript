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
		window.jQuery.fn.extend({
			isRequired: function(errMsg) {

			},
			regExp: function(regexp, errMsg) {

			},
			IP: function(errMsg) {

			},
			digits: function(errMsg) {

			},
			maxLength: function(len, errMsg) {

			},
			max: function(max, errMsg) {

			},
			min: function(min, errMsg) {

			},
			range: function(min, max, errMsg) {

			},
			equals: function(id, errMsg) {

			},
			group: function(name) {

			},
			onError: function(handler) {

			}
		});
		
		window.jQuery.extend({
			validate: function(formName, onError) {

			}
		});
	};
	//*/

	//* Console 需要的函数
	if (window.milk.MILK_CONSOLE_DEFINE) {
		window.jQuery.extend({
			consoleObject: null,
			log: function(message, tag, color) {
				if(!this.consoleObject)
					this.consoleObject = window.milk.alloc("milk.util.Console").initWithWelcome();

				this.consoleObject.log(message, tag, color);

				return this;
			}
		});
	};
	//*/
})();