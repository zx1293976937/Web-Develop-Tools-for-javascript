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
		ObjectClass: (function() {
			var self = this;

			var _identifier = null;

			self.init = function() {
				_identifier = parseInt(Math.random() * Math.pow(10, 15));
				return self;
			};

			self.getIdentifier = function() {
				return _identifier;
			};

			return self.init();
		}),
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
		use: (function(name) {
			var module = moduleMap[name];

			if (!module) throw new Error(name + " is undefined, Are you forget to reference special file?");

			var dependencieDescriptors = module.dependencieDescriptors;

			return (function() {
				var self = module.descriptor.apply(this, dependencieDescriptors);

				return self;
			});	
		}),
		alloc: (function(name) {
			var unInitedInstance = new (milk.use(name));
			return (allocedMap[unInitedInstance.getIdentifier()] = unInitedInstance);
		}),
		dealloc: (function(instance) {
			 delete allocedMap[instance.getIdentifier()];
		})
	};

	window.milk = milk;
})();