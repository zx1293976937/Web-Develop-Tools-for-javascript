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
					return false;
				};
				return true;
			}) },
			regExp: { on: false, msg: "", process: (function(value) { 
				var reg = new RegExp(this.on, "igm");
				if (!reg.test(value)) {
					return false;
				};
				return true;
			}) },
			max: { on: false, msg: "", process: (function(value) { 
				var v = parseInt(value);
				if (isNaN(v)) {
					return false;
				} else if (v > this.on) {
					return false;
				};
				return true;
			}) },
			min: { on: false, msg: "", process: (function(value) { 
				var v = parseInt(value);
				if (isNaN(v)) {
					return false;
				} else if (v < this.on) {
					return false;
				};
				return true;
			}) },
			maxLength: { on: false, msg: "", process: (function(value) {
				var v = value.length;
				if (v > this.on) {
					return false;
				}; 
				return true;
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

			_formObject.addElement(_DOMObject);

			return self;
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
			var result = true;
			var value = _DOMObject.value;

			for (var key in self.config) {
				var item = self.config[key];

				if (item.on !== false && !item.process(value)) {
					for (var i = 0; i < _onErrorHandler.length; i++) {
						try {
							(_onErrorHandler[i])(_DOMObject, item.msg);
						} catch(e) {
							
						};
					};

					_errorMessage = item.msg;

					break;
				};
			};

			return result;
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

		var _onErrorHandler = function(summary) {
			var text = "请修正以下错误: \r\n";
			for (var i = 0; i < summary.length; i++) {
				var str = summary[i];
				text += (str + "\r\n");
			};

			alert(text);
		};

		var elements = {};

		self.addElement = function(element) {
			var selected = elements[element.id];
			if (!selected) 
				elements[element.id] = element;

			return self;
		};
		self.delElement = function(element) {
			var selected = elements[element.id];
			if (selected)
				elements[element.id] = null;

			return self;
		};

		self.onError = function(handler) {
			_onErrorHandler = handler;

			return self;
		};

		self.validate = function() {
			var finalResult = true;
			var summary = [];

			for (var key in elements) {
				var selected = elements[key];

				if (selected) {
					var result = selected.validate();
					finalResult = (finalResult && result);

					if (!result) {
						summary.push(selected.getErrorMessage());
					};
				};
			};

			return finalResult;
		};

		return self;
	});
})();