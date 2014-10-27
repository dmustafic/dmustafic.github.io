Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function (key) {
    var item = this.getItem(key);

    if (item && item != "undefined")
        return JSON.parse(item);

    return undefined;
};
