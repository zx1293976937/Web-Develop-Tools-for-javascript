/*
 * console.js
 * a simple console on page
 *
 * v1.0.0
 * created by qiuwei
 * 2015-02-04
 */

(function() {
	if (!typeof window.milk) 
		throw new Error("requires milk.base.js file");

	window.milk.define("milk.util.Console", [], function() {
		var self = this;

		// 是否已初始化
		var isInited = false;

		// 使日志窗口可拖动
		var startX = 0;
		var startY = 0;
		var isReadyToMove = false;

		// 当前标签名称
		var currentTagName = "DEFAULT";

		// 日志窗口元素对象
		var consoleWindow = null;

		// 应用本地存储的键值
		var STORAGE_POSITION_KEY = 'STORAGE.WINDOW.POSITION.KEY';
		// 本地存储对象
		var dataManager = null;

		var delayHandler = (function(p, delayId) {
			delayId = delayId ? delayId : 0;
			// 检查对象是否已加载完成, 未完成则等500毫秒后再次尝试
			if (consoleWindow) {
				if(consoleWindow.childNodes.length > 0)
					consoleWindow.insertBefore(p, consoleWindow.childNodes[0]);
				else
					consoleWindow.appendChild(p);

				clearTimeout(delayId);
			} else {
				clearTimeout(delayId);
				delayId = setTimeout(function() {
					delayHandler(p, delayId);
				}, 500);
			};
		});

		// window加载完成事件处理函数
		var onWindowLoadHandler = (function() {
			consoleWindow = document.createElement('div');
			consoleWindow.setAttribute('id', 'Milk_Console');
			consoleWindow.setAttribute('draggable', 'true');
			consoleWindow.setAttribute('style', 'position:absolute; bottom: 10px; left: 10px; height: 180px; width: 400px; background-color: black; overflow-y: scroll; border: solid 4px gray; cursor: default; z-index: 9999;');

			document.body.appendChild(consoleWindow);

			if (dataManager) {
				var position = {};

				var positionData = dataManager.getData(STORAGE_POSITION_KEY);
				if (positionData) {
					position = JSON.parse(positionData);
					dataManager.removeData(STORAGE_POSITION_KEY);
				};

				consoleWindow.style.bottom = position.bottom + 'px';
				consoleWindow.style.left = position.left + 'px';
			};

			consoleWindow.ondragstart = function(e) {
				// log('ondragstart');
				e = e || window.event;

				startX = e.screenX;
				startY = e.screenY;

				isReadyToMove = true;

				//return false;
				this.style.cursor = 'move';
			};

			consoleWindow.ondrag = function(e) {
				// log('ondrag');
			};

			consoleWindow.ondragend = function(e) {

				if(!isReadyToMove)
					return false;

				e = e || window.event;

				var currentX = e.screenX;
				var currentY = e.screenY;

				var detalX = currentX - startX;
				var detalY = currentY - startY;

				var bottom = parseInt(this.style.bottom);
				var left = parseInt(this.style.left);

				this.style.left = (left + detalX) + 'px';
				this.style.bottom = (bottom - detalY) + 'px';

				//startX = currentX;
				//startY = currentY;

				if(position && dataManager) {
					position.bottom = (bottom - detalY);
					position.left = (left + detalX);

					dataManager.setData(STORAGE_POSITION_KEY, JSON.stringify(position));
				};

				this.style.cursor = 'default';
				isReadyToMove = false;
				return false;
			};

			document.ondragover = function(e) {
				e.preventDefault();	// 一定要阻止事件传递
			};
		});

		self.init = function() {

			// 是否已调试模式启动
			var regex = /^.+\?(debug=yes).*$/igm;
			if(regex.test(document.location)) {
				// 获得tagName, 以便于筛选日志
				regex = /^.+\?.*tag=(\d).*$/igm;
				var resultArray = regex.exec(document.location);
				if(resultArray && resultArray.length == 2) {
					currentTagName = resultArray[1];
				};
			
				dataManager = window.milk.alloc("milk.storage.LocalDataManager").initWithStorage(window.sessionStorage);

				// 在html的window对象的onload事件队列中添加一个处理函数
				// 用来初始化日志窗口对象
				if (window.addEventListener) {
					window.addEventListener("load", onWindowLoadHandler, false);
				} else {
					window.attachEvent("onload", onWindowLoadHandler);
				};
			};

			isInited = true;
		};

		self.initWithWelcome = function() {

			self.log('-------------------------------', currentTagName);
			self.log('Version: 1.0.0', currentTagName);
			self.log('Date:    2014-07-29', currentTagName);
			self.log('Author:  qiuwei', currentTagName);
			self.log('It can run on Chrome, IE10.', currentTagName);
			self.log('Welcome to use my milk script.', currentTagName);
			self.log('-------------------------------', currentTagName);

			return self;
		}

		self.log = function(message, tagName, color) {
			if (!isInited)
				return self;

			color = color ? color : '#87CEFA';
			tagName = tagName ? tagName : currentTagName;

			if (tagName != currentTagName) 
				return self;

			var date = new Date();
					
			var hours =	date.getHours();
			var minutes = date.getMinutes();
			var seconds = date.getSeconds();
			var milliseconds = date.getMilliseconds();

			var dateStr = 
				(hours < 10 ? '0' + hours : hours)
				+ ':' + (minutes < 10 ? '0' + minutes : minutes)
				+ ':' + (seconds < 10 ? '0' + seconds : seconds);

			if(milliseconds < 100) {
				if(milliseconds < 10) {
					milliseconds = '0' + milliseconds;
				};
				milliseconds = '0' + milliseconds;
			};
			dateStr = dateStr + '.' + milliseconds;

			date = null;	// 释放对象

			var p = document.createElement('pre');
			p.setAttribute('style', 'font-size: 12px; margin: 2px 4px; width: 370px; word-wrap:break-word; color:'+ color + '; background-color: #000; border: none;');
			p.innerText = '[' + dateStr + '] ' + message;

			delayHandler(p);
		};

		return self;
	});

	window.milk.Console = window.milk.alloc("milk.util.Console").initWithWelcome();
	window.$M.Console = window.milk.Console;
})();