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

	window.milk.define("milk.util.Console",
		[],
		function() {
			var self = this;

			var winOnLoadEventHandler = window.onload;
			var consoleWindow = null;
			var lv = 0;
			var wait = null;

			window.onload = function() {
				if (winOnLoadEventHandler)
					winOnLoadEventHandler();

				var regex = /^.+\?(debug=yes).*$/igm;
				if(regex.test(document.location)) {

					// 获得日志等级, 以便于筛选日志
					regex = /^.+\?.*level=(\d).*$/igm;
					var resultArray = regex.exec(document.location);
					
					if(resultArray && resultArray.length == 2) {
						lv = parseInt(resultArray[1]);
					};

					consoleWindow = document.createElement('div');
					consoleWindow.setAttribute('id', 'Milk_Console');
					consoleWindow.setAttribute('draggable', 'true');
					consoleWindow.setAttribute('style', 'position:absolute; bottom: 20px; left: 20px; height: 180px; width: 500px; background-color: black; overflow-y: scroll; border: solid 2px gray; cursor: default; z-index: 9999;');
				
					document.body.appendChild(consoleWindow);
				};
			};

			self.log = function(message, level, color) {
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

				if (!wait) {
					wait = function(ele) {
						if (consoleWindow) {
							if(consoleWindow.childNodes.length > 0)
								consoleWindow.insertBefore(ele, consoleWindow.childNodes[0]);
							else
								consoleWindow.appendChild(ele);

							date = null;
						} else {
							setTimeout(function() {
								wait(ele);
							}, 1000);
						};
					};
				};

				wait(p);

				return true;
			};

			return self;
	});

	milk.Console = milk.use("milk.util.Console");
})();