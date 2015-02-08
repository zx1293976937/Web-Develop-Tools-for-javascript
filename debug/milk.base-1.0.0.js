/*
 * base.js
 * milk 框架的核心文件
 * 
 * v1.0.0
 * created by Weller Qu
 * 2015-02-04
 */
 
(function() {
	// milk 框架基类描述符, 用于创建基类
	var milkObjectDescriptor = (function() {
		var self = this;

		var _identifier = parseInt(Math.random() * Math.pow(10, 15));

		self.init = function() {
			if (window.console)
				window.console.log("Object is created: " + self.getIdentifier());

			return self;
		};

		self.getIdentifier = function() {
			return _identifier;
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

		self.print = function() {
			for (var key in self) {
				if (window.console)
					window.console.log(key);
			};

			return self;
		};

		return self;
	});

	// 已申明的模块
	var moduleMap = {"milk.Object": {
		name: "milk.Object",
		dependencies: [],
		descriptor: milkObjectDescriptor
	}};

	// 已创建的模块实例
	var allocedMap = {};
	// 已销毁的对象数量
	var deallocedCount = 0;

	// 初始化milk框架
	var milk = {
		// 判断是否是数组
		isArray: (function(obj) {
			return window.Object.prototype.toString.call(obj) === "[object Array]";
		}),
		// 定义个类型模块
		define: (function(name, dependencies, descriptor) {
			if (!moduleMap[name]) {
				dependencies = dependencies || [];

				if (dependencies.length == 0)
					dependencies.push("milk.Object");

				var module = {
					name: name,
					dependencies: dependencies,
					descriptor: descriptor,
					entity: null
				};

				moduleMap[name] = module;
			};

			return moduleMap[name];	// get a module's define
		}), 
		// 使用类型模块, name为define时的name
		use: (function(name) {
			var module = moduleMap[name];

			if (!module) throw new Error(name + " is undefined, Did you forget to reference special file?");

			if (!module.entity) {
				module.entity = (function() {
					var self = this;
					var initializers = [];

					var dependencies = module.dependencies;
					for (var i = 0; i < dependencies.length; i++) {
						var dep = dependencies[i];
						var descriptor = milk.use(dep);
						self = descriptor.call(self);

						if (self.init) {
							initializers.push(self.init);
							//delete self.init;
							self.init = null;
						};
					};

					self = module.descriptor.call(self);

					if (self.init) {
						initializers.push(self.init);
					};

					self.init = function() {
						for (var i = 0; i < initializers.length; i++) {
							initializers[i]();
						};

						return self;
					};

					return self;
				});
			};

			return module.entity;	
		}),
		// 获取一个已alloc的实例对象
		getObject: (function(key) {
			var instance = allocedMap[key];
			return instance;
		}),
		// 创建一个类的新实例, name为define时的name
		alloc: (function(name) {
			var unInitedInstance = new (milk.use(name));
			return (allocedMap[unInitedInstance.getIdentifier()] = unInitedInstance).init();
		}),
		// 销毁从alloc出去的实例, name为define时的name
		dealloc: (function(instance) {
			allocedMap[instance.getIdentifier()] = null;
			deallocedCount++;
			
			if (deallocedCount >= 25) {
				for (var key in allocedMap) {
					if (allocedMap[key] == null)
						delete allocedMap[key];
				};
				deallocedCount = 0;
			};

			return this;
		})
	};

	window.milk = window.$M = milk;
})();