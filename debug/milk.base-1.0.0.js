/*
 * base.js
 * milk 框架的核心文件
 * 
 * v1.0.0
 * created by Weller Qu
 * 2015-02-04
 */
 
(function() {
	var moduleMap = {};
	// var javascriptFileMap = {};

	var milk = {
		ObjectClass: (function() {
			var self = this;

			self.init = function() {
				return self;
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

			if (!module) return null;

			var dependencieDescriptors = module.dependencieDescriptors;

			return new (function() {
				var self = module.descriptor.apply(this, dependencieDescriptors);

				return self;
			});	
		})
	};

	window.milk = milk;
})();