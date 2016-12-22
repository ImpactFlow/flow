'use strict';

var _ = require('underscore');

module.exports = function extend (Superclass, prototypeFragment) {
    prototypeFragment = prototypeFragment || {};

    var Subclass = function () {
        if (_.isFunction(prototypeFragment.initialize)) {
            prototypeFragment.initialize.apply(this, arguments);
        } else {
            Superclass.apply(this, arguments);
        }
    };
    Subclass.prototype = Object.create(Superclass.prototype);
    _.extend(Subclass.prototype, prototypeFragment);

    return Subclass;
};
