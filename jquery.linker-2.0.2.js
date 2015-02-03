/*
* Linker.js  
* v.2.0.2
* a web app develop kit base on MVVM 
* 
* qiuwei 2014-11-25
*/

/* Demo 2014-10-31 by qiuwei

var Task = function() {
linker.EntityClass.call(this);
var self = this;

var _p = null;
self.setP = function(p) {
_p = p;
self.propertyChange("P");	// property KeyPath
};
self.getP = function() {
return _p;
};

return self;
};

var context = new Task();
$(selector).property("innerHTML"[, {convert: function(value) { return newValue; } }]).linkTo(context, "P"[, LinkMode.ONE_WAY]);

like this, 
$(selector).property(attributeName[, options]).linkTo(context, propertyKeyPath[, LinkMode]);

options is a json object, like this
{
convert: function(value) { return newValue; },
convertBack: function(value) { return newValue; },
createView: function(context) { return view; },
render: function(view) { view.show(); }
}
//*/

$.fn.extend({
    property: function(attr, options) {

        return new linker.AttributeClass($(this), attr, options);
    },
    subject: function() {

        var identifier = $(this).attr(linker.EntityClass.Identifier);
        if (identifier)
            return linker.EntityReference.getObject(identifier);
        else
            return null;
    }
});

// ===================================== Declare =====================================
if (!typeof linker) linker = {};

// ===================================== Classes =====================================
// Enumeration LinkMode
linker.LinkMode = {
    ONE_WAY: 1,
    TWO_WAY: 2
}; // Enumeration LinkMode

// Attribute Class
linker.AttributeClass = (function(jqElement, attrPath, options) {
    var self = this;

    self.setValue = function(value) {
        var attrPathParts = attrPath.split(".");
        var v = value;

        var finalObject = jqElement.get(0);
        var part = null;
        for (var i = 0; i < attrPathParts.length - 1; i++) {
            part = attrPathParts[i];
            finalObject = finalObject[part];
        };

        var finalAttrName = attrPathParts[attrPathParts.length - 1];
        if (navigator.userAgent.toLowerCase().indexOf("trident") > 0 && linker.compatibleMap[finalAttrName])
            finalAttrName = linker.compatibleMap[finalAttrName];

        if (options && options.convert)
            v = options.convert(value);

        if (options && options.createView) {

            $(finalObject).empty();
            for (var i = 0; i < v.length; i++) {
                var item = v[i]; // item is an EntityClass object
                var view = options.createView(item, i);
                // item.notify();

                $(finalObject).append(view);

                if (options.render)
                    options.render(view, i);
            };
        } else {

            if (finalObject[finalAttrName] == undefined)
                finalObject.setAttribute(finalAttrName, v);
            else
                finalObject[finalAttrName] = v;

            if (options && options.render)
                options.render($(finalObject));
        };

        return self;
    };
    self.getValue = function() {
        var attrPathParts = attrPath.split(".");
        var v = null;

        var finalObject = jqElement.get(0);
        var part = null;
        for (var i = 0; i < attrPathParts.length - 1; i++) {
            part = attrPathParts[i];
            finalObject = finalObject[part];
        };

        var finalAttrName = attrPathParts[attrPathParts.length - 1];
        if (navigator.userAgent.toLowerCase().indexOf("trident") > 0 && linker.compatibleMap[finalAttrName])
            finalAttrName = linker.compatibleMap[finalAttrName];

        if (options && options.createView) {
            // to be continued
        } else {

            if (finalObject[finalAttrName] == undefined)
                v = finalObject.getAttribute(finalAttrName);
            else
                v = finalObject[finalAttrName];
        };

        if (options && options.convertBack) {
            return options.convertBack(v);
        };

        return v;
    };

    var onChangeHandler = function(event) {
        var keyPath = event.data.keyPath;
        //var attrPath = event.data.attrPath;
        var context = event.data.context;
        var self = event.data.self;

        //var value = $(this).val();
        var value = self.getValue();

        var setter = context["set" + keyPath];
        if (setter) {
            //context.canNotify = false;
            setter(value);
            //context.canNotify = true;
        };

        return false;
    };

    self.linkTo = function(context, keyPath, mode) {

        if (!context) return jqElement;

        jqElement.attr(linker.EntityClass.Identifier, context.getIdentifier());

        if (mode === linker.LinkMode.TWO_WAY) {
            /*jqElement.on("focusout", { 
            keyPath: keyPath, 
            attrPath: attrPath, 
            context: context, 
            self: self }, onChangeHandler);*/
            if (!jqElement.on) jqElement.on = jqElement.bind;

            jqElement.on("blur", {
                keyPath: keyPath,
                attrPath: attrPath,
                context: context,
                self: self
            }, onChangeHandler);
        };

        context.addObserver(self, keyPath);
        return jqElement;
    };

    self.release = function(context, keyPath) {

        jqElement.off("blur", onChangeHandler).removeAttr(linker.EntityClass.Identifier);
        context.removeObserver(self, keyPath);
        return jqElement;
    };

    return self;
});  // Attribute Class

