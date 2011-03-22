// ES5 shim

if (!Object.keys) Object.keys = function (obj) {
    var keys = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            keys.push(key);
    }
    return keys;
};

if (typeof Object.create === 'undefined') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

if (!Array.prototype.forEach) Array.prototype.forEach = function (f, to) {
    for (var i = 0; i < this.length; i++) {
        f.call(to, this[i], i, this);
    }
};

if (!Array.isArray) Array.isArray = function (ref) {
    return Object.prototype.toString.call(ref) === '[object Array]';
};

if (!Array.prototype.some) Array.prototype.some = function (f, to) {
    for (var i = 0; i < this.length; i++) {
        if (f.call(to, this[i], i, this)) return true;
    }
    return false;
};

if (!Array.prototype.every) Array.prototype.every = function (f, to) {
    for (var i = 0; i < this.length; i++) {
        if (!f.call(to, this[i], i, this)) return false;
    }
    return true;
};

if (!Array.prototype.indexOf) Array.prototype.indexOf = function (x) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === x) return i;
    }
    return -1;
};



