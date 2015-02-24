/*
 * Validater.js
 * 用于验证表单对象
 * 
 * v1.0.0
 * created by Weller Qu
 * 2015-02-23
 */

(function() {
	if (!window.milk) 
		throw new Error("requires milk.base.js file");

	window.milk.readonly("MILK_VALIDATER_DEFINE", true);

	// 常用正则表达式
	window.milk.readonly("regExps", {
		IP: "^((2[0-4]\\d|25[0-5]|[01]?\\d\\d?)\\.){3}(2[0-4]\\d|25[0-5]|[01]?\\d\\d?)$",
		digits: "^[1-9]\\d*$"
	});

	// 表单元素类
	window.milk.define("milk.validater.ElementObject", [], function() {
		var self = this;

		var _formObject = null;
		var _DOMObject = null;

		var _onErrorHandler = [];

		var _errorMessage = "";

		self.config = {
			isRequired: { on: false, msg: "", process: (function(value) { 
				if (value == "") {
					this.msg = "不能为空";
					return false;
				};
				return true;
			}) },
			regExp: { on: false, msg: "", process: (function(value) { 
				var reg = new RegExp(this.on, "igm");
				if (!reg.test(value)) {
					this.msg = "格式不符合正则表达式规则[" + this.on + "]";
					return false;
				};
				return true;
			}) },
			max: { on: false, msg: "", process: (function(value) { 
				var v = parseInt(value);
				if (isNaN(v)) {
					this.msg = "值不是数字, 无法比较大小";
					return false;
				} else if (v > this.on) {
					this.msg = "[" + value + "]大于最大边界[" + this.on + "]";
					return false;
				};
				return true;
			}) },
			min: { on: false, msg: "", process: (function(value) { 
				var v = parseInt(value);
				if (isNaN(v)) {
					this.msg = "值不是数字, 无法比较大小";
					return false;
				} else if (v < this.on) {
					this.msg = "[" + value + "]小于最小边界[" + this.on + "]";
					return false;
				};
				return true;
			}) },
			maxLength: { on: false, msg: "", process: (function(value) {
				var v = value.length;
				if (v > this.on) {
					this.msg = "超过最大长度";
					return false;
				}; 
				return true;
			}) },
			equals: { on: false, msg: "与目标值不相等", process: (function(value) {
				var another = document.getElementById(this.on);
				if (another) {
					return another.value === value;
				};
				return false;
			}) },
			ajax: { on: false, msg: "", process: (function(value) { 
				return true;
			}) }
		};

		// 失去焦点事件处理函数
		var onBlurEventHandler = function(evt) {
			self.validate();
		};

		self.initWithDOMObject = function(DOMObject, formObject) {
			_DOMObject = DOMObject;
			_formObject = formObject;

			if (_DOMObject.addEventListener) {
				_DOMObject.addEventListener("blur", onBlurEventHandler, false);
			} else {
				_DOMObject.attachEvent("onblur", onBlurEventHandler);
			};

			_formObject.addElementObject(self);

			return self;
		};

		self.initWithDOMObjectId = function(id, formObject) {
			var obj = document.getElementById(id);

			return self.initWithDOMObject(obj, formObject);
		};

		self.getFormObject = function() {
			return _formObject;
		};

		self.getErrorMessage = function() {
			return _errorMessage;
		};

		self.onError = function(handler) {
			_onErrorHandler.push(handler);

			return self;
		};

		self.validate = function() {
			var value = _DOMObject.value;

			for (var key in self.config) {
				var item = self.config[key];

				if (item.on !== false && !item.process(value)) {
					for (var i = 0; i < _onErrorHandler.length; i++) {
						try {
							(_onErrorHandler[i])(self, item.msg);
						} catch(e) {
							// do nothing
						};
					};

					_errorMessage = item.msg;

					return false;
				};
			};

			return true;
		};

		return self;
	});

	// 表单验证类
	window.milk.define("milk.validater.FormObject", [], function() {
		var self = this;

		var _formName = null;
		self.getFormName = function() {
			return _formName;
		};

		self.initWithName = function(name) {
			_formName = name;
			return self;
		};

		var _onErrorHandler = function(formName, summary) {
			var text = "请修正以下错误: \r\n";
			for (var i = 0; i < summary.length; i++) {
				var str = summary[i];
				text += ("    " + str + "\r\n");
			};

			alert(text);
		};

		var elementObjects = {};

		self.addElementObject = function(obj) {
			var selected = elementObjects[obj.getIdentifier()];
			if (!selected) 
				elementObjects[obj.getIdentifier()] = obj;

			return self;
		};
		self.delElementObject = function(element) {
			var selected = elementObjects[obj.getIdentifier()];
			if (!selected) 
				elementObjects[obj.getIdentifier()] = null;

			return self;
		};

		self.onError = function(handler) {
			_onErrorHandler = handler;

			return self;
		};

		self.validate = function() {
			var finalResult = true;
			var summary = [];

			for (var key in elementObjects) {
				var selected = elementObjects[key];

				if (selected) {
					var result = selected.validate();

					if (!result) {
						summary.push(selected.getErrorMessage());
					};

					finalResult = (finalResult && result);
				};
			};

			if (!finalResult && _onErrorHandler) _onErrorHandler(self, summary);

			return finalResult;
		};

		return self;
	});
})();