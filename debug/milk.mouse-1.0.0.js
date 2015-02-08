/*
 * mouse.js
 * milk 框架的鼠标强化
 * 
 * v1.0.0
 * created by Weller Qu
 * 2015-02-05
 */

(function() {
	if (!typeof window.milk) 
		throw new Error("requires milk.base.js file");

	window.milk.define("milk.util.Mouse", [], function() {
		var self = this;

		// 是否绑定过相关事件, 默认为未绑定
		var _boundMouseup = false;
		var _boundMousedown = false;
		var _boundMousemove = false;
		var _boundMousewheel = false;
		var _boundMouseout = false;

		// 是否可以在移动结束前触发事件
		var _canTriggerMoveHandler = false;

		// 目标面板
		var _panel = null;

		// 鼠标移动相关
		var startX = 0;
		var startY = 0;
		var isReadyToMove = false;

		// 鼠标动作函数
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
			move(e);
			isReadyToMove = false;
		};

		function move(e) {
			e = e || window.event;

			if(this.releaseCapture)
				this.releaseCapture();
			else if(window.captureEvents) {
				window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP | Event.MOUSEOUT);
			};

			if(isReadyToMove/* || _canTriggerWhenUnClick*/) {

				var currentX = e.screenX;
				var currentY = e.screenY;

				var detalX = currentX - startX;

				var k = (currentY - startY) / (detalX == 0 ? 1 : detalX);
				var dPt = {x:startX, y:startY};
				var uPt = {x:currentX, y:currentY};

				var handlers = null;

				if (!_canTriggerMoveHandler) {
					if(k >= -0.5 && k <= 0.5) {
						if(currentX > startX)						
							handlers = _onLeftToRightEventHandlers;
						else if(currentX < startX)
							handlers = _onRightToLeftEventHandlers;
						else
							handlers = _onJustClickHandlers;
					} else if(k >= 2 || k <= -2) {
						if(currentY > startY) 
							handlers = _onTopToBottomEventHandlers;
						else if(currentY < startY)
							handlers = _onBottomToTopEventHandlers;
						else
							handlers = _onJustClickHandlers;
					};
				} else {
					handlers = _onMoveEventHandlers;
				};

				if (handlers != null) {
					for (var i = 0; i < handlers.length; i++) {
						var handler = handlers[i];
						handler(dPt, uPt);
					};
				};
			};
		};

		function wheel(e) {
			e = e || window.event;

			var detail = e.wheelDelta || e.detail; // e.detail only in FF
			var pt = {x: e.screenX, y: e.screenY};

			for (var i = 0; i < _onWheelEventHandlers.length; i++) {
				var handler = _onWheelEventHandlers[i];
				handler(detail, pt);
			};
		};

		// 初始化方法
		self.initWithPanel = function(panel) {
			if (!_panel)
				_panel = panel;

			_panel.addEvent = function(eventName, handler) {
				if(this.addEventListener) 
					this.addEventListener(eventName, handler, false);
				else 
					this.attachEvent('on'+eventName, handler);
			};
			_panel.delEvent = function(eventName, handler) {
				if (this.removeEventListener)
					this.removeEventListener(eventName, handler);
				else 
					this.detachEvent('on'+eventName, handler);
			};

			_panel.onselectstart = (function() { return false; });	// 阻止内容被选中, 影响滑动

			if (!_boundMousedown) {
				_panel.addEvent('mousedown', start);
				_boundMousedown = true;
			};
			if (!_boundMouseout) {
				_panel.addEvent('mouseout', end);
				_boundMouseout = true;
			};
			if (!_boundMouseup) {
				_panel.addEvent('mouseup', end);
				_boundMouseup = true;
			};
			if (!_boundMousewheel) {
				_panel.addEvent('mousewheel', wheel);
				_boundMousewheel = true;
			};

			return self;
		};

		// 改变控制是否在结束前触发事件的标识
		self.canTriggerMoving = function(trueOr) {
			_canTriggerMoveHandler = trueOr;
			
			if (_canTriggerMoveHandler && !_boundMousemove) {
				_panel.addEvent("mousemove", move);
				_boundMousemove = true;
			}
			else {
				_panel.delEvent("mousemove", move);
				_boundMousemove = false;
			};

			return self;
		};

		// 鼠标事件处理函数队列
		var _onLeftToRightEventHandlers = [];
		var _onRightToLeftEventHandlers = [];
		var _onTopToBottomEventHandlers = [];
		var _onBottomToTopEventHandlers = [];
		var _onMoveEventHandlers = [];
		var _onWheelEventHandlers = [];
		var _onJustClickHandlers = [];

		// 订阅相关事件
		self.onLeftToRight = function(handler) {
			_onLeftToRightEventHandlers.push(handler);
			return self;
		};
		self.onRightToLeft = function(handler) {
			_onRightToLeftEventHandlers.push(handler);
			return self;
		};
		self.onTopToBottom = function(handler) {
			_onTopToBottomEventHandlers.push(handler);
			return self;
		};
		self.onBottomToTop = function(handler) {
			_onBottomToTopEventHandlers.push(handler);
			return self;
		}
		self.onWheel = function(handler) {
			_onWheelEventHandlers.push(handler);
			return self;
		};
		self.onMove = function(handler) {
			_onMoveEventHandlers.push(handler);
			return self;
		};
		self.onClickUp = function(handler) {
			_JustClickHandlers.push(handler);
			return self;
		};

		return self;
	});
})();