/*
 * mouse.js
 * 鼠标手势库
 * 
 * v1.0.0
 * created by Weller Qu
 */

/*
// 调用测试 Demo
var mouse = new milk.Mouse(div);
// mouse.tiggerOnMoving = true;

mouse.onLeftToRight(function(downPt, upPt) {

});
mouse.onRightToLeft(function(downPt, upPt) {

});		
mouse.onTopToBottom(function(downPt, upPt) {

});
mouse.onBottomToTop(function(downPt, upPt) {

});
mouse.onMouseWheel(function(detail, pt) {

});
//*/

if (!typeof milk) milk = {};

milk.Mouse = (function(element, isTriggerOnMoving){
	var self = this;

	self.tiggerOnMoving = !!isTriggerOnMoving;

	element.addEvent = function(eventName, handler) {
		if(this.addEventListener) {
			this.addEventListener(eventName, handler, false);
			//myConsole.log(eventName + ' not IE');
		}
		else {
			this.attachEvent('on'+eventName, handler);
			//myConsole.log(eventName + ' IE');
		};
	};

	var startX = 0;
	var startY = 0;
	var isReadyToMove = false;

	function start(e) {
		e = e || window.event;

		if(this.setCapture)
			this.setCapture();
		else if(window.captureEvents) {
			window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP | Event.MOUSEOUT);
		};

		startX = e.screenX;
		startY = e.screenY;

		isReadyToMove = true;
	};
	function end(e) {
		e = e || window.event;

		if(this.releaseCapture)
			this.releaseCapture();
		else if(window.captureEvents) {
			window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP | Event.MOUSEOUT);
		};

		if(isReadyToMove) {

			var currentX = e.screenX;
			var currentY = e.screenY;

			var detalX = currentX - startX;

			var k = (currentY - startY) / (detalX == 0 ? 1 : detalX);
			var dPt = {x:startX, y:startY};
			var uPt = {x:currentX, y:currentY};

			if(k >= -0.5 && k <= 0.5) {
				if(currentX > startX)
					_LeftToRightHandler(dPt, uPt);
				else if(currentX < startX)
					_RightToLeftHandler(dPt, uPt);
				else
					_JustClickHandler(dPt, uPt);
			} else if(k >= 2 || k <= -2) {
				if(currentY > startY) 
					_TopToBottomHandler(dPt, uPt);
				else if(currentY < startY)
					_BottomToTopHandler(dPt, uPt);
				else
					_JustClickHandler(dPt, uPt);
			};
		};

		isReadyToMove = false;
	};
	function wheel(e) {
		e = e || window.event;

		var detail = e.wheelDelta; // e.detail only in FF
		var pt = {x: e.screenX, y: e.screenY};
		//myConsole.log(detail);
		_MouseWheelHandler(detail, pt);
	};

	element.addEvent('mousedown', start);

	if (self.tiggerOnMoving)
		element.addEvent('mousemove', moving);
	else {
		element.addEvent('mouseout', end);
		element.addEvent('mouseup', end);
	};

	element.addEvent('mousewheel', wheel);

	var _LeftToRightHandler = [];	// function() { /*myConsole.log('左到右方向未注册处理函数');*/ };
	var _RightToLeftHandler = [];	// function() { /*myConsole.log('右到左方向未注册处理函数');*/ };
	var _TopToBottomHandler = [];	// function() { /*myConsole.log('上到下方向未注册处理函数');*/ };
	var _BottomToTopHandler = [];	// function() { /*myConsole.log('下到上方向未注册处理函数');*/ };
	var _JustClickHandler = [];		// function() { /*myConsole.log('单击一下而已.');*/ };

	var _MouseWheelHandler = [];	// function() { /*myConsole.log('鼠标滑轮滚动.');*/ };

	self.onLeftToRight = function(handler) {
		_LeftToRightHandler.push(handler);
		/*myConsole.log('_LeftToRightHandler');*/
	};
	self.onRightToLeft = function(handler) {
		_RightToLeftHandler.push(handler);
		/*myConsole.log('_RightToLeftHandler');*/
	};
	self.onTopToBottom = function(handler) {
		_TopToBottomHandler.push(handler);
		/*myConsole.log('_TopToBottomHandler');*/
	};
	self.onBottomToTop = function(handler) {
		_BottomToTopHandler.push(handler);
		/*myConsole.log('_BottomToTopHandler');*/
	};
	self.onClick = function(handler) {
		_JustClickHandler.push(handler);
		/*myConsole.log('_JustClickHandler');*/
	};
	self.onMouseWheel = function(handler) {
		_MouseWheelHandler.push(handler);
		/*myConsole.log('_MouseWheelHandler');*/
	};

	return self;
});