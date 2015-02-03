/**
* milk.core.js
* v1.0.0
* v1.0.1 去除与Linker.js的相互依赖
* v1.0.2 添加DateController类, 用于格式化显示Date对象; 添加本地化语言映射; 修复栈pop后长度不变的bug;
*
* qiuwei 2014-12-18 10:58
*/

// ===================================== Declare =====================================
if (!!typeof milk) milk = {};

// =================================== Controllers ===================================
// Array Controller
milk.ArrayController = function(array) {
    var self = this;
    var _arrangedObjects = [];

    if (array) {
        for (var i = 0; i < array.length; i++) {
            _arrangedObjects.push(array[i]);
        };
    };

    self.getArrangedObjects = function() {
        return _arrangedObjects;
    };

    self.size = function() {
        return _arrangedObjects.length;
    };

    self.append = function(object) {
        _arrangedObjects.push(object);

        return self;
    };

    self.remove = function(object) {
        for (var i = 0; i < _arrangedObjects.length; i++) {
            var item = _arrangedObjects[i];
            if (item === object) {
                _arrangedObjects.splice(i, 1);
                break;
            };
        };

        return self;
    };

    self.clear = function() {
        _arrangedObjects = [];

        return self;
    };

    self.insertAtIndex = function(object, index) {

        _arrangedObjects.splice(index, 0, object);

        return self;
    };

    self.removeAtIndex = function(index) {

        _arrangedObjects.splice(index, 1);

        return self;
    };

    self.find = function(is) {
        if (!is) return null;

        var t = null;

        for (var i = 0; i < _arrangedObjects.length; i++) {
            var item = _arrangedObjects[i];

            if (is(i, item)) {
                t = item;
                break;
            };
        };

        return t;
    };

    // v1.0.1 add code
    self.findMore = function(is) {
        if (!is) return null;

        var t = [];

        for (var i = 0; i < _arrangedObjects.length; i++) {
            var item = _arrangedObjects[i];

            if (is(i, item)) {
                t.push(item);
            };
        };

        return t;
    };

    self.forEach = function(callback) {
        callback = callback ? callback : function() { };

        for (var i = 0; i < _arrangedObjects.length; i++) {
            var result = callback(i, _arrangedObjects[i]);

            if (result === false) {
                break;
            } else {
                continue;
            };
        };

        return self;
    };

    return self;
};        // Array Controller

// Stack Controller
milk.StackController = function() {
    var self = this;

    var _stackedObjects = [];

    self.getStackedObjects = function() {
        return _stackedObjects;
    };

    self.size = function() {
        return _stackedObjects.length;
    };

    self.push = function(d) {
        _stackedObjects.push(d);
    };

    self.pop = function() {
        if (_stackedObjects.length == 0) {
            throw new Error("栈为空");
        };

        return _stackedObjects.pop();
    };

    self.top = function() {
        if (_stackedObjects.length == 0) {
            throw new Error("栈为空");
        };

        return _stackedObjects[_stackedObjects.length - 1];
    };

    self.bottom = function() {
        if (_stackedObjects.length == 0) {
            throw new Error("栈为空");
        };
        return _stackedObjects[0];
    };

    self.clear = function() {
        _stackedObjects = [];
    };

    return self;
}; // Stack Controller

// String Controller
milk.StringController = function(str) {
    var self = this;
    var _string = str;

    self.toDate = function() {
        var arr = _string.split(/[: -]/igm);
        var sdt = new Date(arr[0], parseInt(arr[1]) - 1, arr[2], arr[3], arr[4], arr[5]);

        return sdt;
    };

    self.format = function(value) {
        //取得参数副本
        var formatStr = _string;
        var valueObject = value;

        //定义格式化字符串正则
        var reg = /\{(\d+)\}/gm;

        //解析格式化字符串str1
        var fr = null
        while (fr = reg.exec(formatStr)) {
            var idx_0 = fr[0];
            var idx_1 = fr[1];

            formatStr = formatStr.replace(idx_0, valueObject[idx_1]);
        };

        return formatStr;
    };

    return self;
}; // String Controller

// Date Controller
milk.DateController = function(dateObject) {
    var self = this;
    var _dateObject = dateObject;

    var year = _dateObject.getFullYear();
    var month = _dateObject.getMonth() + 1;
    var date = _dateObject.getDate();
    var day = _dateObject.getDay();
    var hour = _dateObject.getHours();
    var minute = _dateObject.getMinutes();
    var second = _dateObject.getSeconds();
    var millisecond = _dateObject.getMilliseconds();

    /*
     * fmt: 格式化字符串, 默认为 yyyy-MM-dd w HH:mm:ss.si
     *
     * 可选的格式: 
     * yyyy或yy      年份
     * MM或M         月份
     * mm或m         分钟
     * dd或d         日期
     * HH或H或hh或h  小时
     * ss或s         秒
     * si            毫秒
     * w或CHW或ENW   星期
     */
    self.toString = function(fmt) {
        var str = fmt ? fmt : "yyyy-MM-dd w HH:mm:ss.si";

        var hourStr = null;
        if (hour < 12) 
            hourStr = "";
        else 
            hourStr = "";

        str = str.replace(/yyyy/igm, year);
        str = str.replace(/yy/igm, year % 100);
        str = str.replace(/MM/gm, month < 10 ? ("0" + month) : month);
        str = str.replace(/M/gm, month);
        str = str.replace(/dd/igm, date < 10 ? ("0" + date) : date);
        str = str.replace(/d/igm, date);
        str = str.replace(/CHW/igm, milk.LocalLanguage.CH_WEEK_MAP[day]);
        str = str.replace(/ENW/igm, milk.LocalLanguage.EN_WEEK_MAP[day]);
        str = str.replace(/w/igm, day);
        str = str.replace(/HH/gm, hour < 10 ? ("0" + hour) : hour);
        str = str.replace(/H/gm, hour);
        str = str.replace(/hh/gm, hourStr + (hour < 10 ? ("0" + hour) : hour));
        str = str.replace(/h/gm, hourStr + hour);
        str = str.replace(/mm/gm, minute < 10 ? ("0" + minute) : minute);
        str = str.replace(/m/gm, minute);
        str = str.replace(/ss/igm, second < 10 ? ("0" + second) : second);
        str = str.replace(/si/igm, millisecond);
        str = str.replace(/s/igm, second);

        return str;
    };

    return self;
};  // Date Controller

// ==================================== Root Datas ===================================
// Root Data Of Page
milk.ViewData = {
    // necessary objects
    __Objects: new milk.ArrayController(),
    setObject: function(id, o) {
        var self = this;
        self.__Objects.append({ id: id, data: o });

        return self;
    },
    getObject: function(id) {
        var self = this;

        var t = self.__Objects.find(function(i, n) { return n.id == id; });

        return (t ? t.data : null);
    },
    clear: function() {
        var self = this;
        self.__Objects.clear();

        return self;
    }
};    // Root Data Of Page


// ================================== Local Language =================================
milk.LocalLanguage = {
    CH_WEEK_MAP: {
        0: "星期日",
        1: "星期一",
        2: "星期二",
        3: "星期三",
        4: "星期四",
        5: "星期五",
        6: "星期六"
    },
    EN_WEEK_MAP: {
        0: "Sunday",
        1: "Monday",
        2: "Thuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday"
    }
};