/*
 * base.js
 * milk 框架的核心文件
 * 
 * v1.0.0
 * created by Weller Qu
 * 2015-02-04
 */
 
(function() {
	// 已申明的模块
	var moduleMap = {};
	// 已创建的模块实例
	var allocedMap = {};

	var milk = {
		// 基础类
		ObjectClass: (function() {
			var self = this;

			var _identifier = null;
			var _className = null;

			self.init = function() {
				if (!_identifier)
					_identifier = parseInt(Math.random() * Math.pow(10, 15));

				return self;
			};

			self.initWithClassName = function(name) {
				_className = name;
				return self;
			};

			self.getIdentifier = function() {
				return _identifier;
			};

			self.getClassName = function() {
				return _className;
			};

			self.setValue = function(value, forKey) {
				var setter = self["set" + forKey];
				if (setter)
					setter(value);
				else
					throw new Error("Key: " + forKey + " is not exists key or cant write.");

				return self;
			};

			self.getValue = function(forKey) {
				var getter = self["get" + forKey];
				if (getter)
					return getter();

				throw new Error("Key: " + forKey + " is not exists key or cant read.");
			};

			return (self.init());
		}),
		// 判断是否是数组
		isArray: (function(obj) {
			return window.Object.prototype.toString.call(obj) === '[object Array]';
		}),
		// 定义个类型模块
		define: (function(name, dependencies, descriptor) {
			if (!moduleMap[name]) {
				var dependencieDescriptors = [];
				if (dependencies) {
					for (var i = 0; i < dependencies.length; i++) {
						var item = dependencies[i];

						dependencieDescriptors.push(this.use(item));
					};
				};

				var module = {
					name: name,
					dependencieDescriptors: dependencieDescriptors,
					descriptor: descriptor
				};

				moduleMap[name] = module;
			};

			return moduleMap[name];	// get a module's define
		}), 
		// 使用类型模块, name为define时的name
		use: (function(name) {
			var module = moduleMap[name];

			if (!module) throw new Error(name + " is undefined, Are you forget to reference special file?");

			var dependencieDescriptors = module.dependencieDescriptors;

			return (function() {
				var self = module.descriptor.apply(this, dependencieDescriptors);

				return self.initWithClassName(name);
			});	
		}),
		// 创建一个并未初始化的实例, name为define时的name
		alloc: (function(name) {
			var unInitedInstance = new (milk.use(name));
			return (allocedMap[unInitedInstance.getIdentifier()] = unInitedInstance);
		}),
		// 销毁从alloc出去的实例, name为define时的name
		dealloc: (function(instance) {
			 delete allocedMap[instance.getIdentifier()];
		})
	};

	window.milk = window.$M = milk;
})();