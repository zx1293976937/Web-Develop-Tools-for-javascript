var line = "<div id=\"d123\">hello world</div>";

// var symbolMap = {
// 	"\\;": " ; ",
// 	"<": " &lt; ",
// 	">": " &gt; ",
// 	"=": " = ",
// 	"\\.": " . ",
// 	"\\(": " ( ",
// 	"\\)": " ) ",
// 	"\\{": " { ",
// 	"\\}": " } "
// };

var symbolMap = {
	begin: {
		"<": "&lt;",
		"(": "(",
		"{": "{"
	},
	end: {
		">": "&gt;",
		")": ")",
		"}": "}"
	},
	space: {
		" ": 1,
		"=": 1
	},
	"/": 1,
	"*": 1,
	"-": 1,
	"!": 1,
	"\"": 1,
	"'": 1,
	",": 1,
	" ": 1
};

var characters = line.split("");
var newLine = Array("");
var words = Array("");

for (var i = 0; i < characters.length; i++) {
	var ch = characters[i];

	// if (symbolMap.begin[ch]) {
	// 	newLine.push(symbolMap.begin[ch]);
	// 	newLine.push("<span>");
	// } else if (symbolMap.end[ch]) {
	// 	newLine.push("</span>");
	// 	newLine.push(symbolMap.end[ch]);
	// } else if (symbolMap.space[ch]) {
	// 	newLine.push("</span>");
	// 	newLine.push(" ");
	// 	newLine.push("<span>");
	// } else {
	// 	newLine.push(ch);
	// };
};

console.log(newLine.join(""));

// var symbolMap = {
// 	"\\;": " ; ",
// 	"<": " &lt; ",
// 	">": " &gt; ",
// 	"=": " = ",
// 	"\\.": " . ",
// 	"\\(": " ( ",
// 	"\\)": " ) ",
// 	"\\{": " { ",
// 	"\\}": " } "
// };

// var summarys = {
// 	"!--": 1,
// 	"--": 1,
// 	"//": 1,
// 	"/*": 1,
// 	"*/": 1
// };

// function prepare (argument) {
// 	for (var key in symbolMap) {
// 		argument = argument.replace(new RegExp(key, "igm"), symbolMap[key]);
// 	};
// 	return argument;
// };

// function highlight(argument) {
// 	var newLine = Array("");

// 	// <div id="hello">Hello World</div>

// 	var array = argument.split(/\s/igm);
// 	for (var i = 0; i < array.length; i++) {
// 		var item = array[i];

// 		if (item == "")
// 			continue;

// 		if (i - 1 > -1 && array[i - 1] == "&lt;") {
// 			if (item == "!--" ) {
// 				newLine.push("<span class='summaryWords'>");
// 				newLine.push(item);
// 				newLine.push(" ");
// 				newLine.push("</span>");
// 			} else {
// 				newLine.push("<span class='htmlTag'>");
// 				newLine.push(item);
// 				newLine.push("</span>");
// 			};
// 		} else if (i - 1 > -1 && array[i - 1] == "=") {
// 			newLine.push("<span class='htmlAttrVal'>");
// 			newLine.push(item);
// 			newLine.push("</span>");
// 		} else if (i + 1 < array.length && array[i + 1] == "=") {
// 			newLine.push("<span class='htmlAttr'>");
// 			newLine.push(" ");
// 			newLine.push(item);
// 			newLine.push("</span>");
// 		} else if (i + 1 < array.length && array[i + 1] == "&gt;") {
// 			if (item == "--") {
// 				newLine.push("<span class='summaryWords'>");
// 				newLine.push(" ");
// 				newLine.push(item);
// 				newLine.push("</span>");
// 			} else if (item != "/") {
// 				newLine.push("<span class='htmlTag'>");
// 				newLine.push(item);
// 				newLine.push("</span>");
// 			} else {
// 				newLine.push(item);
// 			};
// 		} else if (i - 1 > -1 && array[i - 1] == "!--") {
// 			newLine.push("<span class='summaryWords'>");
// 			newLine.push(item);
// 			newLine.push("</span>");
// 		} else {
// 			newLine.push(item); // < > / = ; ( )
// 		};
// 	};

// 	return newLine.join("");
// };

// line = highlight(prepare(line));

// console.log(line);