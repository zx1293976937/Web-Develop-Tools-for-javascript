/*
 */

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
		.declareProperty("Example")
		.declareProperty("Others");

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
				self.Others = res.others;
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
		self.Desc = [];
		self.Dependencies = [];
		self.ReturnType = "";
		self.Parameters = [];
		self.Example = [];
		self.Others = [];

		return self;
	};

	return this;
});

$M.define("milk.helper.CodeDisplayer", [], function() {
	var self = this;

	var symbolMap = {
		"=": 1,
		";": 1
	};

	self.highlight = function(str) {

		console.log(str);

		var symbolStack = [];		//0
		var valueStack = [];		//1
		var wordStack = [];			//2
		var operationStack = [];

		var array = str.split(' ');
		for (var i = 0; i < array.length; i++) {
			var item = array[i];

		};

		console.log(str);

		return str;
	};

	self.prepra = function(str) {
		str = str.replace('=', " = ");
		str = str.replace('<', " < ");
		str = str.replace('>', " > ");
		str = str.replace('/', " / ");
		str = str.replace('(', " ( ");
		str = str.replace(')', " ) ");
		str = str.replace('.', " . ");

		return str.replace(/</igm, "&lt;").replace(/>/igm, "&gt;");
	};

	self.render = function(str) {
		str = self.prepra(str);
		str = self.highlight(str);

		return str;
	};

	return self;
});