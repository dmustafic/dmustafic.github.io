Array.prototype.remove = function (id) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].id === id) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

Array.prototype.get = function (id) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].id === id) {
            return this[i];
        }
    }
    return undefined;
};

Array.prototype.contains = function (id) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].id === id) {
            return true;
        }
    }
    return false;
};
