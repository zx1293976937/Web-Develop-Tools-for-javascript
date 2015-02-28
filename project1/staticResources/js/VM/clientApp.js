/*
 */

$M.define("milk.helper.JQueryMethod", ["milk.linker.Entity"], function() {
	var self = this;

	self.declareProperty("MethodName")
		.declareProperty("Desc")
		.declareProperty("Key");

	return self;
});

$M.define("milk.helper.Module", ["milk.linker.Entity"], function() {
	var self = this;

	self.declareProperty("ModuleName")
		.declareProperty("Desc")
		.declareProperty("Key");

	return self;
});

$M.define("milk.helper.App", ["milk.linker.Entity"], function() {
	var self = this;

	self.declareProperty("JQueryMethods")
		.declareProperty("Modules")
		.declareProperty("JqDescription")
		.declareProperty("MdDescription")
		.declareProperty("DownloadUrl")
		.declareProperty("FileName");

	self.load = function(dataUrl) {
		$.getJSON(dataUrl, function(res) {
			if (res && res.success) {

				self.JqDescription = res.description;
				self.MdDescription = res.description2;

				self.DownloadUrl = res.download;
				self.FileName = res.file;

				var array = [];
				for (var i=0;i<res.api.length;i++) {
					var itemData = res.api[i].split("\t");
					if (itemData.length >= 2) {
						var itemObject = $M.alloc("milk.helper.JQueryMethod");
						itemObject.MethodName = itemData[0];
						itemObject.Desc = itemData[1];

						itemObject.Key = itemData[0];

						array.push(itemObject);
					};
				};
				self.JQueryMethods = array;

				array = [];
				for (var i = 0; i < res.modules.length; i++) {
					var itemData = res.modules[i].split("\t");
					if (itemData.length >= 2) {
						var itemObject = $M.alloc("milk.helper.Module");
						itemObject.ModuleName = itemData[0];
						itemObject.Desc = itemData[1];

						itemObject.Key = itemData[0];

						array.push(itemObject);
					};
				};
				self.Modules = array;
			} else {
				alert(res.error);
			};
		});
		return self;
	};

	return self;
});

$M.define("milk.helper.Parameter", ["milk.linker.Entity"], function() {
	var self = this;

	self.declareProperty("Type")
		.declareProperty("Name")
		.declareProperty("Desc");

	return self;
});

$M.define("milk.helper.ChildWindow", ["milk.linker.Entity"], function() {
	var self = this;

	self.declareProperty("Title")
		.declareProperty("Desc")
		.declareProperty("Dependencies")
		.declareProperty("ReturnType")
		.declareProperty("Parameters")
		.declareProperty("Example");

	self.loadMore = function(dataUrl) {
		dataUrl = dataUrl.replace(":key", self.Title);
		$.getJSON(dataUrl, {name: self.Title}, function(res) {
			if (res && res.success) {
				self.Desc = res.description;
				self.Dependencies = res.dependencies;
				self.ReturnType = res.returnType;

				var array = [];
				for (var i = 0; i < res.parameters.length; i++) {
					var itemData = res.parameters[i].split("\t");
					if (itemData.length >= 3) {
						var itemObject = $M.alloc("milk.helper.Parameter");

						itemObject.Type = itemData[0];
						itemObject.Name = itemData[1];
						itemObject.Desc = itemData[2];

						array.push(itemObject);
					};
				};
				self.Parameters = array;
				self.Example = res.example;
			} else {
				// res.error
				alert("帮助文档仍在编辑中, 请等待.");
			};
		});

		return self;
	};

	return this;
});