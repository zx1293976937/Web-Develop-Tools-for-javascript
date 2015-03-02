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
				// alert(res.error);
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

$M.define("milk.helper.Code", [], function() {
	var self = this;

	var symbolMap = {
		"=": " = ",
		"\\(": " ( ",
		"\\)": " ) ",
		"<": " &lt; ",
		">": " &gt; ",
		"\b/\b": " / "
	};

	var summaryMap = {
		"//": 1,
		"/*": 1,
		"*/": 1,
		"!--": 1,
		"--": 1
	}

	function prepra(line) {
		// console.log(line);
		for (var key in symbolMap) {
			line = line.replace(new RegExp(key, "igm"), symbolMap[key]);
		};
		// console.log(line);

		return line;
	};

	function highlight(line) {
		var newLine = Array("");

		var arr = line.split(' ');
		for (var i = 0; i < arr.length; i++) {
			var item = arr[i];

			if (item == "")
				continue;

			newLine.push(item+" ");
		};

		return newLine.join("");
	};

	self.render = function(line) {
		line = prepra(line);
		line = highlight(line);

		return line;
	};

	return self;
});