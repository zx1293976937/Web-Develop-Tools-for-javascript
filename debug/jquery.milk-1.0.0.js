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

	window.jQuery.fn.extend({
		/* Linker 需要的方法 */
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
		// 获取最后一个Link的视图模型
		subject: function() {
			var key = this.attr(window.milk.LINKER_IDENTIFIER_KEY);
			return window.milk.getObject(key);
		}
	});

	window.jQuery.extend({
		/* Console 需要的方法 */
		consoleObject: null,
		log: function(message, tag, color) {
			if(!this.consoleObject)
				this.consoleObject = window.milk.alloc("milk.util.Console").initWithWelcome();

			this.consoleObject.log(message, tag, color);

			return this;
		}
	});
})();