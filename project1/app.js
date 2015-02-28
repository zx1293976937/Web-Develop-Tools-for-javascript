console.log("Hello Milk");

// 引入文件系统
var fs = require("fs");
// 引入ejs视图模板引擎
var ejsTemplateEngine = require("ejs");
// 引入 /document 路由
var doc = require("./controllers/document");
// 引入express
var express = require('express');

// 创建应用程序
var app = express();

// 定义静态资源目录(中间件的一种用法)
app.use("/staticResources", express.static(__dirname + "/staticResources"));

// 监视所有的请求
app.all("/*", function(req, res, next) {
	console.log(req.url);
	next();
});

// 挂载 /document 路由
app.use("/document", doc);

/*app.get("/", function(req, res) {
	// 使用视图引擎
	res.render("index", {title: "My first page", content: "Hello World"});
});*/

/* 编写自定义视图模板引擎
// 自定义视图引擎的视图模板
app.engine("hp", function(filePath, options, callback) {
	fs.readFile(filePath, function(err, content) {
		if (err) throw new Error(err);

		var html = content.toString().replace("!title", options.data.title)
			.replace("!content", options.data.content);

		return callback(null, html);
	});
});
// 指定视图引擎模板存放目录
app.set("views", "./views");
// 注册视图引擎, ./views 目录中的文件需要以hp作为后缀名, 比如index.hp
app.set("view engine", "hp");
//*/

//* 使用ejs视图模板引擎 
app.engine("ejs", ejsTemplateEngine.__express);
app.set("views", "./views");
app.set("view engine", "ejs");
//*/

// 处理404
app.use(function(req, res, next) {
	res.status(404).end("Sorry, 404了");
	next();
});

// 处理服务器错误
app.use(function(err, req, res, next) {
	console.log(err);
	res.status(500).end("Sorry, Something wrong.")
});

// 打开监听, 应用程序启动
app.listen(3000, function() {
	console.log("Start listen 3000 port");
});