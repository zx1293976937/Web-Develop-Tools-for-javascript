/*
 * Console.js
 * 在界面上绘制一个控制台, 通过在页面路径请求中添加?debug=yes召唤出来.
 * -= 注意: 只能在文档末尾引入本文件 =-
 *
 * v1.0.0
 * created by qiuwei
 */

if (!!typeof milk) milk = {};

milk.Console = (function() {
	// 是否已调试模式启动
	var regex = /^.+\?(debug=yes).*$/igm;
	if(regex.test(document.location)) {

		// 获得日志等级, 以便于筛选日志
		regex = /^.+\?.*level=(\d).*$/igm;
		var resultArray = regex.exec(document.location);
		var lv = 0;
		if(resultArray && resultArray.length == 2) {
			lv = parseInt(resultArray[1]);
		};

		// 创建日志窗口
		var storage = window.sessionStorage;	// 仅IE10需要部署到IIS下才能生效- -!!
		var STORAGE_POSITION_KEY = 'STORAGE.WINDOW.POSITION.KEY';

		var position = null;

		if(storage) {
			
			var positionValue = storage.getItem(STORAGE_POSITION_KEY);
			if(!positionValue) {
				position = {bottom: 0, left: 0};

				storage.removeItem(STORAGE_POSITION_KEY);
				storage.setItem(STORAGE_POSITION_KEY, JSON.stringify(position));
			}
			else {
				position = JSON.parse(positionValue);
			};
		};

		var consoleWindow = document.createElement('div');
		consoleWindow.setAttribute('id', 'Milk_Console');
		consoleWindow.setAttribute('draggable', 'true');
		consoleWindow.setAttribute('style', 'position:absolute; bottom: 0px; left: 0px; height: 180px; width: 400px; background-color: black; overflow-y: scroll; border: solid 4px gray; cursor: default; z-index: 9999;');

		document.body.appendChild(consoleWindow);

		if(position) {
			consoleWindow.style.bottom = position.bottom + 'px';
			consoleWindow.style.left = position.left + 'px';
		};

		// 使日志窗口可拖动
		var startX = 0;
		var startY = 0;
		var isReadyToMove = false;
		/* // 一种实现方式
		consoleWindow.onmousedown = function(e) {
			// log('mousedown');
			
			if(this.setCapture)
				this.setCapture();
			else if(window.captureEvents) {
				window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
			};

			e = e || window.event;

			startX = e.screenX;
			startY = e.screenY;

			isReadyToMove = true;

			return false;
		};

		consoleWindow.onmousemove = function(e) {
			// log('mousemove');
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

			startX = currentX;
			startY = currentY;

			if(position && storage) {
				position.bottom = (bottom - detalY);
				position.left = (left + detalX);

				storage.setItem(STORAGE_POSITION_KEY, JSON.stringify(position));
			};

			return false;
		};

		consoleWindow.onmouseup = function(e) {
			// log('mouseup');

			if(this.releaseCapture)
				this.releaseCapture();
			else if(window.captureEvents) {
				window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
			};

			isReadyToMove = false;

			return false;
		};
		//*/

		//* // 另一种实现方式
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

			if(position && storage) {
				position.bottom = (bottom - detalY);
				position.left = (left + detalX);

				storage.setItem(STORAGE_POSITION_KEY, JSON.stringify(position));
			};

			this.style.cursor = 'default';
			isReadyToMove = false;
			return false;
		};
		document.ondragover = function(e) {
			e.preventDefault();	// 一定要阻止事件传递
		};

		/* // 如果没有放置目标的话, 不用打开注释
		document.body.ondragenter = function(e) {
			// log('ondragenter');	
		};
		document.body.ondragover = function(e) {
			// log('ondragover');
			e.preventDefault();	
		};
		document.body.ondrop = function(e) {
			// log('ondrop');		
		};
		//*/

		// 添加日志方法
		if(!window.log) {
			var noLimitLevel = 19910917;

				window.log = function(message, level, color) {
					level = level ? level : 0;
					color = color ? color : '#87CEFA';

					if(lv != level && noLimitLevel != level)
						return false;

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

				var p = document.createElement('pre');
				p.setAttribute('style', 'font-size: 12px; margin: 2px 4px; width: 370px; word-wrap:break-word; color:'+ color + '; background-color: #000; border: none;');
				p.innerText = '[' + dateStr + '] ' + message;

				if(consoleWindow.childNodes.length > 0)
					consoleWindow.insertBefore(p, consoleWindow.childNodes[0]);
				else
					consoleWindow.appendChild(p);

				date = null;

				return true;
			};
		};

		// 添加判断
		if(!window.assert) {
			window.assert = function(expression, messageOnTRUE, messageOnFALSE) {
				if(expression) {
					log(messageOnTRUE, noLimitLevel, 'lightgreen');
				} else {
					log(messageOnFALSE, noLimitLevel, 'red');
				};
			};
		};

		// 清空控制台
		if(!window.clear) {
			var timerId = 0;
			window.clear = function() {
				log('clear all logs after 3s', noLimitLevel);
				clearTimeout(timerId);
				timerId = setTimeout(function() {
					consoleWindow.innerHTML = null;
				}, 3000);
			};
		};

		assert(1==1, 'assert(1==1, \'yes\', \'no\');', 'no');
		assert(1!=1, 'yes', 'assert(1!=1, \'yes\', \'no\');');

		log('-------------------------------', noLimitLevel);
		log('Version: 1.0.0', noLimitLevel);
		log('Date:    2014-07-29', noLimitLevel);
		log('Author:  qiuwei', noLimitLevel);
		log('It can run on Chrome, IE10.', noLimitLevel);
		log('Welcome to use my script.', noLimitLevel);
		log('-------------------------------', noLimitLevel);

		return {
			log: window.log,
			assert: window.assert,
			clear: window.clear
		};
	};

	return {
		log: function(){ },
		assert: function() { },
		clear: function() { }
	};
})();