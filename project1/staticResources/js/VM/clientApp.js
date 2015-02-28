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
		.declareProperty("JqDownloadUrl")
		.declareProperty("JqFileName")
		.declareProperty("MdDownloadUrl")
		.declareProperty("MdFileName");

	self.load = function(dataUrl) {
		$.getJSON(dataUrl, function(res) {
			if (res && res.success) {

				self.JqDescription = res.description;
				self.MdDescription = res.description2;

				self.JqDownloadUrl = res.download;
				self.JqFileName = res.file;

				self.MdDownloadUrl = res.download2;
				self.MdFileName = res.file2;

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
		self.clear();
		dataUrl = dataUrl.replace(":key", self.Title);

		$.getJSON(dataUrl, function(res) {
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

				// alert("帮助文档仍在编辑中, 请等待.");
				self.Desc = ["帮助文档仍在编辑中, 请等待."];
			};
		});

		return self;
	};

	self.clear = function() {
		// self.Title = "";
		self.Desc = "";
		self.Dependencies = [];
		self.ReturnType = "";
		self.Parameters = [];
		self.Example = [];

		return self;
	};

	return this;
});