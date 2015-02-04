/*
 * core.js
 * milk 框架的核心文件
 * 
 * v1.0.0
 * created by Weller Qu
 * 2015-02-04
 */
 
(function() {
	var moduleMap = {};
	var javascriptFileMap = {};

	var milk = {
		define: (function(name, dependencies, factory) {
			if (!moduleMap[name]) {
				var module = {
					name: name,
					dependencies: dependencies,
					factory: factory
				};

				moduleMap[name] = module;
			};

			return moduleMap[name];
		}), 
		use: (function(name) {
			var module = moduleMap[name];

			if (!module) return null;

			if(!module.entity) {
				var args = [];
				for (var i = 0; i < module.dependencies.length; i++) {
					var dep = module.dependencies[i];
					if (moduleMap[dep].entity)
						args.push(moduleMap[dep].entity);
					else
						args.push(this.use(dep));
				};

				module.entity = module.factory.apply(null, args);
			};

			return module.entity;
		}),
		requires: (function(files, callback) {
			/*for (var i = 0; i < files.length; i++) {
				var f = files[i];

				if (!javascriptFileMap[f]) {
					var headNode = document.getElementByTagName("head")[0];
					var scriptNode = document.createElement("script");

					scriptNode.type = "text/javascript";
					scriptNode.async = "true";
					scriptNode.src = name;
					scriptNode.onload = function() {
						javascriptFileMap[name] = true;
						// headNode.removeChild(scriptNode);
						checkAllFilesStatus();
					};

					headNode.appendChild(scriptNode);
				};
			};
			
			function checkAllFilesStatus() {
				var allLoad = true;
				for (var i = 0; i < files.length; i++) {
					var f = files[i];
					if (!javascriptFileMap[f]) {
						allLoad = false;
						break;
					};
				};

				if (allLoad && callback)
					callback();
			};*/
		})
	};

	window.milk = milk;
})();