// Entity Reference
linker.EntityReference = (function() {
    var self = this;
    var __map = {};

    self.setObject = function(key, object) {
        __map[key] = object;
        return self;
    };

    self.getObject = function(key) {
        return __map[key];
    };

    return self;
})();   // Entity Reference

// Entity Class
linker.EntityClass = (function() {
    var self = this;
    var observerMap = {};

    //self.canNotify = true;
    var _identifier = parseInt(Math.random() * Math.pow(10, 15));
    linker.EntityReference.setObject(_identifier, self);

    // self.setIdentifier = function(i) {
    // 	_identifier = i;
    // 	self.propertyChange(EntityClass.Identifier);
    // };
    self.getIdentifier = function() {
        return _identifier;
    };

    self.addObserver = function(attributeClass, keyPath) {
        var observers = observerMap[keyPath];
        if (!observers) {
            observers = observerMap[keyPath] = [];
        };
        observers.push(attributeClass);

        return self;
    };
    self.removeObserver = function(attributeClass, keyPath) {
        var observers = observerMap[keyPath];
        if (observers) {
            for (var i = 0; i < observers.length; i++) {
                var item = observers[i];
                if (item == attributeClass) {
                    observers.splice(i, 1);
                    break;
                };
            };
        };

        return self;
    };

    self.propertyChange = function(keyPath) {

        //if (!self.canNotify) { return false; };

        var getter = self["get" + keyPath]; // getName
        if (getter) {
            var value = getter();

            var observers = observerMap[keyPath];
            if (observers) {
                var item = null;
                for (var i = 0; i < observers.length; i++) {
                    item = observers[i];
                    item.setValue(value);
                };
            };

            //console.log('output:'+value);
        };

        return true;
    };

    // code to json
    self.toJson = function() {
        var jsonObject = {};
        for (var key in self) {
            if (key.indexOf("get") > -1) {
                var getter = self[key];
                if (getter && typeof getter == "function") {
                    jsonObject[key.replace("get", "")] = getter();
                };
            };
        };

        return jsonObject;
    };

    // decode from json
    self.withJson = function(jsonObject) {
        for (var key in jsonObject) {
            var setter = self["set" + key];
            if (setter && typeof setter == "function") {
                setter(jsonObject[key]);
            };
        };

        return self;
    };

    // notify all observer to change
    self.notify = function() {
        for (var key in observerMap) {
            self.propertyChange(key);
        };

        return self;
    };

    self.print = function() {
        for (var key in observerMap) {
            //console.log(key);
        };

        return self;
    };

    return self;
}); // Entity Class

// v1.0.1 add code, Element Attribute
linker.EntityClass.Identifier = "Identifier";

// ==================================== Compatible ====================================
linker.compatibleMap = {
    "class": "className"
};