var readLines = require('n-readlines');

var express = require('express');
var router = express.Router();

var config = {
	title: "Milk在线帮助文档"
};

var indexHandler = function(req, res) {
	res.render("index", { title: config.title });
};

router.get("/", indexHandler);
router.get("/index", indexHandler);
router.get("/welcome", indexHandler);

router.get("/about", function(req, res) {
	res.end("about");
});

var readToObject = function(jsonObject, file) {
	var reader = new readLines(file, {"readChunk": 2048, "newLineCharacter": "\n"});
	var line = "";
	var key = "";
	while(line = reader.next()) {
		if (!line || line == "" || line == "\r\n" || line == "\n" || line == "\r")
			continue;

		line = line.toString()
			.replace("\r", "").replace("\n", "").replace(" ", "");

		if (line.indexOf("[") == 0) {
			key = line.replace("[", "").replace("]", "");
		} else {
			if (Object.prototype.toString.call(jsonObject[key]) === "[object Array]")
					jsonObject[key].push(line);
				else
					jsonObject[key] = line;
		};
	};
};

router.get("/query/:key", function(req, res) {
	console.log(req.params);
	var itemObject = {
		success: true,
		error: "",
		title: "",
		description: "",
		dependencies: [],
		returnType: "",
		parameters: [],
		example:[]
	};

	try {
		readToObject(itemObject, "doc/" + req.params.key + ".txt");
	} catch(e) {
		itemObject.success = false;
		itemObject.error = e.message;
	};

	res.json(itemObject);
});

router.get("/query", function(req, res) {
	var docObject = {
		success: true,
		error: "",
		title: "",
		file: "",
		download: "",
		description: "",
		api: [],
		title2: "",
		file2: "",
		download2: "",
		description2: "",
		modules: []
	};

	try {
		readToObject(docObject, "doc/document.txt");
	} catch(e) {
		docObject.success = false;
		docObject.error = e.message;
	};

	res.json(docObject);
});

module.exports = router;