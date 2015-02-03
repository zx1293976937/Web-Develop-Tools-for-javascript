/**
 * Valider.js
 * v1.0.1
 * 
 * v1.0.1 添加clearError的调用
 * v1.0.0 beta 
 * 
 * qiuwei 2014-12-17
 */

$.fn.extend({
	isRequired: function(errMsg) {
		this.register();

		var elementObj = valider.__elementObjectDic[this.selector];
		if(elementObj) {
			elementObj.config.isRequired.on = true;
			elementObj.config.isRequired.msg = errMsg;
		};
		return this;
	},
	regExp: function(regexp, errMsg) {
		this.register();

		var elementObj = valider.__elementObjectDic[this.selector];
		if(elementObj) {
			elementObj.config.regExp.on = regexp;	// not false, not null
			elementObj.config.regExp.msg = errMsg;
		};
		return this;
	},
	IP: function(errMsg) {

		return this.regExp(valider.regExps.IP, errMsg);
	},
	digits: function(errMsg) {

		return this.regExp(valider.regExps.digits, errMsg);
	},
	maxLength: function(len, errMsg) {
		this.register();

		var elementObj = valider.__elementObjectDic[this.selector];
		if(elementObj) {
			elementObj.config.maxLength.on = len;
			elementObj.config.maxLength.msg = errMsg;
		};
		return this;
	},
	max: function(max, errMsg) {
		this.register();

		var elementObj = valider.__elementObjectDic[this.selector];
		if(elementObj) {
			elementObj.config.max.on = max;
			elementObj.config.max.msg = errMsg;
		};
		return this;
	},
	min: function(min, errMsg) {
		this.register();
		
		var elementObj = valider.__elementObjectDic[this.selector];
		if(elementObj) {
			elementObj.config.min.on = min;
			elementObj.config.min.msg = errMsg;
		};
		return this;
	},
	range: function(min, max, errMsg) {
		this.register();
		
		var elementObj = valider.__elementObjectDic[this.selector];
		if(elementObj) {
			elementObj.config.max.on = max;
			elementObj.config.max.msg = errMsg;

			elementObj.config.min.on = min;
			elementObj.config.min.msg = errMsg;
		};
		return this;
	},
	group: function(name) {
		this.register();

		var elementObj = valider.__elementObjectDic[this.selector];
		if(elementObj) {
			elementObj.config.defaultGroupName = name;
		};
		return this;
	},
	register: function() {
		var id = this.selector;
		if (!id || id == "")
			throw new Error("ID 不能为null或空字符串");
		
		if(!valider.__elementObjectDic[id]) {
			var elementObj = new valider.ElementObjectClass(this);
			valider.__elementObjectDic[id] = elementObj;
		};

		return this;
	}
});

$.extend({
	validate: function(groupName) {
		groupName = groupName ? groupName : "default";

		var finalResult = true;
		var errorSummary = "存在以下错误信息, 请修改后重试: ";

		for (var key in valider.__elementObjectDic) {
			var item = valider.__elementObjectDic[key];

			if (item.config.defaultGroupName != groupName)
				continue;

			var onceResult = item.validate();

			if(!onceResult) {
				errorSummary += ("\r\n" + item.config.defaultErrorMsg);
			} else if (valider.onClearError) {
				valider.onClearError(item.element);
			};

			finalResult = finalResult && onceResult;
		};

		if (!finalResult) {
			if (valider.onFinalError) 
				valider.onFinalError(errorSummary);
			else 
				alert(errorSummary);
		};
		
		return finalResult;
	}
});

// ===================================== Declare =====================================
// Package valider
var valider = {
	__elementObjectDic: {},

	ElementObjectClass: null,
	controls: {
		//BaseControlClass: null,
		TextClass: null
	},

	regExps: {
		IP: "^((2[0-4]\\d|25[0-5]|[01]?\\d\\d?)\\.){3}(2[0-4]\\d|25[0-5]|[01]?\\d\\d?)$",	// IP 地址
		digits: "^[1-9]\\d*$"																// 正整数
	},

	onOnceError: null,	// be shot when it lose focus
	onFinalError: null,	// be shot when final validate be called
	onClearError: null
};	// Package valider

// ===================================== Classes =====================================
// ElementObjectClass
valider.ElementObjectClass = function(element) {
	var self = this;

	self.element = element;
	self.config = {
		defaultGroupName: "default",
		defaultErrorMsg: "",
		isRequired: { on: false, msg: "" },
		regExp: { on: false, msg: "" },
		max: { on: false, msg: "" },
		min: { on: false, msg: "" },
		maxLength: { on: false, msg: ""}
	};

	self.element.on("focusout", { validateData: self }, function(event) {
		var obj = event.data.validateData;
		if(!obj.validate() && valider.onOnceError) {
			valider.onOnceError(obj.element, obj.config.defaultErrorMsg);
			// self.element.focus(); // 这句注释千万不能放开, 不要问我为什么!!! 任性!
		} else if (obj.validate() && valider.onClearError) {
			valider.onClearError(obj.element);
		};
	});

	self.validate = function() {
		var value = new valider.controls.TextClass(self.element).getValue();
		value = value ? value : "";

		if (self.config.isRequired.on) {
			if (value == "") {
				self.config.defaultErrorMsg = self.config.isRequired.msg;
				return false;
			};
		};
		if (self.config.regExp.on) {
			var reg = new RegExp(self.config.regExp.on, "igm");
			if (!reg.test(value)) {
				self.config.defaultErrorMsg = self.config.regExp.msg;
				return false;
			};
		};
		if (self.config.maxLength.on !== false) {
			var v = value.length;
			if (v > self.config.maxLength.on) {
				self.config.defaultErrorMsg = self.config.maxLength.msg + ", 当前长度: " + v;
				return false;
			};
		};
		if (self.config.max.on !== false) {
			var v = parseInt(value);
			if (isNaN(v)) {
				self.config.defaultErrorMsg = "当前值不是数字, 无法比较大小: " + value;
				return false;
			} else if (v > self.config.max.on) {
				self.config.defaultErrorMsg = self.config.max.msg;
				return false;
			};
		};
		if (self.config.min.on !== false) {
			var v = parseInt(value);
			if (isNaN(v)) {
				self.config.defaultErrorMsg = "当前值不是数字, 无法比较大小: " + value;
				return false;
			} else if (v < self.config.min.on) {
				self.config.defaultErrorMsg = self.config.min.msg;
				return false;
			};
		};

		return true;
	};

	return self;
};	// ElementObjectClass

// TextClass
valider.controls.TextClass = function(element) {
	var self = this;

	self.getValue = function() {
		return element.val();
	};

	return self;
};	// TextClass